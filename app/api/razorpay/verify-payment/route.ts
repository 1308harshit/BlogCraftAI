import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { createClient } from '@supabase/supabase-js'

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId 
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update user status to active
    if (supabase) {
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
          razorpay_order_id,
          razorpay_payment_id,
          amount: 99900,
          currency: 'INR',
          status: 'success',
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully' 
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
