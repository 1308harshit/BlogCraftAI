// Performance Correlation and Failure Analysis System
// Identify what drives success and what causes failure

import { ContentDNA } from '../content-dna/types'
import { PerformanceMetrics } from '../platform/types'

export interface PerformanceCorrelation {
  element: string
  metric: string
  correlation: number
  significance: number
  sampleSize: number
  confidenceInterval: { lower: number; upper: number }
  recommendation: string
  examples: CorrelationExample[]
}

export interface CorrelationExample {
  contentId: string
  elementValue: number | string
  metricValue: number
  performance: 'high' | 'medium' | 'low'
}

export interface FailureAnalysis {
  contentId: string
  failureType: 'low_engagement' | 'poor_reach' | 'low_conversions' | 'high_bounce'
  severity: 'critical' | 'major' | 'minor'
  rootCauses: FailureCause[]
  recommendations: string[]
  preventionStrategies: string[]
  estimatedImpact: number
  confidence: number
}

export interface FailureCause {
  category: 'content' | 'timing' | 'platform' | 'audience' | 'technical'
  factor: string
  contribution: number
  evidence: string[]
  fixComplexity: 'easy' | 'medium' | 'hard'
}

export interface PerformancePattern {
  id: string
  name: string
  type: 'success' | 'failure'
  frequency: number
  characteristics: string[]
  avgPerformance: Record<string, number>
  conditions: string[]
  recommendations: string[]
}

export interface OptimizationOpportunity {
  id: string
  contentId: string
  type: 'quick_win' | 'major_improvement' | 'strategic_change'
  description: string
  currentPerformance: Record<string, number>
  projectedPerformance: Record<string, number>
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  priority: number
  actionItems: string[]
  timeline: string
}

export class CorrelationAnalyzer {
  private static instance: CorrelationAnalyzer
  private correlations: Map<string, PerformanceCorrelation> = new Map()
  private failures: Map<string, FailureAnalysis> = new Map()
  private patterns: Map<string, PerformancePattern> = new Map()
  private opportunities: Map<string, OptimizationOpportunity> = new Map()

  static getInstance(): CorrelationAnalyzer {
    if (!CorrelationAnalyzer.instance) {
      CorrelationAnalyzer.instance = new CorrelationAnalyzer()
    }
    return CorrelationAnalyzer.instance
  }

