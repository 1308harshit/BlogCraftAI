'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PenLine,
  Search,
  Gauge,
  TrendingUp,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWorkspaceStore } from '@/stores/workspace-store'

const quickActions = [
  { label: 'New blog post', href: '/dashboard/writer', icon: PenLine },
  { label: 'Research topic', href: '/dashboard/research', icon: Search },
  { label: 'SEO audit', href: '/dashboard/seo', icon: Gauge },
  { label: 'Make viral', href: '/dashboard/writer?viral=1', icon: TrendingUp },
]

const trendingKeywords = ['AI automation', 'content SEO 2026', 'affiliate blogging', 'SaaS marketing']

export default function DashboardPage() {
  const { projects, brandMemory } = useWorkspaceStore()

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
        <p className="mt-1 text-muted-foreground">Your AI blogging command center</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="group cursor-pointer transition-all hover:border-primary/40">
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
                    {p.seoScore != null && <Badge variant="success">SEO {p.seoScore}</Badge>}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-gradient">87</span>
                <Badge>+12 this week</Badge>
              </div>
              <Progress value={87} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trending keywords</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {trendingKeywords.map((kw) => (
                <Badge key={kw} variant="secondary">
                  {kw}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
