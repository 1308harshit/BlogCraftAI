// Platform-Specific Strategy Adaptation System
// Automatically adjusts content strategies based on performance data and algorithm changes

import {
  PlatformType,
  PlatformStrategy,
  PerformanceMetrics,
  CrossPlatformMetrics,
  PlatformContent
} from './types'
import { getPlatformConfig } from './platform-configs'
import { performanceTracker } from './performance-tracker'

export type AdaptationReason = 
  | 'underperformance'
  | 'algorithm_change'
  | 'audience_shift'
  | 'competitive_pressure'
  | 'seasonal_trend'
  | 'content_fatigue'

export interface StrategyAdaptation {
  platform: PlatformType
  originalStrategy: PlatformStrategy
  adaptedStrategy: PlatformStrategy
  reason: AdaptationReason
  confidence: number
  expectedImpact: ImpactPrediction
  changes: string[]
  implementationDate: Date
}

export interface ImpactPrediction {
  engagementChange: number // percentage
  reachChange: number // percentage
  conversionChange: number // percentage
  confidence: number
  timeToImpact: number // days
}

export interface StrategyTestResult {
  platform: PlatformType
  testId: string
  originalStrategy: PlatformStrategy
  testStrategy: PlatformStrategy
  startDate: Date
  endDate: Date
  originalPerformance: PerformanceMetrics
  testPerformance: PerformanceMetrics
  winner: 'original' | 'test' | 'inconclusive'
  improvementPercentage: number
  statisticalSignificance: number
}

export interface AlgorithmUpdate {
  platform: PlatformType
  detectedDate: Date
  changeType: 'major' | 'minor' | 'suspected'
  affectedMetrics: string[]
  confidence: number
  recommendedActions: string[]
}

export class StrategyAdapter {
  private static instance: StrategyAdapter

  static getInstance(): StrategyAdapter {
    if (!StrategyAdapter.instance) {
      StrategyAdapter.instance = new StrategyAdapter()
    }
    return StrategyAdapter.instance
  }

  // Main method: Adapt strategy based on performance data
  async adaptStrategy(
    userId: string,
    platform: PlatformType,
    currentStrategy: PlatformStrategy,
    performanceData: PerformanceMetrics,
    contentHistory: PlatformContent[]
  ): Promise<StrategyAdaptation> {
    console.log(`Adapting strategy for ${platform}...`)

    // Analyze performance to determine if adaptation is needed
    const analysis = await this.analyzePerformance(platform, performanceData, contentHistory)
    
    // Determine adaptation reason
    const reason = this.determineAdaptationReason(analysis)
    
    // Generate adapted strategy
    const adaptedStrategy = await this.generateAdaptedStrategy(
      platform,
      currentStrategy,
      analysis,
      reason
    )
    
    // Predict impact of adaptation
    const expectedImpact = this.predictImpact(
      platform,
      currentStrategy,
      adaptedStrategy,
      performanceData
    )
    
    // Calculate confidence in adaptation
    const confidence = this.calculateAdaptationConfidence(analysis, contentHistory.length)
    
    // Identify specific changes
    const changes = this.identifyChanges(currentStrategy, adaptedStrategy)

    return {
      platform,
      originalStrategy: currentStrategy,
      adaptedStrategy,
      reason,
      confidence,
      expectedImpact,
      changes,
      implementationDate: new Date()
    }
  }

