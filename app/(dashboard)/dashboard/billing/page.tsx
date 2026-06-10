'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (plan: 'pro' | 'business') => {
    setLoading(plan)
    try {
      const res = await fetch('/api/razorpay/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.error) return toast.error(data.error ?? 'Checkout unavailable')

      const scriptOk = await new Promise<boolean>((resolve) => {
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
        if (existing) return resolve(true)
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => resolve(true)
        s.onerror = () => resolve(false)
        document.body.appendChild(s)
      })

      if (!scriptOk) {
        toast.error('Failed to load Razorpay checkout')
        return
      }

      // @ts-expect-error Razorpay is injected by checkout.js
      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: 'BlogCraft AI',
        description: `${plan.toUpperCase()} plan subscription`,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, plan }),
          })
          const verify = await verifyRes.json()
          if (verify.success) toast.success('Subscription active!')
          else toast.error(verify.error ?? 'Verification failed')
        },
        theme: { color: '#7c3aed' },
      })

      rzp.open()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription via Razorpay</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {(['free', 'pro', 'business'] as const).map((key) => {
          const plan = {
            free: {
              name: 'Free',
              description: 'Get started',
              price: '₹0',
              features: ['10 generations / month', 'SEO Engine', 'Research Agent (manual sources)'],
            },
            pro: {
              name: 'Pro',
              description: 'Unlimited writing',
              price: '₹999 / month',
              features: ['Unlimited generations', 'AI Writer + Pipeline', 'Templates', 'Exports'],
            },
            business: {
              name: 'Business',
              description: 'Teams + automations',
              price: '₹2,999 / month',
              features: ['Unlimited generations', 'Team workspace', 'Automations + integrations'],
            },
          }[key]
          return (
            <Card key={key} className={key === 'pro' ? 'border-primary/50' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.description} · <span className="text-foreground">{plan.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {key !== 'free' && (
                  <Button
                    className="w-full"
                    onClick={() => checkout(key as 'pro' | 'business')}
                    disabled={loading === key}
                  >
                    {loading === key ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
