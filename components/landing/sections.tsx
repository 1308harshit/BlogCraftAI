'use client'

import { motion } from 'framer-motion'
import { Workflow, Globe2, Quote, Plug } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const workflows = [
  { title: 'Topic → Research → Outline → Article', desc: 'Full pipeline in one click' },
  { title: 'Auto-publish to WordPress', desc: 'Schedule and ship without leaving BlogCraft' },
  { title: 'Blog → Twitter thread → LinkedIn', desc: 'One article, every channel' },
]

const integrations = ['WordPress', 'Medium', 'Ghost', 'Webflow', 'Shopify', 'Razorpay', 'Supabase', 'OpenAI']

const testimonials = [
  {
    quote: 'BlogCraft feels like Notion met Perplexity — finally an AI tool that respects workflow.',
    author: 'Priya S.',
    role: 'Content Lead, SaaS startup',
  },
  {
    quote: 'We cut content production time by 70% while SEO scores went up. The research agent is unreal.',
    author: 'Marcus T.',
    role: 'Agency founder',
  },
  {
    quote: 'The UI alone sold me. My team actually wants to write now.',
    author: 'Elena R.',
    role: 'Marketing director',
  },
]

export function LandingWorkflows() {
  return (
    <section id="workflows" className="border-y border-border/50 bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4">AI Workflows</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Automate your entire content machine</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {workflows.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <Workflow className="mb-4 h-8 w-8 text-primary" />
              <h3 className="font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingIntegrations() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Plug className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h2 className="text-3xl font-bold">Integrations</h2>
        <p className="mt-4 text-muted-foreground">Publish and monetize everywhere you grow</p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {integrations.map((name) => (
            <Badge key={name} variant="secondary" className="px-4 py-2 text-sm">
              {name}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingTestimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">Loved by creators & teams</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/60" />
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-medium">{t.author}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingSEO() {
  return (
    <section className="border-t border-border/50 py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Globe2 className="h-16 w-16 shrink-0 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Enterprise SEO Engine</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Live scoring, keyword density, meta generation, schema markup, snippet preview, and
            competitor comparison — built into every article you write.
          </p>
        </div>
      </div>
    </section>
  )
}