  // Analyze performance to identify issues and opportunities
  private async analyzePerformance(
    platform: PlatformType,
    performanceData: PerformanceMetrics,
    contentHistory: PlatformContent[]
  ): Promise<any> {
    const config = getPlatformConfig(platform)
    
    // Calculate engagement rate
    const engagementRate = performanceData.reach > 0 
      ? performanceData.engagement / performanceData.reach 
      : 0
    
    // Calculate average performance from history
    const avgEngagement = contentHistory.length > 0
      ? contentHistory.reduce((sum, c) => sum + (c.performanceMetrics?.engagement || 0), 0) / contentHistory.length
      : 0
    
    const avgReach = contentHistory.length > 0
      ? contentHistory.reduce((sum, c) => sum + (c.performanceMetrics?.reach || 0), 0) / contentHistory.length
      : 0

    // Identify performance trends
    const isUnderperforming = engagementRate < 0.02 || performanceData.engagement < avgEngagement * 0.7
    const isOverperforming = engagementRate > 0.05 || performanceData.engagement > avgEngagement * 1.5
    
    // Check for content fatigue (declining performance over time)
    const recentContent = contentHistory.slice(-10)
    const olderContent = contentHistory.slice(-20, -10)
    
    const recentAvgEngagement = recentContent.length > 0
      ? recentContent.reduce((sum, c) => sum + (c.performanceMetrics?.engagement || 0), 0) / recentContent.length
      : 0
    
    const olderAvgEngagement = olderContent.length > 0
      ? olderContent.reduce((sum, c) => sum + (c.performanceMetrics?.engagement || 0), 0) / olderContent.length
      : 0
    
    const hasFatigue = recentAvgEngagement < olderAvgEngagement * 0.8

    return {
      engagementRate,
      avgEngagement,
      avgReach,
      isUnderperforming,
      isOverperforming,
      hasFatigue,
      recentTrend: recentAvgEngagement > olderAvgEngagement ? 'improving' : 'declining',
      contentCount: contentHistory.length
    }
  }

  // Determine the primary reason for adaptation
  private determineAdaptationReason(analysis: any): AdaptationReason {
    if (analysis.hasFatigue) {
      return 'content_fatigue'
    }
    
    if (analysis.isUnderperforming) {
      return 'underperformance'
    }
    
    if (analysis.recentTrend === 'declining' && analysis.contentCount > 20) {
      return 'algorithm_change'
    }
    
    return 'audience_shift'
  }

  // Generate adapted strategy based on analysis
  private async generateAdaptedStrategy(
    platform: PlatformType,
    currentStrategy: PlatformStrategy,
    analysis: any,
    reason: AdaptationReason
  ): Promise<PlatformStrategy> {
    const config = getPlatformConfig(platform)
    const adaptedStrategy = { ...currentStrategy }

    // Apply platform-specific adaptations based on reason
    switch (reason) {
      case 'underperformance':
        adaptedStrategy.postingFrequency = Math.max(1, currentStrategy.postingFrequency - 1)
        adaptedStrategy.engagementTactics = [
          ...currentStrategy.engagementTactics,
          'Increase visual content',
          'Add more interactive elements',
          'Test different posting times'
        ]
        break

      case 'content_fatigue':
        adaptedStrategy.contentTypes = this.diversifyContentTypes(platform, currentStrategy.contentTypes)
        adaptedStrategy.engagementTactics = [
          'Introduce new content formats',
          'Experiment with trending topics',
          'Refresh brand voice and style'
        ]
        break

      case 'algorithm_change':
        adaptedStrategy.engagementTactics = this.getAlgorithmSpecificTactics(platform)
        adaptedStrategy.postingFrequency = config.algorithm.optimalPostingFrequency.max
        break

      case 'audience_shift':
        adaptedStrategy.optimalTimes = await this.recalculateOptimalTimes(platform)
        adaptedStrategy.engagementTactics = [
          'Analyze audience demographics',
          'Adjust content tone and style',
          'Test new audience segments'
        ]
        break

      default:
        // Minor optimizations
        adaptedStrategy.performanceGoals = {
          engagement: currentStrategy.performanceGoals.engagement * 1.2,
          reach: currentStrategy.performanceGoals.reach * 1.2,
          clicks: currentStrategy.performanceGoals.clicks * 1.2
        }
    }

    return adaptedStrategy
  }

  // Diversify content types to combat fatigue
  private diversifyContentTypes(platform: PlatformType, currentTypes: any[]): any[] {
    const config = getPlatformConfig(platform)
    const allFormats = config.supportedFormats
    
    // Add formats not currently in use
    const newFormats = allFormats.filter(f => !currentTypes.includes(f))
    
    return [...currentTypes, ...newFormats.slice(0, 2)]
  }

