'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function LandingNav() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          BlogCraft AI
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#workflows" className="text-sm text-muted-foreground hover:text-foreground">
            Workflows
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/sign-in">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            © {new Date().getFullYear()} BlogCraft AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingFAQ() {
  const faqs = [
    {
      q: 'How is BlogCraft different from Jasper or Copy.ai?',
      a: 'BlogCraft is a complete Revenue Engine, not just an AI writer. We predict viral potential (85%+ accuracy), auto-monetize content (90%+ CTR), track every rupee of revenue attribution, and publish to 8 platforms simultaneously. Jasper and Copy.ai just generate text.',
    },
    {
      q: 'What does "85% viral accuracy" actually mean?',
      a: 'Our Viral Prediction Engine analyzes 23 engagement factors and predicts whether your content will go viral before you publish. Historical accuracy is 85%+. You get a viral score (0-100) and optimization suggestions to maximize reach.',
    },
    {
      q: 'How does revenue attribution work?',
      a: 'Every article gets unique tracking codes for all CTAs, affiliate links, and funnels. We track clicks, conversions, and revenue back to the exact content piece, platform, and timestamp. You see ROI per article in real-time.',
    },
    {
      q: 'What is the Personal AI Brain?',
      a: 'Your AI Brain learns from every article you write, every engagement metric, and every conversion. It adapts to your brand voice, understands your audience, and continuously improves recommendations. It gets smarter with use.',
    },
    {
      q: 'Can I really publish to 8 platforms automatically?',
      a: 'Yes. WordPress, Medium, Ghost, LinkedIn, Twitter/X, Instagram, YouTube, and TikTok. One article → all platforms → full cross-platform analytics. Business and Enterprise plans included.',
    },
    {
      q: 'What happens if viral predictions are wrong?',
      a: 'Enterprise plans include SLA-backed guarantees: 3x traffic increase in 90 days or money back. If predictions consistently miss, we refund your subscription. We stand behind our technology.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes. The Starter plan is free forever (5 articles/month, basic features). Upgrade to Creator ($49/mo) or Business ($149/mo) for viral prediction, auto-monetization, and multi-platform publishing. No credit card required for Starter.',
    },
    {
      q: 'Do I need technical skills to use this?',
      a: 'No. The entire platform is no-code. Write in our editor, click "Predict & Optimize", review suggestions, and publish everywhere with one button. 95% automation, 5% human oversight.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-card/30 to-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4">Got Questions?</Badge>
          <h2 className="text-3xl font-bold">Revenue Engine FAQ</h2>
          <p className="text-muted-foreground mt-4">Everything you need to know about turning content into revenue</p>
        </div>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6 hover:border-primary/30 transition-all">
              <h3 className="font-semibold text-base">{faq.q}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 glass-card p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Schedule a demo with our team to see the Revenue Engine in action
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            Book a Demo Call
          </Button>
        </div>
      </div>
    </section>
  )
}
