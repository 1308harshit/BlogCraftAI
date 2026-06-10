'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      q: 'Is BlogCraft just another AI writer?',
      a: 'No. BlogCraft is a full blogging OS — research, writing, SEO, automations, publishing, and analytics in one premium workspace.',
    },
    {
      q: 'Which AI models do you use?',
      a: 'Multi-model routing with OpenAI primary and Gemini fallback, optimized per task.',
    },
    {
      q: 'Can I publish directly to WordPress?',
      a: 'Yes. Business plans include WordPress, Medium, Ghost, and more integrations.',
    },
  ]

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold">FAQ</h2>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
