// Platform-Specific Strategy Adaptation System
// Automatically adjusts content strategies based on performance data and platform algorithms

import {
  PlatformType,
  PerformanceMetrics,
  PlatformContent,
  PlatformStrategy,
  CrossPlatformMetrics
} from './types'
import { getPlatformConfig } from './platform-configs'
import { performanceTracker, PerformanceInsight } from './performance-tracker'

export interface StrategyAdaptation {
  platform: PlatformType
  currentStrategy: PlatformStrategy
  adaptedStrategy: PlatformStrategy
  adaptationReasons: AdaptationReason[]
  expectedImpact: ImpactPrediction
  confidence: number
  implementedAt: Date
}

export interface AdaptationReason {
  type: 'performance' | 'algorithm' | 'audience' | 'competition' | 'trend'
  description: string
  metric: string
  currentValue: number
  targetValue: number
  priority: number
}

export interface ImpactPrediction {
  engagementIncrease: number // percentage
  reachIncrease: number // percentage
  conversionIncrease: number // percentage
  timeToImpact: number // hours
  confidence: number
}

export interface StrategyTestResult {
  strategyId: string
  platform: PlatformType
  testDuration: number // hours
  performanceImprovement: number // percentage
  statisticalSignificance: number
  recommendation: 'adopt' | 'reject' | 'continue_testing'
}

export interface AlgorithmUpdate {
  platform: PlatformType
  updateType: 'prioritization' | 'penalty' | 'feature' | 'timing'
  description: string
  detectedAt: Date
  adaptationRequired: boolean
  suggestedChanges: string[]
}

// Performance benchmarks for each platform
const PLATFORM_BENCHMARKS: Record<PlatformType, {
  engagementRate: number
  reachPerPost: number
  clickThroughRate: number
  conversionRate: number
}> = {
  twitter: {
    engagementRate: 0.03,
    reachPerPost: 500,
    clickThroughRate: 0.02,
    conversionRate: 0.01
  },
  linkedin: {
    engagementRate: 0.05,
    reachPerPost: 1000,
    clickThroughRate: 0.03,
    conversionRate: 0.015
  },
  instagram: {
    engagementRate: 0.04,
    reachPerPost: 800,
    clickThroughRate: 0.015,
    conversionRate: 0.008
  },
  youtube: {
    engagementRate: 0.06,
    reachPerPost: 5000,
    clickThroughRate: 0.05,
    conversionRate: 0.02
  },
  tiktok: {
    engagementRate: 0.08,
    reachPerPost: 2000,
    clickThroughRate: 0.04,
    conversionRate: 0.012
  },
  medium: {
    engagementRate: 0.04,
    reachPerPost: 1500,
    clickThroughRate: 0.025,
    conversionRate: 0.018
  },
  facebook: {
    engagementRate: 0.035,
    reachPerPost: 600,
    clickThroughRate: 0.02,
    conversionRate: 0.01
  },
  blog: {
    engagementRate: 0.02,
    reachPerPost: 3000,
    clickThroughRate: 0.03,
    conversionRate: 0.02
  }
}

export class StrategyAdapter {
  private static instance: StrategyAdapter
  private activeAdaptations: Map<string, StrategyAdaptation> = new Map()
  private strategyTests: Map<string, StrategyTestResult> = new Map()

  static getInstance(): StrategyAdapter {
    if (!StrategyAdapter.instance) {
      StrategyAdapter.instance = new StrategyAdapter()
    }
    return StrategyAdapter.instance
  }

  // Main method: Analyze performance and adapt strategy
  async adaptStrategy(
    userId: string,
    platform: PlatformType,
    currentStrategy: PlatformStrategy,
    performanceData: PerformanceMetrics,
    contentHistory: PlatformContent[]
  ): Promise<StrategyAdaptation> {
    console.log(`Adapting strategy for ${platform} based on performance data...`)

    // Analyze performance against benchmarks
    const performanceAnalysis = this.analyzePerformance(platform, performanceData)

    // Identify adaptation needs
    const adaptationReasons = this.identifyAdaptationNeeds(
      platform,
      performanceAnalysis,
      currentStrategy
    )

    // Generate adapted strategy
    const adaptedStrategy = await this.generateAdaptedStrategy(
      platform,
      currentStrategy,
      adaptationReasons,
      contentHistory
    )

    // Predict impact
    const expectedImpact = this.predictImpact(
      platform,
      currentStrategy,
      adaptedStrategy,
      performanceAnalysis
    )

    // Calculate confidence
    const confidence = this.calculateAdaptationConfidence(
      adaptationReasons,
      contentHistory.length,
      performanceAnalysis
    )

    const adaptation: StrategyAdaptation = {
      platform,
      currentStrategy,
      adaptedStrategy,
      adaptationReasons,
      expectedImpact,
      confidence,
      implementedAt: new Date()
    }

    // Store adaptation
    const adaptationKey = `${userId}_${platform}`
    this.activeAdaptations.set(adaptationKey, adaptation)

    console.log(`✓ Strategy adapted for ${platform} with ${confidence.toFixed(2)} confidence`)

    return adaptation
  }

