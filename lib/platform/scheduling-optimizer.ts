// Scheduling Optimizer - Intelligent Timing and Audience Activity Analysis
// Predicts optimal posting times based on platform best practices and audience patterns

import {
  PlatformType,
  OptimalTiming,
  PerformanceMetrics
} from './types'
import { getPlatformConfig } from './platform-configs'

export interface AudienceActivityPattern {
  userId: string
  platform: PlatformType
  hourlyActivity: Record<number, number> // hour (0-23) -> activity score (0-100)
  dailyActivity: Record<string, number> // day name -> activity score (0-100)
  timezoneDistribution: Record<string, number> // timezone -> percentage of audience
  peakHours: number[]
  peakDays: string[]
  lastUpdated: Date
}

export interface SchedulingRecommendation {
  platform: PlatformType
  optimalTime: Date
  confidence: number // 0-1
  reasoning: string[]
  alternativeTimes: Date[]
  expectedEngagement: number
  audienceReach: number
}

export interface BatchSchedulingRequest {
  userId: string
  contentCount: number
  platforms: PlatformType[]
  startDate: Date
  endDate: Date
  timezone?: string
  avoidWeekends?: boolean
  customConstraints?: SchedulingConstraint[]
}

export interface SchedulingConstraint {
  type: 'min_gap' | 'max_per_day' | 'preferred_hours' | 'blackout_period'
  value: any
}

export interface BatchSchedulingResult {
  schedules: Map<PlatformType, Date[]>
  totalSlots: number
  utilizationRate: number
  expectedTotalReach: number
  warnings: string[]
}

export interface HistoricalPerformanceData {
  contentId: string
  platform: PlatformType
  publishedTime: Date
  metrics: PerformanceMetrics
  dayOfWeek: string
  hourOfDay: number
  timezone: string
}

export class SchedulingOptimizer {
  private static instance: SchedulingOptimizer
  private audiencePatterns: Map<string, AudienceActivityPattern> = new Map()
  private performanceHistory: Map<string, HistoricalPerformanceData[]> = new Map()

  static getInstance(): SchedulingOptimizer {
    if (!SchedulingOptimizer.instance) {
      SchedulingOptimizer.instance = new SchedulingOptimizer()
    }
    return SchedulingOptimizer.instance
  }

  /**
   * Predict optimal posting time for a specific platform
   * Combines platform best practices with learned audience patterns
   */
  async predictOptimalTime(
    platform: PlatformType,
    userId: string,
    options?: {
      timezone?: string
      startDate?: Date
      excludeHours?: number[]
      excludeDays?: string[]
    }
  ): Promise<SchedulingRecommendation> {
    const config = getPlatformConfig(platform)
    const audiencePattern = this.getAudiencePattern(userId, platform)
    const performanceData = this.getPerformanceHistory(userId, platform)

    // Calculate optimal time based on multiple factors
    const optimalTime = this.calculateOptimalTime(
      platform,
      config.optimalTiming,
      audiencePattern,
      performanceData,
      options
    )

    // Calculate confidence based on data availability
    const confidence = this.calculateConfidence(audiencePattern, performanceData)

    // Generate reasoning
    const reasoning = this.generateReasoning(
      platform,
      config.optimalTiming,
      audiencePattern,
      optimalTime
    )

    // Find alternative times
    const alternativeTimes = this.findAlternativeTimes(
      platform,
      optimalTime,
      config.optimalTiming,
      audiencePattern,
      3
    )

    // Estimate expected engagement
    const expectedEngagement = this.estimateEngagement(
      platform,
      optimalTime,
      audiencePattern,
      performanceData
    )

    // Estimate audience reach
    const audienceReach = this.estimateAudienceReach(
      platform,
      optimalTime,
      audiencePattern
    )

    return {
      platform,
      optimalTime,
      confidence,
      reasoning,
      alternativeTimes,
      expectedEngagement,
      audienceReach
    }
  }

