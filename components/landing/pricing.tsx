'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    desc: 'Try the platform',
    features: [
      '5 articles/month',
      'Basic AI writer',
      'SEO scoring',
      'Viral prediction preview',
      'Export markdown'
    ],
    cta: 'Start Free',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Creator',
    price: '$49',
    desc: 'For serious content creators',
    features: [
      'Unlimited articles',
      'Personal AI Brain (learns your style)',
      'Viral Prediction Engine (85%+ accuracy)',
      'Auto-monetization (affiliates + CTAs)',
      'SEO optimization',
      '1 automation workflow',
      'All export formats'
    ],
    cta: 'Start Creator',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Business',
    price: '$149',
    desc: 'For teams & agencies',
    features: [
      'Everything in Creator',
      'Multi-platform publishing (8 platforms)',
      'Revenue attribution tracking',
      'Content DNA analyzer',
      'A/B testing automation',
      '10 automation workflows',
      'Business intelligence dashboard',
      'Priority support'
    ],
    cta: 'Start Business',
    href: '/sign-up',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$399',
    desc: 'For enterprises',
    features: [
      'Everything in Business',
      'Unlimited team members',
      'White-label solution',
      '3x traffic guarantee or refund',
      'Dedicated success manager',
      'Custom integrations',
      'SLA-backed performance',
      'Advanced analytics',
      'API access'
    ],
    cta: 'Contact Sales',
    href: '/sign-up',
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-card/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600">Transparent Pricing</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Enterprise Features, Startup Pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Scale when ready. Cancel anytime.</p>
        </div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full ${plan.popular ? 'border-primary/50 glow-primary scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-600">
                    ⭐ Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.desc}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-muted-foreground">/mo</span>}
                  </div>
                  {plan.price !== '$0' && (
                    <p className="text-xs text-muted-foreground pt-1">
                      Billed monthly • 20% off annual
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'} 
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculator Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 glass-card p-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold">Calculate Your ROI</h3>
            <p className="text-muted-foreground mt-2">See how much revenue you can generate</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20">
              <p className="text-3xl font-bold text-violet-500">3x</p>
              <p className="text-sm text-muted-foreground mt-2">Traffic Growth</p>
              <p className="text-xs text-muted-foreground mt-1">Guaranteed in 90 days</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
              <p className="text-3xl font-bold text-cyan-500">85%+</p>
              <p className="text-sm text-muted-foreground mt-2">Viral Accuracy</p>
              <p className="text-xs text-muted-foreground mt-1">Before publishing</p>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <p className="text-3xl font-bold text-green-500">₹2.4L</p>
              <p className="text-sm text-muted-foreground mt-2">Avg Revenue</p>
              <p className="text-xs text-muted-foreground mt-1">Per month per user</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
