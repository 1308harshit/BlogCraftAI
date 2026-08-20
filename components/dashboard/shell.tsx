'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  PenLine,
  Search,
  Gauge,
  LayoutTemplate,
  Image,
  Workflow,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Moon,
  Sun,
  Sparkles,
  Menu,
  X,
  Shield,
  Brain,
  Share2,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CommandPalette } from '@/components/dashboard/command-palette'
import { useState, useEffect } from 'react'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { WorkspaceHydrator } from '@/components/dashboard/workspace-hydrator'

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/god-mode', label: 'God Mode', icon: Brain },
  { href: '/dashboard/writer', label: 'AI Writer', icon: PenLine },
  { href: '/dashboard/content-intelligence', label: 'Content Intelligence', icon: Sparkles },
  { href: '/dashboard/research', label: 'Research Agent', icon: Search },
  { href: '/dashboard/seo', label: 'SEO Engine', icon: Gauge },
  { href: '/dashboard/distribution', label: 'Distribution', icon: Share2 },
  { href: '/dashboard/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/dashboard/images', label: 'AI Images', icon: Image },
  { href: '/dashboard/automations', label: 'Automations', icon: Workflow },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const mobileNavItems = baseNavItems.slice(0, 5)

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [navItems, setNavItems] = useState(baseNavItems)

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const res = await fetch('/api/admin/check-access')
        if (res.ok) {
          setIsAdmin(true)
          setNavItems([...baseNavItems, { href: '/dashboard/admin', label: 'Admin', icon: Shield }])
        }
      } catch (error) {
        // Not an admin, keep base nav items
      }
    }
    checkAdminAccess()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceHydrator />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold">BlogCraft AI</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
          </div>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <CommandPalette />
        </header>
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
        {mobileNavItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate px-1">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
