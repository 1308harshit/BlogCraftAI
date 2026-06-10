// Real-Time Cross-Platform Performance Tracking System
// Monitors content performance across all 8 platforms with consolidated analytics

import {
  PlatformType,
  PerformanceMetrics,
  CrossPlatformMetrics,
  PlatformContent
} from './types'
import {
  getRedisClient,
  CACHE_KEYS,
  CACHE_TTL,
  setRealTimeMetrics,
  getRealTimeMetrics,
  setCachedPerformanceData,
  getCachedPerformanceData
} from '../database/redis'

export interface PlatformMetricsCollector {
  platform: PlatformType
  collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics>
  getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]>
  getRateLimits(): RateLimitInfo
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface RateLimitInfo {
  requestsPerHour: number
  requestsPerDay: number
  currentUsage: number
  resetTime: Date
}

export interface PerformanceInsight {
  type: 'success' | 'warning' | 'opportunity' | 'alert'
  platform?: PlatformType
  title: string
  description: string
  metric: string
  value: number
  benchmark?: number
  recommendation: string
  priority: number
}

export interface ConsolidatedReport {
  contentId: string
  timeRange: TimeRange
  overallMetrics: CrossPlatformMetrics
  platformInsights: PerformanceInsight[]
  trendAnalysis: TrendAnalysis
  recommendations: string[]
  generatedAt: Date
}

export interface TrendAnalysis {
  growthRate: number
  momentum: 'accelerating' | 'steady' | 'declining'
  peakPlatform: PlatformType
  underperformingPlatforms: PlatformType[]
  projectedReach: number
}

