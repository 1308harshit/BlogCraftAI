'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [email, setEmail] = useState('')

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle early access signup
    window.location.href = `/signup?email=${encodeURIComponent(email)}`
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            BlogCraft AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate Google-optimized blog posts in 60 seconds. 
            Save ₹50,000+ per month on content creation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/generator" className="btn-primary text-lg px-8 py-3">
              Try Free Demo
            </Link>
            <form onSubmit={handleEarlyAccess} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button type="submit" className="btn-secondary">
                Get Early Access
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">60s</div>
              <div className="text-gray-600">Article Generation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">₹999</div>
              <div className="text-gray-600">Founder Pricing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">SEO</div>
              <div className="text-gray-600">Optimized Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}