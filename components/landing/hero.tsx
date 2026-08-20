'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, TrendingUp, Target, DollarSign, Brain, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'AI Models', value: '3+', badge: 'Integrated' },
  { label: 'Content Formats', value: '20+', badge: 'Supported' },
  { label: 'Platforms', value: '8', badge: 'Publishing' },
  { label: 'SEO Tools', value: 'Built-in', badge: 'Real-time' },
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
          <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600">
              🎯 AI-Powered Content Intelligence
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
              🚀 Multi-Platform Publishing
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600">
              💰 Built-in SEO & Monetization
            </Badge>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            The AI Growth Engine for{' '}
            <span className="text-gradient">Content Businesses</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Research, create, optimize, publish, and measure your content with AI that learns what works for your business. 
            Complete content growth system in one platform.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="min-w-[220px] bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
              <Link href="/analyze">
                Analyze My Content <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See Features</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Free content analyzer • No signup required • Get instant insights
          </p>
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
                <span className="ml-2 text-xs text-muted-foreground">BlogCraft AI Content Analysis</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Brain, title: 'Personal AI Brain', desc: 'Learns & adapts to your success', color: 'text-violet-500' },
                  { icon: Target, title: 'Viral Prediction', desc: '85%+ accuracy before publish', color: 'text-cyan-500' },
                  { icon: DollarSign, title: 'Auto-Monetization', desc: 'Affiliate + CTAs + Funnels', color: 'text-green-500' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/50 bg-background/50 p-4 hover:border-primary/50 transition-all">
                    <item.icon className={`mb-2 h-5 w-5 ${item.color}`} />
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-violet-500" />
                  <span className="text-sm font-medium">Content Analysis</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-primary">&gt;</span> Analyzing &quot;AI Content Automation&quot;...
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Content Score:</span>
                      <span className="text-green-500 font-bold">87/100</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">SEO Optimization:</span>
                      <span className="text-cyan-500">Strong</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Readability:</span>
                      <span className="text-green-500">Excellent</span>
                    </div>
                  </div>
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />
                </div>
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
              <Badge variant="secondary" className="mt-2 text-xs">{stat.badge}</Badge>
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
      icon: Brain,
      title: 'AI Content Intelligence',
      desc: 'Adaptive AI system that learns your brand voice and content preferences. Create consistent, on-brand content at scale.',
      badge: 'Learning System'
    },
    {
      icon: Target,
      title: 'Content Performance Scoring',
      desc: 'Multi-factor content analysis covering SEO, readability, engagement potential, and search intent alignment.',
      badge: 'Real-time Analysis'
    },
    {
      icon: DollarSign,
      title: 'Monetization Tools',
      desc: 'Built-in CTA generation, affiliate link management, and lead magnet creation to help monetize your content.',
      badge: 'Revenue Tools'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      desc: 'Track content performance, traffic sources, and engagement metrics. Understand what resonates with your audience.',
      badge: 'Data-Driven'
    },
    {
      icon: Rocket,
      title: 'Content Research',
      desc: 'AI-powered research assistant that helps you discover trending topics, analyze competitors, and find content gaps.',
      badge: 'Research Tools'
    },
    {
      icon: Zap,
      title: 'Multi-Platform Publishing',
      desc: 'Publish to multiple platforms including WordPress, Medium, and social channels. Manage everything from one dashboard.',
      badge: 'Integrations'
    },
    {
      icon: Sparkles,
      title: 'SEO Optimization',
      desc: 'Built-in SEO tools including keyword analysis, meta tag generation, readability scoring, and content structure recommendations.',
      badge: 'SEO Built-in'
    },
    {
      icon: TrendingUp,
      title: 'Content Calendar',
      desc: 'Plan, schedule, and manage your content pipeline. Keep your publishing schedule organized and consistent.',
      badge: 'Organization'
    },
  ]

  return (
    <section id="revenue-engine" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-cyan-600">Platform Features</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Complete Content Growth Platform</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to research, create, optimize, and publish high-quality content that drives results.
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group p-6 transition-all hover:border-primary/30 hover:shadow-primary/10 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <f.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <Badge variant="secondary" className="text-xs">{f.badge}</Badge>
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 glass-card p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">What Makes BlogCraft Different</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Complete System</div>
              <p className="text-sm text-muted-foreground">Research, write, optimize, publish, and measure — all in one platform</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
              <p className="text-sm text-muted-foreground">Multiple AI models working together for better content creation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Built for Growth</div>
              <p className="text-sm text-muted-foreground">SEO tools, analytics, and monetization features built-in from day one</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