// Platform-specific metric collectors
class TwitterMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'twitter'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    // In production, this would call Twitter API
    // For now, simulate with realistic data structure
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0, // retweets
      clicks: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      retweets: 0,
      lastUpdated: new Date()
    }
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 300,
      requestsPerDay: 10000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class LinkedInMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'linkedin'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
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
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 100,
      requestsPerDay: 5000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class InstagramMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'instagram'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      saves: 0,
      lastUpdated: new Date()
    }
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 200,
      requestsPerDay: 5000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class YouTubeMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'youtube'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
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
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 10000,
      requestsPerDay: 1000000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class TikTokMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'tiktok'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
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
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 100,
      requestsPerDay: 10000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class MediumMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'medium'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
      views: 0,
      likes: 0, // claps
      comments: 0,
      shares: 0,
      clicks: 0,
      engagement: 0,
      reach: 0,
      impressions: 0,
      lastUpdated: new Date()
    }
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 60,
      requestsPerDay: 1000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class FacebookMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'facebook'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    return {
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
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 200,
      requestsPerDay: 5000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

class BlogMetricsCollector implements PlatformMetricsCollector {
  platform: PlatformType = 'blog'

  async collectMetrics(contentId: string, platformContentId: string): Promise<PerformanceMetrics> {
    // For blog, metrics would come from Google Analytics or similar
    return {
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
  }

  async getHistoricalMetrics(contentId: string, timeRange: TimeRange): Promise<PerformanceMetrics[]> {
    return []
  }

  getRateLimits(): RateLimitInfo {
    return {
      requestsPerHour: 1000,
      requestsPerDay: 50000,
      currentUsage: 0,
      resetTime: new Date(Date.now() + 3600000)
    }
  }
}

// Main Performance Tracker class
export class PerformanceTracker {
  private static instance: PerformanceTracker
  private collectors: Map<PlatformType, PlatformMetricsCollector>
  private redis = getRedisClient()

  private constructor() {
    this.collectors = new Map([
      ['twitter', new TwitterMetricsCollector()],
      ['linkedin', new LinkedInMetricsCollector()],
      ['instagram', new InstagramMetricsCollector()],
      ['youtube', new YouTubeMetricsCollector()],
      ['tiktok', new TikTokMetricsCollector()],
      ['medium', new MediumMetricsCollector()],
      ['facebook', new FacebookMetricsCollector()],
      ['blog', new BlogMetricsCollector()]
    ])
  }

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Collect real-time metrics for a specific platform
  async collectPlatformMetrics(
    contentId: string,
    platform: PlatformType,
    platformContentId: string
  ): Promise<PerformanceMetrics> {
    const collector = this.collectors.get(platform)
    if (!collector) {
      throw new Error(`No collector found for platform: ${platform}`)
    }

    try {
      const metrics = await collector.collectMetrics(contentId, platformContentId)
      
      // Cache metrics in Redis
      await setRealTimeMetrics(platformContentId, {
        views: metrics.views ?? 0,
        engagement: metrics.engagement ?? 0,
        shares: metrics.shares ?? 0,
        updatedAt: new Date().toISOString(),
      })

      return metrics
    } catch (error) {
      console.error(`Error collecting metrics for ${platform}:`, error)
      throw error
    }
  }

  // Collect metrics across all platforms for a content piece
  async collectCrossPlatformMetrics(
    contentId: string,
    platformContents: PlatformContent[]
  ): Promise<CrossPlatformMetrics> {
    const platformBreakdown: Record<string, PerformanceMetrics> = {}
    let totalReach = 0
    let totalEngagement = 0
    let totalClicks = 0

    // Collect metrics from each platform in parallel
    const metricsPromises = platformContents.map(async (pc) => {
      if (!pc.publishedTime || pc.status !== 'published') {
        return null
      }

      try {
        const metrics = await this.collectPlatformMetrics(
          contentId,
          pc.platform,
          pc.id || `${pc.platform}_${contentId}`
        )
        return { platform: pc.platform, metrics }
      } catch (error) {
        console.error(`Failed to collect metrics for ${pc.platform}:`, error)
        return null
      }
    })

    const results = await Promise.all(metricsPromises)

    // Aggregate metrics
    results.forEach((result) => {
      if (result) {
        platformBreakdown[result.platform] = result.metrics
        totalReach += result.metrics.reach
        totalEngagement += result.metrics.engagement
        totalClicks += result.metrics.clicks
      }
    })

    // Determine best and worst performing platforms
    const platforms = Object.keys(platformBreakdown) as PlatformType[]
    let bestPerformingPlatform: PlatformType = platforms[0] || 'twitter'
    let worstPerformingPlatform: PlatformType = platforms[0] || 'twitter'
    let maxEngagement = 0
    let minEngagement = Infinity

    platforms.forEach((platform) => {
      const engagement = platformBreakdown[platform].engagement
      if (engagement > maxEngagement) {
        maxEngagement = engagement
        bestPerformingPlatform = platform
      }
      if (engagement < minEngagement) {
        minEngagement = engagement
        worstPerformingPlatform = platform
      }
    })

    const crossPlatformMetrics: CrossPlatformMetrics = {
      contentId,
      totalReach,
      totalEngagement,
      totalClicks,
      platformBreakdown,
      bestPerformingPlatform,
      worstPerformingPlatform,
      overallEngagementRate: totalReach > 0 ? totalEngagement / totalReach : 0,
      lastUpdated: new Date()
    }

    // Cache consolidated metrics
    await setCachedPerformanceData(
      `cross_platform:${contentId}`,
      crossPlatformMetrics,
      CACHE_TTL.METRICS
    )

    return crossPlatformMetrics
  }

  // Generate performance insights based on metrics
  async generateInsights(
    contentId: string,
    metrics: CrossPlatformMetrics
  ): Promise<PerformanceInsight[]> {
    const insights: PerformanceInsight[] = []

    // Overall engagement analysis
    if (metrics.overallEngagementRate > 0.05) {
      insights.push({
        type: 'success',
        title: 'High Engagement Rate',
        description: `Content is performing exceptionally well with ${(metrics.overallEngagementRate * 100).toFixed(2)}% engagement rate`,
        metric: 'engagement_rate',
        value: metrics.overallEngagementRate,
        benchmark: 0.03,
        recommendation: 'Consider amplifying this content across additional channels',
        priority: 1
      })
    } else if (metrics.overallEngagementRate < 0.01) {
      insights.push({
        type: 'warning',
        title: 'Low Engagement Rate',
        description: `Content engagement is below expectations at ${(metrics.overallEngagementRate * 100).toFixed(2)}%`,
        metric: 'engagement_rate',
        value: metrics.overallEngagementRate,
        benchmark: 0.03,
        recommendation: 'Review content hooks, timing, and platform-specific optimization',
        priority: 1
      })
    }

    // Platform-specific insights
    Object.entries(metrics.platformBreakdown).forEach(([platform, platformMetrics]) => {
      const engagementRate = platformMetrics.reach > 0 
        ? platformMetrics.engagement / platformMetrics.reach 
        : 0

      // High performer
      if (engagementRate > 0.07) {
        insights.push({
          type: 'success',
          platform: platform as PlatformType,
          title: `${platform} Outperforming`,
          description: `Exceptional performance on ${platform} with ${(engagementRate * 100).toFixed(2)}% engagement`,
          metric: 'platform_engagement',
          value: engagementRate,
          benchmark: 0.03,
          recommendation: `Analyze what's working on ${platform} and apply learnings to other platforms`,
          priority: 2
        })
      }

      // Low performer
      if (engagementRate < 0.01 && platformMetrics.reach > 100) {
        insights.push({
          type: 'alert',
          platform: platform as PlatformType,
          title: `${platform} Underperforming`,
          description: `Low engagement on ${platform} despite reach of ${platformMetrics.reach}`,
          metric: 'platform_engagement',
          value: engagementRate,
          benchmark: 0.03,
          recommendation: `Review ${platform}-specific content adaptation and posting time`,
          priority: 2
        })
      }

      // Viral potential
      if (platformMetrics.shares > platformMetrics.views * 0.1) {
        insights.push({
          type: 'opportunity',
          platform: platform as PlatformType,
          title: `Viral Potential on ${platform}`,
          description: `High share rate indicates viral potential`,
          metric: 'share_rate',
          value: platformMetrics.shares / platformMetrics.views,
          recommendation: `Boost this content with paid promotion to maximize viral spread`,
          priority: 1
        })
      }
    })

    // Reach opportunities
    if (metrics.totalReach < 1000) {
      insights.push({
        type: 'opportunity',
        title: 'Expand Reach',
        description: 'Content has limited reach across platforms',
        metric: 'total_reach',
        value: metrics.totalReach,
        benchmark: 5000,
        recommendation: 'Consider cross-posting to additional platforms or boosting with paid promotion',
        priority: 3
      })
    }

    // Sort by priority
    insights.sort((a, b) => a.priority - b.priority)

    return insights
  }

  // Generate consolidated performance report
  async generateConsolidatedReport(
    contentId: string,
    platformContents: PlatformContent[],
    timeRange: TimeRange
  ): Promise<ConsolidatedReport> {
    // Collect current metrics
    const overallMetrics = await this.collectCrossPlatformMetrics(contentId, platformContents)
    
    // Generate insights
    const platformInsights = await this.generateInsights(contentId, overallMetrics)
    
    // Analyze trends
    const trendAnalysis = await this.analyzeTrends(contentId, overallMetrics, timeRange)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(platformInsights, trendAnalysis)

    return {
      contentId,
      timeRange,
      overallMetrics,
      platformInsights,
      trendAnalysis,
      recommendations,
      generatedAt: new Date()
    }
  }

  // Analyze performance trends
  private async analyzeTrends(
    contentId: string,
    currentMetrics: CrossPlatformMetrics,
    timeRange: TimeRange
  ): Promise<TrendAnalysis> {
    // In production, this would compare with historical data
    // For now, provide basic analysis based on current metrics

    const totalEngagement = currentMetrics.totalEngagement
    const totalReach = currentMetrics.totalReach
    const engagementRate = totalReach > 0 ? totalEngagement / totalReach : 0

    // Determine momentum based on engagement rate
    let momentum: 'accelerating' | 'steady' | 'declining' = 'steady'
    if (engagementRate > 0.05) {
      momentum = 'accelerating'
    } else if (engagementRate < 0.01) {
      momentum = 'declining'
    }

    // Calculate growth rate (simplified - would use historical data in production)
    const growthRate = engagementRate * 100

    // Identify underperforming platforms
    const underperformingPlatforms: PlatformType[] = []
    Object.entries(currentMetrics.platformBreakdown).forEach(([platform, metrics]) => {
      const platformEngagementRate = metrics.reach > 0 ? metrics.engagement / metrics.reach : 0
      if (platformEngagementRate < 0.01) {
        underperformingPlatforms.push(platform as PlatformType)
      }
    })

    // Project future reach based on current trends
    const projectedReach = Math.round(totalReach * (1 + growthRate / 100))

    return {
      growthRate,
      momentum,
      peakPlatform: currentMetrics.bestPerformingPlatform,
      underperformingPlatforms,
      projectedReach
    }
  }

  // Generate actionable recommendations
  private generateRecommendations(
    insights: PerformanceInsight[],
    trends: TrendAnalysis
  ): string[] {
    const recommendations: string[] = []

    // Based on momentum
    if (trends.momentum === 'accelerating') {
      recommendations.push('Content is gaining traction - consider increasing posting frequency')
      recommendations.push('Amplify successful content across additional platforms')
    } else if (trends.momentum === 'declining') {
      recommendations.push('Review content strategy and adjust hooks/timing')
      recommendations.push('A/B test different content variations to improve performance')
    }

    // Based on underperforming platforms
    if (trends.underperformingPlatforms.length > 0) {
      recommendations.push(
        `Optimize content for ${trends.underperformingPlatforms.join(', ')} using platform-specific best practices`
      )
    }

    // Based on peak platform
    recommendations.push(
      `Analyze success factors from ${trends.peakPlatform} and apply to other platforms`
    )

    // Add top priority insights as recommendations
    insights
      .filter(i => i.priority <= 2)
      .forEach(insight => {
        if (!recommendations.includes(insight.recommendation)) {
          recommendations.push(insight.recommendation)
        }
      })

    return recommendations.slice(0, 5) // Limit to top 5 recommendations
  }

  // Get cached metrics if available
  async getCachedMetrics(contentId: string): Promise<CrossPlatformMetrics | null> {
    return await getCachedPerformanceData(`cross_platform:${contentId}`)
  }

  // Track metrics over time for historical analysis
  async trackMetricsHistory(
    contentId: string,
    platform: PlatformType,
    metrics: PerformanceMetrics
  ): Promise<void> {
    const historyKey = `metrics_history:${contentId}:${platform}`
    const timestamp = Date.now()
    
    try {
      // Store as sorted set with timestamp as score
      await this.redis.zadd(
        historyKey,
        timestamp,
        JSON.stringify(metrics)
      )
      
      // Keep only last 30 days of data
      const thirtyDaysAgo = timestamp - (30 * 24 * 60 * 60 * 1000)
      await this.redis.zremrangebyscore(historyKey, '-inf', thirtyDaysAgo)
      
      // Set expiry to 31 days
      await this.redis.expire(historyKey, 31 * 24 * 60 * 60)
    } catch (error) {
      console.error('Error tracking metrics history:', error)
    }
  }

  // Get rate limit info for a platform
  getRateLimitInfo(platform: PlatformType): RateLimitInfo {
    const collector = this.collectors.get(platform)
    if (!collector) {
      throw new Error(`No collector found for platform: ${platform}`)
    }
    return collector.getRateLimits()
  }

  // Batch collect metrics for multiple content pieces
  async batchCollectMetrics(
    contentItems: Array<{ contentId: string; platformContents: PlatformContent[] }>
  ): Promise<Map<string, CrossPlatformMetrics>> {
    const results = new Map<string, CrossPlatformMetrics>()

    const promises = contentItems.map(async (item) => {
      try {
        const metrics = await this.collectCrossPlatformMetrics(
          item.contentId,
          item.platformContents
        )
        return { contentId: item.contentId, metrics }
      } catch (error) {
        console.error(`Error collecting metrics for ${item.contentId}:`, error)
        return null
      }
    })

    const settled = await Promise.allSettled(promises)
    
    settled.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        results.set(result.value.contentId, result.value.metrics)
      }
    })

    return results
  }
}

export const performanceTracker = PerformanceTracker.getInstance()
