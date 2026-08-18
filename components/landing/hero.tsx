'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, TrendingUp, Target, DollarSign, Brain, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Traffic Growth', value: '3x', badge: 'Guaranteed' },
  { label: 'Viral Accuracy', value: '85%+', badge: 'AI Predicted' },
  { label: 'Avg Revenue', value: '₹2.4L', badge: 'Per Month' },
  { label: 'Automation', value: '95%', badge: 'Hands-Free' },
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
              🎯 3x Traffic Guarantee
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
              🚀 85% Viral Accuracy
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600">
              💰 Revenue Attribution
            </Badge>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Turn Content Into{' '}
            <span className="text-gradient">Revenue.</span>
            <br />
            Guaranteed Results.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            AI-powered <strong>Revenue Engine</strong> that predicts viral success, automates monetization,
            and guarantees 3x traffic growth in 90 days — not just another content generator.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="min-w-[220px] bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
              <Link href="/sign-up">
                See Your Viral Score <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#revenue-engine">How It Works</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            💎 No credit card required • 🎁 Free viral prediction • 🔒 Cancel anytime
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
                <span className="ml-2 text-xs text-muted-foreground">BlogCraft Revenue Engine</span>
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
                  <span className="text-sm font-medium">Viral Prediction Analysis</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-primary">&gt;</span> Analyzing &quot;AI Content Automation&quot;...
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Viral Score:</span>
                      <span className="text-green-500 font-bold">87/100 🔥</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Predicted Traffic:</span>
                      <span className="text-cyan-500">12,400 views</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Revenue Potential:</span>
                      <span className="text-green-500">₹8,200</span>
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
      title: 'Personal AI Brain',
      desc: 'Learns your success patterns, adapts strategies automatically, and replicates what works. No re-prompting needed.',
      badge: 'Adaptive Learning'
    },
    {
      icon: Target,
      title: 'Viral Prediction Engine',
      desc: 'Scores content 1-100 with 85%+ accuracy. Know if it will go viral before you publish. Optimize for maximum reach.',
      badge: '85%+ Accurate'
    },
    {
      icon: DollarSign,
      title: 'Auto-Monetization',
      desc: 'Contextual affiliate links (90%+ relevance), smart CTAs, lead magnets, and complete sales funnels. Revenue on autopilot.',
      badge: '90%+ Relevance'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Attribution',
      desc: 'Track every ₹ back to specific content. Multi-touch attribution, ROI calculations, and forecasting with confidence intervals.',
      badge: '95%+ Accuracy'
    },
    {
      icon: Rocket,
      title: 'Content DNA Analyzer',
      desc: 'Reverse-engineer viral content. Extract success patterns, emotional triggers, and replicate what works across topics.',
      badge: 'Pattern Recognition'
    },
    {
      icon: Zap,
      title: '8-Platform Domination',
      desc: 'Auto-adapt and publish to Twitter, LinkedIn, Instagram, YouTube, TikTok, Medium, Facebook, WordPress. One click, all channels.',
      badge: '8 Platforms'
    },
    {
      icon: Sparkles,
      title: 'Smart A/B Testing',
      desc: 'Automatic testing of headlines, hooks, CTAs, formats. Statistical significance calculation and winner implementation.',
      badge: 'Automated'
    },
    {
      icon: TrendingUp,
      title: 'Business Intelligence',
      desc: 'Revenue forecasting, growth opportunities, competitor analysis, and market intelligence. Make data-driven decisions.',
      badge: 'Forecasting'
    },
  ]

  return (
    <section id="revenue-engine" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-cyan-600">Revenue Engine Features</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Not Just Content — Business Results</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            While competitors generate generic content, we guarantee measurable outcomes:
            traffic growth, revenue attribution, and viral success prediction.
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

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 glass-card p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Why BlogCraft Dominates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Jasper</th>
                  <th className="text-center py-4 px-4">Copy.ai</th>
                  <th className="text-center py-4 px-4 bg-primary/10 rounded-t-lg">
                    <span className="font-bold text-primary">BlogCraft</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-4 font-medium">Viral Prediction Engine</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅ 85%+</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Personal AI Brain (Learning)</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Revenue Attribution</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Auto-Monetization</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅ 90%</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">8-Platform Publishing</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Traffic Growth Guarantee</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅ 3x</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Content DNA Analysis</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-primary/5">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
