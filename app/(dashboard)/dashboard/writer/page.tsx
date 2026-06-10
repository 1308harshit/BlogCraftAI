'use client'

import { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Download,
  Zap,
  TrendingUp,
  FileDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BlogEditor } from '@/components/editor/blog-editor'
import { CommentsPanel } from '@/components/collab/comments-panel'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

export default function WriterPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [pipelineLoading, setPipelineLoading] = useState(false)
  const [seoScore, setSeoScore] = useState<number | null>(null)
  const { brandMemory, addProject, updateProject, currentProjectId } = useWorkspaceStore()

  const brandContext = brandMemory
    ? `Niche: ${brandMemory.niche}. Style: ${brandMemory.writingStyle}. Audience: ${brandMemory.targetAudience}. Tone: ${brandMemory.brandTone}.`
    : ''

  const saveProject = (html: string, title: string) => {
    const id = currentProjectId ?? uuidv4()
    if (currentProjectId) {
      updateProject(id, { title, content: html })
    } else {
      addProject({ id, title, content: html, updatedAt: new Date().toISOString() })
    }
    fetch('/api/workspace/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentProjectId ? id : undefined, title, content: html }),
    }).catch(() => {})
  }

  const markdownToHtml = (md: string) =>
    md
      .split('\n')
      .map((line: string) => {
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
        if (line.trim()) return `<p>${line}</p>`
        return ''
      })
      .join('')

  const generate = async () => {
    if (!topic.trim()) {
      toast.error('Enter a topic')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          brandContext,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      if (data.content) {
        const html = markdownToHtml(data.content)
        setContent(html)
        saveProject(html, topic)
        toast.success('Article generated!')
      }
    } catch {
      toast.error('Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const runPipeline = async () => {
    if (!topic.trim()) {
      toast.error('Enter a topic')
      return
    }
    setPipelineLoading(true)
    try {
      const res = await fetch('/api/blog/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          brandContext,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      const html = markdownToHtml(data.steps.article)
      setContent(html)
      setSeoScore(data.steps.seo?.score ?? null)
      saveProject(html, topic)
      toast.success('Full pipeline complete — research, outline, article, SEO!')
    } catch {
      toast.error('Pipeline failed')
    } finally {
      setPipelineLoading(false)
    }
  }

  const makeViral = async () => {
    if (!content) {
      toast.error('Generate content first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.replace(/<[^>]*>/g, ' '),
          task: 'expand',
          instruction: 'Rewrite as viral, hook-driven content with punchy headlines and scroll-stopping openers.',
        }),
      })
      const data = await res.json()
      if (data.content) {
        setContent(markdownToHtml(data.content))
        toast.success('Viral version ready!')
      }
    } finally {
      setLoading(false)
    }
  }

  const exportContent = async (format: 'markdown' | 'html' | 'text') => {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title: topic || 'Blog Post', format }),
    })
    const data = await res.json()
    if (data.data) {
      const blob = new Blob([data.data], { type: data.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${topic || 'post'}.${format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'txt'}`
      a.click()
      toast.success(`Exported as ${format}`)
    }
  }

  const publishWordpress = async () => {
    if (!content || !topic.trim()) {
      toast.error('Add a title and content first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/integrations/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic, html: content, status: 'draft' }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Published to WordPress (draft)')
        if (data.link) window.open(data.link, '_blank', 'noopener,noreferrer')
      } else {
        toast.error(data.error ?? 'Publish failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI Writer</h1>
          <p className="text-muted-foreground">TipTap editor · full pipeline · export · viral mode</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => exportContent('markdown')} disabled={!content}>
            <FileDown className="mr-1 h-3 w-3" /> MD
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportContent('html')} disabled={!content}>
            <Download className="mr-1 h-3 w-3" /> HTML
          </Button>
          <Button variant="outline" size="sm" onClick={publishWordpress} disabled={!content || loading}>
            <Download className="mr-1 h-3 w-3" /> WordPress
          </Button>
          <Button variant="outline" size="sm" onClick={makeViral} disabled={!content || loading}>
            <TrendingUp className="mr-1 h-3 w-3" /> Viral
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Topic (e.g. AI content automation for startups)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Textarea
            placeholder="Keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={loading || pipelineLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Quick generate
            </Button>
            <Button variant="secondary" onClick={runPipeline} disabled={loading || pipelineLoading}>
              {pipelineLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Full pipeline
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Full pipeline: research → outline → article → SEO → social snippets
          </p>
        </CardContent>
      </Card>

      {seoScore != null && (
        <div className="flex items-center gap-4">
          <Badge variant="success">SEO {seoScore}/100</Badge>
          <Progress value={seoScore} className="max-w-xs flex-1" />
        </div>
      )}

      <BlogEditor content={content} onChange={setContent} onSEOUpdate={setSeoScore} />

      <CommentsPanel projectId={currentProjectId} />
    </div>
  )
}
