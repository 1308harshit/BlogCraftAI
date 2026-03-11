import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        await handleSuccessfulPayment(session)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        await handleSuccessfulPayment(invoice)
        break

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object
        await updateSubscriptionStatus(subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleSuccessfulPayment(session: any) {
  const userId = session.metadata?.userId
  if (!userId) return

  // Update user status to active
  await supabase
    .from('users')
    .update({ status: 'active' })
    .eq('id', userId)

  // Create or update subscription record
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
  }
}

async function updateSubscriptionStatus(subscription: any) {
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  // Update user status based on subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (sub) {
    const userStatus = subscription.status === 'active' ? 'active' : 'inactive'
    await supabase
      .from('users')
      .update({ status: userStatus })
      .eq('id', sub.user_id)
  }
}