'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Globe, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Articles generated', value: '2.4M+' },
  { label: 'Avg. SEO score', value: '94' },
  { label: 'Time saved / week', value: '12hrs' },
  { label: 'Active creators', value: '18K+' },
]

export function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge className="mb-6">AI Blogging Operating System</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Write smarter.{' '}
            <span className="text-gradient">Rank faster.</span>
            <br />
            Scale infinitely.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            BlogCraft AI combines research agents, SEO intelligence, and premium workflows —
            so you publish world-class content without feeling like you&apos;re using an AI wrapper.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/sign-up">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Explore features</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <div className="glass-card mx-auto max-w-5xl overflow-hidden p-1">
            <div className="rounded-lg bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-muted-foreground">BlogCraft Dashboard</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Sparkles, title: 'AI Writer', desc: 'TipTap editor + inline AI' },
                  { icon: Globe, title: 'Research Agent', desc: 'SERP + competitor intel' },
                  { icon: BarChart3, title: 'SEO Engine', desc: 'Real-time optimization' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/50 bg-background/50 p-4">
                    <item.icon className="mb-2 h-5 w-5 text-primary" />
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-muted/30 p-4 font-mono text-sm text-muted-foreground">
                <span className="text-primary">&gt;</span> Generating SEO blog on &quot;AI content automation&quot;...
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-gradient sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  const features = [
    {
      icon: Zap,
      title: 'AI Writer',
      desc: 'TipTap editor with slash commands, inline rewrite, expand, tone change, and autocomplete.',
    },
    {
      icon: Globe,
      title: 'Research Agent',
      desc: 'Autonomous web research, competitor analysis, keyword clustering, and auto-outlines.',
    },
    {
      icon: BarChart3,
      title: 'SEO Engine',
      desc: 'Live scoring, keyword density, meta generation, schema markup, and snippet preview.',
    },
    {
      icon: Sparkles,
      title: 'Automations',
      desc: 'No-code workflows: daily blogs, WordPress publish, social threads, newsletters.',
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to dominate content</h2>
          <p className="mt-4 text-muted-foreground">Not a wrapper. A complete blogging OS.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group p-6 transition-all hover:border-primary/30 hover:shadow-primary/10"
            >
              <f.icon className="mb-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
