'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import type { ContentAnalysis } from '@/lib/content-analyzer'

const scoreLabels = [
  ['SEO', 'seo'], ['Readability', 'readability'], ['Engagement', 'engagement'], ['Structure', 'structure'],
] as const

export default function AnalyzePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setAnalysis(null)
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, keyword }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to analyze the content.')
      setAnalysis(data as ContentAnalysis)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to analyze the content.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Link className="flex items-center gap-2 font-semibold" href="/"><Sparkles className="h-5 w-5 text-primary" />BlogCraft AI</Link><Button variant="ghost" asChild><Link href="/login">Log in</Link></Button></div></header>
      <section className="border-b border-border bg-card/30 py-14 text-center"><Badge>Free tool</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight">Content analyzer</h1><p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Get transparent, rule-based feedback on SEO, readability, engagement, and structure. No account required.</p></section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 sm:px-6">
        <Card><CardHeader><CardTitle>Paste a draft</CardTitle><CardDescription>Your text is analyzed only to create this response. Scores are guidance, not a promise of rankings or traffic.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={onSubmit}>
          <div><label className="text-sm font-medium" htmlFor="title">Article title</label><Input className="mt-1" id="title" maxLength={120} onChange={(event) => setTitle(event.target.value)} required value={title} /></div>
          <div><label className="text-sm font-medium" htmlFor="keyword">Target phrase <span className="text-muted-foreground">(optional)</span></label><Input className="mt-1" id="keyword" maxLength={80} onChange={(event) => setKeyword(event.target.value)} value={keyword} /></div>
          <div><label className="text-sm font-medium" htmlFor="content">Article content</label><Textarea className="mt-1 min-h-72" id="content" maxLength={20_000} minLength={50} onChange={(event) => setContent(event.target.value)} required value={content} /><p className="mt-1 text-xs text-muted-foreground">{content.length.toLocaleString()}/20,000 characters</p></div>
          {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
          <Button className="w-full" disabled={isLoading} size="lg" type="submit">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing</> : <>Analyze draft <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
        </form></CardContent></Card>
        <section aria-live="polite">{analysis ? <Results analysis={analysis} /> : <Card className="border-dashed"><CardContent className="py-24 text-center text-muted-foreground">Your feedback will appear here after you analyze a draft.</CardContent></Card>}</section>
      </div>
    </main>
  )
}

function Results({ analysis }: { analysis: ContentAnalysis }) {
  return <div className="space-y-5"><Card><CardHeader><CardDescription>Overall heuristic score</CardDescription><CardTitle className="text-5xl text-primary">{analysis.overallScore}<span className="text-lg text-muted-foreground">/100</span></CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{analysis.summary}</p></CardContent></Card><Card><CardHeader><CardTitle>Breakdown</CardTitle></CardHeader><CardContent className="space-y-5">{scoreLabels.map(([label, key]) => { const item = analysis.breakdown[key]; const value = Math.round((item.score / item.maxScore) * 100); return <div key={key}><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span>{item.score}/{item.maxScore}</span></div><Progress value={value} /></div> })}</CardContent></Card>{analysis.recommendations.length > 0 && <Card><CardHeader><CardTitle>Recommended next steps</CardTitle></CardHeader><CardContent className="space-y-3">{analysis.recommendations.map((item) => <div className="rounded-lg border border-border p-3" key={`${item.category}-${item.title}`}><div className="flex items-center justify-between gap-2"><p className="font-medium">{item.title}</p><Badge variant="secondary">{item.priority}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div>)}</CardContent></Card>}</div>
}
