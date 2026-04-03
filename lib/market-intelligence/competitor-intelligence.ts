// Competitor Intelligence System
// Track, analyze, and learn from competitors

import {
  CompetitorAnalysis,
  TrendAnalysis
} from '../business-intelligence/types'

export interface Competitor {
  id: string
  name: string
  domain: string
  category: string
  trackingSince: Date
  lastAnalyzed: Date
}

export interface CompetitorContent {
  id: string
  competitorId: string
  title: string
  url: string
  publishedDate: Date
  contentType: string
  estimatedTraffic: number
  backlinks: number
  socialShares: number
  keywords: string[]
  performance: 'high' | 'medium' | 'low'
}

export interface ContentGap {
  id: string
  topic: string
  keywords: string[]
  searchVolume: number
  competition: 'low' | 'medium' | 'high'
  competitorCoverage: number
  ourCoverage: number
  opportunity: number
  priority: 'high' | 'medium' | 'low'
  recommendations: string[]
}

export interface MarketTrend {
  id: string
  trend: string
  category: string
  momentum: 'rising' | 'stable' | 'declining'
  growthRate: number
  searchVolume: number
  competitorAdoption: number
  ourPosition: 'leader' | 'follower' | 'absent'
  recommendations: string[]
}

export class CompetitorIntelligence {
  private static instance: CompetitorIntelligence
  private competitors: Map<string, Competitor> = new Map()
  private competitorContent: Map<string, CompetitorContent[]> = new Map()
  private contentGaps: Map<string, ContentGap> = new Map()
  private marketTrends: Map<string, MarketTrend> = new Map()

  static getInstance(): CompetitorIntelligence {
    if (!CompetitorIntelligence.instance) {
      CompetitorIntelligence.instance = new CompetitorIntelligence()
    }
    return CompetitorIntelligence.instance
  }

  // Add competitor to tracking
  async addCompetitor(competitor: Omit<Competitor, 'id' | 'trackingSince' | 'lastAnalyzed'>): Promise<Competitor> {
    const id = `comp_${Date.now()}`
    const fullCompetitor: Competitor = {
      id,
      ...competitor,
      trackingSince: new Date(),
      lastAnalyzed: new Date()
    }

    this.competitors.set(id, fullCompetitor)
    console.log(`Added competitor: ${competitor.name}`)

    return fullCompetitor
  }

  // Analyze competitor
  async analyzeCompetitor(competitorId: string): Promise<CompetitorAnalysis> {
    const competitor = this.competitors.get(competitorId)
    if (!competitor) {
      throw new Error(`Competitor not found: ${competitorId}`)
    }

    console.log(`Analyzing competitor: ${competitor.name}...`)

    // Mock analysis (would use real data in production)
    const analysis: CompetitorAnalysis = {
      competitor: competitor.name,
      metrics: {
        estimatedTraffic: Math.floor(Math.random() * 2000000) + 500000,
        contentVolume: Math.floor(Math.random() * 800) + 200,
        engagementRate: Math.random() * 0.08 + 0.02,
        topKeywords: [
          'content marketing',
          'SEO optimization',
          'digital strategy',
          'social media marketing',
          'email marketing'
        ],
        contentGaps: [
          'Video tutorials',
          'Interactive tools',
          'Podcast content',
          'Webinar series',
          'Community forum'
        ]
      },
      strengths: [
        'Strong brand recognition',
        'High-quality long-form content',
        'Active social media presence',
        'Consistent publishing schedule',
        'Strong backlink profile'
      ],
      weaknesses: [
        'Limited video content',
        'Slow page load times',
        'Weak mobile experience',
        'Infrequent content updates',
        'Limited international reach'
      ],
      opportunities: [
        'Expand to emerging platforms (TikTok, Clubhouse)',
        'Create more interactive content',
        'Develop mobile app',
        'Launch podcast series',
        'Build community features'
      ],
      threats: [
        'New AI-powered competitors',
        'Algorithm changes affecting rankings',
        'Market saturation in core topics',
        'Rising content production costs',
        'Changing user preferences'
      ]
    }

    // Update last analyzed
    competitor.lastAnalyzed = new Date()
    this.competitors.set(competitorId, competitor)

    console.log(`Analysis complete for ${competitor.name}`)
    console.log(`  Traffic: ${analysis.metrics.estimatedTraffic.toLocaleString()}`)
    console.log(`  Content: ${analysis.metrics.contentVolume} pieces`)
    console.log(`  Engagement: ${(analysis.metrics.engagementRate * 100).toFixed(2)}%`)

    return analysis
  }

