import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createRazorpaySubscription } from '@/lib/razorpay'
import { envServer } from '@/lib/env'

const PLAN_TO_RAZORPAY_PLAN_ID: Record<string, string | undefined> = {
  pro: envServer.RAZORPAY_PLAN_PRO,
  business: envServer.RAZORPAY_PLAN_BUSINESS,
}

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { plan } = await req.json()
  if (!plan || typeof plan !== 'string') {
    return NextResponse.json({ error: 'plan is required' }, { status: 400 })
  }
  if (plan !== 'pro' && plan !== 'business') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const razorpayPlanId = PLAN_TO_RAZORPAY_PLAN_ID[plan]
  if (!razorpayPlanId) {
    return NextResponse.json(
      { error: `Missing Razorpay plan id for "${plan}". Set RAZORPAY_PLAN_${plan.toUpperCase()}.` },
      { status: 503 }
    )
  }

  const subscription = await createRazorpaySubscription(razorpayPlanId, authed.user.id, authed.user.email ?? '')

  // Store a local subscription row (status will be updated via webhook/verification).
  await authed.supabase.from('subscriptions').insert({
    user_id: authed.user.id,
    provider: 'razorpay',
    plan_id: plan,
    provider_subscription_id: subscription.id,
    status: subscription.status ?? 'created',
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({
    keyId: envServer.RAZORPAY_KEY_ID ?? '',
    subscriptionId: subscription.id,
    plan,
  })
}

