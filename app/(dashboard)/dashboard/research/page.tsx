'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function ResearchPage() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [outline, setOutline] = useState('')
  const [sources, setSources] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [loading, setLoading] = useState(false)

  const runResearch = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          sources: sources
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          competitorUrls: competitors
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })
      const data = await res.json()
      setResult(data.research ?? '')
      setOutline(data.outline ?? '')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Research Agent</h1>
        <p className="text-muted-foreground">Autonomous topic research, competitor angles, and outlines</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter topic to research..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runResearch()}
        />
        <Button onClick={runResearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Curated sources (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste 1 URL per line (blog posts, docs, reports)…"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Competitor URLs (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste competitor URLs (1 per line)…"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Research Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">{result}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Outline Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">{outline}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