  // Analyze performance against platform benchmarks
  private analyzePerformance(
    platform: PlatformType,
    metrics: PerformanceMetrics
  ): {
    engagementRate: number
    reachPerformance: number
    clickThroughRate: number
    performanceScore: number
    underperformingMetrics: string[]
  } {
    const benchmarks = PLATFORM_BENCHMARKS[platform]
    const underperformingMetrics: string[] = []

    const engagementRate = metrics.reach > 0 ? metrics.engagement / metrics.reach : 0
    const clickThroughRate = metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0

    // Compare against benchmarks
    if (engagementRate < benchmarks.engagementRate * 0.8) {
      underperformingMetrics.push('engagement_rate')
    }

    if (metrics.reach < benchmarks.reachPerPost * 0.7) {
      underperformingMetrics.push('reach')
    }

    if (clickThroughRate < benchmarks.clickThroughRate * 0.8) {
      underperformingMetrics.push('click_through_rate')
    }

    // Calculate overall performance score (0-100)
    const engagementScore = Math.min((engagementRate / benchmarks.engagementRate) * 100, 100)
    const reachScore = Math.min((metrics.reach / benchmarks.reachPerPost) * 100, 100)
    const ctrScore = Math.min((clickThroughRate / benchmarks.clickThroughRate) * 100, 100)

    const performanceScore = (engagementScore + reachScore + ctrScore) / 3

    return {
      engagementRate,
      reachPerformance: metrics.reach / benchmarks.reachPerPost,
      clickThroughRate,
      performanceScore,
      underperformingMetrics
    }
  }

  // Identify what needs to be adapted and why
  private identifyAdaptationNeeds(
    platform: PlatformType,
    performanceAnalysis: ReturnType<typeof this.analyzePerformance>,
    currentStrategy: PlatformStrategy
  ): AdaptationReason[] {
    const reasons: AdaptationReason[] = []
    const config = getPlatformConfig(platform)
    const benchmarks = PLATFORM_BENCHMARKS[platform]

    // Performance-based adaptations
    if (performanceAnalysis.underperformingMetrics.includes('engagement_rate')) {
      reasons.push({
        type: 'performance',
        description: 'Engagement rate below platform benchmark',
        metric: 'engagement_rate',
        currentValue: performanceAnalysis.engagementRate,
        targetValue: benchmarks.engagementRate,
        priority: 1
      })
    }

    if (performanceAnalysis.underperformingMetrics.includes('reach')) {
      reasons.push({
        type: 'performance',
        description: 'Reach below expected levels',
        metric: 'reach',
        currentValue: performanceAnalysis.reachPerformance,
        targetValue: 1.0,
        priority: 1
      })
    }

    if (performanceAnalysis.underperformingMetrics.includes('click_through_rate')) {
      reasons.push({
        type: 'performance',
        description: 'Click-through rate needs improvement',
        metric: 'click_through_rate',
        currentValue: performanceAnalysis.clickThroughRate,
        targetValue: benchmarks.clickThroughRate,
        priority: 2
      })
    }

    // Algorithm-specific adaptations
    if (config.algorithm.prioritizes.includes('engagement')) {
      reasons.push({
        type: 'algorithm',
        description: `${platform} algorithm prioritizes engagement - optimize for interactions`,
        metric: 'algorithm_alignment',
        currentValue: performanceAnalysis.engagementRate,
        targetValue: benchmarks.engagementRate * 1.2,
        priority: 1
      })
    }

    if (config.algorithm.prioritizes.includes('video_watch_time')) {
      reasons.push({
        type: 'algorithm',
        description: 'Platform algorithm favors video content with high watch time',
        metric: 'video_optimization',
        currentValue: 0,
        targetValue: 1,
        priority: 2
      })
    }

    if (config.algorithm.prioritizes.includes('professional_content')) {
      reasons.push({
        type: 'algorithm',
        description: 'Platform algorithm rewards professional, thought-leadership content',
        metric: 'content_quality',
        currentValue: 0,
        targetValue: 1,
        priority: 2
      })
    }

    // Posting frequency adaptation
    const currentFrequency = currentStrategy.postingFrequency
    const optimalFrequency = config.algorithm.optimalPostingFrequency

    if (currentFrequency < optimalFrequency.min) {
      reasons.push({
        type: 'algorithm',
        description: `Posting frequency below platform optimal (${optimalFrequency.min}-${optimalFrequency.max} per ${optimalFrequency.unit})`,
        metric: 'posting_frequency',
        currentValue: currentFrequency,
        targetValue: optimalFrequency.min,
        priority: 2
      })
    }

    // Sort by priority
    reasons.sort((a, b) => a.priority - b.priority)

    return reasons
  }

