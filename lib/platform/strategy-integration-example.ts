// Strategy Adapter Integration Example
// Demonstrates how to use platform-specific strategy adaptation

import {
  strategyAdapter,
  multiPlatformManager,
  performanceTracker,
  PlatformType,
  PlatformContent,
  PerformanceMetrics
} from './index'

/**
 * Example 1: Adapt strategy for a single platform based on performance
 */
export async function adaptPlatformStrategy(
  userId: string,
  platform: PlatformType,
  contentId: string,
  platformContentId: string
) {
  console.log(`\n=== Adapting Strategy for ${platform} ===\n`)

  // Step 1: Get current strategy
  const currentStrategy = await multiPlatformManager.generatePlatformStrategy(
    platform,
    userId
  )

  console.log('Current Strategy:', {
    postingFrequency: currentStrategy.postingFrequency,
    contentTypes: currentStrategy.contentTypes,
    engagementTactics: currentStrategy.engagementTactics.slice(0, 3)
  })

  // Step 2: Collect performance data
  const performanceData = await performanceTracker.collectPlatformMetrics(
    contentId,
    platform,
    platformContentId
  )

  console.log('Performance Metrics:', {
    engagement: performanceData.engagement,
    reach: performanceData.reach,
    clicks: performanceData.clicks
  })

  // Step 3: Get content history (mock for example)
  const contentHistory: PlatformContent[] = [
    {
      contentId: 'content_1',
      platform,
      adaptedContent: 'Sample content 1',
      format: 'text',
      metadata: { hashtags: ['example'] },
      status: 'published',
      publishedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      performanceMetrics: {
        views: 1000,
        likes: 50,
        comments: 10,
        shares: 5,
        clicks: 20,
        engagement: 85,
        reach: 800,
        impressions: 1200,
        lastUpdated: new Date()
      }
    }
  ]

  // Step 4: Adapt strategy
  const adaptation = await strategyAdapter.adaptStrategy(
    userId,
    platform,
    currentStrategy,
    performanceData,
    contentHistory
  )

  console.log('\nStrategy Adaptation Results:')
  console.log('- Adaptation Reasons:', adaptation.adaptationReasons.length)
  adaptation.adaptationReasons.forEach((reason) => {
    console.log(`  • ${reason.description}`)
  })

  console.log('\nExpected Impact:')
  console.log(`- Engagement Increase: ${adaptation.expectedImpact.engagementIncrease.toFixed(1)}%`)
  console.log(`- Reach Increase: ${adaptation.expectedImpact.reachIncrease.toFixed(1)}%`)
  console.log(`- Conversion Increase: ${adaptation.expectedImpact.conversionIncrease.toFixed(1)}%`)
  console.log(`- Time to Impact: ${adaptation.expectedImpact.timeToImpact} hours`)
  console.log(`- Confidence: ${(adaptation.confidence * 100).toFixed(1)}%`)

  console.log('\nAdapted Strategy:')
  console.log('- Posting Frequency:', adaptation.adaptedStrategy.postingFrequency)
  console.log('- New Tactics:', adaptation.adaptedStrategy.engagementTactics.slice(0, 5))

  return adaptation
}

/**
 * Example 2: Adapt strategies across all platforms
 */
export async function adaptAllPlatformStrategies(
  userId: string,
  contentId: string,
  platformContents: PlatformContent[]
) {
  console.log(`\n=== Adapting Strategies Across All Platforms ===\n`)

  // Step 1: Collect cross-platform metrics
  const crossPlatformMetrics = await performanceTracker.collectCrossPlatformMetrics(
    contentId,
    platformContents
  )

  console.log('Cross-Platform Performance:')
  console.log(`- Total Reach: ${crossPlatformMetrics.totalReach}`)
  console.log(`- Total Engagement: ${crossPlatformMetrics.totalEngagement}`)
  console.log(`- Best Platform: ${crossPlatformMetrics.bestPerformingPlatform}`)
  console.log(`- Worst Platform: ${crossPlatformMetrics.worstPerformingPlatform}`)

  // Step 2: Adapt strategies for all platforms
  const adaptations = await strategyAdapter.adaptCrossPlatformStrategies(
    userId,
    crossPlatformMetrics,
    platformContents
  )

  console.log(`\nAdapted ${adaptations.size} platform strategies:`)
  adaptations.forEach((adaptation, platform) => {
    console.log(`\n${platform}:`)
    console.log(`- Confidence: ${(adaptation.confidence * 100).toFixed(1)}%`)
    console.log(`- Expected Engagement Increase: ${adaptation.expectedImpact.engagementIncrease.toFixed(1)}%`)
    console.log(`- Adaptation Reasons: ${adaptation.adaptationReasons.length}`)
  })

  return adaptations
}

