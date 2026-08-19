'use client'

import Link from 'next/link'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function LandingNav() {
  const { theme, setTheme } = useTheme()
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold"><Sparkles className="h-5 w-5 text-primary" />BlogCraft AI</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Beta</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            <Sun className="h-4 w-4 dark:hidden" /><Moon className="hidden h-4 w-4 dark:block" />
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link href="/login">Log in</Link></Button>
          <Button asChild><Link href="/signup">Get started</Link></Button>
        </div>
      </div>
    </header>
  )
}

export function LandingFooter() {
  return <footer className="border-t border-border py-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row"><p>© {new Date().getFullYear()} BlogCraft AI</p><div className="flex gap-6"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>
}

export function LandingFAQ() {
  const faqs = [
    ['What is available today?', 'The beta includes AI-assisted writing, project saving, research from public URLs, and SEO tools.'],
    ['Is billing live?', 'No. The beta is free and paid plans will only appear after payment processing is fully enabled.'],
    ['Do automations run automatically?', 'Not yet. Workflow execution is disabled until it can run reliably and transparently.'],
    ['Can I publish to WordPress?', 'Yes, after a WordPress connection is configured for your account.'],
  ]
  return <section id="faq" className="bg-card/30 py-20"><div className="mx-auto max-w-3xl px-4"><div className="text-center"><Badge>Beta FAQ</Badge><h2 className="mt-4 text-3xl font-bold">Clear about what&apos;s live</h2></div><div className="mt-10 space-y-4">{faqs.map(([question, answer]) => <div key={question} className="glass-card p-5"><h3 className="font-semibold">{question}</h3><p className="mt-2 text-sm text-muted-foreground">{answer}</p></div>)}</div></div></section>
}
