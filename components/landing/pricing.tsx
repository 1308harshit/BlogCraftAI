'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'For trying BlogCraft',
    features: ['5 generations/month', 'Basic editor', 'SEO score', 'Export markdown'],
    cta: 'Get started',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    desc: 'For serious creators',
    features: ['Unlimited writing', 'SEO engine', 'AI research', 'AI images', 'All exports'],
    cta: 'Start Pro trial',
    href: '/sign-up',
    popular: true,
  },
  {
    name: 'Business',
    price: '$79',
    desc: 'For teams & agencies',
    features: ['Everything in Pro', 'Team workspace', 'Automations', 'Integrations', 'Priority support'],
    cta: 'Start Business',
    href: '/sign-up',
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you&apos;re ready to scale.</p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full ${plan.popular ? 'border-primary/50 glow-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.desc}</CardDescription>
                  <p className="pt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-muted-foreground">/mo</span>}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
