// Viral Content Amplification System
// Detects and amplifies viral content across platforms

import {
  PlatformType,
  PlatformContent,
  PerformanceMetrics
} from './types'
import { ViralContent, AmplificationStrategy } from './engagement-automation'

export interface ViralDetectionConfig {
  viralThreshold: number // multiplier (e.g., 3.0 = 3x normal)
  minEngagement: number
  minReach: number
  timeWindow: number // minutes
  platforms: PlatformType[]
}

export interface AmplificationResult {
  contentId: string
  platform: PlatformType
  originalReach: number
  amplifiedReach: number
  reachMultiplier: number
  actionsPerformed: string[]
  cost: number
  roi: number
  status: 'pending' | 'active' | 'completed' | 'failed'
}

export interface ViralPattern {
  id: string
  platform: PlatformType
  contentType: string
  triggers: string[]
  averageGrowthRate: number
  peakTime: number // hours after posting
  successRate: number
  examples: string[]
}

export class ViralAmplification {
  private static instance: ViralAmplification
  private viralPatterns: Map<string, ViralPattern> = new Map()
  private amplificationResults: Map<string, AmplificationResult> = new Map()

  static getInstance(): ViralAmplification {
    if (!ViralAmplification.instance) {
      ViralAmplification.instance = new ViralAmplification()
    }
    return ViralAmplification.instance
  }

  // Detect viral potential early
  async detectViralPotential(
    contentId: string,
    platform: PlatformType,
    currentMetrics: PerformanceMetrics,
    timeElapsed: number // minutes since posting
  ): Promise<{
    isViral: boolean
    viralScore: number
    confidence: number
    projectedReach: number
    recommendation: string
  }> {
    // Calculate engagement velocity (engagement per minute)
    const engagementVelocity = currentMetrics.engagement / Math.max(1, timeElapsed)
    
    // Calculate viral indicators
    const shareRate = currentMetrics.shares / Math.max(1, currentMetrics.views)
    const engagementRate = currentMetrics.engagement / Math.max(1, currentMetrics.reach)
    const viralityIndex = (shareRate * 100) + (engagementRate * 50) + (engagementVelocity * 10)

    // Viral score (0-100)
    const viralScore = Math.min(100, viralityIndex * 2)
    
    // Confidence based on data points
    const confidence = Math.min(0.95, 0.5 + (timeElapsed / 120) * 0.45)

    // Project final reach
    const growthFactor = viralScore > 70 ? 10 : viralScore > 50 ? 5 : 2
    const projectedReach = currentMetrics.reach * growthFactor

    // Determine if viral
    const isViral = viralScore > 60 && engagementVelocity > 5

    // Generate recommendation
    let recommendation = ''
    if (isViral && viralScore > 80) {
      recommendation = 'URGENT: Amplify immediately with maximum budget'
    } else if (isViral && viralScore > 60) {
      recommendation = 'Amplify now with moderate budget'
    } else if (viralScore > 40) {
      recommendation = 'Monitor closely - potential viral content'
    } else {
      recommendation = 'Continue normal monitoring'
    }

    return {
      isViral,
      viralScore,
      confidence,
      projectedReach,
      recommendation
    }
  }

