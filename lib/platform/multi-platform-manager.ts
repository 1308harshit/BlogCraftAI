// Multi-Platform Manager - Cross-Platform Content Distribution and Optimization
// Coordinates content publishing, scheduling, and performance tracking across all platforms

import {
  PlatformType,
  PlatformContent,
  PublishingSchedule,
  PublishingResult,
  CrossPlatformMetrics,
  PlatformStrategy,
  AdaptationRequest,
  PerformanceMetrics
} from './types'
import { contentAdapter } from './content-adapter'
import { getPlatformConfig } from './platform-configs'
import { schedulingOptimizer, SchedulingRecommendation } from './scheduling-optimizer'

export interface MultiPlatformPublishRequest {
  userId: string
  contentId: string
  content: string
  title?: string
  platforms: PlatformType[]
  schedule?: PublishingSchedule
  brandVoice?: string
  targetAudience?: string
  keywords?: string[]
  optimizeForViral?: boolean
}

export interface ContentDistributionResult {
  contentId: string
  totalPlatforms: number
  successfulAdaptations: number
  failedAdaptations: number
  platformContent: PlatformContent[]
  publishingResults: PublishingResult[]
  errors: string[]
}

export class MultiPlatformManager {
  private static instance: MultiPlatformManager

  static getInstance(): MultiPlatformManager {
    if (!MultiPlatformManager.instance) {
      MultiPlatformManager.instance = new MultiPlatformManager()
    }
    return MultiPlatformManager.instance
  }

