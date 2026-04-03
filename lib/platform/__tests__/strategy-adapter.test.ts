// Strategy Adapter Tests
// Comprehensive test suite for platform-specific strategy adaptation

import { strategyAdapter } from '../strategy-adapter'
import {
  PlatformType,
  PlatformStrategy,
  PerformanceMetrics,
  PlatformContent,
  CrossPlatformMetrics
} from '../types'

describe('StrategyAdapter', () => {
  // Helper function to create mock performance metrics
  const createMockMetrics = (overrides?: Partial<PerformanceMetrics>): PerformanceMetrics => ({
    views: 10000,
    likes: 300,
    comments: 50,
    shares: 25,
    clicks: 150,
    engagement: 525,
    reach: 8000,
    impressions: 12000,
    lastUpdated: new Date(),
    ...overrides
  })

  // Helper function to create mock strategy
  const createMockStrategy = (platform: PlatformType): PlatformStrategy => ({
    platform,
    contentTypes: ['text', 'image'],
    postingFrequency: 3,
    optimalTimes: [],
    hashtagStrategy: ['engagement', 'relevance'],
    engagementTactics: [
      'Post during peak hours',
      'Use platform-specific features'
    ],
    performanceGoals: {
      engagement: 0.03,
      reach: 5000,
      clicks: 100
    }
  })

  // Helper function to create mock content
  const createMockContent = (
    platform: PlatformType,
    metrics?: PerformanceMetrics
  ): PlatformContent => ({
    contentId: `content_${Date.now()}`,
    platform,
    adaptedContent: 'Test content',
    format: 'text',
    metadata: {},
    status: 'published',
    publishedTime: new Date(),
    performanceMetrics: metrics || createMockMetrics()
  })

  describe('adaptStrategy', () => {
    it('should adapt strategy for underperforming content', async () => {
      const platform: PlatformType = 'twitter'
      const currentStrategy = createMockStrategy(platform)
      const poorMetrics = createMockMetrics({
        engagement: 50,
        reach: 8000,
        views: 1000
      })
      const contentHistory = [
        createMockContent(platform, createMockMetrics({ engagement: 500 })),
        createMockContent(platform, createMockMetrics({ engagement: 480 })),
        createMockContent(platform, poorMetrics)
      ]

      const adaptation = await strategyAdapter.adaptStrategy(
        'user123',
        platform,
        currentStrategy,
        poorMetrics,
        contentHistory
      )

      expect(adaptation).toBeDefined()
      expect(adaptation.platform).toBe(platform)
      expect(adaptation.reason).toBe('underperformance')
      expect(adaptation.confidence).toBeGreaterThan(0)
      expect(adaptation.confidence).toBeLessThanOrEqual(1)
      expect(adaptation.changes.length).toBeGreaterThan(0)
      expect(adaptation.expectedImpact).toBeDefined()
      expect(adaptation.adaptedStrategy).toBeDefined()
    })

    it('should detect content fatigue and adapt accordingly', async () => {
      const platform: PlatformType = 'linkedin'
      const currentStrategy = createMockStrategy(platform)
      
      // Create declining performance history
      const contentHistory: PlatformContent[] = []
      for (let i = 0; i < 20; i++) {
        const engagement = i < 10 ? 600 - i * 10 : 400 - (i - 10) * 20
        contentHistory.push(
          createMockContent(platform, createMockMetrics({ engagement }))
        )
      }

      const currentMetrics = createMockMetrics({ engagement: 200 })

      const adaptation = await strategyAdapter.adaptStrategy(
        'user123',
        platform,
        currentStrategy,
        currentMetrics,
        contentHistory
      )

      expect(adaptation.reason).toBe('content_fatigue')
      expect(adaptation.adaptedStrategy.contentTypes.length).toBeGreaterThan(
        currentStrategy.contentTypes.length
      )
      expect(adaptation.changes.some(change => change.includes('content types'))).toBe(true)
    })

    it('should provide high confidence with sufficient data', async () => {
      const platform: PlatformType = 'instagram'
      const currentStrategy = createMockStrategy(platform)
      const metrics = createMockMetrics()
      
      // Create large content history
      const contentHistory: PlatformContent[] = []
      for (let i = 0; i < 60; i++) {
        contentHistory.push(createMockContent(platform))
      }

      const adaptation = await strategyAdapter.adaptStrategy(
        'user123',
        platform,
        currentStrategy,
        metrics,
        contentHistory
      )

      expect(adaptation.confidence).toBeGreaterThan(0.6)
    })

    it('should predict positive impact for adaptations', async () => {
      const platform: PlatformType = 'youtube'
      const currentStrategy = createMockStrategy(platform)
      const metrics = createMockMetrics({ engagement: 100 })
      const contentHistory = [createMockContent(platform, metrics)]

      const adaptation = await strategyAdapter.adaptStrategy(
        'user123',
        platform,
        currentStrategy,
        metrics,
        contentHistory
      )

      expect(adaptation.expectedImpact.engagementChange).toBeGreaterThanOrEqual(0)
      expect(adaptation.expectedImpact.reachChange).toBeGreaterThanOrEqual(0)
      expect(adaptation.expectedImpact.confidence).toBeGreaterThan(0)
      expect(adaptation.expectedImpact.timeToImpact).toBeGreaterThan(0)
    })

    it('should identify specific changes between strategies', async () => {
      const platform: PlatformType = 'tiktok'
      const currentStrategy = createMockStrategy(platform)
      const metrics = createMockMetrics({ engagement: 50 })
      const contentHistory = [createMockContent(platform, metrics)]

      const adaptation = await strategyAdapter.adaptStrategy(
        'user123',
        platform,
        currentStrategy,
        metrics,
        contentHistory
      )

      expect(adaptation.changes).toBeDefined()
      expect(Array.isArray(adaptation.changes)).toBe(true)
      expect(adaptation.changes.length).toBeGreaterThan(0)
    })
  })

  describe('adaptCrossPlatformStrategies', () => {
    it('should adapt strategies for multiple platforms', async () => {
      const platforms: PlatformType[] = ['twitter', 'linkedin', 'instagram']
      const platformContents: PlatformContent[] = platforms.map(p =>
        createMockContent(p)
      )

      const crossPlatformMetrics: CrossPlatformMetrics = {
        contentId: 'content123',
        totalReach: 24000,
        totalEngagement: 1575,
        totalClicks: 450,
        platformBreakdown: {
          twitter: createMockMetrics(),
          linkedin: createMockMetrics(),
          instagram: createMockMetrics()
        },
        bestPerformingPlatform: 'twitter',
        worstPerformingPlatform: 'instagram',
        overallEngagementRate: 0.065,
        lastUpdated: new Date()
      }

      const adaptations = await strategyAdapter.adaptCrossPlatformStrategies(
        'user123',
        crossPlatformMetrics,
        platformContents
      )

      expect(adaptations.size).toBe(platforms.length)
      platforms.forEach(platform => {
        expect(adaptations.has(platform)).toBe(true)
        const adaptation = adaptations.get(platform)!
        expect(adaptation.platform).toBe(platform)
        expect(adaptation.adaptedStrategy).toBeDefined()
      })
    })

    it('should handle empty platform contents gracefully', async () => {
      const crossPlatformMetrics: CrossPlatformMetrics = {
        contentId: 'content123',
        totalReach: 0,
        totalEngagement: 0,
        totalClicks: 0,
        platformBreakdown: {},
        bestPerformingPlatform: 'twitter',
        worstPerformingPlatform: 'twitter',
        overallEngagementRate: 0,
        lastUpdated: new Date()
      }

      const adaptations = await strategyAdapter.adaptCrossPlatformStrategies(
        'user123',
        crossPlatformMetrics,
        []
      )

      expect(adaptations.size).toBe(0)
    })
  })

  describe('testStrategyAdaptation', () => {
    it('should create A/B test for strategy adaptation', async () => {
      const platform: PlatformType = 'facebook'
      const originalStrategy = createMockStrategy(platform)
      const adaptedStrategy = {
        ...originalStrategy,
        postingFrequency: 5,
        contentTypes: ['text', 'image', 'video']
      }

      const testResult = await strategyAdapter.testStrategyAdaptation(
        'user123',
        platform,
        originalStrategy,
        adaptedStrategy,
        14
      )

      expect(testResult).toBeDefined()
      expect(testResult.platform).toBe(platform)
      expect(testResult.testId).toBeDefined()
      expect(testResult.originalStrategy).toEqual(originalStrategy)
      expect(testResult.testStrategy).toEqual(adaptedStrategy)
      expect(testResult.startDate).toBeInstanceOf(Date)
      expect(testResult.endDate).toBeInstanceOf(Date)
      expect(testResult.winner).toMatch(/original|test|inconclusive/)
      expect(testResult.statisticalSignificance).toBeGreaterThan(0)
    })

    it('should use default test duration if not specified', async () => {
      const platform: PlatformType = 'medium'
      const originalStrategy = createMockStrategy(platform)
      const adaptedStrategy = { ...originalStrategy, postingFrequency: 4 }

      const testResult = await strategyAdapter.testStrategyAdaptation(
        'user123',
        platform,
        originalStrategy,
        adaptedStrategy
      )

      const durationDays = Math.round(
        (testResult.endDate.getTime() - testResult.startDate.getTime()) /
          (24 * 60 * 60 * 1000)
      )
      expect(durationDays).toBe(14)
    })

    it('should calculate improvement percentage', async () => {
      const platform: PlatformType = 'blog'
      const originalStrategy = createMockStrategy(platform)
      const adaptedStrategy = { ...originalStrategy, postingFrequency: 6 }

      const testResult = await strategyAdapter.testStrategyAdaptation(
        'user123',
        platform,
        originalStrategy,
        adaptedStrategy
      )

      expect(typeof testResult.improvementPercentage).toBe('number')
      expect(testResult.improvementPercentage).not.toBeNaN()
    })
  })

  describe('detectAlgorithmChanges', () => {
    it('should detect significant algorithm changes', async () => {
      const platform: PlatformType = 'twitter'
      
      // Historical performance (good)
      const historicalPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 15; i++) {
        historicalPerformance.push(
          createMockMetrics({ engagement: 500, reach: 8000 })
        )
      }

      // Recent performance (significantly worse)
      const recentPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 10; i++) {
        recentPerformance.push(
          createMockMetrics({ engagement: 200, reach: 4000 })
        )
      }

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeDefined()
      expect(algorithmUpdate!.platform).toBe(platform)
      expect(algorithmUpdate!.changeType).toMatch(/major|minor|suspected/)
      expect(algorithmUpdate!.affectedMetrics.length).toBeGreaterThan(0)
      expect(algorithmUpdate!.confidence).toBeGreaterThan(0)
      expect(algorithmUpdate!.recommendedActions.length).toBeGreaterThan(0)
    })

    it('should return null when no significant changes detected', async () => {
      const platform: PlatformType = 'linkedin'
      
      // Consistent performance
      const historicalPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 15; i++) {
        historicalPerformance.push(createMockMetrics())
      }

      const recentPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 10; i++) {
        recentPerformance.push(createMockMetrics())
      }

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeNull()
    })

    it('should return null with insufficient data', async () => {
      const platform: PlatformType = 'instagram'
      const recentPerformance = [createMockMetrics()]
      const historicalPerformance = [createMockMetrics()]

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeNull()
    })

    it('should identify affected metrics correctly', async () => {
      const platform: PlatformType = 'youtube'
      
      const historicalPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 15; i++) {
        historicalPerformance.push(
          createMockMetrics({ views: 10000, engagement: 500 })
        )
      }

      const recentPerformance: PerformanceMetrics[] = []
      for (let i = 0; i < 10; i++) {
        recentPerformance.push(
          createMockMetrics({ views: 5000, engagement: 500 })
        )
      }

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeDefined()
      expect(algorithmUpdate!.affectedMetrics).toContain('views')
    })
  })

  describe('generateAdaptationReport', () => {
    it('should generate comprehensive adaptation report', async () => {
      const platform: PlatformType = 'tiktok'
      const timeRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }

      const report = await strategyAdapter.generateAdaptationReport(
        'user123',
        platform,
        timeRange
      )

      expect(report).toBeDefined()
      expect(report.platform).toBe(platform)
      expect(report.timeRange).toEqual(timeRange)
      expect(report.adaptations).toBeDefined()
      expect(report.testResults).toBeDefined()
      expect(report.algorithmUpdates).toBeDefined()
      expect(report.overallImpact).toBeDefined()
      expect(report.recommendations).toBeDefined()
      expect(Array.isArray(report.recommendations)).toBe(true)
    })

    it('should include overall impact metrics', async () => {
      const platform: PlatformType = 'medium'
      const timeRange = {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }

      const report = await strategyAdapter.generateAdaptationReport(
        'user123',
        platform,
        timeRange
      )

      expect(report.overallImpact.engagementImprovement).toBeDefined()
      expect(report.overallImpact.reachImprovement).toBeDefined()
      expect(report.overallImpact.successRate).toBeDefined()
      expect(typeof report.overallImpact.engagementImprovement).toBe('number')
      expect(typeof report.overallImpact.reachImprovement).toBe('number')
      expect(typeof report.overallImpact.successRate).toBe('number')
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete adaptation workflow', async () => {
      const platform: PlatformType = 'twitter'
      const userId = 'user123'
      
      // Step 1: Adapt strategy
      const currentStrategy = createMockStrategy(platform)
      const metrics = createMockMetrics({ engagement: 100 })
      const contentHistory = [createMockContent(platform, metrics)]

      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        currentStrategy,
        metrics,
        contentHistory
      )

      expect(adaptation).toBeDefined()

      // Step 2: Test adaptation
      const testResult = await strategyAdapter.testStrategyAdaptation(
        userId,
        platform,
        adaptation.originalStrategy,
        adaptation.adaptedStrategy,
        7
      )

      expect(testResult).toBeDefined()
      expect(testResult.winner).toBeDefined()

      // Step 3: Generate report
      const report = await strategyAdapter.generateAdaptationReport(
        userId,
        platform,
        {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }
      )

      expect(report).toBeDefined()
      expect(report.recommendations.length).toBeGreaterThan(0)
    })

    it('should adapt strategies across multiple platforms consistently', async () => {
      const platforms: PlatformType[] = ['twitter', 'linkedin', 'instagram', 'facebook']
      const platformContents: PlatformContent[] = platforms.map(p =>
        createMockContent(p, createMockMetrics({ engagement: 100 }))
      )

      const crossPlatformMetrics: CrossPlatformMetrics = {
        contentId: 'content123',
        totalReach: 32000,
        totalEngagement: 400,
        totalClicks: 200,
        platformBreakdown: platforms.reduce((acc, p) => {
          acc[p] = createMockMetrics({ engagement: 100 })
          return acc
        }, {} as any),
        bestPerformingPlatform: 'twitter',
        worstPerformingPlatform: 'facebook',
        overallEngagementRate: 0.0125,
        lastUpdated: new Date()
      }

      const adaptations = await strategyAdapter.adaptCrossPlatformStrategies(
        'user123',
        crossPlatformMetrics,
        platformContents
      )

      expect(adaptations.size).toBe(platforms.length)
      
      // All adaptations should have valid structure
      adaptations.forEach((adaptation, platform) => {
        expect(adaptation.platform).toBe(platform)
        expect(adaptation.confidence).toBeGreaterThan(0)
        expect(adaptation.adaptedStrategy).toBeDefined()
        expect(adaptation.expectedImpact).toBeDefined()
      })
    })
  })
})
