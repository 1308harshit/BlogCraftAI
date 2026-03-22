// Scheduling Optimizer Integration Example
// Demonstrates how to use the scheduling optimizer in real-world scenarios

import {
  multiPlatformManager,
  schedulingOptimizer,
  PlatformType,
  HistoricalPerformanceData
} from './index'

/**
 * Example 1: Schedule a single post with intelligent timing
 */
export async function scheduleOptimalPost(
  userId: string,
  content: string,
  title: string,
  platforms: PlatformType[]
) {
  console.log('🚀 Scheduling content with intelligent timing...')

  // Get optimal times for each platform
  const schedulingRecommendations = await Promise.all(
    platforms.map(async (platform) => {
      const recommendation = await multiPlatformManager.getSchedulingRecommendation(
        platform,
        userId,
        {
          timezone: 'America/New_York',
          excludeHours: [0, 1, 2, 3, 4, 5] // Avoid late night
        }
      )
      return { platform, recommendation }
    })
  )

  // Display recommendations
  console.log('\n📊 Scheduling Recommendations:')
  schedulingRecommendations.forEach(({ platform, recommendation }) => {
    console.log(`\n${platform.toUpperCase()}:`)
    console.log(`  Optimal Time: ${recommendation.optimalTime.toLocaleString()}`)
    console.log(`  Confidence: ${(recommendation.confidence * 100).toFixed(0)}%`)
    console.log(`  Expected Engagement: ${recommendation.expectedEngagement}`)
    console.log(`  Expected Reach: ${recommendation.audienceReach}`)
    console.log(`  Reasoning:`)
    recommendation.reasoning.forEach(reason => {
      console.log(`    - ${reason}`)
    })
  })

  // Create custom schedule with optimal times
  const customTimes: Record<PlatformType, Date> = {} as any
  schedulingRecommendations.forEach(({ platform, recommendation }) => {
    customTimes[platform] = recommendation.optimalTime
  })

  // Distribute content with optimal scheduling
  const result = await multiPlatformManager.distributeContent({
    userId,
    contentId: `content_${Date.now()}`,
    content,
    title,
    platforms,
    schedule: {
      platforms,
      scheduleStrategy: 'custom',
      customTimes
    }
  })

  console.log('\n✅ Content scheduled successfully!')
  console.log(`Total platforms: ${result.totalPlatforms}`)
  console.log(`Successful adaptations: ${result.successfulAdaptations}`)
  
  return result
}

/**
 * Example 2: Generate a 30-day content calendar
 */
export async function generateContentCalendar(
  userId: string,
  contentCount: number,
  platforms: PlatformType[]
) {
  console.log(`📅 Generating ${contentCount}-post content calendar...`)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 1) // Start tomorrow

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 30) // 30 days

  // Generate batch schedule
  const batchSchedule = await multiPlatformManager.generateBatchSchedule(
    userId,
    contentCount,
    platforms,
    startDate,
    endDate,
    {
      timezone: 'America/New_York',
      avoidWeekends: false // Include weekends for social media
    }
  )

  console.log('\n📊 Content Calendar Summary:')
  console.log(`Total slots: ${batchSchedule.totalSlots}`)
  console.log(`Utilization rate: ${(batchSchedule.utilizationRate * 100).toFixed(1)}%`)
  console.log(`Expected total reach: ${batchSchedule.expectedTotalReach.toLocaleString()}`)

  // Display schedule by platform
  console.log('\n📋 Schedule by Platform:')
  batchSchedule.schedules.forEach((times, platform) => {
    console.log(`\n${platform.toUpperCase()} (${times.length} posts):`)
    
    // Group by week
    const weeklySchedule = new Map<number, Date[]>()
    times.forEach(time => {
      const weekNumber = Math.floor((time.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
      if (!weeklySchedule.has(weekNumber)) {
        weeklySchedule.set(weekNumber, [])
      }
      weeklySchedule.get(weekNumber)!.push(time)
    })

    weeklySchedule.forEach((weekTimes, weekNum) => {
      console.log(`  Week ${weekNum + 1}:`)
      weekTimes.forEach(time => {
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][time.getDay()]
        console.log(`    ${dayName} ${time.toLocaleDateString()} at ${time.toLocaleTimeString()}`)
      })
    })
  })

  // Display warnings
  if (batchSchedule.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    batchSchedule.warnings.forEach(warning => {
      console.log(`  - ${warning}`)
    })
  }

  return batchSchedule
}