  // Get algorithm-specific tactics for a platform
  private getAlgorithmSpecificTactics(platform: PlatformType): string[] {
    const config = getPlatformConfig(platform)
    const tactics: string[] = []

    config.algorithm.prioritizes.forEach(factor => {
      switch (factor) {
        case 'engagement':
          tactics.push('Add compelling CTAs', 'Ask questions to drive comments')
          break
        case 'video_watch_time':
          tactics.push('Create hook in first 3 seconds', 'Optimize video length for retention')
          break
        case 'professional_content':
          tactics.push('Share industry insights', 'Provide actionable advice')
          break
        case 'seo':
          tactics.push('Optimize keywords', 'Improve meta descriptions')
          break
        case 'recency':
          tactics.push('Post during peak hours', 'Leverage trending topics')
          break
      }
    })

    return tactics.slice(0, 5)
  }

  // Recalculate optimal posting times
  private async recalculateOptimalTimes(platform: PlatformType): Promise<Date[]> {
    const config = getPlatformConfig(platform)
    const now = new Date()
    const optimalTimes: Date[] = []
    
    // Generate times for next 7 days using platform defaults
    for (let i = 0; i < 7; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      
      // Use best hours from config
      config.optimalTiming.bestHours.forEach(hour => {
        const time = new Date(date)
        time.setHours(hour, 0, 0, 0)
        optimalTimes.push(time)
      })
    }

    return optimalTimes.slice(0, 7)
  }

  // Predict impact of strategy adaptation
  private predictImpact(
    platform: PlatformType,
    originalStrategy: PlatformStrategy,
    adaptedStrategy: PlatformStrategy,
    currentPerformance: PerformanceMetrics
  ): ImpactPrediction {
    // Calculate expected changes based on adaptation type
    let engagementChange = 0
    let reachChange = 0
    let conversionChange = 0

    // Posting frequency impact
    const freqChange = adaptedStrategy.postingFrequency - originalStrategy.postingFrequency
    if (freqChange > 0) {
      reachChange += freqChange * 10 // 10% reach increase per additional post
    }

    // Content type diversification impact
    const newTypes = adaptedStrategy.contentTypes.length - originalStrategy.contentTypes.length
    if (newTypes > 0) {
      engagementChange += newTypes * 15 // 15% engagement boost per new format
    }

    // Engagement tactics impact
    const newTactics = adaptedStrategy.engagementTactics.length - originalStrategy.engagementTactics.length
    if (newTactics > 0) {
      engagementChange += newTactics * 5 // 5% per new tactic
      conversionChange += newTactics * 3 // 3% conversion improvement
    }

    // Calculate confidence based on historical data availability
    const confidence = Math.min(0.85, 0.5 + (currentPerformance.reach / 10000) * 0.35)

    return {
      engagementChange: Math.min(50, engagementChange), // Cap at 50%
      reachChange: Math.min(40, reachChange), // Cap at 40%
      conversionChange: Math.min(30, conversionChange), // Cap at 30%
      confidence,
      timeToImpact: 7 // Days to see results
    }
  }

  // Calculate confidence in adaptation recommendation
  private calculateAdaptationConfidence(analysis: any, dataPoints: number): number {
    let confidence = 0.5 // Base confidence

    // More data = higher confidence
    if (dataPoints > 50) confidence += 0.2
    else if (dataPoints > 20) confidence += 0.1

    // Clear trends = higher confidence
    if (analysis.isUnderperforming || analysis.isOverperforming) {
      confidence += 0.15
    }

    // Content fatigue is a strong signal
    if (analysis.hasFatigue) {
      confidence += 0.15
    }

    return Math.min(0.95, confidence)
  }

  // Identify specific changes between strategies
  private identifyChanges(original: PlatformStrategy, adapted: PlatformStrategy): string[] {
    const changes: string[] = []

    if (original.postingFrequency !== adapted.postingFrequency) {
      changes.push(
        `Posting frequency: ${original.postingFrequency} → ${adapted.postingFrequency} posts per day`
      )
    }

    if (original.contentTypes.length !== adapted.contentTypes.length) {
      const newTypes = adapted.contentTypes.filter(t => !original.contentTypes.includes(t))
      if (newTypes.length > 0) {
        changes.push(`Added content types: ${newTypes.join(', ')}`)
      }
    }

    if (original.engagementTactics.length !== adapted.engagementTactics.length) {
      const newTactics = adapted.engagementTactics.filter(t => !original.engagementTactics.includes(t))
      if (newTactics.length > 0) {
        changes.push(`New engagement tactics: ${newTactics.slice(0, 3).join(', ')}`)
      }
    }

    if (JSON.stringify(original.performanceGoals) !== JSON.stringify(adapted.performanceGoals)) {
      changes.push('Updated performance goals')
    }

    return changes
  }

