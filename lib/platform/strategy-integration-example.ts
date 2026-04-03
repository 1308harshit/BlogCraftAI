// Strategy Adapter Integration Examples
// Demonstrates how to use the Strategy Adapter in real-world scenarios

import {
  strategyAdapter,
  multiPlatformManager,
  performanceTracker,
  schedulingOptimizer,
  PlatformType,
  PlatformStrategy,
  PerformanceMetrics,
  PlatformContent
} from './index'

// Example 1: Basic Strategy Adaptation
export async function example1_BasicAdaptation() {
  console.log('=== Example 1: Basic Strategy Adaptation ===\n')

  const userId = 'user123'
  const platform: PlatformType = 'twitter'
  
  // Current strategy
  const currentStrategy: PlatformStrategy = {
    platform: 'twitter',
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
  }

  // Recent performance metrics (underperforming)
  const performanceMetrics: PerformanceMetrics = {
    views: 3000,
    likes: 50,
    comments: 10,
    shares: 5,
    clicks: 30,
    engagement: 95,
    reach: 2500,
    impressions: 4000,
    lastUpdated: new Date()
  }

  // Content history
  const contentHistory: PlatformContent[] = [
    {
      contentId: 'content1',
      platform: 'twitter',
      adaptedContent: 'Sample content 1',
      format: 'text',
      metadata: {},
      status: 'published',
      publishedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      performanceMetrics: {
        views: 5000,
        likes: 150,
        comments: 30,
        shares: 20,
        clicks: 100,
        engagement: 300,
        reach: 4000,
        impressions: 6000,
        lastUpdated: new Date()
      }
    }
  ]

  // Adapt strategy
  const adaptation = await strategyAdapter.adaptStrategy(
    userId,
    platform,
    currentStrategy,
    performanceMetrics,
    contentHistory
  )

  console.log('Adaptation Reason:', adaptation.reason)
  console.log('Confidence:', (adaptation.confidence * 100).toFixed(1) + '%')
  console.log('\nExpected Impact:')
  console.log('  Engagement:', adaptation.expectedImpact.engagementChange + '%')
  console.log('  Reach:', adaptation.expectedImpact.reachChange + '%')
  console.log('  Time to Impact:', adaptation.expectedImpact.timeToImpact, 'days')
  console.log('\nChanges:')
  adaptation.changes.forEach(change => console.log('  -', change))
  console.log('\nAdapted Strategy:')
  console.log('  Posting Frequency:', adaptation.adaptedStrategy.postingFrequency)
  console.log('  Content Types:', adaptation.adaptedStrategy.contentTypes.join(', '))
  console.log('  Engagement Tactics:', adaptation.adaptedStrategy.engagementTactics.slice(0, 3).join(', '))
}

