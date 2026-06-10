'use client'

import { useEffect, useState } from 'react'
import { Workflow, Clock, Zap, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Automation {
  id: string
  name: string
  trigger_type: string
  enabled: boolean
}

interface Run {
  id: string
  automation_id: string
  status: string
  message: string | null
  created_at: string
}

const presets = [
  { name: 'Daily blog generator', trigger_type: 'schedule:09:00' },
  { name: 'WordPress auto-publish', trigger_type: 'on:content_ready' },
  { name: 'Twitter thread from blog', trigger_type: 'on:publish' },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')

  const load = () => {
    fetch('/api/automations')
      .then((r) => r.json())
      .then((d) => setAutomations(d.automations ?? []))
      .finally(() => setLoading(false))

    fetch('/api/automations/runs')
      .then((r) => r.json())
      .then((d) => setRuns(d.runs ?? []))
      .catch(() => {})
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (name: string, trigger_type: string) => {
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, trigger_type }),
    })
    if (res.ok) {
      toast.success('Workflow created')
      load()
    } else {
      toast.error('Connect Supabase to save workflows')
    }
  }

  const toggle = async (id: string, enabled: boolean) => {
    await fetch('/api/automations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, enabled: !enabled }),
    })
    load()
  }

  const runNow = async (automationId: string) => {
    const res = await fetch('/api/automations/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ automationId }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Run recorded')
      load()
    } else {
      toast.error(data.error ?? 'Run failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-muted-foreground">No-code workflows for content at scale</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          <Input
            placeholder="Custom workflow name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="max-w-xs"
          />
          <Button
            onClick={() => {
              if (newName.trim()) create(newName, 'manual')
              setNewName('')
            }}
          >
            <Workflow className="mr-2 h-4 w-4" /> Create
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <Button key={p.name} variant="outline" size="sm" onClick={() => create(p.name, p.trigger_type)}>
            + {p.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <div className="space-y-6">
          {automations.length === 0 ? (
            <p className="text-center text-muted-foreground">No workflows yet — add a preset above</p>
          ) : (
            automations.map((w) => (
              <Card key={w.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-primary/15 p-3">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{w.name}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" /> {w.trigger_type}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggle(w.id, w.enabled)}>
                    {w.enabled ? 'Pause' : 'Enable'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => runNow(w.id)}>
                    Run now
                  </Button>
                  <Badge variant={w.enabled ? 'success' : 'secondary'}>
                    {w.enabled ? 'active' : 'paused'}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Run history</p>
            <Button variant="outline" size="sm" onClick={load}>
              Refresh
            </Button>
          </div>
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs yet</p>
          ) : (
            <div className="space-y-2">
              {runs.slice(0, 10).map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{r.status}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                    {r.message && <p className="text-xs text-muted-foreground">{r.message}</p>}
                  </div>
                  <Badge variant={r.status === 'success' ? 'success' : 'secondary'}>{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