  // Analyze performance correlations
  async analyzeCorrelations(
    contentData: Array<{ dna: ContentDNA; metrics: PerformanceMetrics }>
  ): Promise<PerformanceCorrelation[]> {
    console.log(`Analyzing correlations for ${contentData.length} content pieces...`)

    const correlations: PerformanceCorrelation[] = []

    // Word count vs engagement
    const wordCountCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.structure.wordCount),
      contentData.map(d => d.metrics.engagement),
      'Word Count',
      'Engagement'
    )
    correlations.push(wordCountCorr)

    // Image count vs shares
    const imageCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.structure.imageCount),
      contentData.map(d => d.metrics.shares),
      'Image Count',
      'Shares'
    )
    correlations.push(imageCorr)

    // Readability vs completion
    const readabilityCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.readabilityScore),
      contentData.map(d => d.metrics.views),
      'Readability Score',
      'Views'
    )
    correlations.push(readabilityCorr)

    // Heading count vs engagement
    const headingCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.structure.headingCount),
      contentData.map(d => d.metrics.engagement),
      'Heading Count',
      'Engagement'
    )
    correlations.push(headingCorr)

    // CTA count vs conversions
    const ctaCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.elements.filter(e => e.type === 'cta').length),
      contentData.map(d => d.metrics.clicks),
      'CTA Count',
      'Clicks'
    )
    correlations.push(ctaCorr)

    // Emotional intensity vs shares
    const emotionCorr = this.calculateCorrelation(
      contentData.map(d => d.dna.emotionalProfile.emotionalIntensity),
      contentData.map(d => d.metrics.shares),
      'Emotional Intensity',
      'Shares'
    )
    correlations.push(emotionCorr)

    // Store correlations
    correlations.forEach(corr => {
      this.correlations.set(`${corr.element}_${corr.metric}`, corr)
    })

    console.log(`Found ${correlations.length} significant correlations`)
    console.log(`Strongest correlation: ${correlations[0]?.element} vs ${correlations[0]?.metric} (r=${correlations[0]?.correlation.toFixed(3)})`)

    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
  }

  // Calculate correlation between two variables
  private calculateCorrelation(
    x: number[],
    y: number[],
    elementName: string,
    metricName: string
  ): PerformanceCorrelation {
    const n = Math.min(x.length, y.length)
    
    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / n
    const meanY = y.reduce((sum, val) => sum + val, 0) / n

    // Calculate correlation coefficient
    let numerator = 0
    let sumXSquared = 0
    let sumYSquared = 0

    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX
      const deltaY = y[i] - meanY
      numerator += deltaX * deltaY
      sumXSquared += deltaX * deltaX
      sumYSquared += deltaY * deltaY
    }

    const correlation = numerator / Math.sqrt(sumXSquared * sumYSquared)
    
    // Calculate significance (simplified t-test)
    const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation))
    const significance = Math.abs(tStat) > 2.0 ? 0.95 : 0.8

    // Generate examples
    const examples: CorrelationExample[] = []
    for (let i = 0; i < Math.min(5, n); i++) {
      examples.push({
        contentId: `content_${i}`,
        elementValue: x[i],
        metricValue: y[i],
        performance: y[i] > meanY * 1.2 ? 'high' : y[i] < meanY * 0.8 ? 'low' : 'medium'
      })
    }

    return {
      element: elementName,
      metric: metricName,
      correlation,
      significance,
      sampleSize: n,
      confidenceInterval: {
        lower: correlation - 0.1,
        upper: correlation + 0.1
      },
      recommendation: this.generateCorrelationRecommendation(elementName, metricName, correlation),
      examples
    }
  }

  // Generate recommendation based on correlation
  private generateCorrelationRecommendation(
    element: string,
    metric: string,
    correlation: number
  ): string {
    const strength = Math.abs(correlation)
    const direction = correlation > 0 ? 'increase' : 'decrease'

    if (strength > 0.7) {
      return `Strong correlation found: ${direction} ${element.toLowerCase()} to improve ${metric.toLowerCase()}`
    } else if (strength > 0.5) {
      return `Moderate correlation: Consider ${direction === 'increase' ? 'optimizing' : 'reducing'} ${element.toLowerCase()}`
    } else if (strength > 0.3) {
      return `Weak correlation: ${element} may have minor impact on ${metric.toLowerCase()}`
    } else {
      return `No significant correlation between ${element.toLowerCase()} and ${metric.toLowerCase()}`
    }
  }

  // Analyze content failures
  async analyzeFailures(
    contentData: Array<{ dna: ContentDNA; metrics: PerformanceMetrics; contentId: string }>
  ): Promise<FailureAnalysis[]> {
    console.log(`Analyzing failures for ${contentData.length} content pieces...`)

    const failures: FailureAnalysis[] = []

    // Calculate performance benchmarks
    const avgEngagement = contentData.reduce((sum, d) => sum + d.metrics.engagement, 0) / contentData.length
    const avgReach = contentData.reduce((sum, d) => sum + d.metrics.reach, 0) / contentData.length
    const avgClicks = contentData.reduce((sum, d) => sum + d.metrics.clicks, 0) / contentData.length

    // Identify underperforming content
    contentData.forEach(data => {
      const failureTypes: string[] = []
      
      if (data.metrics.engagement < avgEngagement * 0.5) {
        failureTypes.push('low_engagement')
      }
      if (data.metrics.reach < avgReach * 0.5) {
        failureTypes.push('poor_reach')
      }
      if (data.metrics.clicks < avgClicks * 0.5) {
        failureTypes.push('low_conversions')
      }

      if (failureTypes.length > 0) {
        const analysis = this.analyzeContentFailure(data, {
          avgEngagement,
          avgReach,
          avgClicks
        })
        failures.push(analysis)
        this.failures.set(data.contentId, analysis)
      }
    })

    console.log(`Identified ${failures.length} content failures`)
    console.log(`Most common failure type: ${this.getMostCommonFailureType(failures)}`)

    return failures.sort((a, b) => b.estimatedImpact - a.estimatedImpact)
  }

  // Analyze individual content failure
  private analyzeContentFailure(
    data: { dna: ContentDNA; metrics: PerformanceMetrics; contentId: string },
    benchmarks: { avgEngagement: number; avgReach: number; avgClicks: number }
  ): FailureAnalysis {
    const rootCauses: FailureCause[] = []

    // Content-related causes
    if (data.dna.readabilityScore < 60) {
      rootCauses.push({
        category: 'content',
        factor: 'Poor readability',
        contribution: 0.3,
        evidence: [`Readability score: ${data.dna.readabilityScore}/100`],
        fixComplexity: 'medium'
      })
    }

    if (data.dna.structure.wordCount < 300) {
      rootCauses.push({
        category: 'content',
        factor: 'Content too short',
        contribution: 0.25,
        evidence: [`Word count: ${data.dna.structure.wordCount} (recommended: 500+)`],
        fixComplexity: 'easy'
      })
    }

    if (data.dna.elements.filter(e => e.type === 'cta').length === 0) {
      rootCauses.push({
        category: 'content',
        factor: 'Missing call-to-action',
        contribution: 0.2,
        evidence: ['No CTAs found in content'],
        fixComplexity: 'easy'
      })
    }

    if (data.dna.structure.imageCount === 0) {
      rootCauses.push({
        category: 'content',
        factor: 'No visual elements',
        contribution: 0.15,
        evidence: ['No images or visuals included'],
        fixComplexity: 'medium'
      })
    }

    if (data.dna.seoScore < 50) {
      rootCauses.push({
        category: 'technical',
        factor: 'Poor SEO optimization',
        contribution: 0.1,
        evidence: [`SEO score: ${data.dna.seoScore}/100`],
        fixComplexity: 'medium'
      })
    }

    // Determine primary failure type
    const engagementRatio = data.metrics.engagement / benchmarks.avgEngagement
    const reachRatio = data.metrics.reach / benchmarks.avgReach
    const clickRatio = data.metrics.clicks / benchmarks.avgClicks

    let failureType: FailureAnalysis['failureType'] = 'low_engagement'
    if (reachRatio < engagementRatio && reachRatio < clickRatio) {
      failureType = 'poor_reach'
    } else if (clickRatio < engagementRatio && clickRatio < reachRatio) {
      failureType = 'low_conversions'
    }

    const severity: FailureAnalysis['severity'] = 
      Math.min(engagementRatio, reachRatio, clickRatio) < 0.3 ? 'critical' :
      Math.min(engagementRatio, reachRatio, clickRatio) < 0.5 ? 'major' :
      'minor'

    return {
      contentId: data.contentId,
      failureType,
      severity,
      rootCauses,
      recommendations: this.generateFailureRecommendations(rootCauses),
      preventionStrategies: this.generatePreventionStrategies(rootCauses),
      estimatedImpact: this.calculateFailureImpact(data.metrics, benchmarks),
      confidence: 0.8
    }
  }

  // Generate failure recommendations
  private generateFailureRecommendations(causes: FailureCause[]): string[] {
    const recommendations: string[] = []

    causes.forEach(cause => {
      switch (cause.factor) {
        case 'Poor readability':
          recommendations.push('Simplify language and shorten sentences')
          break
        case 'Content too short':
          recommendations.push('Expand content with more details and examples')
          break
        case 'Missing call-to-action':
          recommendations.push('Add clear CTAs throughout the content')
          break
        case 'No visual elements':
          recommendations.push('Include relevant images, charts, or videos')
          break
        case 'Poor SEO optimization':
          recommendations.push('Optimize title, headings, and meta description')
          break
      }
    })

    return recommendations
  }

  // Generate prevention strategies
  private generatePreventionStrategies(causes: FailureCause[]): string[] {
    return [
      'Use content templates with proven structures',
      'Implement content quality checklist',
      'A/B test headlines and CTAs',
      'Monitor readability scores during creation',
      'Include visual elements in content planning'
    ]
  }

  // Calculate failure impact
  private calculateFailureImpact(
    metrics: PerformanceMetrics,
    benchmarks: { avgEngagement: number; avgReach: number; avgClicks: number }
  ): number {
    const engagementLoss = Math.max(0, benchmarks.avgEngagement - metrics.engagement)
    const reachLoss = Math.max(0, benchmarks.avgReach - metrics.reach)
    const clickLoss = Math.max(0, benchmarks.avgClicks - metrics.clicks)

    // Estimate revenue impact (simplified)
    const revenuePerClick = 0.5 // $0.50 per click
    const estimatedRevenueLoss = clickLoss * revenuePerClick

    return estimatedRevenueLoss
  }

  // Get most common failure type
  private getMostCommonFailureType(failures: FailureAnalysis[]): string {
    const counts = failures.reduce((acc, f) => {
      acc[f.failureType] = (acc[f.failureType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown'
  }

  // Identify optimization opportunities
  async identifyOptimizationOpportunities(
    contentData: Array<{ dna: ContentDNA; metrics: PerformanceMetrics; contentId: string }>
  ): Promise<OptimizationOpportunity[]> {
    console.log(`Identifying optimization opportunities...`)

    const opportunities: OptimizationOpportunity[] = []

    contentData.forEach(data => {
      // Quick wins
      if (data.dna.elements.filter(e => e.type === 'cta').length < 2) {
        opportunities.push({
          id: `opp_cta_${data.contentId}`,
          contentId: data.contentId,
          type: 'quick_win',
          description: 'Add more call-to-action elements',
          currentPerformance: { clicks: data.metrics.clicks },
          projectedPerformance: { clicks: data.metrics.clicks * 1.3 },
          effort: 'low',
          impact: 'medium',
          priority: 1,
          actionItems: [
            'Add CTA in introduction',
            'Include mid-content CTA',
            'Strengthen conclusion CTA'
          ],
          timeline: '1 day'
        })
      }

      // Major improvements
      if (data.dna.structure.wordCount < 1000 && data.metrics.engagement < 100) {
        opportunities.push({
          id: `opp_expand_${data.contentId}`,
          contentId: data.contentId,
          type: 'major_improvement',
          description: 'Expand content depth and value',
          currentPerformance: { 
            engagement: data.metrics.engagement,
            views: data.metrics.views
          },
          projectedPerformance: { 
            engagement: data.metrics.engagement * 2.5,
            views: data.metrics.views * 1.8
          },
          effort: 'medium',
          impact: 'high',
          priority: 2,
          actionItems: [
            'Add more detailed explanations',
            'Include case studies and examples',
            'Add supporting research and data'
          ],
          timeline: '1 week'
        })
      }

      // Strategic changes
      if (data.dna.seoScore < 60) {
        opportunities.push({
          id: `opp_seo_${data.contentId}`,
          contentId: data.contentId,
          type: 'strategic_change',
          description: 'Complete SEO optimization overhaul',
          currentPerformance: { 
            views: data.metrics.views,
            reach: data.metrics.reach
          },
          projectedPerformance: { 
            views: data.metrics.views * 3,
            reach: data.metrics.reach * 2.5
          },
          effort: 'high',
          impact: 'high',
          priority: 3,
          actionItems: [
            'Keyword research and optimization',
            'Restructure with proper headings',
            'Add internal and external links',
            'Optimize meta descriptions'
          ],
          timeline: '2 weeks'
        })
      }
    })

    // Sort by priority and impact
    opportunities.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return b.impact === 'high' ? 1 : -1
    })

    opportunities.forEach(opp => {
      this.opportunities.set(opp.id, opp)
    })

    console.log(`Identified ${opportunities.length} optimization opportunities`)

    return opportunities
  }

  // Get correlations
  getCorrelations(): PerformanceCorrelation[] {
    return Array.from(this.correlations.values())
  }

  // Get failures
  getFailures(): FailureAnalysis[] {
    return Array.from(this.failures.values())
  }

  // Get opportunities
  getOpportunities(): OptimizationOpportunity[] {
    return Array.from(this.opportunities.values())
  }

  // Get failure by content ID
  getFailureAnalysis(contentId: string): FailureAnalysis | undefined {
    return this.failures.get(contentId)
  }
}

export const correlationAnalyzer = CorrelationAnalyzer.getInstance()