'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Check your email to confirm your account.')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const oauth = async (provider: 'google' | 'github') => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start building your AI blogging system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => e.key === 'Enter' && signUp()}
            />
          </div>

          <Button className="w-full" onClick={signUp} disabled={loading || !email || password.length < 6}>
            {loading ? 'Creating…' : 'Sign up'}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => oauth('google')} disabled={loading}>
              Google
            </Button>
            <Button variant="outline" onClick={() => oauth('github')} disabled={loading}>
              GitHub
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link className="text-primary hover:underline" href="/login">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