  // Generate adapted strategy based on identified needs
  private async generateAdaptedStrategy(
    platform: PlatformType,
    currentStrategy: PlatformStrategy,
    adaptationReasons: AdaptationReason[],
    contentHistory: PlatformContent[]
  ): Promise<PlatformStrategy> {
    const config = getPlatformConfig(platform)
    const adaptedStrategy: PlatformStrategy = { ...currentStrategy }

    // Adapt based on each reason
    for (const reason of adaptationReasons) {
      switch (reason.type) {
        case 'performance':
          if (reason.metric === 'engagement_rate') {
            // Increase engagement tactics
            adaptedStrategy.engagementTactics = [
              ...adaptedStrategy.engagementTactics,
              'Add more interactive elements (polls, questions)',
              'Use stronger emotional hooks',
              'Increase call-to-action frequency',
              'Respond to comments within first hour'
            ]

            // Adjust performance goals
            adaptedStrategy.performanceGoals.engagement = reason.targetValue * 1.1
          }

          if (reason.metric === 'reach') {
            // Optimize for reach
            adaptedStrategy.engagementTactics.push(
              'Post during peak audience hours',
              'Use trending hashtags strategically',
              'Cross-promote across platforms',
              'Leverage platform-specific features'
            )

            adaptedStrategy.performanceGoals.reach = Math.round(
              PLATFORM_BENCHMARKS[platform].reachPerPost * 1.2
            )
          }

          if (reason.metric === 'click_through_rate') {
            // Improve CTR
            adaptedStrategy.engagementTactics.push(
              'Craft more compelling headlines',
              'Add clear value propositions',
              'Use curiosity gaps effectively',
              'Optimize link placement'
            )

            adaptedStrategy.performanceGoals.clicks = Math.round(
              adaptedStrategy.performanceGoals.reach * reason.targetValue * 1.1
            )
          }
          break

        case 'algorithm':
          if (reason.metric === 'algorithm_alignment') {
            // Align with algorithm priorities
            const priorities = config.algorithm.prioritizes

            if (priorities.includes('engagement')) {
              adaptedStrategy.hashtagStrategy = [
                ...adaptedStrategy.hashtagStrategy,
                'engagement',
                'interactive'
              ]
            }

            if (priorities.includes('video_watch_time')) {
              adaptedStrategy.contentTypes = ['video', ...adaptedStrategy.contentTypes]
              adaptedStrategy.engagementTactics.push(
                'Create hook-driven video content',
                'Optimize for watch time retention'
              )
            }

            if (priorities.includes('professional_content')) {
              adaptedStrategy.engagementTactics.push(
                'Focus on thought leadership',
                'Share industry insights',
                'Provide actionable advice'
              )
            }

            if (priorities.includes('seo')) {
              adaptedStrategy.engagementTactics.push(
                'Optimize for search keywords',
                'Use descriptive titles',
                'Add comprehensive descriptions'
              )
            }
          }

          if (reason.metric === 'posting_frequency') {
            // Adjust posting frequency
            adaptedStrategy.postingFrequency = Math.round(
              (config.algorithm.optimalPostingFrequency.min +
                config.algorithm.optimalPostingFrequency.max) /
                2
            )
          }
          break

        case 'audience':
          // Adapt to audience behavior patterns
          adaptedStrategy.engagementTactics.push(
            'Tailor content to audience preferences',
            'Use audience-specific language',
            'Address audience pain points'
          )
          break

        case 'trend':
          // Leverage trending topics
          adaptedStrategy.engagementTactics.push(
            'Incorporate trending topics',
            'Use trending hashtags',
            'Ride viral waves'
          )
          break
      }
    }

    // Optimize posting times based on performance
    if (contentHistory.length > 0) {
      const optimalTimes = this.analyzeOptimalTimes(contentHistory)
      if (optimalTimes.length > 0) {
        adaptedStrategy.optimalTimes = optimalTimes
      }
    }

    // Remove duplicate tactics
    adaptedStrategy.engagementTactics = [...new Set(adaptedStrategy.engagementTactics)]
    adaptedStrategy.hashtagStrategy = [...new Set(adaptedStrategy.hashtagStrategy)]

    // Ensure we have meaningful additions
    if (adaptedStrategy.engagementTactics.length === currentStrategy.engagementTactics.length) {
      // Add at least one new tactic if none were added
      adaptedStrategy.engagementTactics.push('Monitor and respond to engagement quickly')
    }

    return adaptedStrategy
  }

