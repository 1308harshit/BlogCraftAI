import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, amount = 99900 } = await request.json()

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Check if using demo Razorpay keys
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('Demo mode: Simulating Razorpay order')
      return NextResponse.json({ 
        orderId: 'demo_order_id',
        amount: amount,
        currency: 'INR',
        keyId: 'demo_key_id',
        note: 'Demo mode - payment simulation'
      })
    }

    const order = await createRazorpayOrder(amount, userId, userEmail)

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
