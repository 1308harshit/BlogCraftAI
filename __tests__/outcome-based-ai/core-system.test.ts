// Test for Outcome-Based AI Core System
// Validates Task 3.1 implementation

import { ContentOptimizer } from '../../lib/outcome-based-ai/content-optimizer'
import { OutcomeOptimizer } from '../../lib/outcome-based-ai/outcome-optimizer'
import { BusinessMetric } from '../../lib/outcome-based-ai/types'

describe('Outcome-Based AI Core System', () => {
  const contentOptimizer = ContentOptimizer.getInstance()
  const outcomeOptimizer = OutcomeOptimizer.getInstance()
  
  const sampleContent = `
# How to Boost Your Business Performance

Running a successful business requires strategic thinking and consistent execution. 

In this comprehensive guide, we'll explore proven strategies that can help you achieve better results.

## Understanding Your Market

Market research is crucial for business success. You need to understand your customers' needs and preferences.

## Implementing Effective Strategies

Once you understand your market, you can implement targeted strategies that drive growth.

## Measuring Success

Track your progress with key performance indicators and adjust your approach as needed.

## Conclusion

Success in business comes from continuous improvement and adaptation to market changes.
  `.trim()

  const createTestMetric = (type: BusinessMetric['type'], targetValue: number = 1000): BusinessMetric => ({
    metricId: `${type}_${Date.now()}`,
    type,
    name: `${type} Growth`,
    description: `Optimize content for increased ${type}`,
    unit: type === 'revenue' ? 'dollars' : 'count',
    targetValue,
    currentValue: 0,
    priority: 8,
    timeframe: 30,
    calculationMethod: 'sum',
    dependencies: [],
    benchmarks: []
  })

  describe('Traffic Optimization', () => {
    it('should optimize content for traffic with SEO improvements', async () => {
      const targetMetric = createTestMetric('traffic', 10000)
      const result = await contentOptimizer.optimizeForTraffic(sampleContent, targetMetric)
      
      expect(result).toBeDefined()
      expect(result.originalContent).toBe(sampleContent)
      expect(result.optimizedContent).toBeDefined()
      expect(result.title).toBeDefined()
      expect(result.seoKeywords).toBeDefined()
      expect(result.seoKeywords.length).toBeGreaterThan(0)
      expect(result.appliedOptimizations).toBeDefined()
      expect(result.appliedOptimizations.length).toBeGreaterThan(0)
      expect(result.qualityScore).toBeGreaterThan(0)
      expect(result.confidenceScore).toBeGreaterThan(0)
      
      // Check for traffic-specific optimizations
      const hasTrafficOptimizations = result.appliedOptimizations.some(
        opt => opt.type === 'seo_keywords' || opt.type === 'title_optimization'
      )
      expect(hasTrafficOptimizations).toBe(true)
    })
  })

  describe('Engagement Optimization', () => {
    it('should optimize content for engagement with hooks and interactive elements', async () => {
      const targetMetric = createTestMetric('engagement', 500)
      const result = await contentOptimizer.optimizeForEngagement(sampleContent, targetMetric)
      
      expect(result).toBeDefined()
      expect(result.originalContent).toBe(sampleContent)
      expect(result.optimizedContent).toBeDefined()
      expect(result.engagementHooks).toBeDefined()
      expect(result.engagementHooks.length).toBeGreaterThan(0)
      expect(result.appliedOptimizations).toBeDefined()
      expect(result.qualityScore).toBeGreaterThan(0)
      expect(result.confidenceScore).toBeGreaterThan(0)
      
      // Check for engagement-specific optimizations
      const hasEngagementOptimizations = result.appliedOptimizations.some(
        opt => opt.type === 'engagement_hooks' || opt.type === 'storytelling'
      )
      expect(hasEngagementOptimizations).toBe(true)
    })
  })

  describe('Conversion Optimization', () => {
    it('should optimize content for conversions with CTAs and social proof', async () => {
      const targetMetric = createTestMetric('conversions', 100)
      const result = await contentOptimizer.optimizeForConversions(sampleContent, targetMetric)
      
      expect(result).toBeDefined()
      expect(result.originalContent).toBe(sampleContent)
      expect(result.optimizedContent).toBeDefined()
      expect(result.ctas).toBeDefined()
      expect(result.ctas.length).toBeGreaterThan(0)
      expect(result.appliedOptimizations).toBeDefined()
      expect(result.qualityScore).toBeGreaterThan(0)
      expect(result.confidenceScore).toBeGreaterThan(0)
      
      // Check for conversion-specific optimizations
      const hasConversionOptimizations = result.appliedOptimizations.some(
        opt => opt.type === 'cta_optimization' || opt.type === 'social_proof'
      )
      expect(hasConversionOptimizations).toBe(true)
    })
  })

  describe('Revenue Optimization', () => {
    it('should optimize content for revenue with monetization elements', async () => {
      const targetMetric = createTestMetric('revenue', 2000)
      const result = await contentOptimizer.optimizeForRevenue(sampleContent, targetMetric)
      
      expect(result).toBeDefined()
      expect(result.originalContent).toBe(sampleContent)
      expect(result.optimizedContent).toBeDefined()
      expect(result.monetizationElements).toBeDefined()
      expect(result.monetizationElements.length).toBeGreaterThan(0)
      expect(result.ctas).toBeDefined()
      expect(result.ctas.length).toBeGreaterThan(0)
      expect(result.appliedOptimizations).toBeDefined()
      expect(result.qualityScore).toBeGreaterThan(0)
      expect(result.confidenceScore).toBeGreaterThan(0)
      
      // Check for revenue-specific optimizations
      const hasRevenueOptimizations = result.appliedOptimizations.some(
        opt => opt.type === 'affiliate_integration' || opt.type === 'revenue_ctas'
      )
      expect(hasRevenueOptimizations).toBe(true)
    })
  })

  describe('Outcome Prediction', () => {
    it('should predict outcomes for different metrics', async () => {
      const context = {
        platform: 'blog',
        scheduledTime: new Date(),
        targetAudience: 'general'
      }
      
      const predictions = await outcomeOptimizer.predictOutcome(sampleContent, context)
      
      expect(predictions).toBeDefined()
      expect(Array.isArray(predictions)).toBe(true)
      expect(predictions.length).toBeGreaterThan(0)
      
      // Check prediction structure
      const prediction = predictions[0]
      expect(prediction.targetMetric).toBeDefined()
      expect(prediction.predictedValue).toBeGreaterThan(0)
      expect(prediction.confidence).toBeGreaterThan(0)
      expect(prediction.confidence).toBeLessThanOrEqual(1)
      expect(prediction.factors).toBeDefined()
      expect(Array.isArray(prediction.factors)).toBe(true)
      expect(prediction.recommendations).toBeDefined()
      expect(Array.isArray(prediction.recommendations)).toBe(true)
    })
  })

  describe('Content Variations', () => {
    it('should generate content variations for A/B testing', async () => {
      const optimizationGoals = [
        {
          metric: createTestMetric('traffic'),
          weight: 0.5,
          constraints: [],
          acceptableRange: { min: 0, max: 1000 }
        },
        {
          metric: createTestMetric('engagement'),
          weight: 0.5,
          constraints: [],
          acceptableRange: { min: 0, max: 1000 }
        }
      ]
      
      const variations = await outcomeOptimizer.generateVariations(sampleContent, optimizationGoals)
      
      expect(variations).toBeDefined()
      expect(Array.isArray(variations)).toBe(true)
      expect(variations.length).toBeGreaterThan(0)
      
      // Check variation structure
      const variation = variations[0]
      expect(variation.id).toBeDefined()
      expect(variation.title).toBeDefined()
      expect(variation.content).toBeDefined()
      expect(variation.optimizationFocus).toBeDefined()
      expect(variation.predictedOutcome).toBeDefined()
      expect(variation.testingPriority).toBeGreaterThan(0)
    })
  })

  describe('Multi-Metric Optimization', () => {
    it('should handle optimization for multiple business metrics', async () => {
      // Test traffic optimization
      const trafficMetric = createTestMetric('traffic')
      const trafficResult = await contentOptimizer.optimizeForTraffic(sampleContent, trafficMetric)
      expect(trafficResult.appliedOptimizations.some(opt => 
        opt.type.includes('seo') || opt.type.includes('keyword')
      )).toBe(true)
      
      // Test engagement optimization
      const engagementMetric = createTestMetric('engagement')
      const engagementResult = await contentOptimizer.optimizeForEngagement(sampleContent, engagementMetric)
      expect(engagementResult.engagementHooks.length).toBeGreaterThan(0)
      
      // Test conversion optimization
      const conversionMetric = createTestMetric('conversions')
      const conversionResult = await contentOptimizer.optimizeForConversions(sampleContent, conversionMetric)
      expect(conversionResult.ctas.length).toBeGreaterThan(0)
      
      // Test revenue optimization
      const revenueMetric = createTestMetric('revenue')
      const revenueResult = await contentOptimizer.optimizeForRevenue(sampleContent, revenueMetric)
      expect(revenueResult.monetizationElements.length).toBeGreaterThan(0)
      
      // All should have different optimization focuses
      expect(trafficResult.appliedOptimizations[0].type).not.toBe(
        engagementResult.appliedOptimizations[0].type
      )
    })
  })

  describe('Quality and Confidence Scoring', () => {
    it('should provide meaningful quality and confidence scores', async () => {
      const targetMetric = createTestMetric('traffic')
      const result = await contentOptimizer.optimizeForTraffic(sampleContent, targetMetric)
      
      // Quality score should be between 0 and 1
      expect(result.qualityScore).toBeGreaterThanOrEqual(0)
      expect(result.qualityScore).toBeLessThanOrEqual(1)
      
      // Confidence score should be between 0 and 1
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0)
      expect(result.confidenceScore).toBeLessThanOrEqual(1)
      
      // More optimizations should generally lead to higher quality scores
      expect(result.qualityScore).toBeGreaterThan(0.5) // Should be above baseline
    })
  })
})