  // Execute amplification strategy
  async executeAmplification(
    viralContent: ViralContent,
    userId: string,
    budget?: number
  ): Promise<AmplificationResult> {
    const strategy = viralContent.amplificationStrategy
    const actionsPerformed: string[] = []
    let totalCost = 0
    let amplifiedReach = viralContent.metrics.reach

    console.log(`Executing amplification for ${viralContent.contentId}...`)

    // 1. Cross-platform distribution
    if (strategy.crossPost) {
      const crossPostCost = strategy.targetPlatforms.length * 50
      totalCost += crossPostCost
      amplifiedReach += strategy.targetPlatforms.length * 5000
      actionsPerformed.push(
        `Cross-posted to ${strategy.targetPlatforms.length} platforms`
      )
    }

    // 2. Paid promotion
    if (strategy.boostBudget && budget && budget >= strategy.boostBudget) {
      totalCost += strategy.boostBudget
      amplifiedReach *= 2.5
      actionsPerformed.push(
        `Activated paid promotion ($${strategy.boostBudget})`
      )
    }

    // 3. Engagement boost
    if (strategy.engagementBoost) {
      totalCost += 100
      amplifiedReach *= 1.3
      actionsPerformed.push('Activated engagement automation')
    }

    // 4. Influencer outreach
    if (strategy.influencerOutreach) {
      totalCost += 300
      amplifiedReach *= 1.8
      actionsPerformed.push('Initiated influencer partnerships')
    }

    // 5. Content variations
    if (strategy.contentVariations.length > 0) {
      totalCost += strategy.contentVariations.length * 25
      amplifiedReach += strategy.contentVariations.length * 2000
      actionsPerformed.push(
        `Created ${strategy.contentVariations.length} content variations`
      )
    }

    // Calculate ROI (assuming $0.01 per reach)
    const revenuePerReach = 0.01
    const estimatedRevenue = amplifiedReach * revenuePerReach
    const roi = totalCost > 0 ? ((estimatedRevenue - totalCost) / totalCost) * 100 : 0

    const result: AmplificationResult = {
      contentId: viralContent.contentId,
      platform: viralContent.platform,
      originalReach: viralContent.metrics.reach,
      amplifiedReach: Math.round(amplifiedReach),
      reachMultiplier: amplifiedReach / viralContent.metrics.reach,
      actionsPerformed,
      cost: totalCost,
      roi,
      status: 'active'
    }

    this.amplificationResults.set(viralContent.contentId, result)

    console.log(`Amplification executed:`)
    console.log(`  Original reach: ${result.originalReach.toLocaleString()}`)
    console.log(`  Amplified reach: ${result.amplifiedReach.toLocaleString()}`)
    console.log(`  Multiplier: ${result.reachMultiplier.toFixed(2)}x`)
    console.log(`  Cost: $${result.cost}`)
    console.log(`  ROI: ${result.roi.toFixed(1)}%`)

    return result
  }

  // Learn viral patterns from successful content
  async learnViralPattern(
    contentId: string,
    platform: PlatformType,
    content: PlatformContent,
    finalMetrics: PerformanceMetrics
  ): Promise<ViralPattern> {
    const patternId = `${platform}_${content.format}_${Date.now()}`

    // Analyze what made it viral
    const triggers: string[] = []
    
    // Check for common viral triggers
    if (finalMetrics.shares > finalMetrics.views * 0.1) {
      triggers.push('high_share_rate')
    }
    if (finalMetrics.comments > finalMetrics.views * 0.05) {
      triggers.push('high_comment_rate')
    }
    if (finalMetrics.engagement > finalMetrics.reach * 0.1) {
      triggers.push('high_engagement_rate')
    }

    // Calculate growth rate
    const growthRate = finalMetrics.reach / 1000 // Simplified

    // Calculate peak time (when did it go viral)
    const peakTime = content.publishedTime 
      ? Math.round((Date.now() - content.publishedTime.getTime()) / (1000 * 60 * 60))
      : 24

    const pattern: ViralPattern = {
      id: patternId,
      platform,
      contentType: content.format,
      triggers,
      averageGrowthRate: growthRate,
      peakTime,
      successRate: 0.85,
      examples: [contentId]
    }

    this.viralPatterns.set(patternId, pattern)

    console.log(`Learned new viral pattern: ${patternId}`)
    console.log(`  Triggers: ${triggers.join(', ')}`)
    console.log(`  Growth rate: ${growthRate.toFixed(2)}x`)
    console.log(`  Peak time: ${peakTime}h after posting`)

    return pattern
  }

  // Predict viral potential before posting
  async predictViralPotential(
    content: string,
    platform: PlatformType,
    format: string
  ): Promise<{
    viralProbability: number
    confidence: number
    recommendations: string[]
    similarPatterns: ViralPattern[]
  }> {
    // Find similar successful patterns
    const similarPatterns = Array.from(this.viralPatterns.values())
      .filter(p => p.platform === platform && p.contentType === format)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5)

    // Calculate viral probability based on patterns
    const avgSuccessRate = similarPatterns.length > 0
      ? similarPatterns.reduce((sum, p) => sum + p.successRate, 0) / similarPatterns.length
      : 0.3

    const viralProbability = avgSuccessRate

    // Generate recommendations
    const recommendations: string[] = []
    
    if (similarPatterns.length > 0) {
      const commonTriggers = this.findCommonTriggers(similarPatterns)
      commonTriggers.forEach(trigger => {
        recommendations.push(this.getTriggerRecommendation(trigger))
      })
    } else {
      recommendations.push('No similar viral patterns found - experiment with different formats')
      recommendations.push('Focus on high engagement hooks in first 3 seconds')
      recommendations.push('Include clear call-to-action for sharing')
    }

    // Add platform-specific recommendations
    recommendations.push(...this.getPlatformViralTips(platform))

