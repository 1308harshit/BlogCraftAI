import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { createClient } from '@supabase/supabase-js'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify webhook signature
  const isValid = verifyWebhookSignature(body, signature)

  if (!isValid) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const event = JSON.parse(body)

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity)
        break

      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.subscription.entity)
        break

      case 'subscription.cancelled':
      case 'subscription.completed':
        await handleSubscriptionEnded(event.payload.subscription.entity)
        break

      default:
        console.log(`Unhandled event type: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentCaptured(payment: any) {
  if (!supabase) return

  const userId = payment.notes?.userId
  if (!userId) return

  // Update user status to active
  await supabase
    .from('users')
    .update({ 
      status: 'active',
      plan: 'pro'
    })
    .eq('id', userId)

  // Create payment record
  await supabase
    .from('payments')
    .insert({
      user_id: userId,
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'success',
      created_at: new Date(payment.created_at * 1000).toISOString()
    })
}

async function handlePaymentFailed(payment: any) {
  if (!supabase) return

  const userId = payment.notes?.userId
  if (!userId) return

  // Log failed payment
  await supabase
    .from('payments')
    .insert({
      user_id: userId,
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'failed',
      created_at: new Date(payment.created_at * 1000).toISOString()
    })
}

async function handleSubscriptionActivated(subscription: any) {
  if (!supabase) return

  const userId = subscription.notes?.userId
  if (!userId) return

  // Update user status
  await supabase
    .from('users')
    .update({ 
      status: 'active',
      plan: 'pro'
    })
    .eq('id', userId)

  // Create subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      razorpay_subscription_id: subscription.id,
      status: subscription.status,
      plan_id: subscription.plan_id,
      current_start: new Date(subscription.current_start * 1000).toISOString(),
      current_end: new Date(subscription.current_end * 1000).toISOString(),
    })
}

async function handleSubscriptionCharged(subscription: any) {
  if (!supabase) return

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_start: new Date(subscription.current_start * 1000).toISOString(),
      current_end: new Date(subscription.current_end * 1000).toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id)
}

async function handleSubscriptionEnded(subscription: any) {
  if (!supabase) return

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
    })
    .eq('razorpay_subscription_id', subscription.id)

  // Update user status
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', subscription.id)
    .single()

  if (sub) {
    await supabase
      .from('users')
      .update({ 
        status: 'inactive',
        plan: 'free'
      })
      .eq('id', sub.user_id)
  }
}
