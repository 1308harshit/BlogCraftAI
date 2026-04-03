// System Orchestrator
// Coordinates all components into cohesive revenue engine

import { personalAIBrain } from '../ai-brain/models'
import { outcomeOptimizer } from '../outcome-based-ai/outcome-optimizer'
import { viralEngine } from '../viral-prediction/viral-engine'
import { contentPipeline } from '../automation/content-pipeline'
import { affiliateEngine } from '../monetization/affiliate-engine'
import { multiPlatformManager } from '../platform/multi-platform-manager'
import { revenueAttributionEngine } from '../revenue-attribution/revenue-attribution-engine'
import { businessIntelligence } from '../business-intelligence/business-intelligence'

export class SystemOrchestrator {
  private static instance: SystemOrchestrator

  static getInstance(): SystemOrchestrator {
    if (!SystemOrchestrator.instance) {
      SystemOrchestrator.instance = new SystemOrchestrator()
    }
    return SystemOrchestrator.instance
  }

  // Execute complete content-to-revenue workflow
  async executeRevenueWorkflow(
    userId: string,
    topic: string,
    targetMetric: 'traffic' | 'engagement' | 'conversions' | 'revenue'
  ): Promise<any> {
    console.log(`Starting revenue workflow for user ${userId}...`)

    // 1. Get AI brain recommendations
    const recommendations = await personalAIBrain.getRecommendations(userId, {
      contentType: 'blog',
      topic,
      targetMetric
    })

    // 2. Optimize for target outcome
    const optimizedStrategy = await outcomeOptimizer.optimizeForMetric(
      { title: topic, content: '', type: 'blog' },
      targetMetric
    )

    // 3. Predict viral potential
    const viralScore = await viralEngine.predictViralPotential({
      title: topic,
      content: optimizedStrategy.optimizedContent || '',
      platform: 'blog',
      targetAudience: 'general'
    })

    // 4. Generate content with automation
    const content = await contentPipeline.generateContent({
      topic,
      contentType: 'blog',
      targetLength: 2000,
      includeImages: true,
      seoOptimized: true
    })

    // 5. Add monetization elements
    const monetizedContent = await affiliateEngine.insertAffiliateLinks(
      content.content,
      topic
    )

    // 6. Distribute across platforms
    const distribution = await multiPlatformManager.distributeContent(
      monetizedContent.content,
      ['blog', 'twitter', 'linkedin']
    )

    // 7. Track revenue attribution
    await revenueAttributionEngine.trackTouchpoint({
      userId,
      contentId: content.id,
      channel: 'organic',
      touchpointType: 'content_view',
      timestamp: new Date()
    })

    // 8. Generate business insights
    const insights = await businessIntelligence.generateInsights(userId)

    console.log('Revenue workflow completed successfully')

    return {
      content,
      viralScore,
      distribution,
      insights,
      projectedRevenue: viralScore.projectedMetrics.revenue
    }
  }

  // Health check for all systems
  async healthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = []

    // Check all critical systems
    try {
      // AI Brain
      if (!personalAIBrain) issues.push('AI Brain not initialized')
      
      // Outcome Optimizer
      if (!outcomeOptimizer) issues.push('Outcome Optimizer not initialized')
      
      // Viral Engine
      if (!viralEngine) issues.push('Viral Engine not initialized')
      
      // Content Pipeline
      if (!contentPipeline) issues.push('Content Pipeline not initialized')
      
      // Monetization
      if (!affiliateEngine) issues.push('Affiliate Engine not initialized')
      
      // Platform Manager
      if (!multiPlatformManager) issues.push('Platform Manager not initialized')
      
      // Revenue Attribution
      if (!revenueAttributionEngine) issues.push('Revenue Attribution not initialized')
      
      // Business Intelligence
      if (!businessIntelligence) issues.push('Business Intelligence not initialized')

    } catch (error) {
      issues.push(`Health check error: ${error}`)
    }

    return {
      healthy: issues.length === 0,
      issues
    }
  }
}

export const systemOrchestrator = SystemOrchestrator.getInstance()