// Example 2: Cross-Platform Strategy Adaptation
export async function example2_CrossPlatformAdaptation() {
  console.log('\n=== Example 2: Cross-Platform Strategy Adaptation ===\n')

  const userId = 'user123'
  const contentId = 'content_multi_123'
  
  // Platform contents
  const platformContents: PlatformContent[] = [
    {
      contentId,
      platform: 'twitter',
      adaptedContent: 'Twitter content',
      format: 'text',
      metadata: {},
      status: 'published',
      publishedTime: new Date(),
      performanceMetrics: {
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
    },
    {
      contentId,
      platform: 'linkedin',
      adaptedContent: 'LinkedIn content',
      format: 'article',
      metadata: {},
      status: 'published',
      publishedTime: new Date(),
      performanceMetrics: {
        views: 5000,
        likes: 200,
        comments: 40,
        shares: 30,
        clicks: 100,
        engagement: 370,
        reach: 4000,
        impressions: 6000,
        lastUpdated: new Date()
      }
    },
    {
      contentId,
      platform: 'instagram',
      adaptedContent: 'Instagram content',
      format: 'image',
      metadata: {},
      status: 'published',
      publishedTime: new Date(),
      performanceMetrics: {
        views: 8000,
        likes: 400,
        comments: 60,
        shares: 20,
        clicks: 80,
        engagement: 560,
        reach: 7000,
        impressions: 10000,
        saves: 50,
        lastUpdated: new Date()
      }
    }
  ]

  // Get cross-platform metrics
  const crossPlatformMetrics = await multiPlatformManager.trackCrossPlatformPerformance(
    contentId,
    platformContents
  )

  console.log('Cross-Platform Performance:')
  console.log('  Total Reach:', crossPlatformMetrics.totalReach.toLocaleString())
  console.log('  Total Engagement:', crossPlatformMetrics.totalEngagement.toLocaleString())
  console.log('  Engagement Rate:', (crossPlatformMetrics.overallEngagementRate * 100).toFixed(2) + '%')
  console.log('  Best Platform:', crossPlatformMetrics.bestPerformingPlatform)
  console.log('  Worst Platform:', crossPlatformMetrics.worstPerformingPlatform)

  // Adapt strategies for all platforms
  const adaptations = await strategyAdapter.adaptCrossPlatformStrategies(
    userId,
    crossPlatformMetrics,
    platformContents
  )

  console.log('\nStrategy Adaptations:')
  for (const [platform, adaptation] of adaptations) {
    console.log(`\n${platform.toUpperCase()}:`)
    console.log('  Reason:', adaptation.reason)
    console.log('  Confidence:', (adaptation.confidence * 100).toFixed(1) + '%')
    console.log('  Expected Engagement Change:', adaptation.expectedImpact.engagementChange + '%')
    console.log('  Key Changes:', adaptation.changes.slice(0, 2).join(', '))
  }
}

// Example 3: A/B Testing Strategy Adaptations
export async function example3_ABTesting() {
  console.log('\n=== Example 3: A/B Testing Strategy Adaptations ===\n')

  const userId = 'user123'
  const platform: PlatformType = 'linkedin'

  const originalStrategy: PlatformStrategy = {
    platform: 'linkedin',
    contentTypes: ['text', 'article'],
    postingFrequency: 2,
    optimalTimes: [],
    hashtagStrategy: ['professional', 'industry'],
    engagementTactics: [
      'Share industry insights',
      'Engage with comments'
    ],
    performanceGoals: {
      engagement: 0.04,
      reach: 3000,
      clicks: 80
    }
  }

  const adaptedStrategy: PlatformStrategy = {
    ...originalStrategy,
    contentTypes: ['text', 'article', 'video'],
    postingFrequency: 3,
    engagementTactics: [
      'Share industry insights',
      'Engage with comments',
      'Use video content',
      'Post thought leadership pieces'
    ]
  }

  console.log('Testing Strategy Adaptation...')
  console.log('Original Posting Frequency:', originalStrategy.postingFrequency)
  console.log('Adapted Posting Frequency:', adaptedStrategy.postingFrequency)
  console.log('New Content Types:', adaptedStrategy.contentTypes.filter(
    t => !originalStrategy.contentTypes.includes(t)
  ).join(', '))

  // Run A/B test
  const testResult = await strategyAdapter.testStrategyAdaptation(
    userId,
    platform,
    originalStrategy,
    adaptedStrategy,
    14 // 14 days
  )

  console.log('\nTest Results:')
  console.log('  Test Duration:', 14, 'days')
  console.log('  Winner:', testResult.winner.toUpperCase())
  console.log('  Improvement:', testResult.improvementPercentage.toFixed(2) + '%')
  console.log('  Statistical Significance:', (testResult.statisticalSignificance * 100).toFixed(1) + '%')
  
  console.log('\nOriginal Performance:')
  console.log('  Engagement:', testResult.originalPerformance.engagement)
  console.log('  Reach:', testResult.originalPerformance.reach)
  console.log('  Engagement Rate:', (
    testResult.originalPerformance.engagement / testResult.originalPerformance.reach * 100
  ).toFixed(2) + '%')

  console.log('\nTest Performance:')
  console.log('  Engagement:', testResult.testPerformance.engagement)
  console.log('  Reach:', testResult.testPerformance.reach)
  console.log('  Engagement Rate:', (
    testResult.testPerformance.engagement / testResult.testPerformance.reach * 100
  ).toFixed(2) + '%')

  if (testResult.winner === 'test') {
    console.log('\n✓ Recommendation: Implement adapted strategy')
  } else if (testResult.winner === 'original') {
    console.log('\n✓ Recommendation: Keep original strategy')
  } else {
    console.log('\n⚠ Recommendation: Continue testing or gather more data')
  }
}

// Example 4: Algorithm Change Detection
export async function example4_AlgorithmDetection() {
  console.log('\n=== Example 4: Algorithm Change Detection ===\n')

  const platform: PlatformType = 'instagram'

  // Historical performance (good)
  const historicalPerformance: PerformanceMetrics[] = []
  for (let i = 0; i < 15; i++) {
    historicalPerformance.push({
      views: 10000 + Math.random() * 2000,
      likes: 500 + Math.random() * 100,
      comments: 80 + Math.random() * 20,
      shares: 40 + Math.random() * 10,
      clicks: 200 + Math.random() * 50,
      engagement: 820 + Math.random() * 100,
      reach: 8000 + Math.random() * 1000,
      impressions: 12000 + Math.random() * 2000,
      lastUpdated: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000)
    })
  }

  // Recent performance (significantly worse - algorithm change)
  const recentPerformance: PerformanceMetrics[] = []
  for (let i = 0; i < 10; i++) {
    recentPerformance.push({
      views: 5000 + Math.random() * 1000,
      likes: 200 + Math.random() * 50,
      comments: 30 + Math.random() * 10,
      shares: 15 + Math.random() * 5,
      clicks: 80 + Math.random() * 20,
      engagement: 325 + Math.random() * 50,
      reach: 4000 + Math.random() * 500,
      impressions: 6000 + Math.random() * 1000,
      lastUpdated: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000)
    })
  }

  console.log('Analyzing Performance Trends...')
  
  const historicalAvg = historicalPerformance.reduce((sum, m) => sum + m.engagement, 0) / historicalPerformance.length
  const recentAvg = recentPerformance.reduce((sum, m) => sum + m.engagement, 0) / recentPerformance.length
  
  console.log('Historical Avg Engagement:', historicalAvg.toFixed(0))
  console.log('Recent Avg Engagement:', recentAvg.toFixed(0))
  console.log('Change:', ((recentAvg - historicalAvg) / historicalAvg * 100).toFixed(1) + '%')

  // Detect algorithm changes
  const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
    platform,
    recentPerformance,
    historicalPerformance
  )

  if (algorithmUpdate) {
    console.log('\n🚨 Algorithm Change Detected!')
    console.log('  Platform:', algorithmUpdate.platform)
    console.log('  Change Type:', algorithmUpdate.changeType.toUpperCase())
    console.log('  Confidence:', (algorithmUpdate.confidence * 100).toFixed(1) + '%')
    console.log('  Affected Metrics:', algorithmUpdate.affectedMetrics.join(', '))
    console.log('\nRecommended Actions:')
    algorithmUpdate.recommendedActions.forEach((action, i) => {
      console.log(`  ${i + 1}. ${action}`)
    })
  } else {
    console.log('\n✓ No significant algorithm changes detected')
  }
}