  // Track competitor content
  async trackCompetitorContent(
    competitorId: string,
    content: Omit<CompetitorContent, 'id'>
  ): Promise<CompetitorContent> {
    const id = `content_${Date.now()}`
    const fullContent: CompetitorContent = {
      id,
      ...content
    }

    const existing = this.competitorContent.get(competitorId) || []
    existing.push(fullContent)
    this.competitorContent.set(competitorId, existing)

    console.log(`Tracked content: ${content.title} from competitor ${competitorId}`)

    return fullContent
  }

  // Identify content gaps
  async identifyContentGaps(
    ourKeywords: string[],
    competitorKeywords: Map<string, string[]>
  ): Promise<ContentGap[]> {
    console.log('Identifying content gaps...')

    const gaps: ContentGap[] = []
    const allCompetitorKeywords = new Set<string>()

    // Collect all competitor keywords
    competitorKeywords.forEach(keywords => {
      keywords.forEach(kw => allCompetitorKeywords.add(kw))
    })

    // Find keywords competitors cover but we don't
    allCompetitorKeywords.forEach(keyword => {
      if (!ourKeywords.includes(keyword)) {
        const competitorCoverage = Array.from(competitorKeywords.values())
          .filter(keywords => keywords.includes(keyword)).length
        
        const coveragePercentage = (competitorCoverage / competitorKeywords.size) * 100

        if (coveragePercentage >= 50) { // At least 50% of competitors cover it
          const gap: ContentGap = {
            id: `gap_${Date.now()}_${keyword}`,
            topic: keyword,
            keywords: [keyword],
            searchVolume: Math.floor(Math.random() * 50000) + 5000,
            competition: coveragePercentage > 75 ? 'high' : coveragePercentage > 50 ? 'medium' : 'low',
            competitorCoverage: coveragePercentage,
            ourCoverage: 0,
            opportunity: (100 - coveragePercentage) * (Math.random() * 0.5 + 0.5),
            priority: coveragePercentage > 75 ? 'high' : coveragePercentage > 50 ? 'medium' : 'low',
            recommendations: [
              `Create comprehensive guide on ${keyword}`,
              `Target long-tail variations`,
              `Build topical authority cluster`
            ]
          }

          gaps.push(gap)
          this.contentGaps.set(gap.id, gap)
        }
      }
    })

    // Sort by opportunity score
    gaps.sort((a, b) => b.opportunity - a.opportunity)

    console.log(`Identified ${gaps.length} content gaps`)
    console.log(`Top gaps: ${gaps.slice(0, 3).map(g => g.topic).join(', ')}`)

    return gaps.slice(0, 20) // Return top 20 gaps
  }

  // Analyze market trends
  async analyzeMarketTrends(
    keywords: string[]
  ): Promise<MarketTrend[]> {
    console.log('Analyzing market trends...')

    const trends: MarketTrend[] = keywords.map(keyword => {
      const growthRate = Math.random() * 100 - 20 // -20% to +80%
      const momentum: 'rising' | 'stable' | 'declining' = 
        growthRate > 20 ? 'rising' :
        growthRate < -10 ? 'declining' :
        'stable'

      const competitorAdoption = Math.random() * 100
      const ourPosition: 'leader' | 'follower' | 'absent' =
        competitorAdoption < 30 ? 'leader' :
        competitorAdoption < 70 ? 'follower' :
        'absent'

      const trend: MarketTrend = {
        id: `trend_${Date.now()}_${keyword}`,
        trend: keyword,
        category: 'content marketing',
        momentum,
        growthRate,
        searchVolume: Math.floor(Math.random() * 100000) + 10000,
        competitorAdoption,
        ourPosition,
        recommendations: this.generateTrendRecommendations(momentum, ourPosition)
      }

      this.marketTrends.set(trend.id, trend)
      return trend
    })

    console.log(`Analyzed ${trends.length} market trends`)
    console.log(`Rising trends: ${trends.filter(t => t.momentum === 'rising').length}`)

    return trends.sort((a, b) => b.growthRate - a.growthRate)
  }