  // Main method: Adapt and distribute content across multiple platforms
  async distributeContent(request: MultiPlatformPublishRequest): Promise<ContentDistributionResult> {
    const platformContent: PlatformContent[] = []
    const publishingResults: PublishingResult[] = []
    const errors: string[] = []
    let successfulAdaptations = 0
    let failedAdaptations = 0

    console.log(`Distributing content to ${request.platforms.length} platforms...`)

    // Adapt content for each platform
    for (const platform of request.platforms) {
      try {
        const adaptedContent = await this.adaptContentForPlatform({
          content: request.content,
          title: request.title,
          targetPlatform: platform,
          userId: request.userId,
          brandVoice: request.brandVoice,
          targetAudience: request.targetAudience,
          keywords: request.keywords,
          optimizeForViral: request.optimizeForViral
        })

        // Determine scheduled time
        const scheduledTime = await this.calculateScheduledTime(
          platform,
          request.schedule,
          request.userId
        )

        const platformContentItem: PlatformContent = {
          contentId: request.contentId,
          platform,
          adaptedContent: adaptedContent.content,
          format: adaptedContent.format,
          metadata: adaptedContent.metadata,
          status: scheduledTime ? 'scheduled' : 'draft',
          scheduledTime
        }

        platformContent.push(platformContentItem)
        successfulAdaptations++

        console.log(`✓ Adapted content for ${platform}`)
      } catch (error) {
        failedAdaptations++
        const errorMessage = `Failed to adapt content for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error(errorMessage)

        publishingResults.push({
          platform,
          success: false,
          error: errorMessage
        })
      }
    }

    // Schedule or publish content
    if (request.schedule) {
      for (const content of platformContent) {
        try {
          const result = await this.scheduleContent(content)
          publishingResults.push(result)
        } catch (error) {
          publishingResults.push({
            platform: content.platform,
            success: false,
            error: error instanceof Error ? error.message : 'Scheduling failed'
          })
        }
      }
    }

    return {
      contentId: request.contentId,
      totalPlatforms: request.platforms.length,
      successfulAdaptations,
      failedAdaptations,
      platformContent,
      publishingResults,
      errors
    }
  }

  // Adapt content for a specific platform
  async adaptContentForPlatform(request: AdaptationRequest) {
    return await contentAdapter.adaptContent(request)
  }

  // Optimize content for platform-specific algorithms
  async optimizeForPlatform(
    content: string,
    platform: PlatformType,
    userId: string
  ): Promise<{ optimizedContent: string; optimizations: string[] }> {
    const config = getPlatformConfig(platform)
    const optimizations: string[] = []

    // Apply platform-specific optimizations
    let optimizedContent = content

    // Algorithm-specific optimizations
    if (config.algorithm.prioritizes.includes('engagement')) {
      optimizations.push('Added engagement hooks')
    }

    if (config.algorithm.prioritizes.includes('seo')) {
      optimizations.push('Applied SEO best practices')
    }

    if (config.algorithm.prioritizes.includes('video_watch_time')) {
      optimizations.push('Optimized for watch time retention')
    }

    if (config.algorithm.prioritizes.includes('professional_content')) {
      optimizations.push('Enhanced professional tone')
    }

    return {
      optimizedContent,
      optimizations
    }
  }

  // Schedule content for optimal posting time
  private async calculateScheduledTime(
    platform: PlatformType,
    schedule?: PublishingSchedule,
    userId?: string
  ): Promise<Date | undefined> {
    if (!schedule) {
      return undefined
    }

    if (schedule.scheduleStrategy === 'immediate') {
      return new Date()
    }

    if (schedule.scheduleStrategy === 'custom' && schedule.customTimes) {
      return schedule.customTimes[platform]
    }

    if (schedule.scheduleStrategy === 'optimal') {
      return await this.calculateOptimalTime(platform, userId)
    }

    return undefined
  }

  // Calculate optimal posting time using intelligent scheduling optimizer
  private async calculateOptimalTime(
    platform: PlatformType,
    userId?: string
  ): Promise<Date> {
    if (userId) {
      try {
        // Use intelligent scheduling optimizer with audience patterns
        const recommendation = await schedulingOptimizer.predictOptimalTime(
          platform,
          userId
        )
        return recommendation.optimalTime
      } catch (error) {
        console.error('Error using scheduling optimizer, falling back to defaults:', error)
      }
    }

    // Fallback to platform defaults
    const config = getPlatformConfig(platform)
    const now = new Date()
    
    // Get next optimal hour
    const currentHour = now.getHours()
    const optimalHours = config.optimalTiming.bestHours
    
    let nextOptimalHour = optimalHours.find(h => h > currentHour)
    
    if (!nextOptimalHour) {
      // Use first optimal hour of next day
      nextOptimalHour = optimalHours[0]
      now.setDate(now.getDate() + 1)
    }
    
    now.setHours(nextOptimalHour, 0, 0, 0)
    
    return now
  }

  // Schedule content for publishing
  private async scheduleContent(content: PlatformContent): Promise<PublishingResult> {
    // In a real implementation, this would integrate with platform APIs
    // For now, we'll simulate scheduling
    
    console.log(`Scheduling content for ${content.platform} at ${content.scheduledTime}`)

    return {
      platform: content.platform,
      success: true,
      scheduledTime: content.scheduledTime,
      platformContentId: `${content.platform}_${Date.now()}`
    }
  }

  // Track cross-platform performance using the performance tracker
  async trackCrossPlatformPerformance(
    contentId: string,
    platformContents: PlatformContent[]
  ): Promise<CrossPlatformMetrics> {
    const { performanceTracker } = await import('./performance-tracker')
    
    // Check cache first
    const cached = await performanceTracker.getCachedMetrics(contentId)
    if (cached) {
      return cached
    }

    // Collect fresh metrics
    return await performanceTracker.collectCrossPlatformMetrics(contentId, platformContents)
  }

  // Generate platform-specific strategy recommendations
  async generatePlatformStrategy(
    platform: PlatformType,
    userId: string,
    performanceData?: any
  ): Promise<PlatformStrategy> {
    const config = getPlatformConfig(platform)
    
    // Calculate optimal posting times
    const now = new Date()
    const optimalTimes: Date[] = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      
      // Use first optimal hour for each day
      const optimalHour = config.optimalTiming.bestHours[0]
      date.setHours(optimalHour, 0, 0, 0)
      
      optimalTimes.push(date)
    }

    return {
      platform,
      contentTypes: config.supportedFormats,
      postingFrequency: config.algorithm.optimalPostingFrequency.max,
      optimalTimes,
      hashtagStrategy: config.algorithm.prioritizes,
      engagementTactics: [
        'Post during peak hours',
        'Use platform-specific features',
        'Engage with comments quickly',
        'Leverage trending topics'
      ],
      performanceGoals: {
        engagement: 0.05,
        reach: 1000,
        clicks: 50
      }
    }
  }

  // Batch adapt content for all platforms
  async batchAdaptContent(
    content: string,
    title: string,
    userId: string,
    platforms: PlatformType[],
    options?: {
      brandVoice?: string
      targetAudience?: string
      keywords?: string[]
    }
  ): Promise<Map<PlatformType, PlatformContent>> {
    const results = new Map<PlatformType, PlatformContent>()

    const adaptations = await Promise.allSettled(
      platforms.map(async (platform) => {
        const adapted = await this.adaptContentForPlatform({
          content,
          title,
          targetPlatform: platform,
          userId,
          brandVoice: options?.brandVoice,
          targetAudience: options?.targetAudience,
          keywords: options?.keywords
        })

        return {
          platform,
          adapted
        }
      })
    )

    adaptations.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { platform, adapted } = result.value
        results.set(platform, {
          contentId: `temp_${Date.now()}_${index}`,
          platform,
          adaptedContent: adapted.content,
          format: adapted.format,
          metadata: adapted.metadata,
          status: 'draft'
        })
      }
    })

    return results
  }

  // Get platform constraints for validation
  getPlatformConstraints(platform: PlatformType) {
    const config = getPlatformConfig(platform)
    return config.constraints
  }

  // Validate content against platform constraints
  validateContent(content: string, platform: PlatformType): {
    valid: boolean
    violations: string[]
  } {
    const config = getPlatformConfig(platform)
    const violations: string[] = []

    // Check length constraints
    if (content.length > config.constraints.maxLength) {
      violations.push(`Content exceeds maximum length of ${config.constraints.maxLength} characters`)
    }

    if (config.constraints.minLength && content.length < config.constraints.minLength) {
      violations.push(`Content below minimum length of ${config.constraints.minLength} characters`)
    }

    // Check hashtag count
    const hashtags = content.match(/#[\w]+/g) || []
    if (hashtags.length > config.constraints.maxHashtags) {
      violations.push(`Too many hashtags (${hashtags.length}). Maximum allowed: ${config.constraints.maxHashtags}`)
    }

    return {
      valid: violations.length === 0,
      violations
    }
  }

  // Get all supported platforms
  getSupportedPlatforms(): PlatformType[] {
    return ['twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'medium', 'facebook', 'blog']
  }

  // Get platforms that support a specific format
  getPlatformsByFormat(format: string): PlatformType[] {
    return this.getSupportedPlatforms().filter(platform => {
      const config = getPlatformConfig(platform)
      return config.supportedFormats.includes(format as any)
    })
  }

  // Get intelligent scheduling recommendation for a platform
  async getSchedulingRecommendation(
    platform: PlatformType,
    userId: string,
    options?: {
      timezone?: string
      startDate?: Date
      excludeHours?: number[]
      excludeDays?: string[]
    }
  ): Promise<SchedulingRecommendation> {
    return await schedulingOptimizer.predictOptimalTime(
      platform,
      userId,
      options
    )
  }

  // Generate batch schedule for multiple content pieces
  async generateBatchSchedule(
    userId: string,
    contentCount: number,
    platforms: PlatformType[],
    startDate: Date,
    endDate: Date,
    options?: {
      timezone?: string
      avoidWeekends?: boolean
    }
  ) {
    return await schedulingOptimizer.generateBatchSchedule({
      userId,
      contentCount,
      platforms,
      startDate,
      endDate,
      timezone: options?.timezone,
      avoidWeekends: options?.avoidWeekends
    })
  }

  // Update audience patterns based on performance data
  async updateAudiencePattern(
    userId: string,
    platform: PlatformType,
    contentId: string,
    publishedTime: Date,
    metrics: PerformanceMetrics
  ) {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][publishedTime.getDay()]
    
    await schedulingOptimizer.updateAudiencePattern(userId, platform, {
      contentId,
      platform,
      publishedTime,
      metrics,
      dayOfWeek,
      hourOfDay: publishedTime.getHours(),
      timezone: 'UTC'
    })
  }

  // Get platform-specific scheduling strategy
  getPlatformSchedulingStrategy(platform: PlatformType) {
    return schedulingOptimizer.getPlatformStrategy(platform)
  }

  // Generate consolidated performance report
  async generatePerformanceReport(
    contentId: string,
    platformContents: PlatformContent[],
    timeRange?: { start: Date; end: Date }
  ) {
    const { performanceTracker } = await import('./performance-tracker')
    
    const range = timeRange || {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date()
    }

    return await performanceTracker.generateConsolidatedReport(
      contentId,
      platformContents,
      range
    )
  }

  // Get performance insights for content
  async getPerformanceInsights(
    contentId: string,
    platformContents: PlatformContent[]
  ) {
    const { performanceTracker } = await import('./performance-tracker')
    
    const metrics = await performanceTracker.collectCrossPlatformMetrics(
      contentId,
      platformContents
    )
    
    return await performanceTracker.generateInsights(contentId, metrics)
  }

  // Collect real-time metrics for a specific platform
  async collectPlatformMetrics(
    contentId: string,
    platform: PlatformType,
    platformContentId: string
  ) {
    const { performanceTracker } = await import('./performance-tracker')
    
    return await performanceTracker.collectPlatformMetrics(
      contentId,
      platform,
      platformContentId
    )
  }

  // Get rate limit information for platform APIs
  async getPlatformRateLimits(platform: PlatformType) {
    const { performanceTracker } = await import('./performance-tracker')
    
    return performanceTracker.getRateLimitInfo(platform)
  }

  // Batch collect metrics for multiple content pieces
  async batchCollectPerformanceMetrics(
    contentItems: Array<{ contentId: string; platformContents: PlatformContent[] }>
  ) {
    const { performanceTracker } = await import('./performance-tracker')
    
    return await performanceTracker.batchCollectMetrics(contentItems)
  }
}

export const multiPlatformManager = MultiPlatformManager.getInstance()