  /**
   * Analyze audience activity patterns from historical data
   */
  async analyzeAudienceActivity(
    userId: string,
    platform: PlatformType,
    historicalData: HistoricalPerformanceData[]
  ): Promise<AudienceActivityPattern> {
    // Initialize activity maps
    const hourlyActivity: Record<number, number> = {}
    const dailyActivity: Record<string, number> = {}
    const timezoneDistribution: Record<string, number> = {}

    // Aggregate performance by hour and day
    const hourlyMetrics: Record<number, { total: number; count: number }> = {}
    const dailyMetrics: Record<string, { total: number; count: number }> = {}

    for (const data of historicalData) {
      const hour = data.hourOfDay
      const day = data.dayOfWeek
      const engagementScore = this.calculateEngagementScore(data.metrics)

      // Aggregate hourly data
      if (!hourlyMetrics[hour]) {
        hourlyMetrics[hour] = { total: 0, count: 0 }
      }
      hourlyMetrics[hour].total += engagementScore
      hourlyMetrics[hour].count += 1

      // Aggregate daily data
      if (!dailyMetrics[day]) {
        dailyMetrics[day] = { total: 0, count: 0 }
      }
      dailyMetrics[day].total += engagementScore
      dailyMetrics[day].count += 1

      // Track timezone distribution
      const tz = data.timezone || 'UTC'
      timezoneDistribution[tz] = (timezoneDistribution[tz] || 0) + 1
    }

    // Calculate average scores and normalize to 0-100
    const maxHourlyScore = Math.max(...Object.values(hourlyMetrics).map(m => m.total / m.count))
    const maxDailyScore = Math.max(...Object.values(dailyMetrics).map(m => m.total / m.count))

    for (let hour = 0; hour < 24; hour++) {
      const metrics = hourlyMetrics[hour]
      if (metrics) {
        hourlyActivity[hour] = Math.round((metrics.total / metrics.count / maxHourlyScore) * 100)
      } else {
        hourlyActivity[hour] = 0
      }
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (const day of daysOfWeek) {
      const metrics = dailyMetrics[day]
      if (metrics) {
        dailyActivity[day] = Math.round((metrics.total / metrics.count / maxDailyScore) * 100)
      } else {
        dailyActivity[day] = 0
      }
    }

    // Normalize timezone distribution to percentages
    const totalTimezoneCount = Object.values(timezoneDistribution).reduce((a, b) => a + b, 0)
    for (const tz in timezoneDistribution) {
      timezoneDistribution[tz] = Math.round((timezoneDistribution[tz] / totalTimezoneCount) * 100)
    }

    // Identify peak hours (top 3 hours with highest activity)
    const peakHours = Object.entries(hourlyActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))
      .sort((a, b) => a - b)

    // Identify peak days (top 3 days with highest activity)
    const peakDays = Object.entries(dailyActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day)

    const pattern: AudienceActivityPattern = {
      userId,
      platform,
      hourlyActivity,
      dailyActivity,
      timezoneDistribution,
      peakHours,
      peakDays,
      lastUpdated: new Date()
    }

    // Cache the pattern
    const key = `${userId}_${platform}`
    this.audiencePatterns.set(key, pattern)

    return pattern
  }