// Example 5: Comprehensive Adaptation Report
export async function example5_AdaptationReport() {
  console.log('\n=== Example 5: Comprehensive Adaptation Report ===\n')

  const userId = 'user123'
  const platform: PlatformType = 'youtube'
  const timeRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  }

  console.log('Generating Adaptation Report...')
  console.log('Platform:', platform)
  console.log('Time Range:', timeRange.start.toLocaleDateString(), '-', timeRange.end.toLocaleDateString())

  const report = await strategyAdapter.generateAdaptationReport(
    userId,
    platform,
    timeRange
  )

  console.log('\nReport Summary:')
  console.log('  Adaptations Made:', report.adaptations.length)
  console.log('  Tests Conducted:', report.testResults.length)
  console.log('  Algorithm Updates Detected:', report.algorithmUpdates.length)

  console.log('\nOverall Impact:')
  console.log('  Engagement Improvement:', report.overallImpact.engagementImprovement.toFixed(1) + '%')
  console.log('  Reach Improvement:', report.overallImpact.reachImprovement.toFixed(1) + '%')
  console.log('  Success Rate:', (report.overallImpact.successRate * 100).toFixed(1) + '%')

  console.log('\nTop Recommendations:')
  report.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`)
  })
}

// Example 6: Integration with Performance Tracker
export async function example6_PerformanceIntegration() {
  console.log('\n=== Example 6: Integration with Performance Tracker ===\n')

  const userId = 'user123'
  const contentId = 'content_456'
  const platform: PlatformType = 'tiktok'
  const platformContentId = 'tiktok_content_456'

  // Collect real-time metrics
  console.log('Collecting Performance Metrics...')
  const metrics = await performanceTracker.collectPlatformMetrics(
    contentId,
    platform,
    platformContentId
  )

  console.log('Current Performance:')
  console.log('  Views:', metrics.views.toLocaleString())
  console.log('  Engagement:', metrics.engagement.toLocaleString())
  console.log('  Reach:', metrics.reach.toLocaleString())
  console.log('  Engagement Rate:', (metrics.engagement / metrics.reach * 100).toFixed(2) + '%')

  // Generate insights
  const crossPlatformMetrics = {
    contentId,
    totalReach: metrics.reach,
    totalEngagement: metrics.engagement,
    totalClicks: metrics.clicks,
    platformBreakdown: { [platform]: metrics },
    bestPerformingPlatform: platform,
    worstPerformingPlatform: platform,
    overallEngagementRate: metrics.engagement / metrics.reach,
    lastUpdated: new Date()
  }

  const insights = await performanceTracker.generateInsights(contentId, crossPlatformMetrics)

  console.log('\nPerformance Insights:')
  insights.slice(0, 3).forEach(insight => {
    console.log(`  ${insight.type.toUpperCase()}: ${insight.title}`)
    console.log(`    ${insight.description}`)
    console.log(`    Recommendation: ${insight.recommendation}`)
  })

  // Adapt strategy if needed
  const needsAdaptation = insights.some(i => i.type === 'warning' || i.type === 'alert')
  
  if (needsAdaptation) {
    console.log('\n⚠ Performance issues detected - adapting strategy...')
    
    const currentStrategy: PlatformStrategy = {
      platform,
      contentTypes: ['video'],
      postingFrequency: 2,
      optimalTimes: [],
      hashtagStrategy: ['trending', 'viral'],
      engagementTactics: ['Use trending sounds', 'Hook in first 3 seconds'],
      performanceGoals: {
        engagement: 0.05,
        reach: 10000,
        clicks: 200
      }
    }

    const adaptation = await strategyAdapter.adaptStrategy(
      userId,
      platform,
      currentStrategy,
      metrics,
      []
    )

    console.log('\nStrategy Adapted:')
    console.log('  Reason:', adaptation.reason)
    console.log('  Confidence:', (adaptation.confidence * 100).toFixed(1) + '%')
    console.log('  Expected Impact:', adaptation.expectedImpact.engagementChange + '% engagement increase')
  } else {
    console.log('\n✓ Performance is healthy - no adaptation needed')
  }
}

// Run all examples
export async function runAllExamples() {
  try {
    await example1_BasicAdaptation()
    await example2_CrossPlatformAdaptation()
    await example3_ABTesting()
    await example4_AlgorithmDetection()
    await example5_AdaptationReport()
    await example6_PerformanceIntegration()
    
    console.log('\n=== All Examples Completed Successfully ===\n')
  } catch (error) {
    console.error('Error running examples:', error)
  }
}

// Uncomment to run examples
// runAllExamples()
