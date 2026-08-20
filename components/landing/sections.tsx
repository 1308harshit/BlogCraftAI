'use client'

import { motion } from 'framer-motion'
import { Workflow, Globe2, Plug, TrendingUp, Sparkles, Target, DollarSign, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const workflows = [
  { 
    icon: FileText,
    title: 'Research → Write → Optimize', 
    desc: 'AI-powered research, content generation, and SEO optimization in one workflow'
  },
  { 
    icon: Target,
    title: 'Content Analysis & Scoring', 
    desc: 'Real-time content scoring for SEO, readability, and engagement potential'
  },
  { 
    icon: Globe2,
    title: 'Multi-Platform Publishing', 
    desc: 'Publish to WordPress, Medium, and social platforms from one dashboard'
  },
]

export function LandingWorkflows() {
  return (
    <section id="workflows" className="border-y border-border/50 bg-gradient-to-b from-card/30 to-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-orange-600 to-red-600">Complete Workflow</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">From Idea to Published Content</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            End-to-end content creation workflow powered by AI, built for modern content teams.
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
        
        {/* Platform Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <Badge className="mb-2">Platform Capabilities</Badge>
            <p className="text-sm text-muted-foreground">What you can do with BlogCraft AI</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <p className="text-2xl font-bold text-violet-500">3+</p>
              <p className="text-xs text-muted-foreground mt-1">AI Models</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-500">20+</p>
              <p className="text-xs text-muted-foreground mt-1">Content Formats</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">SEO</p>
              <p className="text-xs text-muted-foreground mt-1">Built-in Tools</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-2xl font-bold text-orange-500">8</p>
              <p className="text-xs text-muted-foreground mt-1">Publishing Platforms</p>
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
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600">Integrations</Badge>
        <h2 className="text-3xl font-bold">Publish Everywhere From One Place</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Connect your favorite platforms and manage all your content from a single dashboard.
        </p>
        
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 mb-4">
              <Globe2 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Content Platforms</h3>
            <p className="text-sm text-muted-foreground mb-4">Publish to popular blogging platforms</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">WordPress</Badge>
              <Badge variant="secondary">Medium</Badge>
              <Badge variant="secondary">Ghost</Badge>
            </div>
          </div>
          
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 mb-4">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Social Networks</h3>
            <p className="text-sm text-muted-foreground mb-4">Share across social channels</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">LinkedIn</Badge>
              <Badge variant="secondary">Twitter/X</Badge>
              <Badge variant="secondary">More coming</Badge>
            </div>
          </div>
          
          <div className="glass-card p-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 mb-4">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">Analytics & Tools</h3>
            <p className="text-sm text-muted-foreground mb-4">Track performance and growth</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Built-in Analytics</Badge>
              <Badge variant="secondary">SEO Tools</Badge>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-6 max-w-2xl mx-auto"
        >
          <p className="text-sm font-medium mb-2">🎯 Unified Dashboard</p>
          <p className="text-xs text-muted-foreground">
            Manage all your content, track performance, and optimize your strategy from one central location.
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
          <Badge className="mb-4">Trusted by Content Creators</Badge>
          <h2 className="text-3xl font-bold">Built for Modern Content Teams</h2>
          <p className="text-muted-foreground mt-4">Join content creators, marketers, and agencies using BlogCraft AI</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">3+</div>
            <p className="text-sm text-muted-foreground">AI Models Integrated</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">20+</div>
            <p className="text-sm text-muted-foreground">Content Formats</p>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">8</div>
            <p className="text-sm text-muted-foreground">Publishing Platforms</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            BlogCraft AI combines research, writing, SEO optimization, and publishing tools 
            into one unified platform designed for content businesses.
          </p>
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
          <Badge className="mb-4">Core Features</Badge>
          <h2 className="text-3xl font-bold">Everything You Need for Content Success</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools to help you research, create, optimize, and publish high-performing content
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
            <h3 className="font-semibold mb-2">Content Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Real-time analysis of SEO, readability, engagement potential, and content structure.
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
            <h3 className="font-semibold mb-2">AI Writing Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Multiple AI models working together to help you create engaging, high-quality content.
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
            <h3 className="font-semibold mb-2">Monetization Tools</h3>
            <p className="text-sm text-muted-foreground">
              Built-in CTA generation, affiliate link management, and lead magnet creation.
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
            <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Track content performance, traffic sources, and engagement metrics over time.
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
            <h3 className="font-semibold mb-2">Research Tools</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered topic research, competitor analysis, and content gap identification.
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
            <h3 className="font-semibold mb-2">Content Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Plan, schedule, and manage your content pipeline with an organized calendar view.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-8 max-w-4xl mx-auto text-center"
        >
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600">SEO Optimization</Badge>
          <h3 className="text-xl font-bold mb-2">SEO Tools Built Into Every Workflow</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Real-time SEO scoring, keyword analysis, meta tag generation, readability checks, 
            and content structure recommendations—all automated and integrated into your writing process.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