  /**
   * Generate batch scheduling for multiple content pieces across platforms
   */
  async generateBatchSchedule(
    request: BatchSchedulingRequest
  ): Promise<BatchSchedulingResult> {
    const schedules = new Map<PlatformType, Date[]>()
    const warnings: string[] = []
    let totalSlots = 0
    let expectedTotalReach = 0

    for (const platform of request.platforms) {
      const config = getPlatformConfig(platform)
      const audiencePattern = this.getAudiencePattern(request.userId, platform)

      // Calculate optimal posting frequency for this platform
      const optimalFrequency = config.algorithm.optimalPostingFrequency
      const maxPostsPerDay = optimalFrequency.max

      // Generate time slots for this platform
      const timeSlots = this.generateTimeSlots(
        platform,
        request.contentCount,
        request.startDate,
        request.endDate,
        maxPostsPerDay,
        audiencePattern,
        config.optimalTiming,
        {
          timezone: request.timezone,
          avoidWeekends: request.avoidWeekends,
          customConstraints: request.customConstraints
        }
      )

      schedules.set(platform, timeSlots)
      totalSlots += timeSlots.length

      // Calculate expected reach for this platform
      for (const time of timeSlots) {
        expectedTotalReach += this.estimateAudienceReach(platform, time, audiencePattern)
      }

      // Check if we could schedule all content
      if (timeSlots.length < request.contentCount) {
        warnings.push(
          `Could only schedule ${timeSlots.length} out of ${request.contentCount} posts for ${platform} within the date range`
        )
      }
    }

    const utilizationRate = totalSlots / (request.contentCount * request.platforms.length)

    return {
      schedules,
      totalSlots,
      utilizationRate,
      expectedTotalReach,
      warnings
    }
  }

  /**
   * Update audience patterns based on new performance data
   */
  async updateAudiencePattern(
    userId: string,
    platform: PlatformType,
    performanceData: HistoricalPerformanceData
  ): Promise<void> {
    const key = `${userId}_${platform}`
    
    // Add to performance history
    if (!this.performanceHistory.has(key)) {
      this.performanceHistory.set(key, [])
    }
    this.performanceHistory.get(key)!.push(performanceData)

    // Keep only last 90 days of data
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const recentData = this.performanceHistory.get(key)!.filter(
      d => d.publishedTime >= ninetyDaysAgo
    )
    this.performanceHistory.set(key, recentData)

    // Reanalyze audience activity with updated data
    if (recentData.length >= 10) {
      await this.analyzeAudienceActivity(userId, platform, recentData)
    }
  }

  /**
   * Get platform-specific scheduling strategy
   */
  getPlatformStrategy(platform: PlatformType): {
    optimalFrequency: { min: number; max: number; unit: string }
    bestHours: number[]
    bestDays: string[]
    engagementWindow: number
  } {
    const config = getPlatformConfig(platform)
    return {
      optimalFrequency: config.algorithm.optimalPostingFrequency,
      bestHours: config.optimalTiming.bestHours,
      bestDays: config.optimalTiming.bestDays,
      engagementWindow: config.algorithm.engagementWindow
    }
  }

  // Private helper methods

  private calculateOptimalTime(
    platform: PlatformType,
    platformTiming: OptimalTiming,
    audiencePattern: AudienceActivityPattern | null,
    performanceData: HistoricalPerformanceData[],
    options?: {
      timezone?: string
      startDate?: Date
      excludeHours?: number[]
      excludeDays?: string[]
    }
  ): Date {
    const now = options?.startDate || new Date()
    const timezone = options?.timezone || platformTiming.timezone

    // If we have audience pattern data, use it; otherwise use platform defaults
    const optimalHours = audiencePattern?.peakHours || platformTiming.bestHours
    const optimalDays = audiencePattern?.peakDays || platformTiming.bestDays

    // Find next optimal time
    let candidateDate = new Date(now)
    candidateDate.setMinutes(0, 0, 0)

    // Look ahead up to 7 days
    for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
      const checkDate = new Date(candidateDate)
      checkDate.setDate(checkDate.getDate() + daysAhead)

      const dayName = this.getDayName(checkDate)
      
      // Skip if day is excluded
      if (options?.excludeDays?.includes(dayName)) {
        continue
      }

      // Check if this is an optimal day
      if (optimalDays.includes(dayName)) {
        // Find optimal hour for this day
        for (const hour of optimalHours) {
          // Skip if hour is excluded
          if (options?.excludeHours?.includes(hour)) {
            continue
          }

          const optimalTime = new Date(checkDate)
          optimalTime.setHours(hour, 0, 0, 0)

          // Make sure it's in the future
          if (optimalTime > now) {
            return optimalTime
          }
        }
      }
    }