  // Adapt strategies across all platforms based on cross-platform metrics
  async adaptCrossPlatformStrategies(
    userId: string,
    crossPlatformMetrics: CrossPlatformMetrics,
    platformContents: PlatformContent[]
  ): Promise<Map<PlatformType, StrategyAdaptation>> {
    const adaptations = new Map<PlatformType, StrategyAdaptation>()

    // Group content by platform
    const contentByPlatform = new Map<PlatformType, PlatformContent[]>()
    platformContents.forEach(content => {
      if (!contentByPlatform.has(content.platform)) {
        contentByPlatform.set(content.platform, [])
      }
      contentByPlatform.get(content.platform)!.push(content)
    })

    // Adapt strategy for each platform
    for (const [platform, contents] of contentByPlatform) {
      const platformMetrics = crossPlatformMetrics.platformBreakdown[platform]
      if (!platformMetrics) continue

      // Get current strategy (would come from database in production)
      const currentStrategy = await this.getCurrentStrategy(userId, platform)
      
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

  // Get current strategy for a platform (mock implementation)
  private async getCurrentStrategy(userId: string, platform: PlatformType): Promise<PlatformStrategy> {
    const config = getPlatformConfig(platform)
    
    // In production, this would fetch from database
    // For now, return default strategy
    return {
      platform,
      contentTypes: config.supportedFormats.slice(0, 2),
      postingFrequency: config.algorithm.optimalPostingFrequency.min,
      optimalTimes: [],
      hashtagStrategy: config.algorithm.prioritizes.slice(0, 3),
      engagementTactics: [
        'Post during peak hours',
        'Use platform-specific features',
        'Engage with comments quickly'
      ],
      performanceGoals: {
        engagement: 0.03,
        reach: 5000,
        clicks: 100
      }
    }
  }

  // Test strategy adaptation with A/B testing
  async testStrategyAdaptation(
    userId: string,
    platform: PlatformType,
    originalStrategy: PlatformStrategy,
    adaptedStrategy: PlatformStrategy,
    testDuration: number = 14 // days
  ): Promise<StrategyTestResult> {
    const testId = `test_${platform}_${Date.now()}`
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + testDuration * 24 * 60 * 60 * 1000)

    console.log(`Starting strategy test for ${platform} (${testDuration} days)`)

    // In production, this would:
    // 1. Split traffic between original and adapted strategies
    // 2. Track performance for both
    // 3. Calculate statistical significance
    // 4. Determine winner

    // Mock implementation
    const originalPerformance: PerformanceMetrics = {
      views: 10000,
      likes: 300,
      comments: 50,
      shares: 25,
      clicks: 150,
      engagement: 525,
      reach: 8000,
      impressions: 12000,
      lastUpdated: new Date()
    }

    const testPerformance: PerformanceMetrics = {
      views: 12000,
      likes: 400,
      comments: 70,
      shares: 35,
      clicks: 200,
      engagement: 705,
      reach: 10000,
      impressions: 15000,
      lastUpdated: new Date()
    }

    const originalEngagementRate = originalPerformance.engagement / originalPerformance.reach
    const testEngagementRate = testPerformance.engagement / testPerformance.reach
    
    const improvementPercentage = ((testEngagementRate - originalEngagementRate) / originalEngagementRate) * 100
    
    const winner = improvementPercentage > 10 ? 'test' : 
                   improvementPercentage < -10 ? 'original' : 
                   'inconclusive'

    return {
      platform,
      testId,
      originalStrategy,
      testStrategy: adaptedStrategy,
      startDate,
      endDate,
      originalPerformance,
      testPerformance,
      winner,
      improvementPercentage,
      statisticalSignificance: 0.95
    }
  }

  // Detect algorithm changes on a platform
  async detectAlgorithmChanges(
    platform: PlatformType,
    recentPerformance: PerformanceMetrics[],
    historicalPerformance: PerformanceMetrics[]
  ): Promise<AlgorithmUpdate | null> {
    if (recentPerformance.length < 5 || historicalPerformance.length < 10) {
      return null // Not enough data
    }

    // Calculate average metrics
    const recentAvg = this.calculateAverageMetrics(recentPerformance)
    const historicalAvg = this.calculateAverageMetrics(historicalPerformance)

    // Detect significant changes
    const affectedMetrics: string[] = []
    let maxChange = 0

    const metrics = ['engagement', 'reach', 'views', 'clicks'] as const
    metrics.forEach(metric => {
      const change = Math.abs((recentAvg[metric] - historicalAvg[metric]) / historicalAvg[metric])
      if (change > 0.3) { // 30% change threshold
        affectedMetrics.push(metric)
        maxChange = Math.max(maxChange, change)
      }
    })

    if (affectedMetrics.length === 0) {
      return null // No significant changes detected
    }

    // Determine change type
    const changeType: 'major' | 'minor' | 'suspected' = 
      maxChange > 0.5 ? 'major' :
      maxChange > 0.3 ? 'minor' :
      'suspected'

    // Generate recommendations
    const recommendedActions = this.generateAlgorithmChangeRecommendations(
      platform,
      affectedMetrics,
      recentAvg,
      historicalAvg
    )

    return {
      platform,
      detectedDate: new Date(),
      changeType,
      affectedMetrics,
      confidence: Math.min(0.9, 0.5 + maxChange),
      recommendedActions
    }
  }

  // Calculate average metrics from array
  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const sum = metrics.reduce((acc, m) => ({
      views: acc.views + m.views,
      likes: acc.likes + m.likes,
      comments: acc.comments + m.comments,
      shares: acc.shares + m.shares,
      clicks: acc.clicks + m.clicks,
      engagement: acc.engagement + m.engagement,
      reach: acc.reach + m.reach,
      impressions: acc.impressions + m.impressions,
      lastUpdated: new Date()
    }), {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      lastUpdated: new Date()
    })

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

  // Generate recommendations for algorithm changes
  private generateAlgorithmChangeRecommendations(
    platform: PlatformType,
    affectedMetrics: string[],
    recentAvg: PerformanceMetrics,
    historicalAvg: PerformanceMetrics
  ): string[] {
    const recommendations: string[] = []
    const config = getPlatformConfig(platform)

    affectedMetrics.forEach(metric => {
      const isDecreasing = recentAvg[metric as keyof PerformanceMetrics] < historicalAvg[metric as keyof PerformanceMetrics]

      if (metric === 'engagement' && isDecreasing) {
        recommendations.push('Increase interactive content elements')
        recommendations.push('Test new content formats prioritized by the algorithm')
      }

      if (metric === 'reach' && isDecreasing) {
        recommendations.push('Adjust posting times to match new audience patterns')
        recommendations.push('Increase posting frequency within platform limits')
      }

      if (metric === 'views' && isDecreasing) {
        recommendations.push('Optimize thumbnails and preview content')
        recommendations.push('Improve content hooks in first few seconds')
      }
    })

    // Add platform-specific recommendations
    config.algorithm.prioritizes.slice(0, 2).forEach(factor => {
      recommendations.push(`Focus on ${factor} as prioritized by ${platform} algorithm`)
    })

    return recommendations.slice(0, 5)
  }

  // Generate comprehensive adaptation report
  async generateAdaptationReport(
    userId: string,
    platform: PlatformType,
    timeRange: { start: Date; end: Date }
  ): Promise<{
    platform: PlatformType
    timeRange: { start: Date; end: Date }
    adaptations: StrategyAdaptation[]
    testResults: StrategyTestResult[]
    algorithmUpdates: AlgorithmUpdate[]
    overallImpact: {
      engagementImprovement: number
      reachImprovement: number
      successRate: number
    }
    recommendations: string[]
  }> {
    // In production, this would fetch from database
    // Mock implementation for now
    
    return {
      platform,
      timeRange,
      adaptations: [],
      testResults: [],
      algorithmUpdates: [],
      overallImpact: {
        engagementImprovement: 0,
        reachImprovement: 0,
        successRate: 0
      },
      recommendations: [
        'Continue monitoring performance trends',
        'Test new content formats regularly',
        'Stay updated on platform algorithm changes'
      ]
    }
  }
}

export const strategyAdapter = StrategyAdapter.getInstance()