  // Analyze content history to find optimal posting times
  private analyzeOptimalTimes(contentHistory: PlatformContent[]): Date[] {
    const performanceByHour: Map<number, { totalEngagement: number; count: number }> = new Map()

    // Aggregate performance by hour
    contentHistory.forEach((content) => {
      if (content.publishedTime && content.performanceMetrics) {
        const hour = content.publishedTime.getHours()
        const engagement = content.performanceMetrics.engagement

        const existing = performanceByHour.get(hour) || { totalEngagement: 0, count: 0 }
        performanceByHour.set(hour, {
          totalEngagement: existing.totalEngagement + engagement,
          count: existing.count + 1
        })
      }
    })

    // Calculate average engagement per hour
    const hourlyAverages: Array<{ hour: number; avgEngagement: number }> = []
    performanceByHour.forEach((data, hour) => {
      hourlyAverages.push({
        hour,
        avgEngagement: data.totalEngagement / data.count
      })
    })

    // Sort by engagement and take top 4 hours
    hourlyAverages.sort((a, b) => b.avgEngagement - a.avgEngagement)
    const topHours = hourlyAverages.slice(0, 4).map((h) => h.hour)

    // Generate dates for next 7 days at optimal hours
    const optimalTimes: Date[] = []
    const now = new Date()

    for (let day = 0; day < 7; day++) {
      for (const hour of topHours) {
        const date = new Date(now)
        date.setDate(date.getDate() + day)
        date.setHours(hour, 0, 0, 0)
        optimalTimes.push(date)
      }
    }

    return optimalTimes.slice(0, 7) // Return one per day
  }

  // Predict impact of strategy adaptation
  private predictImpact(
    platform: PlatformType,
    currentStrategy: PlatformStrategy,
    adaptedStrategy: PlatformStrategy,
    performanceAnalysis: ReturnType<typeof this.analyzePerformance>
  ): ImpactPrediction {
    // Calculate expected improvements based on adaptation changes
    const tacticsDifference =
      adaptedStrategy.engagementTactics.length - currentStrategy.engagementTactics.length
    const frequencyChange = adaptedStrategy.postingFrequency - currentStrategy.postingFrequency

    // Base improvements on current performance gap
    const performanceGap = 100 - performanceAnalysis.performanceScore
    const improvementPotential = performanceGap * 0.3 // Conservative 30% of gap

    // Calculate specific improvements (ensure non-negative)
    const engagementIncrease = Math.max(
      0,
      Math.min(improvementPotential + tacticsDifference * 2, performanceGap * 0.5)
    )

    const reachIncrease = Math.max(
      0,
      Math.min(improvementPotential * 0.8 + Math.abs(frequencyChange) * 5, performanceGap * 0.4)
    )

    const conversionIncrease = Math.max(0, Math.min(engagementIncrease * 0.6, performanceGap * 0.3))

    // Time to impact varies by platform
    const config = getPlatformConfig(platform)
    const timeToImpact = config.algorithm.engagementWindow * 2 // 2x engagement window

    // Confidence based on data quality and adaptation magnitude
    const confidence = Math.min(
      0.7 + (tacticsDifference > 0 ? 0.1 : 0) + (Math.abs(frequencyChange) > 0 ? 0.1 : 0),
      0.95
    )

    return {
      engagementIncrease,
      reachIncrease,
      conversionIncrease,
      timeToImpact,
      confidence
    }
  }

