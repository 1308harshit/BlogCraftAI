'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const signOut = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={signOut} disabled={loading}>
      {loading ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}

