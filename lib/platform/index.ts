// Multi-Platform Domination System - Main Export
// Centralized exports for platform management and content adaptation

export * from './types'
export * from './platform-configs'
export * from './models'
export { ContentAdapter, contentAdapter } from './content-adapter'
export { MultiPlatformManager, multiPlatformManager } from './multi-platform-manager'
export { SchedulingOptimizer, schedulingOptimizer } from './scheduling-optimizer'
export { PerformanceTracker, performanceTracker } from './performance-tracker'
export { StrategyAdapter, strategyAdapter } from './strategy-adapter'
export type {
  AudienceActivityPattern,
  SchedulingRecommendation,
  BatchSchedulingRequest,
  BatchSchedulingResult,
  HistoricalPerformanceData
} from './scheduling-optimizer'
export type {
  PlatformMetricsCollector,
  TimeRange,
  RateLimitInfo,
  PerformanceInsight,
  ConsolidatedReport,
  TrendAnalysis
} from './performance-tracker'
export type {
  StrategyAdaptation,
  AdaptationReason,
  ImpactPrediction,
  StrategyTestResult,
  AlgorithmUpdate
} from './strategy-adapter'

// Main API class for easy access
export class PlatformAPI {
  private static instance: PlatformAPI

  static getInstance(): PlatformAPI {
    if (!PlatformAPI.instance) {
      PlatformAPI.instance = new PlatformAPI()
    }
    return PlatformAPI.instance
  }

  // Quick access to content adaptation
  async adaptContent(
    content: string,
    platform: string,
    options?: {
      title?: string
      userId?: string
      brandVoice?: string
      keywords?: string[]
    }
  ) {
    const { contentAdapter } = await import('./content-adapter')
    return contentAdapter.adaptContent({
      content,
      targetPlatform: platform as any,
      title: options?.title,
      userId: options?.userId || 'default',
      brandVoice: options?.brandVoice,
      keywords: options?.keywords
    })
  }

  // Quick access to multi-platform distribution
  async distributeContent(
    content: string,
    platforms: string[],
    options?: {
      title?: string
      userId?: string
      contentId?: string
      schedule?: any
    }
  ) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.distributeContent({
      userId: options?.userId || 'default',
      contentId: options?.contentId || `content_${Date.now()}`,
      content,
      title: options?.title,
      platforms: platforms as any[],
      schedule: options?.schedule
    })
  }

  // Get platform configuration
  getPlatformConfig(platform: string) {
    const { getPlatformConfig } = require('./platform-configs')
    return getPlatformConfig(platform)
  }

  // Get all supported platforms
  getSupportedPlatforms() {
    const { getAllPlatforms } = require('./platform-configs')
    return getAllPlatforms()
  }

  // Track cross-platform performance
  async trackPerformance(contentId: string, platformContents: any[]) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.trackCrossPlatformPerformance(contentId, platformContents)
  }

  // Generate performance report
  async generateReport(
    contentId: string,
    platformContents: any[],
    timeRange?: { start: Date; end: Date }
  ) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.generatePerformanceReport(contentId, platformContents, timeRange)
  }

  // Get performance insights
  async getInsights(contentId: string, platformContents: any[]) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.getPerformanceInsights(contentId, platformContents)
  }

  // Collect platform-specific metrics
  async collectMetrics(contentId: string, platform: string, platformContentId: string) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.collectPlatformMetrics(contentId, platform as any, platformContentId)
  }

  // Get rate limits for a platform
  async getRateLimits(platform: string) {
    const { multiPlatformManager } = await import('./multi-platform-manager')
    return multiPlatformManager.getPlatformRateLimits(platform as any)
  }

  // Adapt strategy based on performance
  async adaptStrategy(
    userId: string,
    platform: string,
    currentStrategy: any,
    performanceData: any,
    contentHistory: any[]
  ) {
    const { strategyAdapter } = await import('./strategy-adapter')
    return strategyAdapter.adaptStrategy(
      userId,
      platform as any,
      currentStrategy,
      performanceData,
      contentHistory
    )
  }

  // Adapt strategies for all platforms
  async adaptCrossPlatformStrategies(
    userId: string,
    crossPlatformMetrics: any,
    platformContents: any[]
  ) {
    const { strategyAdapter } = await import('./strategy-adapter')
    return strategyAdapter.adaptCrossPlatformStrategies(userId, crossPlatformMetrics, platformContents)
  }

  // Test strategy adaptation
  async testStrategyAdaptation(
    userId: string,
    platform: string,
    originalStrategy: any,
    adaptedStrategy: any,
    testDuration?: number
  ) {
    const { strategyAdapter } = await import('./strategy-adapter')
    return strategyAdapter.testStrategyAdaptation(
      userId,
      platform as any,
      originalStrategy,
      adaptedStrategy,
      testDuration
    )
  }

  // Detect algorithm changes
  async detectAlgorithmChanges(
    platform: string,
    recentPerformance: any[],
    historicalPerformance: any[]
  ) {
    const { strategyAdapter } = await import('./strategy-adapter')
    return strategyAdapter.detectAlgorithmChanges(platform as any, recentPerformance, historicalPerformance)
  }

  // Generate adaptation report
  async generateAdaptationReport(
    userId: string,
    platform: string,
    timeRange: { start: Date; end: Date }
  ) {
    const { strategyAdapter } = await import('./strategy-adapter')
    return strategyAdapter.generateAdaptationReport(userId, platform as any, timeRange)
  }
}

export const platformAPI = PlatformAPI.getInstance()