    // Fallback: use first optimal hour of next optimal day
    const nextOptimalDay = optimalDays[0]
    const nextOptimalHour = optimalHours[0]
    
    const fallbackDate = new Date(now)
    fallbackDate.setDate(fallbackDate.getDate() + 1)
    fallbackDate.setHours(nextOptimalHour, 0, 0, 0)

    return fallbackDate
  }

  private findAlternativeTimes(
    platform: PlatformType,
    primaryTime: Date,
    platformTiming: OptimalTiming,
    audiencePattern: AudienceActivityPattern | null,
    count: number
  ): Date[] {
    const alternatives: Date[] = []
    const optimalHours = audiencePattern?.peakHours || platformTiming.bestHours
    const optimalDays = audiencePattern?.peakDays || platformTiming.bestDays

    // Generate alternatives by varying hours and days
    for (let dayOffset = 0; dayOffset < 7 && alternatives.length < count; dayOffset++) {
      for (const hour of optimalHours) {
        if (alternatives.length >= count) break

        const altTime = new Date(primaryTime)
        altTime.setDate(altTime.getDate() + dayOffset)
        altTime.setHours(hour, 0, 0, 0)

        // Skip if it's the same as primary time
        if (altTime.getTime() === primaryTime.getTime()) {
          continue
        }

        // Check if day is optimal
        const dayName = this.getDayName(altTime)
        if (optimalDays.includes(dayName) && altTime > new Date()) {
          alternatives.push(altTime)
        }
      }
    }

    return alternatives.slice(0, count)
  }

  private generateTimeSlots(
    platform: PlatformType,
    contentCount: number,
    startDate: Date,
    endDate: Date,
    maxPostsPerDay: number,
    audiencePattern: AudienceActivityPattern | null,
    platformTiming: OptimalTiming,
    options?: {
      timezone?: string
      avoidWeekends?: boolean
      customConstraints?: SchedulingConstraint[]
    }
  ): Date[] {
    const slots: Date[] = []
    const optimalHours = audiencePattern?.peakHours || platformTiming.bestHours
    const optimalDays = audiencePattern?.peakDays || platformTiming.bestDays

    // Start from the beginning of startDate or now, whichever is later
    const now = new Date()
    let currentDate = new Date(Math.max(startDate.getTime(), now.getTime()))
    currentDate.setHours(0, 0, 0, 0)
    
    let postsScheduledToday = 0

    while (slots.length < contentCount && currentDate <= endDate) {
      const dayName = this.getDayName(currentDate)

      // Skip weekends if requested
      if (options?.avoidWeekends && (dayName === 'Saturday' || dayName === 'Sunday')) {
        currentDate.setDate(currentDate.getDate() + 1)
        currentDate.setHours(0, 0, 0, 0)
        postsScheduledToday = 0
        continue
      }

      // Check if this is an optimal day
      if (optimalDays.includes(dayName)) {
        // Schedule posts at optimal hours
        for (const hour of optimalHours) {
          if (postsScheduledToday >= maxPostsPerDay) {
            break
          }

          if (slots.length >= contentCount) {
            break
          }

          const slotTime = new Date(currentDate)
          slotTime.setHours(hour, 0, 0, 0)

          // Make sure it's in the future and within range
          if (slotTime > now && slotTime >= startDate && slotTime <= endDate) {
            slots.push(slotTime)
            postsScheduledToday++
          }
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
      currentDate.setHours(0, 0, 0, 0)
      postsScheduledToday = 0
    }

    return slots
  }

  private calculateEngagementScore(metrics: PerformanceMetrics): number {
    // Weighted engagement score
    const weights = {
      likes: 1,
      comments: 3,
      shares: 5,
      clicks: 2,
      saves: 4
    }

    let score = 0
    score += metrics.likes * weights.likes
    score += metrics.comments * weights.comments
    score += metrics.shares * weights.shares
    score += metrics.clicks * weights.clicks
    score += (metrics.saves || 0) * weights.saves

    return score
  }

  private calculateConfidence(
    audiencePattern: AudienceActivityPattern | null,
    performanceData: HistoricalPerformanceData[]
  ): number {
    // Confidence based on data availability
    let confidence = 0.5 // Base confidence from platform defaults

    if (audiencePattern) {
      confidence += 0.2 // +20% for having audience pattern
    }

    if (performanceData.length >= 10) {
      confidence += 0.1 // +10% for having some historical data
    }

    if (performanceData.length >= 30) {
      confidence += 0.1 // +10% for having substantial historical data
    }

    if (performanceData.length >= 100) {
      confidence += 0.1 // +10% for having extensive historical data
    }

    return Math.min(confidence, 1.0)
  }

  private generateReasoning(
    platform: PlatformType,
    platformTiming: OptimalTiming,
    audiencePattern: AudienceActivityPattern | null,
    optimalTime: Date
  ): string[] {
    const reasoning: string[] = []

    const dayName = this.getDayName(optimalTime)
    const hour = optimalTime.getHours()

    // Platform best practices
    if (platformTiming.bestDays.includes(dayName)) {
      reasoning.push(`${dayName} is an optimal day for ${platform} based on platform best practices`)
    }

    if (platformTiming.bestHours.includes(hour)) {
      reasoning.push(`${hour}:00 is a peak engagement hour for ${platform}`)
    }

    // Audience-specific patterns
    if (audiencePattern) {
      if (audiencePattern.peakDays.includes(dayName)) {
        reasoning.push(`Your audience is most active on ${dayName}s`)
      }

      if (audiencePattern.peakHours.includes(hour)) {
        reasoning.push(`Your audience shows high engagement at ${hour}:00`)
      }

      const hourlyScore = audiencePattern.hourlyActivity[hour]
      if (hourlyScore >= 80) {
        reasoning.push(`This time has ${hourlyScore}% audience activity score`)
      }
    }

    if (reasoning.length === 0) {
      reasoning.push(`Scheduled based on ${platform} platform defaults`)
    }

    return reasoning
  }

  private estimateEngagement(
    platform: PlatformType,
    time: Date,
    audiencePattern: AudienceActivityPattern | null,
    performanceData: HistoricalPerformanceData[]
  ): number {
    // Base engagement estimate
    let engagement = 100

    // Adjust based on audience pattern
    if (audiencePattern) {
      const hour = time.getHours()
      const activityScore = audiencePattern.hourlyActivity[hour] || 50
      engagement = engagement * (activityScore / 100)
    }

    // Adjust based on historical performance at similar times
    if (performanceData.length > 0) {
      const hour = time.getHours()
      const similarTimeData = performanceData.filter(d => d.hourOfDay === hour)
      
      if (similarTimeData.length > 0) {
        const avgEngagement = similarTimeData.reduce(
          (sum, d) => sum + this.calculateEngagementScore(d.metrics),
          0
        ) / similarTimeData.length
        
        engagement = avgEngagement
      }
    }

    return Math.round(engagement)
  }

  private estimateAudienceReach(
    platform: PlatformType,
    time: Date,
    audiencePattern: AudienceActivityPattern | null
  ): number {
    // Base reach estimate (would be replaced with actual follower count)
    let reach = 1000

    // Adjust based on audience activity at this time
    if (audiencePattern) {
      const hour = time.getHours()
      const activityScore = audiencePattern.hourlyActivity[hour] || 50
      reach = reach * (activityScore / 100)
    }

    return Math.round(reach)
  }

  private getAudiencePattern(
    userId: string,
    platform: PlatformType
  ): AudienceActivityPattern | null {
    const key = `${userId}_${platform}`
    return this.audiencePatterns.get(key) || null
  }

  private getPerformanceHistory(
    userId: string,
    platform: PlatformType
  ): HistoricalPerformanceData[] {
    const key = `${userId}_${platform}`
    return this.performanceHistory.get(key) || []
  }

  private getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }
}

export const schedulingOptimizer = SchedulingOptimizer.getInstance()
