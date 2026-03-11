'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface PaymentButtonProps {
  userId: string
  userEmail: string
  userName?: string
  className?: string
  children: React.ReactNode
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentButton({ 
  userId, 
  userEmail, 
  userName = 'User',
  className, 
  children 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setLoading(false)
        return
      }

      // Create order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          amount: 99900, // ₹999 in paise
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId, amount, currency, keyId, note } = await response.json()

      // Demo mode check
      if (note?.includes('Demo')) {
        toast.success('Demo mode: Payment simulation successful!')
        setTimeout(() => {
          window.location.href = '/dashboard?demo_payment=success'
        }, 1500)
        return
      }

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'BlogCraft AI',
        description: 'Founder Special - Unlimited AI Blog Posts',
        order_id: orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#3b82f6',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            toast.success('Payment successful! Welcome to BlogCraft AI Pro!')
            setTimeout(() => {
              window.location.href = '/dashboard?payment=success'
            }, 1500)
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
            console.error('Verification error:', error)
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error('Payment error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}