/**
 * Example 3: Test strategy adaptation with A/B testing
 */
export async function testStrategyWithABTesting(
  userId: string,
  platform: PlatformType
) {
  console.log(`\n=== A/B Testing Strategy Adaptation for ${platform} ===\n`)

  // Step 1: Get current and adapted strategies
  const currentStrategy = await multiPlatformManager.generatePlatformStrategy(
    platform,
    userId
  )

  // Create a mock adapted strategy
  const adaptedStrategy = {
    ...currentStrategy,
    postingFrequency: currentStrategy.postingFrequency + 2,
    engagementTactics: [
      ...currentStrategy.engagementTactics,
      'Use more interactive elements',
      'Increase call-to-action frequency'
    ]
  }

  console.log('Testing Strategy Changes:')
  console.log(`- Original Frequency: ${currentStrategy.postingFrequency}`)
  console.log(`- Adapted Frequency: ${adaptedStrategy.postingFrequency}`)
  console.log(`- New Tactics: ${adaptedStrategy.engagementTactics.length - currentStrategy.engagementTactics.length}`)

  // Step 2: Run A/B test
  const testResult = await strategyAdapter.testStrategyAdaptation(
    userId,
    platform,
    currentStrategy,
    adaptedStrategy,
    168 // 7 days
  )

  console.log('\nA/B Test Results:')
  console.log(`- Performance Improvement: ${testResult.performanceImprovement.toFixed(1)}%`)
  console.log(`- Statistical Significance: ${(testResult.statisticalSignificance * 100).toFixed(1)}%`)
  console.log(`- Recommendation: ${testResult.recommendation.toUpperCase()}`)

  if (testResult.recommendation === 'adopt') {
    console.log('\n✓ Strategy adaptation successful - implementing changes')
  } else if (testResult.recommendation === 'reject') {
    console.log('\n✗ Strategy adaptation not effective - reverting to original')
  } else {
    console.log('\n⏳ Continue testing - need more data for conclusive results')
  }

  return testResult
}

/**
 * Example 4: Detect and respond to algorithm changes
 */
export async function detectAndAdaptToAlgorithmChanges(
  platform: PlatformType,
  userId: string
) {
  console.log(`\n=== Detecting Algorithm Changes for ${platform} ===\n`)

  // Mock recent and historical performance data
  const recentPerformance: PerformanceMetrics[] = [
    {
      views: 500,
      likes: 20,
      comments: 5,
      shares: 2,
      clicks: 10,
      engagement: 37,
      reach: 400,
      impressions: 600,
      lastUpdated: new Date()
    },
    {
      views: 450,
      likes: 18,
      comments: 4,
      shares: 2,
      clicks: 9,
      engagement: 33,
      reach: 380,
      impressions: 550,
      lastUpdated: new Date()
    }
  ]

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

  // Detect algorithm changes
  const algorithmUpdate = await strategyAdapter.detectAlgorithmChanges(
    platform,
    recentPerformance,
    historicalPerformance
  )

  if (algorithmUpdate) {
    console.log('⚠️  Algorithm Change Detected!')
    console.log(`- Type: ${algorithmUpdate.updateType}`)
    console.log(`- Description: ${algorithmUpdate.description}`)
    console.log(`- Detected At: ${algorithmUpdate.detectedAt.toISOString()}`)
    console.log(`- Adaptation Required: ${algorithmUpdate.adaptationRequired ? 'YES' : 'NO'}`)

    if (algorithmUpdate.adaptationRequired) {
      console.log('\nSuggested Changes:')
      algorithmUpdate.suggestedChanges.forEach((change, index) => {
        console.log(`${index + 1}. ${change}`)
      })

      // Automatically adapt strategy
      console.log('\n🔄 Automatically adapting strategy...')
      const currentStrategy = await multiPlatformManager.generatePlatformStrategy(
        platform,
        userId
      )

      // In production, this would trigger a full strategy re-evaluation
      console.log('✓ Strategy adaptation initiated')
    }
  } else {
    console.log('✓ No significant algorithm changes detected')
  }

  return algorithmUpdate
}

/**
 * Example 5: Generate comprehensive adaptation report
 */
