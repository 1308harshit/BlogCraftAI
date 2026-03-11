'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface PaymentButtonProps {
  userId: string
  userEmail: string
  className?: string
  children: React.ReactNode
}

export default function PaymentButton({ userId, userEmail, className, children }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error('Payment error:', error)
    } finally {
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