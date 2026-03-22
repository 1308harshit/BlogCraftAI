// Performance Tracking Integration Example
// Demonstrates how to use the real-time cross-platform performance tracking system

import { 
  performanceTracker,
  multiPlatformManager,
  PlatformContent,
  PlatformType
} from './index'

/**
 * Example 1: Basic Performance Tracking
 * Track performance for a single piece of content across multiple platforms
 */
export async function basicPerformanceTracking() {
  const contentId = 'blog_post_123'
  
  // Define platform content (would come from database in production)
  const platformContents: PlatformContent[] = [
    {
      contentId,
      platform: 'twitter',
      adaptedContent: 'Check out our latest blog post on AI trends! 🚀 #AI #Tech',
      format: 'text',
      metadata: { hashtags: ['AI', 'Tech'] },
      status: 'published',
      publishedTime: new Date('2024-01-15T10:00:00Z'),
      id: 'twitter_123'
    },
    {
      contentId,
      platform: 'linkedin',
      adaptedContent: 'Excited to share our latest insights on AI trends...',
      format: 'article',
      metadata: {},
      status: 'published',
      publishedTime: new Date('2024-01-15T10:30:00Z'),
      id: 'linkedin_456'
    },
    {
      contentId,
      platform: 'medium',
      adaptedContent: 'Full article content...',
      format: 'article',
      metadata: {},
      status: 'published',
      publishedTime: new Date('2024-01-15T11:00:00Z'),
      id: 'medium_789'
    }
  ]

  // Collect cross-platform metrics
  const metrics = await performanceTracker.collectCrossPlatformMetrics(
    contentId,
    platformContents
  )

  console.log('Cross-Platform Performance:')
  console.log(`Total Reach: ${metrics.totalReach}`)
  console.log(`Total Engagement: ${metrics.totalEngagement}`)
  console.log(`Engagement Rate: ${(metrics.overallEngagementRate * 100).toFixed(2)}%`)
  console.log(`Best Platform: ${metrics.bestPerformingPlatform}`)
  console.log(`Worst Platform: ${metrics.worstPerformingPlatform}`)

  return metrics
}

/**
 * Example 2: Generate Performance Insights
 * Get actionable insights and recommendations
 */
export async function generatePerformanceInsights() {
  const contentId = 'blog_post_123'
  
  const platformContents: PlatformContent[] = [
    // ... same as above
  ]

  // Get insights
  const insights = await multiPlatformManager.getPerformanceInsights(
    contentId,
    platformContents
  )

  console.log('\nPerformance Insights:')
  insights.forEach((insight, index) => {
    console.log(`\n${index + 1}. [${insight.type.toUpperCase()}] ${insight.title}`)
    console.log(`   ${insight.description}`)
    console.log(`   Recommendation: ${insight.recommendation}`)
    if (insight.platform) {
      console.log(`   Platform: ${insight.platform}`)
    }
  })

  return insights
}

/**
 * Example 3: Generate Consolidated Report
 * Create a comprehensive performance report with trends and recommendations
 */