export async function generateStrategyAdaptationReport(
  userId: string,
  platform: PlatformType
) {
  console.log(`\n=== Strategy Adaptation Report for ${platform} ===\n`)

  const timeRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  }

  const report = await strategyAdapter.generateAdaptationReport(
    userId,
    platform,
    timeRange
  )

  console.log(`Platform: ${report.platform}`)
  console.log(`Active Adaptations: ${report.adaptations.length}`)

  if (report.adaptations.length > 0) {
    const adaptation = report.adaptations[0]
    console.log('\nCurrent Adaptation:')
    console.log(`- Implemented: ${adaptation.implementedAt.toISOString()}`)
    console.log(`- Confidence: ${(adaptation.confidence * 100).toFixed(1)}%`)
    console.log(`- Adaptation Reasons: ${adaptation.adaptationReasons.length}`)

    console.log('\nPerformance Impact:')
    console.log(`- Engagement Change: ${report.performanceImpact.engagementChange.toFixed(1)}%`)
    console.log(`- Reach Change: ${report.performanceImpact.reachChange.toFixed(1)}%`)
    console.log(`- Conversion Change: ${report.performanceImpact.conversionChange.toFixed(1)}%`)
  }

  console.log('\nRecommendations:')
  report.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`)
  })

  return report
}

/**
 * Example 6: Complete workflow - Monitor, Detect, Adapt
 */
export async function completeAdaptationWorkflow(
  userId: string,
  contentId: string,
  platform: PlatformType,
  platformContentId: string
) {
  console.log(`\n=== Complete Strategy Adaptation Workflow ===\n`)

  // Step 1: Monitor performance
  console.log('Step 1: Monitoring performance...')
  const performanceData = await performanceTracker.collectPlatformMetrics(
    contentId,
    platform,
    platformContentId
  )

  // Step 2: Generate insights
  console.log('Step 2: Generating performance insights...')
  const crossPlatformMetrics = await performanceTracker.collectCrossPlatformMetrics(
    contentId,
    [{
      contentId,
      platform,
      adaptedContent: 'Sample content',
      format: 'text',
      metadata: {},
      status: 'published',
      publishedTime: new Date(),
      performanceMetrics: performanceData
    }]
  )

  const insights = await performanceTracker.generateInsights(contentId, crossPlatformMetrics)
  console.log(`Found ${insights.length} performance insights`)

  // Step 3: Check for algorithm changes
  console.log('Step 3: Checking for algorithm changes...')
  // (Would use real historical data in production)

  // Step 4: Adapt strategy if needed
  console.log('Step 4: Adapting strategy based on insights...')
  const currentStrategy = await multiPlatformManager.generatePlatformStrategy(
    platform,
    userId
  )

  const adaptation = await strategyAdapter.adaptStrategy(
    userId,
    platform,
    currentStrategy,
    performanceData,
    []
  )

  // Step 5: Test adaptation
  console.log('Step 5: Testing adapted strategy...')
  const testResult = await strategyAdapter.testStrategyAdaptation(
    userId,
    platform,
    currentStrategy,
    adaptation.adaptedStrategy,
    168
  )

  // Step 6: Implement if successful
  if (testResult.recommendation === 'adopt') {
    console.log('\n✓ Strategy adaptation successful!')
    console.log('Implementing adapted strategy across all content...')
  }

  console.log('\n=== Workflow Complete ===')

  return {
    performanceData,
    insights,
    adaptation,
    testResult
  }
}

// Example usage
if (require.main === module) {
  const userId = 'user_123'
  const contentId = 'content_456'
  const platform: PlatformType = 'twitter'
  const platformContentId = 'twitter_content_789'

  // Run examples
  ;(async () => {
    try {
      // Example 1: Single platform adaptation
      await adaptPlatformStrategy(userId, platform, contentId, platformContentId)

      // Example 2: Cross-platform adaptation
      // await adaptAllPlatformStrategies(userId, contentId, platformContents)

      // Example 3: A/B testing
      await testStrategyWithABTesting(userId, platform)

      // Example 4: Algorithm change detection
      await detectAndAdaptToAlgorithmChanges(platform, userId)

      // Example 5: Adaptation report
      await generateStrategyAdaptationReport(userId, platform)

      // Example 6: Complete workflow
      // await completeAdaptationWorkflow(userId, contentId, platform, platformContentId)
    } catch (error) {
      console.error('Error running examples:', error)
    }
  })()
}