/**
 * Example 3: Analyze and learn from historical performance
 */
export async function analyzeHistoricalPerformance(
  userId: string,
  platform: PlatformType,
  posts: Array<{
    contentId: string
    publishedTime: Date
    views: number
    likes: number
    comments: number
    shares: number
    clicks: number
  }>
) {
  console.log(`📈 Analyzing ${posts.length} historical posts for ${platform}...`)

  // Convert to HistoricalPerformanceData format
  const historicalData: HistoricalPerformanceData[] = posts.map(post => ({
    contentId: post.contentId,
    platform,
    publishedTime: post.publishedTime,
    metrics: {
      views: post.views,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      clicks: post.clicks,
      engagement: post.likes + post.comments * 3 + post.shares * 5,
      reach: post.views,
      impressions: post.views * 1.2,
      lastUpdated: new Date()
    },
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][post.publishedTime.getDay()],
    hourOfDay: post.publishedTime.getHours(),
    timezone: 'UTC'
  }))

  // Analyze audience activity
  const pattern = await schedulingOptimizer.analyzeAudienceActivity(
    userId,
    platform,
    historicalData
  )

  console.log('\n📊 Audience Activity Pattern:')
  console.log(`\nPeak Hours: ${pattern.peakHours.join(', ')}`)
  console.log(`Peak Days: ${pattern.peakDays.join(', ')}`)

  // Display hourly activity
  console.log('\n⏰ Hourly Activity Scores:')
  const topHours = Object.entries(pattern.hourlyActivity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
  
  topHours.forEach(([hour, score]) => {
    const bar = '█'.repeat(Math.floor(score / 5))
    console.log(`  ${hour.padStart(2, '0')}:00 ${bar} ${score}`)
  })

  // Display daily activity
  console.log('\n📅 Daily Activity Scores:')
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  days.forEach(day => {
    const score = pattern.dailyActivity[day] || 0
    const bar = '█'.repeat(Math.floor(score / 5))
    console.log(`  ${day.padEnd(10)} ${bar} ${score}`)
  })

  // Display timezone distribution
  console.log('\n🌍 Audience Timezone Distribution:')
  Object.entries(pattern.timezoneDistribution)
    .sort(([, a], [, b]) => b - a)
    .forEach(([tz, percentage]) => {
      console.log(`  ${tz}: ${percentage}%`)
    })

  return pattern
}

/**
 * Example 4: Update patterns after publishing new content
 */
export async function trackAndLearnFromPost(
  userId: string,
  platform: PlatformType,
  contentId: string,
  publishedTime: Date,
  performanceMetrics: {
    views: number
    likes: number
    comments: number
    shares: number
    clicks: number
  }
) {
  console.log(`📝 Updating audience pattern with new performance data...`)

  // Update the audience pattern
  await multiPlatformManager.updateAudiencePattern(
    userId,
    platform,
    contentId,
    publishedTime,
    {
      views: performanceMetrics.views,
      likes: performanceMetrics.likes,
      comments: performanceMetrics.comments,
      shares: performanceMetrics.shares,
      clicks: performanceMetrics.clicks,
      engagement: performanceMetrics.likes + performanceMetrics.comments * 3 + performanceMetrics.shares * 5,
      reach: performanceMetrics.views,
      impressions: performanceMetrics.views * 1.2,
      lastUpdated: new Date()
    }
  )

  console.log('✅ Audience pattern updated successfully!')
  console.log('The system will use this data to improve future scheduling recommendations.')

  // Get updated recommendation to show improvement
  const recommendation = await multiPlatformManager.getSchedulingRecommendation(
    platform,
    userId
  )

  console.log(`\n📊 Updated Recommendation (Confidence: ${(recommendation.confidence * 100).toFixed(0)}%):`)
  console.log(`  Next optimal time: ${recommendation.optimalTime.toLocaleString()}`)
  console.log(`  Expected engagement: ${recommendation.expectedEngagement}`)
}

/**
 * Example 5: Compare platform strategies
 */
export async function comparePlatformStrategies(platforms: PlatformType[]) {
  console.log('📊 Comparing platform scheduling strategies...\n')

  platforms.forEach(platform => {
    const strategy = multiPlatformManager.getPlatformSchedulingStrategy(platform)
    
    console.log(`${platform.toUpperCase()}:`)
    console.log(`  Posting Frequency: ${strategy.optimalFrequency.min}-${strategy.optimalFrequency.max} per ${strategy.optimalFrequency.unit}`)
    console.log(`  Best Hours: ${strategy.bestHours.join(', ')}`)
    console.log(`  Best Days: ${strategy.bestDays.join(', ')}`)
    console.log(`  Engagement Window: ${strategy.engagementWindow} hours`)
    console.log()
  })
}

