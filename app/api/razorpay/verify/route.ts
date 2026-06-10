import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 503 })

  const body = await req.json()
  const paymentId = body.razorpay_payment_id as string | undefined
  const signature = body.razorpay_signature as string | undefined
  const orderId =
    (body.razorpay_order_id as string | undefined) ?? (body.razorpay_subscription_id as string | undefined)
  const plan = body.plan as string | undefined

  if (!paymentId || !signature || !orderId || !plan) {
    return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 })
  }

  const ok = verifyRazorpaySignature(orderId, paymentId, signature)
  if (!ok) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

  const { data: planRow, error: planErr } = await admin
    .from('plan_catalog')
    .select('*')
    .eq('id', plan)
    .single()

  if (planErr || !planRow) {
    return NextResponse.json({ error: 'Unknown plan' }, { status: 400 })
  }

  await admin.from('entitlements').upsert({
    user_id: authed.user.id,
    plan_id: planRow.id,
    generations_limit: planRow.generations_limit,
    updated_at: new Date().toISOString(),
  })

  await admin
    .from('subscriptions')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('user_id', authed.user.id)
    .eq('plan_id', plan)

  return NextResponse.json({ success: true })
}