export async function generateConsolidatedReport() {
  const contentId = 'blog_post_123'
  
  const platformContents: PlatformContent[] = [
    // ... same as above
  ]

  // Generate report for last 7 days
  const report = await multiPlatformManager.generatePerformanceReport(
    contentId,
    platformContents,
    {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  )

  console.log('\n=== Performance Report ===')
  console.log(`Content ID: ${report.contentId}`)
  console.log(`Period: ${report.timeRange.start.toLocaleDateString()} - ${report.timeRange.end.toLocaleDateString()}`)
  
  console.log('\nOverall Metrics:')
  console.log(`- Total Reach: ${report.overallMetrics.totalReach}`)
  console.log(`- Total Engagement: ${report.overallMetrics.totalEngagement}`)
  console.log(`- Total Clicks: ${report.overallMetrics.totalClicks}`)
  console.log(`- Engagement Rate: ${(report.overallMetrics.overallEngagementRate * 100).toFixed(2)}%`)

  console.log('\nTrend Analysis:')
  console.log(`- Growth Rate: ${report.trendAnalysis.growthRate.toFixed(2)}%`)
  console.log(`- Momentum: ${report.trendAnalysis.momentum}`)
  console.log(`- Peak Platform: ${report.trendAnalysis.peakPlatform}`)
  console.log(`- Projected Reach: ${report.trendAnalysis.projectedReach}`)

  console.log('\nTop Recommendations:')
  report.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`)
  })

  return report
}

/**
 * Example 4: Platform-Specific Metrics Collection
 * Collect metrics for a specific platform
 */
export async function collectPlatformSpecificMetrics() {
  const contentId = 'blog_post_123'
  const platform: PlatformType = 'twitter'
  const platformContentId = 'twitter_123'

  // Collect metrics for Twitter only
  const metrics = await performanceTracker.collectPlatformMetrics(
    contentId,
    platform,
    platformContentId
  )

  console.log(`\n${platform} Performance:`)
  console.log(`- Views: ${metrics.views}`)
  console.log(`- Likes: ${metrics.likes}`)
  console.log(`- Comments: ${metrics.comments}`)
  console.log(`- Shares: ${metrics.shares}`)
  console.log(`- Clicks: ${metrics.clicks}`)
  console.log(`- Engagement: ${metrics.engagement}`)
  console.log(`- Reach: ${metrics.reach}`)

  return metrics
}

/**
 * Example 5: Batch Performance Collection
 * Collect metrics for multiple content pieces at once
 */
export async function batchPerformanceCollection() {
  const contentItems = [
    {
      contentId: 'blog_post_123',
      platformContents: [
        // ... platform contents for post 123
      ]
    },
    {
      contentId: 'blog_post_456',
      platformContents: [
        // ... platform contents for post 456
      ]
    },
    {
      contentId: 'blog_post_789',
      platformContents: [
        // ... platform contents for post 789
      ]
    }
  ]

  // Batch collect metrics
  const results = await performanceTracker.batchCollectMetrics(contentItems)

  console.log('\n=== Batch Performance Results ===')
  results.forEach((metrics, contentId) => {
    console.log(`\nContent: ${contentId}`)
    console.log(`- Reach: ${metrics.totalReach}`)
    console.log(`- Engagement: ${metrics.totalEngagement}`)
    console.log(`- Best Platform: ${metrics.bestPerformingPlatform}`)
  })

  return results
}

/**
 * Example 6: Real-Time Monitoring Dashboard
 * Simulate a real-time monitoring dashboard
 */
export async function realTimeMonitoringDashboard() {
  const contentId = 'blog_post_123'
  
  const platformContents: PlatformContent[] = [
    // ... platform contents
  ]

  console.log('\n=== Real-Time Monitoring Dashboard ===')
  console.log('Collecting metrics every 5 minutes...\n')

  // Check cache first
  const cached = await performanceTracker.getCachedMetrics(contentId)
  if (cached) {
    console.log('Using cached metrics (updated:', cached.lastUpdated.toLocaleTimeString(), ')')
    displayDashboard(cached)
  } else {
    console.log('No cache found, collecting fresh metrics...')
    const fresh = await performanceTracker.collectCrossPlatformMetrics(
      contentId,
      platformContents
    )
    displayDashboard(fresh)
  }
}

function displayDashboard(metrics: any) {
  console.log('\n┌─────────────────────────────────────┐')
  console.log('│     Performance Dashboard           │')
  console.log('├─────────────────────────────────────┤')
  console.log(`│ Total Reach:       ${metrics.totalReach.toString().padStart(15)} │`)
  console.log(`│ Total Engagement:  ${metrics.totalEngagement.toString().padStart(15)} │`)
  console.log(`│ Total Clicks:      ${metrics.totalClicks.toString().padStart(15)} │`)
  console.log(`│ Engagement Rate:   ${(metrics.overallEngagementRate * 100).toFixed(2).padStart(13)}% │`)
  console.log('├─────────────────────────────────────┤')
  console.log(`│ Best Platform:     ${metrics.bestPerformingPlatform.padEnd(15)} │`)
  console.log(`│ Worst Platform:    ${metrics.worstPerformingPlatform.padEnd(15)} │`)
  console.log('└─────────────────────────────────────┘')
}

/**
 * Example 7: Rate Limit Management
 * Check and manage API rate limits
 */
export async function managePlatformRateLimits() {
  const platforms: PlatformType[] = ['twitter', 'linkedin', 'instagram', 'youtube']

  console.log('\n=== Platform Rate Limits ===')
  
  for (const platform of platforms) {
    const rateLimits = performanceTracker.getRateLimitInfo(platform)
    
    console.log(`\n${platform}:`)
    console.log(`- Requests/Hour: ${rateLimits.requestsPerHour}`)
    console.log(`- Requests/Day: ${rateLimits.requestsPerDay}`)
    console.log(`- Current Usage: ${rateLimits.currentUsage}`)
    console.log(`- Reset Time: ${rateLimits.resetTime.toLocaleTimeString()}`)
    
    const usagePercent = (rateLimits.currentUsage / rateLimits.requestsPerHour) * 100
    if (usagePercent > 90) {
      console.log(`⚠️  WARNING: ${usagePercent.toFixed(1)}% of rate limit used!`)
    }
  }
}

/**
 * Example 8: Historical Metrics Tracking
 * Track and analyze metrics over time
 */
export async function trackHistoricalMetrics() {
  const contentId = 'blog_post_123'
  const platform: PlatformType = 'twitter'

  // Simulate collecting metrics at different times
  const metrics = await performanceTracker.collectPlatformMetrics(
    contentId,
    platform,
    'twitter_123'
  )

  // Track in history
  await performanceTracker.trackMetricsHistory(contentId, platform, metrics)

  console.log('\n✓ Metrics tracked in history')
  console.log('Historical data will be retained for 30 days')
}

/**
 * Example 9: Integration with Content Distribution
 * Complete workflow: distribute content and track performance
 */
export async function completeContentWorkflow() {
  console.log('\n=== Complete Content Workflow ===\n')

  // Step 1: Distribute content
  console.log('Step 1: Distributing content across platforms...')
  const distribution = await multiPlatformManager.distributeContent({
    userId: 'user_123',
    contentId: 'blog_post_123',
    content: 'Amazing insights on AI trends and their impact on business...',
    title: 'AI Trends 2024: What You Need to Know',
    platforms: ['twitter', 'linkedin', 'medium', 'facebook'],
    schedule: {
      platforms: ['twitter', 'linkedin', 'medium', 'facebook'],
      scheduleStrategy: 'optimal'
    }
  })

  console.log(`✓ Content distributed to ${distribution.successfulAdaptations} platforms`)

  // Step 2: Wait for content to be published (simulated)
  console.log('\nStep 2: Waiting for content to be published...')
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Step 3: Track performance
  console.log('\nStep 3: Tracking performance...')
  const metrics = await multiPlatformManager.trackCrossPlatformPerformance(
    'blog_post_123',
    distribution.platformContent
  )

  console.log(`✓ Performance tracked across ${Object.keys(metrics.platformBreakdown).length} platforms`)

  // Step 4: Generate insights
  console.log('\nStep 4: Generating insights...')
  const insights = await multiPlatformManager.getPerformanceInsights(
    'blog_post_123',
    distribution.platformContent
  )

  console.log(`✓ Generated ${insights.length} actionable insights`)

  // Step 5: Generate report
  console.log('\nStep 5: Generating consolidated report...')
  const report = await multiPlatformManager.generatePerformanceReport(
    'blog_post_123',
    distribution.platformContent
  )

  console.log(`✓ Report generated with ${report.recommendations.length} recommendations`)

  console.log('\n=== Workflow Complete ===')
  
  return {
    distribution,
    metrics,
    insights,
    report
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║  Performance Tracking System - Integration Examples   ║')
  console.log('╚════════════════════════════════════════════════════════╝')

  try {
    await basicPerformanceTracking()
    await generatePerformanceInsights()
    await generateConsolidatedReport()
    await collectPlatformSpecificMetrics()
    await realTimeMonitoringDashboard()
    await managePlatformRateLimits()
    await trackHistoricalMetrics()
    await completeContentWorkflow()

    console.log('\n✓ All examples completed successfully!')
  } catch (error) {
    console.error('\n✗ Error running examples:', error)
  }
}

// Export for use in other modules
export default {
  basicPerformanceTracking,
  generatePerformanceInsights,
  generateConsolidatedReport,
  collectPlatformSpecificMetrics,
  batchPerformanceCollection,
  realTimeMonitoringDashboard,
  managePlatformRateLimits,
  trackHistoricalMetrics,
  completeContentWorkflow,
  runAllExamples
}