  // Generate trend recommendations
  private generateTrendRecommendations(
    momentum: 'rising' | 'stable' | 'declining',
    position: 'leader' | 'follower' | 'absent'
  ): string[] {
    const recommendations: string[] = []

    if (momentum === 'rising') {
      if (position === 'absent') {
        recommendations.push('Act quickly to establish presence')
        recommendations.push('Create comprehensive content series')
        recommendations.push('Invest in paid promotion')
      } else if (position === 'follower') {
        recommendations.push('Increase content production')
        recommendations.push('Differentiate from competitors')
        recommendations.push('Build thought leadership')
      } else {
        recommendations.push('Maintain leadership position')
        recommendations.push('Expand content depth')
        recommendations.push('Leverage first-mover advantage')
      }
    } else if (momentum === 'declining') {
      recommendations.push('Reduce investment in this area')
      recommendations.push('Focus on evergreen aspects')
      recommendations.push('Pivot to related rising trends')
    } else {
      recommendations.push('Maintain current strategy')
      recommendations.push('Monitor for changes')
      recommendations.push('Optimize existing content')
    }

    return recommendations
  }

  // Get competitive positioning
  async getCompetitivePositioning(): Promise<{
    ourRank: number
    totalCompetitors: number
    marketShare: number
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
  }> {
    const competitors = Array.from(this.competitors.values())
    
    return {
      ourRank: 3,
      totalCompetitors: competitors.length + 1,
      marketShare: 15.5,
      strengths: [
        'Advanced AI-powered content generation',
        'Multi-platform distribution',
        'Comprehensive analytics',
        'Automated monetization'
      ],
      weaknesses: [
        'Newer brand with less recognition',
        'Smaller content library',
        'Limited international presence'
      ],
      opportunities: [
        'Leverage AI advantage',
        'Expand to underserved markets',
        'Build strategic partnerships',
        'Develop unique features'
      ]
    }
  }

  // Get competitor benchmarks
  async getCompetitorBenchmarks(): Promise<{
    averageTraffic: number
    averageContentVolume: number
    averageEngagementRate: number
    topPerformer: string
    industryAverage: Record<string, number>
  }> {
    const competitors = Array.from(this.competitors.values())
    
    // Mock benchmarks (would use real data in production)
    return {
      averageTraffic: 1250000,
      averageContentVolume: 450,
      averageEngagementRate: 0.045,
      topPerformer: competitors[0]?.name || 'Unknown',
      industryAverage: {
        traffic: 1000000,
        contentVolume: 400,
        engagementRate: 0.04,
        conversionRate: 0.025,
        revenuePerVisitor: 0.05
      }
    }
  }

  // Get competitors
  getCompetitors(): Competitor[] {
    return Array.from(this.competitors.values())
  }

  // Get content gaps
  getContentGaps(priority?: 'high' | 'medium' | 'low'): ContentGap[] {
    const gaps = Array.from(this.contentGaps.values())
    return priority ? gaps.filter(g => g.priority === priority) : gaps
  }

  // Get market trends
  getMarketTrends(momentum?: 'rising' | 'stable' | 'declining'): MarketTrend[] {
    const trends = Array.from(this.marketTrends.values())
    return momentum ? trends.filter(t => t.momentum === momentum) : trends
  }

  // Get competitor content
  getCompetitorContent(competitorId: string): CompetitorContent[] {
    return this.competitorContent.get(competitorId) || []
  }
}

export const competitorIntelligence = CompetitorIntelligence.getInstance()
