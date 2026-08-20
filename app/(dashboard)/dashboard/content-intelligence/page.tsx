'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Dna,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Zap,
  FileText,
  Eye,
  ThumbsUp,
  Share2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function ContentIntelligencePage() {
  const [content, setContent] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!content.trim()) return

    setAnalyzing(true)

    // Simulate analysis (would integrate with backend APIs)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setResults({
      viral: {
        score: 78,
        probability: 'High',
        factors: [
          { name: 'Emotional resonance', score: 85, status: 'excellent' },
          { name: 'Practical value', score: 80, status: 'excellent' },
          { name: 'Surprise factor', score: 72, status: 'good' },
          { name: 'Social currency', score: 65, status: 'good' },
          { name: 'Storytelling', score: 70, status: 'good' },
        ],
        recommendations: [
          'Add a surprising statistic in the intro',
          'Include social sharing prompts',
          'Strengthen emotional hooks',
        ],
      },
      dna: {
        pattern: 'List-based how-to',
        voice: 'Professional yet approachable',
        structure: 'Problem → Solution → Action',
        characteristics: [
          { trait: 'Actionable steps', presence: 'strong' },
          { trait: 'Examples/proof', presence: 'moderate' },
          { trait: 'Data/research', presence: 'weak' },
          { trait: 'Visual elements', presence: 'weak' },
        ],
        consistency: 85,
      },
      seo: {
        score: 82,
        readability: 68,
        keyword: {
          density: 'optimal',
          placement: 'good',
          variations: 'excellent',
        },
        technical: [
          { check: 'Title optimization', status: 'pass' },
          { check: 'Meta description', status: 'pass' },
          { check: 'Header hierarchy', status: 'pass' },
          { check: 'Internal links', status: 'warning' },
          { check: 'Alt text', status: 'fail' },
        ],
      },
      engagement: {
        predictedMetrics: {
          avgTimeOnPage: '4:32',
          bounceRate: '42%',
          shareRate: '3.2%',
          conversionRate: '2.8%',
        },
        hooks: [
          { type: 'Opening hook', strength: 'strong', text: 'First 50 chars...' },
          { type: 'Mid-point hook', strength: 'moderate', text: 'Transition point...' },
          { type: 'CTA', strength: 'strong', text: 'Call to action...' },
        ],
      },
    })

    setAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'pass' || status === 'excellent') return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (status === 'warning' || status === 'good') return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <AlertTriangle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold sm:text-3xl flex items-center gap-2"
        >
          <Sparkles className="h-8 w-8 text-primary" />
          Content Intelligence
        </motion.h1>
        <p className="mt-1 text-muted-foreground">
          AI-powered viral prediction, content DNA analysis, and SEO intelligence
        </p>
      </div>

      {/* Analysis Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Viral Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results ? results.viral.score : '--'}</div>
            <p className="text-xs text-muted-foreground">Viral potential rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Dna className="h-4 w-4 text-purple-500" />
              Content DNA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results ? `${results.dna.consistency}%` : '--'}</div>
            <p className="text-xs text-muted-foreground">Brand consistency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results ? results.seo.score : '--'}</div>
            <p className="text-xs text-muted-foreground">Search optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              Readability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results ? results.seo.readability : '--'}</div>
            <p className="text-xs text-muted-foreground">Reading ease score</p>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Content</CardTitle>
          <CardDescription>
            Paste your content to get viral predictions, DNA analysis, and SEO insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your blog post, article, or social media content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {content.split(/\s+/).filter(Boolean).length} words
            </span>
            <Button onClick={handleAnalyze} disabled={analyzing || !content.trim()}>
              {analyzing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Tabs defaultValue="viral" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="viral">
                <TrendingUp className="mr-2 h-4 w-4" />
                Viral Prediction
              </TabsTrigger>
              <TabsTrigger value="dna">
                <Dna className="mr-2 h-4 w-4" />
                Content DNA
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Target className="mr-2 h-4 w-4" />
                SEO Intelligence
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <BarChart3 className="mr-2 h-4 w-4" />
                Engagement
              </TabsTrigger>
            </TabsList>

            {/* Viral Prediction Tab */}
            <TabsContent value="viral" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Viral Potential Score</span>
                    <Badge variant={results.viral.score >= 70 ? 'default' : 'secondary'} className="text-lg">
                      {results.viral.score}/100
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Probability: <span className="font-medium">{results.viral.probability}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm font-medium mb-3">Viral Factors</div>
                    <div className="space-y-3">
                      {results.viral.factors.map((factor: any, i: number) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{factor.name}</span>
                            <span className={`text-sm font-medium ${getScoreColor(factor.score)}`}>
                              {factor.score}
                            </span>
                          </div>
                          <Progress value={factor.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-3">Recommendations</div>
                    <div className="space-y-2">
                      {results.viral.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-card/50">
                          <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content DNA Tab */}
            <TabsContent value="dna" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content DNA Analysis</CardTitle>
                  <CardDescription>Understanding your unique content signature</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="text-sm text-muted-foreground mb-1">Pattern</div>
                      <div className="font-medium">{results.dna.pattern}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="text-sm text-muted-foreground mb-1">Voice</div>
                      <div className="font-medium">{results.dna.voice}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/50 sm:col-span-2">
                      <div className="text-sm text-muted-foreground mb-1">Structure</div>
                      <div className="font-medium">{results.dna.structure}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-3">Content Characteristics</div>
                    <div className="space-y-3">
                      {results.dna.characteristics.map((char: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <span className="text-sm">{char.trait}</span>
                          <Badge variant={char.presence === 'strong' ? 'default' : 'secondary'}>
                            {char.presence}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Brand Consistency</span>
                    </div>
                    <Progress value={results.dna.consistency} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      This content matches your brand DNA at {results.dna.consistency}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Intelligence Tab */}
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>SEO Intelligence</span>
                    <Badge variant={results.seo.score >= 80 ? 'default' : 'secondary'} className="text-lg">
                      {results.seo.score}/100
                    </Badge>
                  </CardTitle>
                  <CardDescription>Technical SEO and optimization analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm font-medium mb-3">Keyword Optimization</div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="p-3 rounded-lg border bg-card/50">
                        <div className="text-xs text-muted-foreground mb-1">Density</div>
                        <div className="font-medium capitalize">{results.seo.keyword.density}</div>
                      </div>
                      <div className="p-3 rounded-lg border bg-card/50">
                        <div className="text-xs text-muted-foreground mb-1">Placement</div>
                        <div className="font-medium capitalize">{results.seo.keyword.placement}</div>
                      </div>
                      <div className="p-3 rounded-lg border bg-card/50">
                        <div className="text-xs text-muted-foreground mb-1">Variations</div>
                        <div className="font-medium capitalize">{results.seo.keyword.variations}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-3">Technical Checks</div>
                    <div className="space-y-2">
                      {results.seo.technical.map((check: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check.status)}
                            <span className="text-sm">{check.check}</span>
                          </div>
                          <Badge variant={check.status === 'pass' ? 'default' : 'secondary'}>
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-blue-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Readability Score</span>
                    </div>
                    <Progress value={results.seo.readability} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {results.seo.readability >= 60 ? 'Easy to read for most audiences' : 'Consider simplifying language'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Predicted Engagement Metrics</CardTitle>
                  <CardDescription>AI-powered performance predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Avg. Time on Page</span>
                      </div>
                      <div className="text-2xl font-bold">{results.engagement.predictedMetrics.avgTimeOnPage}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Bounce Rate</span>
                      </div>
                      <div className="text-2xl font-bold">{results.engagement.predictedMetrics.bounceRate}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Share2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Share Rate</span>
                      </div>
                      <div className="text-2xl font-bold">{results.engagement.predictedMetrics.shareRate}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2 mb-1">
                        <ThumbsUp className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      </div>
                      <div className="text-2xl font-bold">{results.engagement.predictedMetrics.conversionRate}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-3">Content Hooks</div>
                    <div className="space-y-3">
                      {results.engagement.hooks.map((hook: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg border bg-card/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{hook.type}</span>
                            <Badge variant={hook.strength === 'strong' ? 'default' : 'secondary'}>
                              {hook.strength}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground italic">"{hook.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* No Results State */}
      {!results && !analyzing && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Sparkles className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Content Intelligence</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get viral predictions, DNA analysis, SEO intelligence, and engagement forecasts for your content
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Viral Scoring</Badge>
              <Badge variant="secondary">Content DNA</Badge>
              <Badge variant="secondary">SEO Analysis</Badge>
              <Badge variant="secondary">Engagement Prediction</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
