'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
  { id: 'writer', label: 'Open AI Writer', href: '/dashboard/writer', shortcut: 'W' },
  { id: 'research', label: 'Run Research Agent', href: '/dashboard/research', shortcut: 'R' },
  { id: 'seo', label: 'Open SEO Engine', href: '/dashboard/seo', shortcut: 'S' },
  { id: 'templates', label: 'Browse Templates', href: '/dashboard/templates' },
  { id: 'automations', label: 'View Automations', href: '/dashboard/automations' },
  { id: 'billing', label: 'Manage Billing', href: '/dashboard/billing' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <Search className="h-4 w-4" />
        <span>Search commands...</span>
        <kbd className="ml-auto hidden rounded bg-muted px-1.5 text-xs sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <Command
            className={cn(
              'relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl'
            )}
          >
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input
                placeholder="Type a command..."
                className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              <Command.Group heading="Actions">
                {actions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.label}
                    onSelect={() => {
                      router.push(action.href)
                      setOpen(false)
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm aria-selected:bg-accent"
                  >
                    {action.label}
                    {action.shortcut && (
                      <kbd className="text-xs text-muted-foreground">{action.shortcut}</kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  )
}
