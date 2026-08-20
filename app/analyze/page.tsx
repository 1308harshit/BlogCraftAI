'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp,
  FileText,
  Eye,
  Layout,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ContentAnalysis } from '@/lib/content-analyzer'

export default function AnalyzePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please enter both title and content')
      return
    }

    setAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, keyword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              BlogCraft AI
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-card/30 to-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-cyan-600">
            Free Content Analyzer
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Analyze Your Content Performance
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get honest, actionable insights on SEO, readability, engagement, and structure.
            No signup required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Content</CardTitle>
                <CardDescription>
                  We'll analyze your content and provide specific recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="10 Proven Strategies to Boost Your Content Marketing"
                    maxLength={200}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {title.length}/200 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="keyword">Target Keyword (optional)</Label>
                  <Input
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="content marketing"
                    maxLength={100}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your article content here (Markdown or plain text)..."
                    rows={12}
                    maxLength={50000}
                    className="mt-1.5 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.length.toLocaleString()}/50,000 characters
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !title.trim() || !content.trim()}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Content
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free analysis • No signup required • No credit card
                </p>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    1
                  </div>
                  <div>
                    <strong className="text-foreground">Paste your content</strong> - Add your title and article content
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    2
                  </div>
                  <div>
                    <strong className="text-foreground">Get transparent analysis</strong> - See your score breakdown and specific factors
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    3
                  </div>
                  <div>
                    <strong className="text-foreground">Act on recommendations</strong> - Get prioritized, actionable improvements
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {!analysis && !analyzing && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Your content analysis will appear here
                  </p>
                </CardContent>
              </Card>
            )}

            {analyzing && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Analyzing your content...</p>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Score */}
                <Card className={getScoreBgColor(analysis.overallScore)}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">Overall Score</div>
                      <p className="text-sm mt-4">{analysis.summary}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScoreItem
                      icon={TrendingUp}
                      label="SEO"
                      score={analysis.breakdown.seo.score}
                      maxScore={analysis.breakdown.seo.maxScore}
                    />
                    <ScoreItem
                      icon={Eye}
                      label="Readability"
                      score={analysis.breakdown.readability.score}
                      maxScore={analysis.breakdown.readability.maxScore}
                    />
                    <ScoreItem
                      icon={Sparkles}
                      label="Engagement"
                      score={analysis.breakdown.engagement.score}
                      maxScore={analysis.breakdown.engagement.maxScore}
                    />
                    <ScoreItem
                      icon={Layout}
                      label="Structure"
                      score={analysis.breakdown.structure.score}
                      maxScore={analysis.breakdown.structure.maxScore}
                    />
                  </CardContent>
                </Card>

                {/* Top Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top Recommendations</CardTitle>
                      <CardDescription>
                        Prioritized improvements to boost your content score
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.recommendations.slice(0, 5).map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 p-3 rounded-lg border border-border bg-card/50"
                        >
                          <div className="flex-shrink-0">
                            {rec.priority === 'high' && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            {rec.priority === 'medium' && (
                              <Info className="h-5 w-5 text-yellow-500" />
                            )}
                            {rec.priority === 'low' && (
                              <CheckCircle2 className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{rec.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {rec.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rec.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {rec.impact}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-xl font-bold mb-2">
                      Want to Optimize This Content Automatically?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      BlogCraft AI can help you create, optimize, and publish high-performing content with built-in SEO tools, AI writing assistance, and multi-platform publishing.
                    </p>
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/sign-up">
                        Start Free <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Free plan available • No credit card required
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Transparent Methodology</Badge>
            <h2 className="text-3xl font-bold">How We Score Your Content</h2>
            <p className="text-muted-foreground mt-4">
              Our scoring system analyzes multiple factors with clear, weighted criteria
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  SEO (35% weight)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Word count (optimal: 800-2500 words)</div>
                <div>• Keyword optimization & density</div>
                <div>• Heading structure (H1, H2, H3)</div>
                <div>• Title length (30-60 characters)</div>
                <div>• External links presence</div>
                <div>• Visual content inclusion</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Readability (25% weight)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Overall readability score</div>
                <div>• Sentence length (10-20 words)</div>
                <div>• Paragraph structure & length</div>
                <div>• Text complexity analysis</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Engagement (25% weight)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Title engagement (numbers, questions)</div>
                <div>• Power words usage</div>
                <div>• Introduction hook strength</div>
                <div>• Content formatting variety</div>
                <div>• Bullets, lists, emphasis</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Structure (15% weight)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Clear content sections (3+ H2s)</div>
                <div>• Introduction & conclusion</div>
                <div>• Section depth & balance</div>
                <div>• Logical flow</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is an automated analysis tool that provides guidance based on content best practices. 
              Scores are estimates and should be combined with your own judgment and audience knowledge.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ScoreItem({
  icon: Icon,
  label,
  score,
  maxScore,
}: {
  icon: any
  label: string
  score: number
  maxScore: number
}) {
  const percentage = (score / maxScore) * 100
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
