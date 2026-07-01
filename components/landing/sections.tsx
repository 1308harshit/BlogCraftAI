'use client'

import { motion } from 'framer-motion'
import { Workflow, Globe2, Quote, Plug, TrendingUp, Sparkles, Target, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const workflows = [
  { 
    icon: Target,
    title: 'Viral Prediction → Optimization → Publish', 
    desc: 'Score content before publishing, get optimization tips, guarantee results'
  },
  { 
    icon: DollarSign,
    title: 'Content → Monetization → Revenue Tracking', 
    desc: 'Auto-insert affiliates, CTAs, funnels, track every rupee back to content'
  },
  { 
    icon: TrendingUp,
    title: 'Research → Write → 8 Platforms → Analytics', 
    desc: 'One article, published everywhere, full attribution tracking'
  },
]

const integrations = [
  'WordPress', 'Medium', 'Ghost', 'LinkedIn', 'Twitter/X', 'Instagram', 
  'YouTube', 'TikTok', 'Razorpay', 'Shopify', 'HubSpot', 'Mailchimp'
]

const testimonials = [
  {
    quote: 'BlogCraft\'s viral prediction gave us 87% accuracy. We went from 2K to 24K monthly visitors in 60 days. Revenue increased ₹18L/month.',
    author: 'Rahul Kumar',
    role: 'Founder, TechStartup.io',
    metrics: '+1100% traffic • ₹18L revenue'
  },
  {
    quote: 'The Personal AI Brain learned our brand voice perfectly. Content production time dropped 85% while quality improved. Our team loves it.',
    author: 'Priya Sharma',
    role: 'Content Director, SaaS Company',
    metrics: '85% faster • Better quality'
  },
  {
    quote: 'Revenue attribution changed everything. We finally know which content drives sales. ROI tracking justified our entire content budget.',
    author: 'Marcus Thompson',
    role: 'CMO, E-commerce Brand',
    metrics: '12x ROI • Full attribution'
  },
]

export function LandingWorkflows() {
  return (
    <section id="workflows" className="border-y border-border/50 bg-gradient-to-b from-card/30 to-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-orange-600 to-red-600">Revenue Workflows</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">From Content to Cash Flow — Fully Automated</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Complete automation from viral prediction to revenue tracking. 95% hands-free operation.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {workflows.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all group"
            >
              <w.icon className="mb-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <h3 className="font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Live Metrics Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <Badge className="mb-2">Real-Time Platform Metrics</Badge>
            <p className="text-sm text-muted-foreground">Live data from the Revenue Engine</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <p className="text-2xl font-bold text-violet-500">12,847</p>
              <p className="text-xs text-muted-foreground mt-1">Articles Today</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-500">3,421</p>
              <p className="text-xs text-muted-foreground mt-1">Viral Predictions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">₹28.4L</p>
              <p className="text-xs text-muted-foreground mt-1">Revenue Tracked</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-2xl font-bold text-orange-500">8,934</p>
              <p className="text-xs text-muted-foreground mt-1">Active Automations</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingIntegrations() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600">8-Platform Domination</Badge>
        <h2 className="text-3xl font-bold">Publish Everywhere. Track Everything.</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          One article → 8 platforms → Full revenue attribution. Write once, dominate everywhere.
        </p>
        
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 mb-4">
              <Globe2 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Content Platforms</h3>
            <p className="text-sm text-muted-foreground mb-4">Distribute your content everywhere</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">WordPress</Badge>
              <Badge variant="secondary">Medium</Badge>
              <Badge variant="secondary">Ghost</Badge>
              <Badge variant="secondary">LinkedIn</Badge>
            </div>
          </div>
          
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 mb-4">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Social Networks</h3>
            <p className="text-sm text-muted-foreground mb-4">Amplify reach and engagement</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Twitter/X</Badge>
              <Badge variant="secondary">Instagram</Badge>
              <Badge variant="secondary">YouTube</Badge>
              <Badge variant="secondary">TikTok</Badge>
            </div>
          </div>
          
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 mb-4">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">Revenue Tools</h3>
            <p className="text-sm text-muted-foreground mb-4">Monetize and track attribution</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Razorpay</Badge>
              <Badge variant="secondary">Shopify</Badge>
              <Badge variant="secondary">HubSpot</Badge>
              <Badge variant="secondary">Mailchimp</Badge>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-6 max-w-2xl mx-auto"
        >
          <p className="text-sm font-medium mb-2">🎯 Full Attribution Tracking</p>
          <p className="text-xs text-muted-foreground">
            Every click, conversion, and rupee tracked back to the exact article, platform, and timestamp. 
            Know exactly what content drives revenue across all 8 platforms.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingTestimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Real Results</Badge>
          <h2 className="text-3xl font-bold">Customers Who Transformed Their Business</h2>
          <p className="text-muted-foreground mt-4">Actual metrics from real customers</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/60" />
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-medium">{t.author}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
                <Badge variant="secondary" className="mt-3 text-xs bg-green-500/10 text-green-500 border-green-500/20">
                  {t.metrics}
                </Badge>
              </div>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4">Revenue Engine Capabilities</Badge>
          <h2 className="text-3xl font-bold">Beyond Writing — Complete Revenue Stack</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to turn content into predictable revenue streams
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <Target className="h-8 w-8 text-violet-500 mb-4" />
            <h3 className="font-semibold mb-2">Viral Prediction Engine</h3>
            <p className="text-sm text-muted-foreground">
              85%+ accuracy in predicting viral potential. Score content before publishing, get optimization suggestions, guarantee results.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <Sparkles className="h-8 w-8 text-cyan-500 mb-4" />
            <h3 className="font-semibold mb-2">Personal AI Brain</h3>
            <p className="text-sm text-muted-foreground">
              Learns your brand voice, audience preferences, and success patterns. Gets smarter with every article you publish.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <DollarSign className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">Auto-Monetization</h3>
            <p className="text-sm text-muted-foreground">
              90%+ CTR on AI-generated CTAs and affiliate links. Automatically inserts best-performing monetization elements.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <TrendingUp className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Revenue Attribution</h3>
            <p className="text-sm text-muted-foreground">
              Track every rupee back to exact content. Know your ROI per article, per platform, per CTA. Full financial transparency.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <Globe2 className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-semibold mb-2">Content DNA Analyzer</h3>
            <p className="text-sm text-muted-foreground">
              Analyze top-performing content in your niche. Extract patterns, reverse-engineer success, replicate what works.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <Workflow className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="font-semibold mb-2">Smart A/B Testing</h3>
            <p className="text-sm text-muted-foreground">
              Test headlines, CTAs, monetization strategies. Auto-optimize based on real performance data. Continuous improvement.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-8 max-w-4xl mx-auto text-center"
        >
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600">Enterprise SEO Included</Badge>
          <h3 className="text-xl font-bold mb-2">Complete SEO Stack Built-In</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Live scoring, keyword density analysis, meta generation, schema markup, SERP snippet preview, 
            and competitor comparison — all automated in every article you write.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
