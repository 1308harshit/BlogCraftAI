// Scheduling Optimizer Tests
// Tests for intelligent scheduling and timing optimization

import {
  schedulingOptimizer,
  SchedulingOptimizer,
  AudienceActivityPattern,
  HistoricalPerformanceData
} from '../scheduling-optimizer'
import { PlatformType, PerformanceMetrics } from '../types'

describe('SchedulingOptimizer', () => {
  let optimizer: SchedulingOptimizer

  beforeEach(() => {
    optimizer = SchedulingOptimizer.getInstance()
  })

  describe('predictOptimalTime', () => {
    it('should predict optimal posting time for a platform', async () => {
      const result = await optimizer.predictOptimalTime(
        'twitter',
        'test-user-1'
      )

      expect(result).toBeDefined()
      expect(result.platform).toBe('twitter')
      expect(result.optimalTime).toBeInstanceOf(Date)
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
      expect(result.reasoning).toBeInstanceOf(Array)
      expect(result.reasoning.length).toBeGreaterThan(0)
      expect(result.alternativeTimes).toBeInstanceOf(Array)
      expect(result.expectedEngagement).toBeGreaterThanOrEqual(0)
      expect(result.audienceReach).toBeGreaterThanOrEqual(0)
    })

    it('should respect timezone preferences', async () => {
      const result = await optimizer.predictOptimalTime(
        'linkedin',
        'test-user-2',
        { timezone: 'America/New_York' }
      )

      expect(result.optimalTime).toBeInstanceOf(Date)
      expect(result.optimalTime.getTime()).toBeGreaterThan(Date.now())
    })

    it('should exclude specified hours', async () => {
      const excludeHours = [0, 1, 2, 3, 4, 5, 6, 7, 22, 23]
      const result = await optimizer.predictOptimalTime(
        'instagram',
        'test-user-3',
        { excludeHours }
      )

      const hour = result.optimalTime.getHours()
      expect(excludeHours).not.toContain(hour)
    })

    it('should exclude specified days', async () => {
      const excludeDays = ['Saturday', 'Sunday']
      const result = await optimizer.predictOptimalTime(
        'facebook',
        'test-user-4',
        { excludeDays }
      )

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayName = dayNames[result.optimalTime.getDay()]
      expect(excludeDays).not.toContain(dayName)
    })

    it('should provide alternative times', async () => {
      const result = await optimizer.predictOptimalTime(
        'youtube',
        'test-user-5'
      )

      expect(result.alternativeTimes.length).toBeGreaterThan(0)
      expect(result.alternativeTimes.length).toBeLessThanOrEqual(3)
      
      // All alternatives should be different from primary time
      result.alternativeTimes.forEach(altTime => {
        expect(altTime.getTime()).not.toBe(result.optimalTime.getTime())
      })
    })
  })

  describe('analyzeAudienceActivity', () => {
    it('should analyze audience activity patterns from historical data', async () => {
      const historicalData: HistoricalPerformanceData[] = [
        {
          contentId: 'content-1',
          platform: 'twitter',
          publishedTime: new Date('2024-01-15T09:00:00Z'),
          metrics: {
            views: 1000,
            likes: 50,
            comments: 10,
            shares: 5,
            clicks: 20,
            engagement: 85,
            reach: 1200,
            impressions: 1500,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Monday',
          hourOfDay: 9,
          timezone: 'UTC'
        },
        {
          contentId: 'content-2',
          platform: 'twitter',
          publishedTime: new Date('2024-01-16T12:00:00Z'),
          metrics: {
            views: 1500,
            likes: 75,
            comments: 15,
            shares: 8,
            clicks: 30,
            engagement: 128,
            reach: 1800,
            impressions: 2200,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Tuesday',
          hourOfDay: 12,
          timezone: 'UTC'
        },
        {
          contentId: 'content-3',
          platform: 'twitter',
          publishedTime: new Date('2024-01-17T18:00:00Z'),
          metrics: {
            views: 2000,
            likes: 100,
            comments: 20,
            shares: 12,
            clicks: 40,
            engagement: 172,
            reach: 2400,
            impressions: 3000,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Wednesday',
          hourOfDay: 18,
          timezone: 'UTC'
        }
      ]

      const pattern = await optimizer.analyzeAudienceActivity(
        'test-user-6',
        'twitter',
        historicalData
      )

      expect(pattern).toBeDefined()
      expect(pattern.userId).toBe('test-user-6')
      expect(pattern.platform).toBe('twitter')
      expect(pattern.hourlyActivity).toBeDefined()
      expect(pattern.dailyActivity).toBeDefined()
      expect(pattern.timezoneDistribution).toBeDefined()
      expect(pattern.peakHours).toBeInstanceOf(Array)
      expect(pattern.peakHours.length).toBeGreaterThan(0)
      expect(pattern.peakDays).toBeInstanceOf(Array)
      expect(pattern.peakDays.length).toBeGreaterThan(0)
      expect(pattern.lastUpdated).toBeInstanceOf(Date)

      // Verify hourly activity scores are in valid range
      Object.values(pattern.hourlyActivity).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })

      // Verify daily activity scores are in valid range
      Object.values(pattern.dailyActivity).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })

      // Verify timezone distribution percentages sum to 100
      const totalPercentage = Object.values(pattern.timezoneDistribution).reduce((a, b) => a + b, 0)
      expect(totalPercentage).toBe(100)
    })

    it('should identify peak hours correctly', async () => {
      const historicalData: HistoricalPerformanceData[] = []
      
      // Create data with clear peak at hour 15
      for (let i = 0; i < 10; i++) {
        historicalData.push({
          contentId: `content-${i}`,
          platform: 'linkedin',
          publishedTime: new Date(`2024-01-${10 + i}T15:00:00Z`),
          metrics: {
            views: 2000,
            likes: 100,
            comments: 20,
            shares: 15,
            clicks: 50,
            engagement: 185,
            reach: 2500,
            impressions: 3000,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Tuesday',
          hourOfDay: 15,
          timezone: 'UTC'
        })
      }

      // Add some lower performing data at other hours
      for (let i = 0; i < 5; i++) {
        historicalData.push({
          contentId: `content-low-${i}`,
          platform: 'linkedin',
          publishedTime: new Date(`2024-01-${20 + i}T10:00:00Z`),
          metrics: {
            views: 500,
            likes: 25,
            comments: 5,
            shares: 3,
            clicks: 10,
            engagement: 43,
            reach: 600,
            impressions: 800,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Wednesday',
          hourOfDay: 10,
          timezone: 'UTC'
        })
      }

      const pattern = await optimizer.analyzeAudienceActivity(
        'test-user-7',
        'linkedin',
        historicalData
      )

      // Hour 15 should be in peak hours
      expect(pattern.peakHours).toContain(15)
      
      // Hour 15 should have higher activity score than hour 10
      expect(pattern.hourlyActivity[15]).toBeGreaterThan(pattern.hourlyActivity[10])
    })
  })

  describe('generateBatchSchedule', () => {
    it('should generate batch schedule for multiple platforms', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 1)
      
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)

      const result = await optimizer.generateBatchSchedule({
        userId: 'test-user-8',
        contentCount: 10,
        platforms: ['twitter', 'linkedin', 'instagram'],
        startDate,
        endDate
      })

      expect(result).toBeDefined()
      expect(result.schedules).toBeInstanceOf(Map)
      expect(result.schedules.size).toBe(3)
      expect(result.totalSlots).toBeGreaterThan(0)
      expect(result.utilizationRate).toBeGreaterThan(0)
      expect(result.utilizationRate).toBeLessThanOrEqual(1)
      expect(result.expectedTotalReach).toBeGreaterThanOrEqual(0)
      expect(result.warnings).toBeInstanceOf(Array)

      // Verify each platform has scheduled times
      expect(result.schedules.has('twitter')).toBe(true)
      expect(result.schedules.has('linkedin')).toBe(true)
      expect(result.schedules.has('instagram')).toBe(true)

      // Verify scheduled times are within date range
      result.schedules.forEach((times, platform) => {
        times.forEach(time => {
          expect(time.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
          expect(time.getTime()).toBeLessThanOrEqual(endDate.getTime())
        })
      })
    })

    it('should respect avoidWeekends option', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 1)
      
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 14)

      const result = await optimizer.generateBatchSchedule({
        userId: 'test-user-9',
        contentCount: 5,
        platforms: ['facebook'],
        startDate,
        endDate,
        avoidWeekends: true
      })

      const facebookSchedule = result.schedules.get('facebook')
      expect(facebookSchedule).toBeDefined()

      // Verify no weekend dates
      facebookSchedule?.forEach(time => {
        const day = time.getDay()
        expect(day).not.toBe(0) // Not Sunday
        expect(day).not.toBe(6) // Not Saturday
      })
    })

    it('should respect platform posting frequency limits', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 1)
      
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 7)

      const result = await optimizer.generateBatchSchedule({
        userId: 'test-user-10',
        contentCount: 100, // Request many posts
        platforms: ['medium'], // Medium has low posting frequency
        startDate,
        endDate
      })

      const mediumSchedule = result.schedules.get('medium')
      expect(mediumSchedule).toBeDefined()

      // Medium has max 3 posts per week, so in 7 days should have at most 21 posts (3 per day)
      // But since we're looking at optimal days only, it will be less
      expect(mediumSchedule!.length).toBeLessThanOrEqual(21)
      
      // Should have warning about not being able to schedule all content
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('updateAudiencePattern', () => {
    it('should update audience pattern with new performance data', async () => {
      const performanceData: HistoricalPerformanceData = {
        contentId: 'new-content-1',
        platform: 'tiktok',
        publishedTime: new Date('2024-01-20T19:00:00Z'),
        metrics: {
          views: 5000,
          likes: 250,
          comments: 50,
          shares: 30,
          clicks: 100,
          engagement: 430,
          reach: 6000,
          impressions: 7500,
          lastUpdated: new Date()
        },
        dayOfWeek: 'Saturday',
        hourOfDay: 19,
        timezone: 'UTC'
      }

      await optimizer.updateAudiencePattern(
        'test-user-11',
        'tiktok',
        performanceData
      )

      // Should not throw error
      expect(true).toBe(true)
    })
  })

  describe('getPlatformStrategy', () => {
    it('should return platform-specific scheduling strategy', () => {
      const strategy = optimizer.getPlatformStrategy('twitter')

      expect(strategy).toBeDefined()
      expect(strategy.optimalFrequency).toBeDefined()
      expect(strategy.optimalFrequency.min).toBeGreaterThan(0)
      expect(strategy.optimalFrequency.max).toBeGreaterThanOrEqual(strategy.optimalFrequency.min)
      expect(strategy.bestHours).toBeInstanceOf(Array)
      expect(strategy.bestHours.length).toBeGreaterThan(0)
      expect(strategy.bestDays).toBeInstanceOf(Array)
      expect(strategy.bestDays.length).toBeGreaterThan(0)
      expect(strategy.engagementWindow).toBeGreaterThan(0)
    })

    it('should return different strategies for different platforms', () => {
      const twitterStrategy = optimizer.getPlatformStrategy('twitter')
      const linkedinStrategy = optimizer.getPlatformStrategy('linkedin')

      // Twitter and LinkedIn should have different posting frequencies
      expect(twitterStrategy.optimalFrequency.max).not.toBe(linkedinStrategy.optimalFrequency.max)
    })
  })

  describe('Integration with audience patterns', () => {
    it('should use learned patterns to improve scheduling recommendations', async () => {
      const userId = 'test-user-12'
      const platform: PlatformType = 'instagram'

      // First, create historical data showing strong performance at hour 21
      const historicalData: HistoricalPerformanceData[] = []
      for (let i = 0; i < 20; i++) {
        historicalData.push({
          contentId: `content-${i}`,
          platform,
          publishedTime: new Date(`2024-01-${10 + i}T21:00:00Z`),
          metrics: {
            views: 3000,
            likes: 150,
            comments: 30,
            shares: 20,
            clicks: 60,
            engagement: 260,
            reach: 3500,
            impressions: 4000,
            lastUpdated: new Date()
          },
          dayOfWeek: 'Friday',
          hourOfDay: 21,
          timezone: 'UTC'
        })
      }

      // Analyze audience activity
      await optimizer.analyzeAudienceActivity(userId, platform, historicalData)

      // Get scheduling recommendation
      const recommendation = await optimizer.predictOptimalTime(platform, userId)

      // Should have higher confidence due to historical data
      expect(recommendation.confidence).toBeGreaterThan(0.5)

      // Reasoning should mention audience patterns
      const hasAudienceReasoning = recommendation.reasoning.some(r => 
        r.toLowerCase().includes('audience')
      )
      expect(hasAudienceReasoning).toBe(true)
    })
  })
})
