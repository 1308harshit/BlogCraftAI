'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Image, PenLine, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-60" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-6">Public beta</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create better blog content with <span className="text-gradient">AI assistance.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Research a topic, draft an article, improve its SEO, and save your work in one focused workspace.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="min-w-48">
              <Link href="/signup">Try the beta <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/analyze">Try the free analyzer</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No payment details required during the public beta.</p>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  const features = [
    { icon: PenLine, title: 'AI Writer', text: 'Generate and refine a first draft from a topic and keywords.' },
    { icon: Search, title: 'Research workspace', text: 'Bring your own public sources and turn them into an outline.' },
    { icon: Sparkles, title: 'SEO tools', text: 'Review content and iterate on structure, readability, and keywords.' },
    { icon: Image, title: 'AI images', text: 'Create blog images when image generation is configured for the service.' },
  ]

  return (
    <section id="features" className="border-y border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center"><h2 className="text-3xl font-bold">Built for a practical writing workflow</h2></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6">
              <feature.icon className="mb-4 h-7 w-7 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