/**
 * Example 6: Smart scheduling for different content types
 */
export async function scheduleByContentType(
  userId: string,
  contentType: 'blog' | 'social' | 'video' | 'newsletter'
) {
  console.log(`📝 Scheduling ${contentType} content with optimal platform selection...`)

  // Select platforms based on content type
  let platforms: PlatformType[]
  
  switch (contentType) {
    case 'blog':
      platforms = ['blog', 'medium', 'linkedin']
      break
    case 'social':
      platforms = ['twitter', 'linkedin', 'facebook', 'instagram']
      break
    case 'video':
      platforms = ['youtube', 'tiktok', 'instagram']
      break
    case 'newsletter':
      platforms = ['blog', 'medium', 'linkedin']
      break
  }

  console.log(`Selected platforms: ${platforms.join(', ')}`)

  // Get recommendations for each platform
  const recommendations = await Promise.all(
    platforms.map(async (platform) => {
      const rec = await multiPlatformManager.getSchedulingRecommendation(
        platform,
        userId
      )
      return { platform, ...rec }
    })
  )

  // Sort by expected engagement
  recommendations.sort((a, b) => b.expectedEngagement - a.expectedEngagement)

  console.log('\n📊 Recommended Posting Order (by expected engagement):')
  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.platform.toUpperCase()}`)
    console.log(`   Time: ${rec.optimalTime.toLocaleString()}`)
    console.log(`   Expected Engagement: ${rec.expectedEngagement}`)
    console.log(`   Confidence: ${(rec.confidence * 100).toFixed(0)}%`)
  })

  return recommendations
}

// Example usage
if (require.main === module) {
  (async () => {
    const userId = 'demo-user-123'

    console.log('='.repeat(60))
    console.log('SCHEDULING OPTIMIZER INTEGRATION EXAMPLES')
    console.log('='.repeat(60))

    // Example 1: Schedule optimal post
    console.log('\n\n' + '='.repeat(60))
    console.log('EXAMPLE 1: Schedule Single Post with Intelligent Timing')
    console.log('='.repeat(60))
    await scheduleOptimalPost(
      userId,
      'Check out our latest blog post about AI-powered content creation! 🚀',
      'AI-Powered Content Creation Guide',
      ['twitter', 'linkedin', 'facebook']
    )

    // Example 2: Generate content calendar
    console.log('\n\n' + '='.repeat(60))
    console.log('EXAMPLE 2: Generate 30-Day Content Calendar')
    console.log('='.repeat(60))
    await generateContentCalendar(
      userId,
      20,
      ['twitter', 'linkedin', 'instagram']
    )

    // Example 3: Analyze historical performance
    console.log('\n\n' + '='.repeat(60))
    console.log('EXAMPLE 3: Analyze Historical Performance')
    console.log('='.repeat(60))
    await analyzeHistoricalPerformance(
      userId,
      'twitter',
      [
        {
          contentId: 'post-1',
          publishedTime: new Date('2024-01-15T09:00:00Z'),
          views: 1000,
          likes: 50,
          comments: 10,
          shares: 5,
          clicks: 20
        },
        {
          contentId: 'post-2',
          publishedTime: new Date('2024-01-16T15:00:00Z'),
          views: 2000,
          likes: 100,
          comments: 20,
          shares: 12,
          clicks: 40
        },
        {
          contentId: 'post-3',
          publishedTime: new Date('2024-01-17T18:00:00Z'),
          views: 3000,
          likes: 150,
          comments: 30,
          shares: 20,
          clicks: 60
        }
      ]
    )

    // Example 4: Compare platform strategies
    console.log('\n\n' + '='.repeat(60))
    console.log('EXAMPLE 4: Compare Platform Strategies')
    console.log('='.repeat(60))
    await comparePlatformStrategies(['twitter', 'linkedin', 'instagram', 'youtube'])

    // Example 5: Schedule by content type
    console.log('\n\n' + '='.repeat(60))
    console.log('EXAMPLE 5: Schedule by Content Type')
    console.log('='.repeat(60))
    await scheduleByContentType(userId, 'video')

    console.log('\n\n' + '='.repeat(60))
    console.log('ALL EXAMPLES COMPLETED!')
    console.log('='.repeat(60))
  })()
}
