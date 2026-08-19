import Razorpay from 'razorpay'
import crypto from 'crypto'

// Payments must fail closed. Demo responses must never grant paid access.
export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null

export function isRazorpayConfigured() {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET &&
      process.env.RAZORPAY_PLAN_PRO &&
      process.env.RAZORPAY_PLAN_BUSINESS
  )
}

export const createRazorpayOrder = async (
  amount: number, // Amount in paise (₹999 = 99900 paise)
  userId: string,
  userEmail: string
) => {
  if (!razorpay) throw new Error('Razorpay is not configured')

  const order = await razorpay.orders.create({
    amount: amount,
    currency: 'INR',
    receipt: `receipt_${userId}_${Date.now()}`,
    notes: {
      userId,
      userEmail,
    },
  })

  return order
}

export const createRazorpaySubscription = async (
  planId: string,
  userId: string,
  userEmail: string,
  totalCount: number = 12 // 12 months by default
) => {
  if (!isRazorpayConfigured() || !razorpay) throw new Error('Razorpay is not configured')

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: totalCount,
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId,
      userEmail,
    },
  })

  return subscription
}

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!process.env.RAZORPAY_KEY_SECRET) return false

  const text = `${orderId}|${paymentId}`
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex')

  return generatedSignature === signature
}

export const verifyWebhookSignature = (
  body: string,
  signature: string
): boolean => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}