    return {
      viralProbability,
      confidence: similarPatterns.length > 0 ? 0.75 : 0.4,
      recommendations: recommendations.slice(0, 5),
      similarPatterns
    }
  }

  // Find common triggers across patterns
  private findCommonTriggers(patterns: ViralPattern[]): string[] {
    const triggerCounts = new Map<string, number>()
    
    patterns.forEach(pattern => {
      pattern.triggers.forEach(trigger => {
        triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1)
      })
    })

    return Array.from(triggerCounts.entries())
      .filter(([_, count]) => count >= patterns.length * 0.5)
      .map(([trigger]) => trigger)
  }

  // Get recommendation for trigger
  private getTriggerRecommendation(trigger: string): string {
    const recommendations: Record<string, string> = {
      high_share_rate: 'Include shareable quotes or statistics',
      high_comment_rate: 'Ask engaging questions to drive discussion',
      high_engagement_rate: 'Use interactive elements and clear CTAs',
      emotional_hook: 'Lead with emotional storytelling',
      controversy: 'Present contrarian viewpoints (carefully)',
      trending_topic: 'Leverage current trending topics',
      visual_appeal: 'Use high-quality visuals and graphics'
    }

    return recommendations[trigger] || 'Optimize for engagement'
  }

  // Get platform-specific viral tips
  private getPlatformViralTips(platform: PlatformType): string[] {
    const tips: Record<PlatformType, string[]> = {
      twitter: [
        'Use threads for complex topics',
        'Include relevant hashtags (max 2)',
        'Post during peak hours'
      ],
      linkedin: [
        'Share professional insights',
        'Use data and statistics',
        'Engage in comments quickly'
      ],
      instagram: [
        'Use all 30 hashtags',
        'Post Reels for maximum reach',
        'Include location tags'
      ],
      youtube: [
        'Optimize thumbnail for clicks',
        'Front-load value in first 30 seconds',
        'Use trending topics in title'
      ],
      tiktok: [
        'Use trending sounds',
        'Hook viewers in first 3 seconds',
        'Post 3-4 times per day'
      ],
      medium: [
        'Write 7-10 minute read time',
        'Use compelling headlines',
        'Include actionable takeaways'
      ],
      facebook: [
        'Use video content',
        'Ask questions to drive comments',
        'Post during evening hours'
      ],
      blog: [
        'Optimize for SEO',
        'Include social share buttons',
        'Use compelling headlines'
      ]
    }

    return tips[platform] || []
  }

  // Get amplification results
  getAmplificationResults(contentId?: string): AmplificationResult[] {
    if (contentId) {
      const result = this.amplificationResults.get(contentId)
      return result ? [result] : []
    }
    return Array.from(this.amplificationResults.values())
  }

  // Get viral patterns
  getViralPatterns(platform?: PlatformType): ViralPattern[] {
    const patterns = Array.from(this.viralPatterns.values())
    return platform ? patterns.filter(p => p.platform === platform) : patterns
  }

  // Calculate amplification ROI
  calculateROI(result: AmplificationResult): {
    roi: number
    revenueGenerated: number
    costPerReach: number
    efficiency: string
  } {
    const revenuePerReach = 0.01 // $0.01 per reach
    const revenueGenerated = result.amplifiedReach * revenuePerReach
    const costPerReach = result.cost / result.amplifiedReach
    
    let efficiency = 'poor'
    if (result.roi > 200) efficiency = 'excellent'
    else if (result.roi > 100) efficiency = 'good'
    else if (result.roi > 0) efficiency = 'moderate'

    return {
      roi: result.roi,
      revenueGenerated,
      costPerReach,
      efficiency
    }
  }

  // Generate amplification report
  async generateAmplificationReport(
    timeRange: { start: Date; end: Date }
  ): Promise<{
    totalAmplifications: number
    totalReachGained: number
    totalCost: number
    averageROI: number
    topPerformers: AmplificationResult[]
    recommendations: string[]
  }> {
    const results = Array.from(this.amplificationResults.values())
    
    const totalReachGained = results.reduce(
      (sum, r) => sum + (r.amplifiedReach - r.originalReach),
      0
    )
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0)
    const averageROI = results.length > 0
      ? results.reduce((sum, r) => sum + r.roi, 0) / results.length
      : 0

    const topPerformers = results
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5)

    const recommendations: string[] = [
      'Continue amplifying content with viral score > 70',
      'Allocate more budget to high-ROI platforms',
      'Test content variations for better performance',
      'Monitor viral patterns and replicate success factors'
    ]

    return {
      totalAmplifications: results.length,
      totalReachGained,
      totalCost,
      averageROI,
      topPerformers,
      recommendations
    }
  }
}

export const viralAmplification = ViralAmplification.getInstance()