  // Calculate confidence in adaptation recommendations
  private calculateAdaptationConfidence(
    adaptationReasons: AdaptationReason[],
    contentHistoryLength: number,
    performanceAnalysis: ReturnType<typeof this.analyzePerformance>
  ): number {
    let confidence = 0.5 // Base confidence

    // More data = higher confidence
    if (contentHistoryLength > 20) confidence += 0.2
    else if (contentHistoryLength > 10) confidence += 0.15
    else if (contentHistoryLength > 5) confidence += 0.1

    // Clear performance issues = higher confidence in adaptation
    if (performanceAnalysis.underperformingMetrics.length > 0) {
      confidence += 0.1 * performanceAnalysis.underperformingMetrics.length
    }

    // Multiple adaptation reasons = higher confidence
    if (adaptationReasons.length > 2) confidence += 0.1

    // High priority reasons = higher confidence
    const highPriorityReasons = adaptationReasons.filter((r) => r.priority === 1)
    if (highPriorityReasons.length > 0) {
      confidence += 0.05 * highPriorityReasons.length
    }

    return Math.min(confidence, 0.95) // Cap at 95%
  }

  // Adapt strategies for all platforms based on cross-platform performance
  async adaptCrossPlatformStrategies(
    userId: string,
    crossPlatformMetrics: CrossPlatformMetrics,
    platformContents: PlatformContent[]
  ): Promise<Map<PlatformType, StrategyAdaptation>> {
    const adaptations = new Map<PlatformType, StrategyAdaptation>()

    // Group content by platform
    const contentByPlatform = new Map<PlatformType, PlatformContent[]>()
    platformContents.forEach((content) => {
      const existing = contentByPlatform.get(content.platform) || []
      contentByPlatform.set(content.platform, [...existing, content])
    })

    // Adapt strategy for each platform
    for (const [platform, contents] of contentByPlatform) {
      const platformMetrics = crossPlatformMetrics.platformBreakdown[platform]
      if (!platformMetrics) continue

      // Get current strategy (or generate default)
      const { multiPlatformManager } = await import('./multi-platform-manager')
      const currentStrategy = await multiPlatformManager.generatePlatformStrategy(
        platform,
        userId
      )

      // Adapt strategy
      const adaptation = await this.adaptStrategy(
        userId,
        platform,
        currentStrategy,
        platformMetrics,
        contents
      )

      adaptations.set(platform, adaptation)
    }

    return adaptations
  }

  // Test strategy adaptation with A/B testing
  async testStrategyAdaptation(
    userId: string,
    platform: PlatformType,
    originalStrategy: PlatformStrategy,
    adaptedStrategy: PlatformStrategy,
    testDuration: number = 168 // 7 days in hours
  ): Promise<StrategyTestResult> {
    const testId = `${userId}_${platform}_${Date.now()}`

    console.log(`Starting A/B test for ${platform} strategy adaptation...`)

    // In production, this would run actual A/B tests
    // For now, simulate test results based on predicted impact

    // Simulate performance improvement (would be real data in production)
    const performanceImprovement = Math.random() * 30 + 10 // 10-40% improvement

    // Calculate statistical significance (simplified)
    const statisticalSignificance = Math.min(
      0.7 + (testDuration / 168) * 0.2 + (performanceImprovement / 100) * 0.1,
      0.99
    )

    // Determine recommendation
    let recommendation: 'adopt' | 'reject' | 'continue_testing' = 'continue_testing'

    if (statisticalSignificance > 0.95 && performanceImprovement > 15) {
      recommendation = 'adopt'
    } else if (statisticalSignificance > 0.9 && performanceImprovement < 5) {
      recommendation = 'reject'
    }

    const result: StrategyTestResult = {
      strategyId: testId,
      platform,
      testDuration,
      performanceImprovement,
      statisticalSignificance,
      recommendation
    }

    this.strategyTests.set(testId, result)

    return result
  }

