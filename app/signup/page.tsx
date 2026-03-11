'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function Signup() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      const data = await response.json()
      
      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.user.id,
          userEmail: email,
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error('Payment setup failed')
      }

      const { url } = await checkoutResponse.json()
      toast.success('Account created! Redirecting to payment...')
      window.location.href = url
    } catch (error) {
      toast.error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join BlogCraft AI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join 1000+ businesses creating SEO content with AI
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">₹999/month</div>
            <div className="text-gray-600">Founder Special Pricing</div>
            <div className="text-sm text-gray-500 line-through">Regular: ₹2,999/month</div>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Start Free Trial'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited blog posts
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                SEO optimization
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                WordPress export
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}