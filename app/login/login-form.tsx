'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { envPublic } from '@/lib/env'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        return
      }

      const profileRes = await fetch('/api/workspace/brand-memory')
      if (profileRes.ok) {
        const profile = await profileRes.json()
        router.push(profile.onboardingCompleted ? next : '/onboarding')
      } else {
        router.push(next)
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const authCallbackUrl =
    envPublic.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    (typeof window !== 'undefined' ? window.location.origin : '')
  const emailRedirectTo = `${authCallbackUrl}/auth/callback`

  const oauth = async (provider: 'google' | 'github') => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: emailRedirectTo },
      })
      if (error) toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh-gradient p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log in to your BlogCraft AI workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              void signIn()
            }}
          >
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading || !email || !password}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => oauth('google')} disabled={loading}>
              Google
            </Button>
            <Button variant="outline" onClick={() => oauth('github')} disabled={loading}>
              GitHub
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            New here?{' '}
            <Link className="text-primary hover:underline" href="/signup">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
