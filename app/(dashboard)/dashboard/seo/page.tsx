'use client'

import { useState } from 'react'
import { Gauge, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { SEOAnalysis } from '@/lib/seo/analyzer'

export default function SEOPage() {
  const [content, setContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      })
      setAnalysis(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SEO Engine</h1>
        <p className="text-muted-foreground">Real-time scoring, optimization checklist, and meta generation</p>
      </div>

      <Input
        placeholder="Target keywords (comma-separated)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <Textarea
        placeholder="Paste your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />
      <Button onClick={analyze} disabled={loading || !content.trim()}>
        <Gauge className="mr-2 h-4 w-4" />
        Analyze SEO
      </Button>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>SEO Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-gradient">{analysis.score}</span>
                <span className="mb-2 text-muted-foreground">/100</span>
              </div>
              <Progress value={analysis.score} className="mt-4" />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Words</p>
                  <p className="font-semibold">{analysis.wordCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Readability</p>
                  <p className="font-semibold">{analysis.readability}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="text-blue-400">{analysis.metaTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-muted-foreground">{analysis.metaDescription}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Google Snippet Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-blue-400">{analysis.snippetPreview.title}</p>
              <p className="text-emerald-400">{analysis.snippetPreview.url}</p>
              <p className="text-muted-foreground">{analysis.snippetPreview.description}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Optimization Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.issues.map((issue) => (
                <div key={issue} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  {issue}
                </div>
              ))}
              {analysis.suggestions.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {s}
                </div>
              ))}
              {Object.entries(analysis.keywordDensity).map(([kw, density]) => (
                <Badge key={kw} variant="secondary">
                  {kw}: {density.toFixed(2)}%
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Schema Markup (Article)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-lg border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
                {analysis.schemaMarkup}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