  // Detect algorithm changes and adapt accordingly
  async detectAlgorithmChanges(
    platform: PlatformType,
    recentPerformance: PerformanceMetrics[],
    historicalPerformance: PerformanceMetrics[]
  ): Promise<AlgorithmUpdate | null> {
    if (recentPerformance.length < 5 || historicalPerformance.length < 10) {
      return null // Not enough data
    }

    // Calculate average metrics for recent vs historical
    const recentAvg = this.calculateAverageMetrics(recentPerformance)
    const historicalAvg = this.calculateAverageMetrics(historicalPerformance)

    // Detect significant changes (>30% difference)
    const engagementChange =
      (recentAvg.engagement - historicalAvg.engagement) / historicalAvg.engagement
    const reachChange = (recentAvg.reach - historicalAvg.reach) / historicalAvg.reach

    if (Math.abs(engagementChange) > 0.3 || Math.abs(reachChange) > 0.3) {
      const updateType: AlgorithmUpdate['updateType'] =
        engagementChange < -0.3 ? 'penalty' : 'prioritization'

      return {
        platform,
        updateType,
        description: `Detected ${Math.abs(engagementChange * 100).toFixed(1)}% change in engagement patterns`,
        detectedAt: new Date(),
        adaptationRequired: true,
        suggestedChanges: [
          'Review recent platform algorithm announcements',
          'Analyze top-performing content for pattern changes',
          'Adjust content strategy to align with new algorithm priorities',
          'Test different content formats and posting times'
        ]
      }
    }

    return null
  }

  // Calculate average metrics from array
  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const sum = metrics.reduce(
      (acc, m) => ({
        views: acc.views + m.views,
        likes: acc.likes + m.likes,
        comments: acc.comments + m.comments,
        shares: acc.shares + m.shares,
        clicks: acc.clicks + m.clicks,
        engagement: acc.engagement + m.engagement,
        reach: acc.reach + m.reach,
        impressions: acc.impressions + m.impressions,
        lastUpdated: new Date()
      }),
      {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        engagement: 0,
        reach: 0,
        impressions: 0,
        lastUpdated: new Date()
      }
    )

    const count = metrics.length

    return {
      views: sum.views / count,
      likes: sum.likes / count,
      comments: sum.comments / count,
      shares: sum.shares / count,
      clicks: sum.clicks / count,
      engagement: sum.engagement / count,
      reach: sum.reach / count,
      impressions: sum.impressions / count,
      lastUpdated: new Date()
    }
  }

  // Get active adaptation for a platform
  getActiveAdaptation(userId: string, platform: PlatformType): StrategyAdaptation | undefined {
    return this.activeAdaptations.get(`${userId}_${platform}`)
  }

  // Get all active adaptations for a user
  getUserAdaptations(userId: string): StrategyAdaptation[] {
    const adaptations: StrategyAdaptation[] = []

    this.activeAdaptations.forEach((adaptation, key) => {
      if (key.startsWith(userId)) {
        adaptations.push(adaptation)
      }
    })

    return adaptations
  }

  // Get strategy test results
  getStrategyTestResult(testId: string): StrategyTestResult | undefined {
    return this.strategyTests.get(testId)
  }

  // Generate strategy adaptation report
  async generateAdaptationReport(
    userId: string,
    platform: PlatformType,
    timeRange: { start: Date; end: Date }
  ): Promise<{
    platform: PlatformType
    adaptations: StrategyAdaptation[]
    performanceImpact: {
      engagementChange: number
      reachChange: number
      conversionChange: number
    }
    recommendations: string[]
  }> {
    const adaptation = this.getActiveAdaptation(userId, platform)

    if (!adaptation) {
      return {
        platform,
        adaptations: [],
        performanceImpact: {
          engagementChange: 0,
          reachChange: 0,
          conversionChange: 0
        },
        recommendations: ['No active strategy adaptations for this platform']
      }
    }

    // Calculate actual performance impact (would use real data in production)
    const performanceImpact = {
      engagementChange: adaptation.expectedImpact.engagementIncrease * 0.8, // 80% of predicted
      reachChange: adaptation.expectedImpact.reachIncrease * 0.75,
      conversionChange: adaptation.expectedImpact.conversionIncrease * 0.7
    }

    // Generate recommendations
    const recommendations: string[] = []

    if (performanceImpact.engagementChange > 10) {
      recommendations.push('Strategy adaptation is working well - continue current approach')
    } else if (performanceImpact.engagementChange < 5) {
      recommendations.push('Consider additional strategy adjustments or A/B testing')
    }

    if (adaptation.confidence < 0.7) {
      recommendations.push('Gather more performance data to increase adaptation confidence')
    }

    recommendations.push(
      `Monitor performance for ${adaptation.expectedImpact.timeToImpact} hours to see full impact`
    )

    return {
      platform,
      adaptations: [adaptation],
      performanceImpact,
      recommendations
    }
  }
}

export const strategyAdapter = StrategyAdapter.getInstance()
