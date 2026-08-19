import { NextRequest, NextResponse } from 'next/server'
import { isRazorpayConfigured, verifyWebhookSignature } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) return NextResponse.json({ error: 'Billing is not available yet' }, { status: 503 })
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 503 })
  }

  const event = JSON.parse(rawBody) as any
  const eventType = event.event as string

  // We rely on notes.userId set during subscription creation.
  const payload = event.payload ?? {}
  const subscription = payload.subscription?.entity

  if (subscription?.notes?.userId && subscription?.id) {
    const userId = subscription.notes.userId as string
    const status = subscription.status as string

    await admin
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('provider_subscription_id', subscription.id)
  }

  // Payment events can be handled similarly if you store plan in notes.
  return NextResponse.json({ received: true, type: eventType })
}

