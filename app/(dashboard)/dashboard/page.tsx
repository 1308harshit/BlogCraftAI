'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  PenLine,
  Search,
  Gauge,
  TrendingUp,
  FileText,
  ArrowRight,
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWorkspaceStore } from '@/stores/workspace-store'
import type { GrowthScore } from '@/lib/growth-score'

const quickActions = [
  { label: 'New blog post', href: '/dashboard/writer', icon: PenLine },
  { label: 'Research topic', href: '/dashboard/research', icon: Search },
  { label: 'SEO audit', href: '/dashboard/seo', icon: Gauge },
  { label: 'View analytics', href: '/dashboard/analytics', icon: TrendingUp },
]

export default function DashboardPage() {
  const { projects, brandMemory } = useWorkspaceStore()
  const [growthScore, setGrowthScore] = useState<(GrowthScore & { isDemo?: boolean }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGrowthScore() {
      try {
        const response = await fetch('/api/growth-score')
        if (response.ok) {
          const data = await response.json()
          setGrowthScore(data)
        }
      } catch (error) {
        console.error('Failed to fetch growth score:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGrowthScore()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-green-500/5'
    if (score >= 60) return 'from-yellow-500/20 to-yellow-500/5'
    if (score >= 40) return 'from-orange-500/20 to-orange-500/5'
    return 'from-red-500/20 to-red-500/5'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getTrendLabel = (trend: string) => {
    if (trend === 'improving') return 'Improving'
    if (trend === 'declining') return 'Declining'
    return 'Stable'
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold sm:text-3xl"
        >
          Welcome back{brandMemory?.niche ? `, ${brandMemory.niche} creator` : ''}
        </motion.h1>
        <p className="mt-1 text-muted-foreground">Your content growth command center</p>
      </div>

      {/* Growth Score Card */}
      {!loading && growthScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border-2 bg-gradient-to-br ${getScoreBg(growthScore.overall)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Your Growth Score</CardTitle>
                  <CardDescription>Overall content performance and opportunities</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(growthScore.trend)}
                  <span className="text-sm font-medium">{getTrendLabel(growthScore.trend)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-6 mb-6">
                <div>
                  <div className={`text-6xl font-bold ${getScoreColor(growthScore.overall)}`}>
                    {growthScore.overall}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
                <div className="flex-1 space-y-3 pb-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Content</span>
                      <span className="text-sm">{growthScore.categories.content.score}/100</span>
                    </div>
                    <Progress value={growthScore.categories.content.score} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">SEO</span>
                      <span className="text-sm">{growthScore.categories.seo.score}/100</span>
                    </div>
                    <Progress value={growthScore.categories.seo.score} className="h-2" />
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-4">{growthScore.summary}</p>
              
              {growthScore.isDemo && (
                <Badge variant="secondary" className="text-xs">
                  Demo score - Create content to see your real growth metrics
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-lg bg-primary/15 p-2">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent projects</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No projects yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/writer">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create your first post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    href="/dashboard/writer"
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(p.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {p.seoScore != null && (
                      <Badge variant={p.seoScore >= 80 ? 'default' : 'secondary'}>
                        SEO {p.seoScore}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <div className="space-y-6">
          {!loading && growthScore && growthScore.opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Top Opportunities
                </CardTitle>
                <CardDescription>Actions to boost your growth score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {growthScore.opportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {opp.priority === 'high' && (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      {opp.priority === 'medium' && (
                        <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      )}
                      {opp.priority === 'low' && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{opp.title}</div>
                        <p className="text-xs text-muted-foreground mt-1">{opp.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {opp.estimatedImpact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
