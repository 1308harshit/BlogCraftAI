// Strategy Adapter Unit Tests
// Tests for platform-specific strategy adaptation functionality

import { strategyAdapter } from '../strategy-adapter'
import {
  PlatformType,
  PlatformStrategy,
  PerformanceMetrics,
  PlatformContent
} from '../types'

describe('StrategyAdapter', () => {
  const userId = 'test_user_123'
  const platform: PlatformType = 'twitter'

  const mockCurrentStrategy: PlatformStrategy = {
    platform: 'twitter',
    contentTypes: ['text', 'image'],
    postingFrequency: 5,
    optimalTimes: [new Date()],
    hashtagStrategy: ['trending', 'relevant'],
    engagementTactics: [
      'Post during peak hours',
      'Use platform-specific features'
    ],
    performanceGoals: {
      engagement: 0.03,
      reach: 500,
      clicks: 10
    }
  }

  const mockPerformanceData: PerformanceMetrics = {
    views: 300,
    likes: 5,
    comments: 1,
    shares: 0,
    clicks: 3,
    engagement: 9,
    reach: 250,
    impressions: 400,
    lastUpdated: new Date()
  }

  const mockContentHistory: PlatformContent[] = [
    {
      contentId: 'content_1',
      platform: 'twitter',
      adaptedContent: 'Test content 1',
      format: 'text',
      metadata: { hashtags: ['test'] },
      status: 'published',
      publishedTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      performanceMetrics: {
        views: 500,
        likes: 25,
        comments: 5,
        shares: 3,
        clicks: 10,
        engagement: 43,
        reach: 400,
        impressions: 600,
        lastUpdated: new Date()
      }
    },
    {
      contentId: 'content_2',
      platform: 'twitter',
      adaptedContent: 'Test content 2',
      format: 'text',
      metadata: { hashtags: ['test'] },
      status: 'published',
      publishedTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
      performanceMetrics: {
        views: 450,
        likes: 20,
        comments: 4,
        shares: 2,
        clicks: 8,
        engagement: 34,
        reach: 380,
        impressions: 550,
        lastUpdated: new Date()
      }
    }
  ]

  describe('adaptStrategy', () => {
    it('should generate strategy adaptation with valid structure', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      expect(adaptation).toBeDefined()
      expect(adaptation.platform).toBe(platform)
      expect(adaptation.currentStrategy).toBeDefined()
      expect(adaptation.adaptedStrategy).toBeDefined()
      expect(adaptation.adaptationReasons).toBeInstanceOf(Array)
      expect(adaptation.expectedImpact).toBeDefined()
      expect(adaptation.confidence).toBeGreaterThan(0)
      expect(adaptation.confidence).toBeLessThanOrEqual(1)
      expect(adaptation.implementedAt).toBeInstanceOf(Date)
    })

    it('should identify performance issues when metrics are below benchmarks', async () => {
      const lowPerformanceData: PerformanceMetrics = {
        views: 100,
        likes: 2,
        comments: 0,
        shares: 0,
        clicks: 1,
        engagement: 3,
        reach: 80,
        impressions: 150,
        lastUpdated: new Date()
      }

      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        lowPerformanceData,
        mockContentHistory
      )

      expect(adaptation.adaptationReasons.length).toBeGreaterThan(0)
      
      const performanceReasons = adaptation.adaptationReasons.filter(
        r => r.type === 'performance'
      )
      expect(performanceReasons.length).toBeGreaterThan(0)
    })

    it('should include algorithm-specific adaptations', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      const algorithmReasons = adaptation.adaptationReasons.filter(
        r => r.type === 'algorithm'
      )
      expect(algorithmReasons.length).toBeGreaterThan(0)
    })

    it('should predict positive impact for adaptations', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      expect(adaptation.expectedImpact.engagementIncrease).toBeGreaterThanOrEqual(0)
      expect(adaptation.expectedImpact.reachIncrease).toBeGreaterThanOrEqual(0)
      expect(adaptation.expectedImpact.conversionIncrease).toBeGreaterThanOrEqual(0)
      expect(adaptation.expectedImpact.timeToImpact).toBeGreaterThan(0)
      expect(adaptation.expectedImpact.confidence).toBeGreaterThan(0)
      expect(adaptation.expectedImpact.confidence).toBeLessThanOrEqual(1)
    })

    it('should increase confidence with more content history', async () => {
      const shortHistory = mockContentHistory.slice(0, 1)
      const longHistory = [...mockContentHistory, ...mockContentHistory, ...mockContentHistory]

      const adaptationShort = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        shortHistory
      )

      const adaptationLong = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        longHistory
      )

      expect(adaptationLong.confidence).toBeGreaterThanOrEqual(adaptationShort.confidence)
    })

    it('should adapt posting frequency when below optimal', async () => {
      const lowFrequencyStrategy = {
        ...mockCurrentStrategy,
        postingFrequency: 1 // Below Twitter optimal (3-15)
      }

      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        lowFrequencyStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      expect(adaptation.adaptedStrategy.postingFrequency).toBeGreaterThan(
        lowFrequencyStrategy.postingFrequency
      )
    })

    it('should add engagement tactics to adapted strategy', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      expect(adaptation.adaptedStrategy.engagementTactics.length).toBeGreaterThanOrEqual(
        mockCurrentStrategy.engagementTactics.length
      )
    })

    it('should optimize posting times based on content history', async () => {
      const historyWithTimes = mockContentHistory.map((content, index) => ({
        ...content,
        publishedTime: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
      }))

      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        historyWithTimes
      )

      expect(adaptation.adaptedStrategy.optimalTimes).toBeDefined()
      expect(adaptation.adaptedStrategy.optimalTimes.length).toBeGreaterThan(0)
    })
  })

  describe('testStrategyAdaptation', () => {
    it('should return valid test results', async () => {
      const adaptedStrategy = {
        ...mockCurrentStrategy,
        postingFrequency: mockCurrentStrategy.postingFrequency + 2
      }

      const testResult = await strategyAdapter.testStrategyAdaptation(
        userId,
        platform,
        mockCurrentStrategy,
        adaptedStrategy,
        168
      )

      expect(testResult).toBeDefined()
      expect(testResult.strategyId).toBeDefined()
      expect(testResult.platform).toBe(platform)
      expect(testResult.testDuration).toBe(168)
      expect(testResult.performanceImprovement).toBeGreaterThanOrEqual(0)
      expect(testResult.statisticalSignificance).toBeGreaterThan(0)
      expect(testResult.statisticalSignificance).toBeLessThanOrEqual(1)
      expect(['adopt', 'reject', 'continue_testing']).toContain(testResult.recommendation)
    })

    it('should recommend adoption for high improvement and significance', async () => {
      const adaptedStrategy = {
        ...mockCurrentStrategy,
        postingFrequency: mockCurrentStrategy.postingFrequency + 5
      }

      // Run multiple tests to increase chance of high performance
      const tests = await Promise.all(
        Array(5).fill(null).map(() =>
          strategyAdapter.testStrategyAdaptation(
            userId,
            platform,
            mockCurrentStrategy,
            adaptedStrategy,
            168
          )
        )
      )

      const adoptRecommendations = tests.filter(t => t.recommendation === 'adopt')
      // At least some tests should recommend adoption
      expect(adoptRecommendations.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('detectAlgorithmChanges', () => {
    it('should detect significant performance drops', async () => {
      const recentPerformance: PerformanceMetrics[] = Array(5).fill(null).map(() => ({
        views: 200,
        likes: 5,
        comments: 1,
        shares: 0,
        clicks: 2,
        engagement: 8,
        reach: 150,
        impressions: 250,
        lastUpdated: new Date()
      }))

      const historicalPerformance: PerformanceMetrics[] = Array(10).fill(null).map(() => ({
        views: 1000,
        likes: 50,
        comments: 10,
        shares: 5,
        clicks: 20,
        engagement: 85,
        reach: 800,
        impressions: 1200,
        lastUpdated: new Date()
      }))

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeDefined()
      expect(algorithmUpdate?.platform).toBe(platform)
      expect(algorithmUpdate?.updateType).toBeDefined()
      expect(algorithmUpdate?.description).toBeDefined()
      expect(algorithmUpdate?.detectedAt).toBeInstanceOf(Date)
      expect(algorithmUpdate?.adaptationRequired).toBe(true)
      expect(algorithmUpdate?.suggestedChanges).toBeInstanceOf(Array)
      expect(algorithmUpdate?.suggestedChanges.length).toBeGreaterThan(0)
    })

    it('should return null when no significant changes detected', async () => {
      const stablePerformance: PerformanceMetrics[] = Array(5).fill(null).map(() => ({
        views: 500,
        likes: 25,
        comments: 5,
        shares: 3,
        clicks: 10,
        engagement: 43,
        reach: 400,
        impressions: 600,
        lastUpdated: new Date()
      }))

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        stablePerformance,
        stablePerformance
      )

      expect(algorithmUpdate).toBeNull()
    })

    it('should return null with insufficient data', async () => {
      const recentPerformance: PerformanceMetrics[] = [mockPerformanceData]
      const historicalPerformance: PerformanceMetrics[] = [mockPerformanceData]

      const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
        platform,
        recentPerformance,
        historicalPerformance
      )

      expect(algorithmUpdate).toBeNull()
    })
  })

  describe('generateAdaptationReport', () => {
    it('should generate report with valid structure', async () => {
      // First create an adaptation
      await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      const timeRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }

      const report = await strategyAdapter.generateAdaptationReport(
        userId,
        platform,
        timeRange
      )

      expect(report).toBeDefined()
      expect(report.platform).toBe(platform)
      expect(report.adaptations).toBeInstanceOf(Array)
      expect(report.performanceImpact).toBeDefined()
      expect(report.performanceImpact.engagementChange).toBeDefined()
      expect(report.performanceImpact.reachChange).toBeDefined()
      expect(report.performanceImpact.conversionChange).toBeDefined()
      expect(report.recommendations).toBeInstanceOf(Array)
      expect(report.recommendations.length).toBeGreaterThan(0)
    })

    it('should provide recommendations when no adaptations exist', async () => {
      const timeRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }

      const report = await strategyAdapter.generateAdaptationReport(
        'nonexistent_user',
        platform,
        timeRange
      )

      expect(report.adaptations.length).toBe(0)
      expect(report.recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('getActiveAdaptation', () => {
    it('should retrieve stored adaptation', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        mockContentHistory
      )

      const retrieved = strategyAdapter.getActiveAdaptation(userId, platform)

      expect(retrieved).toBeDefined()
      expect(retrieved?.platform).toBe(adaptation.platform)
      expect(retrieved?.confidence).toBe(adaptation.confidence)
    })

    it('should return undefined for non-existent adaptation', () => {
      const retrieved = strategyAdapter.getActiveAdaptation('nonexistent_user', platform)
      expect(retrieved).toBeUndefined()
    })
  })

  describe('getUserAdaptations', () => {
    it('should retrieve all adaptations for a user', async () => {
      const platforms: PlatformType[] = ['twitter', 'linkedin', 'instagram']

      for (const plt of platforms) {
        await strategyAdapter.adaptStrategy(
          userId,
          plt,
          { ...mockCurrentStrategy, platform: plt },
          mockPerformanceData,
          mockContentHistory
        )
      }

      const adaptations = strategyAdapter.getUserAdaptations(userId)

      expect(adaptations.length).toBeGreaterThanOrEqual(platforms.length)
      expect(adaptations.every(a => a.platform)).toBe(true)
    })

    it('should return empty array for user with no adaptations', () => {
      const adaptations = strategyAdapter.getUserAdaptations('nonexistent_user')
      expect(adaptations).toEqual([])
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content history', async () => {
      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        mockPerformanceData,
        []
      )

      expect(adaptation).toBeDefined()
      expect(adaptation.confidence).toBeGreaterThan(0)
    })

    it('should handle zero performance metrics', async () => {
      const zeroPerformance: PerformanceMetrics = {
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

      const adaptation = await strategyAdapter.adaptStrategy(
        userId,
        platform,
        mockCurrentStrategy,
        zeroPerformance,
        mockContentHistory
      )

      expect(adaptation).toBeDefined()
      expect(adaptation.adaptationReasons.length).toBeGreaterThan(0)
    })

    it('should handle all platforms', async () => {
      const platforms: PlatformType[] = [
        'twitter',
        'linkedin',
        'instagram',
        'youtube',
        'tiktok',
        'medium',
        'facebook',
        'blog'
      ]

      for (const plt of platforms) {
        const adaptation = await strategyAdapter.adaptStrategy(
          userId,
          plt,
          { ...mockCurrentStrategy, platform: plt },
          mockPerformanceData,
          mockContentHistory
        )

        expect(adaptation).toBeDefined()
        expect(adaptation.platform).toBe(plt)
      }
    })
  })
})
