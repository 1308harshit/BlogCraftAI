'use client'

import { Suspense, useEffect, useState } from 'react'
import { Users, UserPlus, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

type Member = { user_id: string; role: string }

function TeamPageContent() {
  const searchParams = useSearchParams()
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState('')
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/workspace/members')
    const data = await res.json()
    setMembers(data.members ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const token = searchParams.get('invite')
    if (!token) return
    fetch('/api/workspace/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          toast.success('Invite accepted')
          load()
        }
      })
      .catch(() => {})
  }, [searchParams])

  const invite = async () => {
    const res = await fetch('/api/workspace/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (data.inviteUrl) {
      setInviteUrl(data.inviteUrl)
      toast.success('Invite link created')
    } else {
      toast.error(data.error ?? 'Invite failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Workspace</h1>
          <p className="text-muted-foreground">Collaborate with shared brand kits and approvals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Invite member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              className="max-w-sm"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={invite} disabled={!email.trim()}>
              Create invite link
            </Button>
          </div>
          {inviteUrl && (
            <div className="flex items-center gap-2 rounded-lg border border-border/50 p-3 text-sm">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{inviteUrl}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl).catch(() => {})
                  toast.success('Copied')
                }}
              >
                Copy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Team members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <p className="font-medium">{m.user_id.slice(0, 8)}…</p>
                <p className="text-sm text-muted-foreground">Member</p>
              </div>
              <Badge>{m.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading team…</div>}>
      <TeamPageContent />
    </Suspense>
  )
}
