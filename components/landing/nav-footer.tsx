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
          <a href="/analyze" className="text-sm text-muted-foreground hover:text-foreground">
            Free Analyzer
          </a>
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
      q: 'What makes BlogCraft AI different from other AI writing tools?',
      a: 'BlogCraft is a complete content platform, not just an AI writer. We combine research tools, multiple AI models, SEO optimization, content scoring, multi-platform publishing, and analytics in one unified dashboard.',
    },
    {
      q: 'What AI models does BlogCraft use?',
      a: 'We integrate multiple AI models including OpenAI (GPT-4), Google Gemini, and others. The system automatically routes requests to the best available model for your task, with fallback options for reliability.',
    },
    {
      q: 'How does content scoring work?',
      a: 'Our content analysis examines multiple factors including SEO optimization, readability, structure, keyword usage, and search intent alignment. You get a comprehensive score with specific recommendations to improve your content.',
    },
    {
      q: 'Can I publish to multiple platforms?',
      a: 'Yes. We currently support WordPress, Medium, Ghost, and are expanding to more platforms including LinkedIn and Twitter/X. Manage all your content and publishing from one dashboard.',
    },
    {
      q: 'What is included in the free plan?',
      a: 'The free plan includes 10 AI generations per month, basic AI writing tools, SEO scoring, content analysis, markdown export, and email support. Perfect for trying out the platform.',
    },
    {
      q: 'Can I upgrade or downgrade my plan anytime?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the start of your next billing cycle. No long-term contracts required.',
    },
    {
      q: 'Is there a team collaboration feature?',
      a: 'Yes. The Business plan includes team collaboration features with support for up to 5 team members, shared workspaces, and collaborative editing.',
    },
    {
      q: 'What kind of support do you offer?',
      a: 'All plans include email support. Pro plans get priority support with faster response times. Business plans include dedicated support and onboarding assistance.',
    },
    {
      q: 'Do I need technical skills to use BlogCraft?',
      a: 'No technical skills required. The platform is designed to be intuitive and user-friendly. If you can use a word processor, you can use BlogCraft AI.',
    },
    {
      q: 'Can I export my content?',
      a: 'Yes. You can export your content in multiple formats including Markdown, HTML, and plain text. Your content is always yours to keep.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-card/30 to-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4">Got Questions?</Badge>
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4">Everything you need to know about BlogCraft AI</p>
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
            Contact our team to learn more about how BlogCraft AI can help your content business
          </p>
          <Button size="lg" asChild>
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
