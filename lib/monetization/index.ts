// Monetization Engine - Main Export File
// Centralized exports for the monetization system

// Core interfaces and types
export * from './types'

// Core engines
export { AffiliateEngineImpl, affiliateEngine } from './affiliate-engine'
export { ConversionTracker, conversionTracker } from './conversion-tracker'
export { CTAGenerator, ctaGenerator } from './cta-generator'
export { FunnelCreator, funnelCreator } from './funnel-creator'
export { MonetizationPerformanceOptimizerImpl, monetizationPerformanceOptimizer } from './performance-optimizer'

// Database models
export { MonetizationElementModel, AffiliateProductModel } from './models'

// Main API class for easy usage
export class MonetizationEngine {
  private static instance: MonetizationEngine

  static getInstance(): MonetizationEngine {
    if (!MonetizationEngine.instance) {
      MonetizationEngine.instance = new MonetizationEngine()
    }
    return MonetizationEngine.instance
  }

  // Convenience methods that delegate to the appropriate engines
  async monetizeContent(
    content: string,
    context: {
      userId: string
      topic: string
      keywords: string[]
      targetAudience: string
      contentType: 'blog' | 'social' | 'email' | 'video_script'
    }
  ) {
    const { affiliateEngine } = await import('./affiliate-engine')
    
    // Find relevant products
    const products = await affiliateEngine.findRelevantProducts(content, context)
    
    // Insert affiliate links
    const monetizedContent = await affiliateEngine.insertAffiliateLinks(content, products)
    
    return monetizedContent
  }

  async trackClick(
    contentId: string,
    userId: string,
    productId: string,
    metadata?: Record<string, any>
  ) {
    const { conversionTracker } = await import('./conversion-tracker')
    return await conversionTracker.trackClick(contentId, userId, productId, metadata)
  }

  async trackConversion(
    conversionId: string,
    orderValue: number,
    commission: number
  ) {
    const { conversionTracker } = await import('./conversion-tracker')
    return await conversionTracker.trackConversion(conversionId, orderValue, commission)
  }

  async getPerformanceMetrics(
    contentId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const { conversionTracker } = await import('./conversion-tracker')
    return await conversionTracker.getConversionMetrics(contentId, startDate, endDate)
  }

  async optimizeStrategy(performanceData: any) {
    const { affiliateEngine } = await import('./affiliate-engine')
    return await affiliateEngine.optimizeAffiliateStrategy(performanceData)
  }

  async generateCTA(request: {
    content: string
    context: any
    goal: any
    targetAudience?: string
    brandVoice?: string
  }) {
    const { ctaGenerator } = await import('./cta-generator')
    return await ctaGenerator.generateCTA(request)
  }

  async optimizeCTA(cta: any, performanceData: any) {
    const { ctaGenerator } = await import('./cta-generator')
    return await ctaGenerator.optimizeCTA(cta, performanceData)
  }

  async createCTAABTest(baseCTA: any, variationCount?: number) {
    const { ctaGenerator } = await import('./cta-generator')
    return await ctaGenerator.createABTest(baseCTA, variationCount)
  }

  async analyzeCTAABTest(testConfig: any, results: any[]) {
    const { ctaGenerator } = await import('./cta-generator')
    return await ctaGenerator.analyzeABTest(testConfig, results)
  }

  async createFunnel(request: {
    content: string
    context: any
    businessGoal: any
    targetAudience: string
    brandVoice?: string
  }) {
    const { funnelCreator } = await import('./funnel-creator')
    return await funnelCreator.createFunnel(request)
  }

  async generateLeadMagnet(content: string, topic: string, targetAudience: string) {
    const { funnelCreator } = await import('./funnel-creator')
    return await funnelCreator.generateLeadMagnet(content, topic, targetAudience)
  }

  async createEmailSequence(topic: string, leadMagnet: any, businessGoal: any, brandVoice?: string) {
    const { funnelCreator } = await import('./funnel-creator')
    return await funnelCreator.createEmailSequence(topic, leadMagnet, businessGoal, brandVoice)
  }

  async optimizeFunnel(funnelId: string, performanceData: any) {
    const { funnelCreator } = await import('./funnel-creator')
    return await funnelCreator.optimizeFunnel(funnelId, performanceData)
  }

  async trackFunnelMetrics(funnelId: string) {
    const { funnelCreator } = await import('./funnel-creator')
    return await funnelCreator.trackFunnelMetrics(funnelId)
  }

  // Performance optimization methods
  async analyzeElementPerformance(contentId: string) {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.analyzeElementPerformance(contentId)
  }

  async attributeRevenue(contentId: string) {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.attributeRevenue(contentId)
  }

  async optimizeMonetizationStrategy(contentId: string, performanceData: any) {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.optimizeStrategy(contentId, performanceData)
  }

  async createPerformanceTest(contentId: string, testType: 'placement' | 'element_type' | 'copy' | 'timing') {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.createPerformanceTest(contentId, testType)
  }

  async analyzeTestResults(testId: string) {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.analyzeTestResults(testId)
  }

  async getTopPerformingElements(userId: string, limit?: number) {
    const { monetizationPerformanceOptimizer } = await import('./performance-optimizer')
    return await monetizationPerformanceOptimizer.getTopPerformingElements(userId, limit)
  }
}

// Export singleton instance
export const monetizationEngine = MonetizationEngine.getInstance()
