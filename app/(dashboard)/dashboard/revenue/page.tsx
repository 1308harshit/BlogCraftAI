'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Target,
  Users,
  MousePointer,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RevenuePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading revenue data
    setTimeout(() => {
      setData({
        overview: {
          totalRevenue: 24750,
          thisMonth: 8420,
          growthRate: 23.5,
          avgRevenuePerArticle: 185,
        },
        topPerformers: [
          {
            id: '1',
            title: 'Complete Guide to AI Content Marketing',
            revenue: 3240,
            conversions: 18,
            traffic: 12500,
            conversionRate: 1.44,
            status: 'growing',
          },
          {
            id: '2',
            title: '10 SEO Strategies That Actually Work in 2024',
            revenue: 2880,
            conversions: 16,
            traffic: 9800,
            conversionRate: 1.63,
            status: 'stable',
          },
          {
            id: '3',
            title: 'How to Build a Content Strategy',
            revenue: 1920,
            conversions: 12,
            traffic: 8200,
            conversionRate: 1.46,
            status: 'declining',
          },
        ],
        moneyMap: [
          { source: 'Organic Search', revenue: 14250, percentage: 57.6 },
          { source: 'Social Media', revenue: 5940, percentage: 24.0 },
          { source: 'Email', revenue: 2970, percentage: 12.0 },
          { source: 'Direct', revenue: 1590, percentage: 6.4 },
        ],
        conversionPaths: [
          {
            path: 'Organic → Blog Post → CTA → Conversion',
            conversions: 42,
            revenue: 6720,
            avgTime: '8:24',
          },
          {
            path: 'Social → Blog Post → CTA → Conversion',
            conversions: 28,
            revenue: 4480,
            avgTime: '5:12',
          },
          {
            path: 'Email → Blog Post → CTA → Conversion',
            conversions: 18,
            revenue: 2880,
            avgTime: '6:48',
          },
        ],
        contentROI: [
          {
            contentType: 'Long-form guides (2000+ words)',
            investment: 500,
            revenue: 3200,
            roi: 540,
          },
          {
            contentType: 'How-to articles (1000-1500 words)',
            investment: 300,
            revenue: 1800,
            roi: 500,
          },
          {
            contentType: 'Listicles (800-1200 words)',
            investment: 200,
            revenue: 920,
            roi: 360,
          },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendIcon = (status: string) => {
    if (status === 'growing') return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (status === 'declining') return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold sm:text-3xl flex items-center gap-2"
        >
          <DollarSign className="h-8 w-8 text-primary" />
          Revenue Attribution
        </motion.h1>
        <p className="mt-1 text-muted-foreground">
          Track revenue by content, understand conversion paths, measure ROI
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All-time tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.thisMonth)}</div>
            <p className="text-xs text-green-500">+{data.overview.growthRate}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Avg per Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.avgRevenuePerArticle)}</div>
            <p className="text-xs text-muted-foreground">Average revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.growthRate}%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="performers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performers">
            <TrendingUp className="mr-2 h-4 w-4" />
            Top Content
          </TabsTrigger>
          <TabsTrigger value="moneymap">
            <BarChart3 className="mr-2 h-4 w-4" />
            Money Map
          </TabsTrigger>
          <TabsTrigger value="paths">
            <MousePointer className="mr-2 h-4 w-4" />
            Conversion Paths
          </TabsTrigger>
          <TabsTrigger value="roi">
            <DollarSign className="mr-2 h-4 w-4" />
            Content ROI
          </TabsTrigger>
        </TabsList>

        {/* Top Performers Tab */}
        <TabsContent value="performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Content</CardTitle>
              <CardDescription>Your highest-earning articles and their performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.topPerformers.map((article: any, index: number) => (
                <div
                  key={article.id}
                  className="p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <h3 className="font-medium">{article.title}</h3>
                        {getTrendIcon(article.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {article.traffic.toLocaleString()} visitors • {article.conversions} conversions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">
                        {formatCurrency(article.revenue)}
                      </div>
                      <Badge variant="outline">{article.conversionRate}% CVR</Badge>
                    </div>
                  </div>
                  <Progress value={(article.revenue / data.topPerformers[0].revenue) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Money Map Tab */}
        <TabsContent value="moneymap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Traffic Source</CardTitle>
              <CardDescription>Where your money is coming from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.moneyMap.map((source: any) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(source.revenue)}</div>
                      <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between font-medium">
                  <span>Total Revenue</span>
                  <span>{formatCurrency(data.overview.totalRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Conversion Paths</CardTitle>
              <CardDescription>How users reach conversion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.conversionPaths.map((path: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-mono text-sm mb-2">{path.path}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {path.conversions} conversions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Avg. {path.avgTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-500">
                        {formatCurrency(path.revenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(path.revenue / path.conversions)} per conversion
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Type ROI</CardTitle>
              <CardDescription>Return on investment by content format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.contentROI.map((item: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.contentType}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Investment: {formatCurrency(item.investment)}</span>
                        <span>Revenue: {formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.roi >= 500 ? 'default' : 'secondary'} className="text-lg">
                        {item.roi}% ROI
                      </Badge>
                    </div>
                  </div>
                  <Progress value={Math.min((item.roi / 600) * 100, 100)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">ROI Insight</h3>
                  <p className="text-sm text-muted-foreground">
                    Long-form guides (2000+ words) generate the highest ROI at 540%. Consider investing
                    more in comprehensive content for maximum returns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
