'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type Comment = {
  id: string
  body: string
  created_at: string
}

export function CommentsPanel({ projectId }: { projectId: string | null }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')

  const load = async () => {
    if (!projectId) return
    const res = await fetch(`/api/projects/comments?projectId=${encodeURIComponent(projectId)}`)
    const data = await res.json()
    setComments(data.comments ?? [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [projectId])

  const add = async () => {
    if (!projectId || !text.trim()) return
    const res = await fetch('/api/projects/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, body: text }),
    })
    const data = await res.json()
    if (data.comment) {
      setText('')
      toast.success('Comment added')
      load().catch(() => {})
    } else {
      toast.error(data.error ?? 'Failed to add comment')
    }
  }

  if (!projectId) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input placeholder="Leave feedback…" value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={add} disabled={!text.trim()}>
            Add
          </Button>
        </div>
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet</p>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-border/50 p-3 text-sm">
                <p>{c.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

