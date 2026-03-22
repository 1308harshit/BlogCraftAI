// CTA Generator Tests
// Unit tests for CTA generation, optimization, and A/B testing

import {
  CTAGenerator,
  ctaGenerator,
  CTAGenerationRequest,
  CTA,
  CTAPerformanceMetrics,
  CTAVariant,
  CTATestConfig
} from '../../lib/monetization/cta-generator'

describe('CTAGenerator', () => {
  describe('generateCTA', () => {
    it('should generate CTA for traffic goal', async () => {
      const request: CTAGenerationRequest = {
        content: 'This is a blog post about web development. It covers various topics including React, TypeScript, and Next.js. The content is designed to help developers learn new skills.',
        context: {
          userId: 'user123',
          topic: 'web development',
          keywords: ['react', 'typescript', 'nextjs'],
          targetAudience: 'developers',
          contentType: 'blog'
        },
        goal: {
          type: 'traffic',
          targetAction: 'Read More',
          targetValue: 1000,
          priority: 7
        },
        brandVoice: 'professional'
      }

      const cta = await ctaGenerator.generateCTA(request)

      expect(cta).toBeDefined()
      expect(cta.id).toMatch(/^cta_/)
      expect(cta.text).toBeDefined()
      expect(cta.type).toBe('button')
      expect(cta.goal.type).toBe('traffic')
      expect(cta.expectedConversion).toBeGreaterThan(0)
      expect(cta.placement).toBeDefined()
      expect(cta.placement.location).toBeDefined()
      expect(cta.design).toBeDefined()
      expect(cta.design.color).toBeDefined()
    })

    it('should generate CTA for conversion goal', async () => {
      const request: CTAGenerationRequest = {
        content: 'Sign up for our premium service and get access to exclusive features.',
        context: {
          userId: 'user123',
          topic: 'saas product',
          keywords: ['premium', 'features', 'signup'],
          targetAudience: 'business owners',
          contentType: 'blog'
        },
        goal: {
          type: 'conversions',
          targetAction: 'Sign Up',
          targetValue: 100,
          priority: 9
        },
        brandVoice: 'professional'
      }

      const cta = await ctaGenerator.generateCTA(request)

      expect(cta).toBeDefined()
      expect(cta.type).toBe('button')
      expect(cta.goal.type).toBe('conversions')
      expect(cta.design.urgency).toBe(true)
      expect(cta.design.size).toBe('large')
    })

    it('should generate CTA for lead generation goal', async () => {
      const request: CTAGenerationRequest = {
        content: 'Download our free guide to learn more about digital marketing strategies.',
        context: {
          userId: 'user123',
          topic: 'digital marketing',
          keywords: ['guide', 'marketing', 'strategies'],
          targetAudience: 'marketers',
          contentType: 'blog'
        },
        goal: {
          type: 'lead_generation',
          targetAction: 'Download Guide',
          targetValue: 500,
          priority: 8
        },
        brandVoice: 'casual'
      }

      const cta = await ctaGenerator.generateCTA(request)

      expect(cta).toBeDefined()
      expect(cta.type).toBe('form')
      expect(cta.goal.type).toBe('lead_generation')
      expect(cta.placement.location).toBe('footer')
    })

    it('should generate CTA for revenue goal', async () => {
      const request: CTAGenerationRequest = {
        content: 'Purchase our premium course and master web development in 30 days.',
        context: {
          userId: 'user123',
          topic: 'online course',
          keywords: ['course', 'premium', 'web development'],
          targetAudience: 'students',
          contentType: 'blog'
        },
        goal: {
          type: 'revenue',
          targetAction: 'Buy Now',
          targetValue: 5000,
          priority: 10
        },
        brandVoice: 'professional'
      }

      const cta = await ctaGenerator.generateCTA(request)

      expect(cta).toBeDefined()
      expect(cta.type).toBe('button')
      expect(cta.goal.type).toBe('revenue')
      expect(cta.design.urgency).toBe(true)
      expect(cta.expectedConversion).toBeGreaterThan(0)
      expect(cta.expectedConversion).toBeLessThanOrEqual(15)
    })

    it('should generate CTA with different brand voices', async () => {
      const baseRequest: CTAGenerationRequest = {
        content: 'Learn about our product features and benefits.',
        context: {
          userId: 'user123',
          topic: 'product',
          keywords: ['features', 'benefits'],
          targetAudience: 'general',
          contentType: 'blog'
        },
        goal: {
          type: 'engagement',
          targetAction: 'Learn More',
          targetValue: 200,
          priority: 6
        }
      }

      const voices = ['professional', 'casual', 'technical', 'creative']
      
      for (const voice of voices) {
        const cta = await ctaGenerator.generateCTA({
          ...baseRequest,
          brandVoice: voice
        })

        expect(cta).toBeDefined()
        expect(cta.text).toBeDefined()
        expect(cta.text.length).toBeGreaterThan(0)
      }
    })
  })

  describe('optimizeCTA', () => {
    it('should optimize CTA with low CTR', async () => {
      const cta: CTA = {
        id: 'cta_test_123',
        text: 'Click Here',
        type: 'button',
        placement: {
          location: 'inline',
          position: 100,
          context: 'test context'
        },
        design: {
          color: '#3B82F6',
          size: 'medium',
          style: 'primary',
          urgency: false,
          personalization: false
        },
        targetAction: 'Learn More',
        goal: {
          type: 'traffic',
          targetAction: 'Learn More',
          targetValue: 1000,
          priority: 7
        },
        expectedConversion: 5.0,
        createdAt: new Date()
      }

      const performanceData: CTAPerformanceMetrics = {
        impressions: 1000,
        clicks: 15,
        conversions: 5,
        clickThroughRate: 1.5,
        conversionRate: 0.5,
        revenue: 100,
        lastUpdated: new Date()
      }

      const optimized = await ctaGenerator.optimizeCTA(cta, performanceData)

      expect(optimized).toBeDefined()
      expect(optimized.optimizations).toBeDefined()
      expect(optimized.optimizations.length).toBeGreaterThan(0)
      expect(optimized.confidence).toBeGreaterThan(0)
      
      // Should have text optimization for low CTR
      const textOptimization = optimized.optimizations.find(o => o.type === 'text')
      expect(textOptimization).toBeDefined()
      expect(textOptimization?.expectedImpact).toBeGreaterThan(0)
    })

    it('should optimize CTA with low conversion rate', async () => {
      const cta: CTA = {
        id: 'cta_test_456',
        text: 'Sign Up',
        type: 'button',
        placement: {
          location: 'footer',
          position: 500,
          context: 'test context'
        },
        design: {
          color: '#10B981',
          size: 'small',
          style: 'secondary',
          urgency: false,
          personalization: false
        },
        targetAction: 'Sign Up',
        goal: {
          type: 'conversions',
          targetAction: 'Sign Up',
          targetValue: 100,
          priority: 9
        },
        expectedConversion: 2.5,
        createdAt: new Date()
      }

      const performanceData: CTAPerformanceMetrics = {
        impressions: 500,
        clicks: 50,
        conversions: 10,
        clickThroughRate: 10.0,
        conversionRate: 2.0,
        revenue: 500,
        lastUpdated: new Date()
      }

      const optimized = await ctaGenerator.optimizeCTA(cta, performanceData)

      expect(optimized).toBeDefined()
      expect(optimized.optimizations.length).toBeGreaterThan(0)
      
      // Should have design optimization for low conversion rate
      const designOptimization = optimized.optimizations.find(o => o.type === 'design')
      expect(designOptimization).toBeDefined()
      expect(optimized.design.urgency).toBe(true)
    })

    it('should optimize CTA with low impressions', async () => {
      const cta: CTA = {
        id: 'cta_test_789',
        text: 'Get Started',
        type: 'button',
        placement: {
          location: 'sidebar',
          position: 200,
          context: 'test context'
        },
        design: {
          color: '#EF4444',
          size: 'medium',
          style: 'primary',
          urgency: true,
          personalization: false
        },
        targetAction: 'Get Started',
        goal: {
          type: 'conversions',
          targetAction: 'Get Started',
          targetValue: 50,
          priority: 8
        },
        expectedConversion: 3.0,
        createdAt: new Date()
      }

      const performanceData: CTAPerformanceMetrics = {
        impressions: 50,
        clicks: 5,
        conversions: 2,
        clickThroughRate: 10.0,
        conversionRate: 4.0,
        revenue: 200,
        lastUpdated: new Date()
      }

      const optimized = await ctaGenerator.optimizeCTA(cta, performanceData)

      expect(optimized).toBeDefined()
      expect(optimized.optimizations.length).toBeGreaterThan(0)
      
      // Should have placement optimization for low impressions
      const placementOptimization = optimized.optimizations.find(o => o.type === 'placement')
      expect(placementOptimization).toBeDefined()
    })

    it('should calculate confidence based on sample size', async () => {
      const cta: CTA = {
        id: 'cta_test_confidence',
        text: 'Learn More',
        type: 'button',
        placement: {
          location: 'inline',
          position: 100,
          context: 'test'
        },
        design: {
          color: '#3B82F6',
          size: 'medium',
          style: 'primary',
          urgency: false,
          personalization: false
        },
        targetAction: 'Learn More',
        goal: {
          type: 'traffic',
          targetAction: 'Learn More',
          targetValue: 1000,
          priority: 7
        },
        expectedConversion: 5.0,
        createdAt: new Date()
      }

      // Low sample size
      const lowSampleData: CTAPerformanceMetrics = {
        impressions: 50,
        clicks: 5,
        conversions: 2,
        clickThroughRate: 10.0,
        conversionRate: 4.0,
        revenue: 100,
        lastUpdated: new Date()
      }

      const lowSampleOptimized = await ctaGenerator.optimizeCTA(cta, lowSampleData)
      expect(lowSampleOptimized.confidence).toBeLessThan(0.7)

      // High sample size
      const highSampleData: CTAPerformanceMetrics = {
        impressions: 2000,
        clicks: 200,
        conversions: 80,
        clickThroughRate: 10.0,
        conversionRate: 4.0,
        revenue: 4000,
        lastUpdated: new Date()
      }

      const highSampleOptimized = await ctaGenerator.optimizeCTA(cta, highSampleData)
      expect(highSampleOptimized.confidence).toBeGreaterThan(0.85)
    })
  })

  describe('createABTest', () => {
    it('should create A/B test with variations', async () => {
      const baseCTA: CTA = {
        id: 'cta_base_123',
        text: 'Get Started',
        type: 'button',
        placement: {
          location: 'inline',
          position: 100,
          context: 'test context'
        },
        design: {
          color: '#3B82F6',
          size: 'medium',
          style: 'primary',
          urgency: false,
          personalization: false
        },
        targetAction: 'Get Started',
        goal: {
          type: 'conversions',
          targetAction: 'Get Started',
          targetValue: 100,
          priority: 8
        },
        expectedConversion: 2.5,
        createdAt: new Date()
      }

      const testConfig = await ctaGenerator.createABTest(baseCTA, 2)

      expect(testConfig).toBeDefined()
      expect(testConfig.variants).toHaveLength(3) // base + 2 variations
      expect(testConfig.trafficSplit).toHaveLength(3)
      expect(testConfig.trafficSplit.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0)
      expect(testConfig.successMetric).toBe('conversions')
      expect(testConfig.minSampleSize).toBeGreaterThan(0)
      expect(testConfig.significanceThreshold).toBeGreaterThan(0)
    })

    it('should create variations with different aspects', async () => {
      const baseCTA: CTA = {
        id: 'cta_variations_456',
        text: 'Learn More',
        type: 'button',
        placement: {
          location: 'inline',
          position: 100,
          context: 'test'
        },
        design: {
          color: '#3B82F6',
          size: 'medium',
          style: 'primary',
          urgency: false,
          personalization: false
        },
        targetAction: 'Learn More',
        goal: {
          type: 'traffic',
          targetAction: 'Learn More',
          targetValue: 1000,
          priority: 7
        },
        expectedConversion: 5.0,
        createdAt: new Date()
      }

      const testConfig = await ctaGenerator.createABTest(baseCTA, 3)

      expect(testConfig.variants).toHaveLength(4)
      
      // Check that variations are different from base
      const variations = testConfig.variants.slice(1)
      variations.forEach(variant => {
        const isDifferent = 
          variant.text !== baseCTA.text ||
          variant.design.color !== baseCTA.design.color ||
          variant.placement.location !== baseCTA.placement.location
        
        expect(isDifferent).toBe(true)
      })
    })

    it('should select appropriate success metric based on goal', async () => {
      const goals = [
        { type: 'traffic' as const, expectedMetric: 'clicks' as const },
        { type: 'conversions' as const, expectedMetric: 'conversions' as const },
        { type: 'revenue' as const, expectedMetric: 'revenue' as const },
        { type: 'lead_generation' as const, expectedMetric: 'conversions' as const }
      ]

      for (const { type, expectedMetric } of goals) {
        const cta: CTA = {
          id: `cta_${type}`,
          text: 'Test',
          type: 'button',
          placement: { location: 'inline', position: 0, context: '' },
          design: { color: '#000', size: 'medium', style: 'primary', urgency: false, personalization: false },
          targetAction: 'Test',
          goal: { type, targetAction: 'Test', targetValue: 100, priority: 7 },
          expectedConversion: 5.0,
          createdAt: new Date()
        }

        const testConfig = await ctaGenerator.createABTest(cta, 1)
        expect(testConfig.successMetric).toBe(expectedMetric)
      }
    })
  })

  describe('analyzeABTest', () => {
    it('should analyze A/B test results and determine winner', async () => {
      const baseCTA: CTA = {
        id: 'cta_test',
        text: 'Get Started',
        type: 'button',
        placement: { location: 'inline', position: 0, context: '' },
        design: { color: '#3B82F6', size: 'medium', style: 'primary', urgency: false, personalization: false },
        targetAction: 'Get Started',
        goal: { type: 'conversions', targetAction: 'Get Started', targetValue: 100, priority: 8 },
        expectedConversion: 2.5,
        createdAt: new Date()
      }

      const testConfig: CTATestConfig = {
        variants: [baseCTA, { ...baseCTA, id: 'cta_var1' }],
        trafficSplit: [0.5, 0.5],
        successMetric: 'conversions',
        minSampleSize: 100,
        maxDuration: 14,
        significanceThreshold: 0.95
      }

      const results: CTAVariant[] = [
        {
          variantId: 'var_control',
          cta: baseCTA,
          impressions: 1000,
          clicks: 100,
          conversions: 20,
          conversionRate: 2.0,
          confidence: 0.95
        },
        {
          variantId: 'var_treatment',
          cta: { ...baseCTA, id: 'cta_var1' },
          impressions: 1000,
          clicks: 120,
          conversions: 30,
          conversionRate: 3.0,
          confidence: 0.95
        }
      ]

      const analysis = await ctaGenerator.analyzeABTest(testConfig, results)

      expect(analysis).toBeDefined()
      expect(analysis.testId).toBeDefined()
      expect(analysis.variants).toHaveLength(2)
      expect(analysis.statisticalSignificance).toBeGreaterThan(0)
      expect(analysis.testDuration).toBeGreaterThan(0)
      expect(analysis.totalSamples).toBe(2000)
    })

    it('should not declare winner without statistical significance', async () => {
      const baseCTA: CTA = {
        id: 'cta_test',
        text: 'Test',
        type: 'button',
        placement: { location: 'inline', position: 0, context: '' },
        design: { color: '#3B82F6', size: 'medium', style: 'primary', urgency: false, personalization: false },
        targetAction: 'Test',
        goal: { type: 'conversions', targetAction: 'Test', targetValue: 100, priority: 8 },
        expectedConversion: 2.5,
        createdAt: new Date()
      }

      const testConfig: CTATestConfig = {
        variants: [baseCTA],
        trafficSplit: [1.0],
        successMetric: 'conversions',
        minSampleSize: 100,
        maxDuration: 14,
        significanceThreshold: 0.95
      }

      // Small sample size - low significance
      const results: CTAVariant[] = [
        {
          variantId: 'var_control',
          cta: baseCTA,
          impressions: 20,
          clicks: 2,
          conversions: 1,
          conversionRate: 5.0,
          confidence: 0.5
        },
        {
          variantId: 'var_treatment',
          cta: { ...baseCTA, id: 'cta_var1' },
          impressions: 20,
          clicks: 3,
          conversions: 1,
          conversionRate: 5.0,
          confidence: 0.5
        }
      ]

      const analysis = await ctaGenerator.analyzeABTest(testConfig, results)

      expect(analysis.statisticalSignificance).toBeLessThan(0.90)
      expect(analysis.winner).toBeUndefined()
    })

    it('should calculate statistical significance correctly', async () => {
      const baseCTA: CTA = {
        id: 'cta_test',
        text: 'Test',
        type: 'button',
        placement: { location: 'inline', position: 0, context: '' },
        design: { color: '#3B82F6', size: 'medium', style: 'primary', urgency: false, personalization: false },
        targetAction: 'Test',
        goal: { type: 'conversions', targetAction: 'Test', targetValue: 100, priority: 8 },
        expectedConversion: 2.5,
        createdAt: new Date()
      }

      const testConfig: CTATestConfig = {
        variants: [baseCTA],
        trafficSplit: [1.0],
        successMetric: 'conversions',
        minSampleSize: 100,
        maxDuration: 14,
        significanceThreshold: 0.95
      }

      // Large sample with clear winner
      const results: CTAVariant[] = [
        {
          variantId: 'var_control',
          cta: baseCTA,
          impressions: 5000,
          clicks: 500,
          conversions: 100,
          conversionRate: 2.0,
          confidence: 0.95
        },
        {
          variantId: 'var_treatment',
          cta: { ...baseCTA, id: 'cta_var1' },
          impressions: 5000,
          clicks: 600,
          conversions: 180,
          conversionRate: 3.6,
          confidence: 0.95
        }
      ]

      const analysis = await ctaGenerator.analyzeABTest(testConfig, results)

      expect(analysis.statisticalSignificance).toBeGreaterThan(0.90)
      expect(analysis.winner).toBeDefined()
      expect(analysis.winner?.conversionRate).toBeGreaterThan(results[0].conversionRate)
    })
  })

  describe('Integration Tests', () => {
    it('should complete full CTA lifecycle: generate -> optimize -> test', async () => {
      // 1. Generate CTA
      const request: CTAGenerationRequest = {
        content: 'Learn web development with our comprehensive course.',
        context: {
          userId: 'user123',
          topic: 'web development',
          keywords: ['course', 'learning'],
          targetAudience: 'developers',
          contentType: 'blog'
        },
        goal: {
          type: 'conversions',
          targetAction: 'Enroll Now',
          targetValue: 100,
          priority: 9
        },
        brandVoice: 'professional'
      }

      const cta = await ctaGenerator.generateCTA(request)
      expect(cta).toBeDefined()

      // 2. Simulate performance and optimize
      const performanceData: CTAPerformanceMetrics = {
        impressions: 1000,
        clicks: 80,
        conversions: 15,
        clickThroughRate: 8.0,
        conversionRate: 1.5,
        revenue: 1500,
        lastUpdated: new Date()
      }

      const optimized = await ctaGenerator.optimizeCTA(cta, performanceData)
      expect(optimized.optimizations.length).toBeGreaterThan(0)

      // 3. Create A/B test
      const testConfig = await ctaGenerator.createABTest(optimized, 2)
      expect(testConfig.variants.length).toBe(3)

      // 4. Simulate test results
      const testResults: CTAVariant[] = testConfig.variants.map((variant, index) => ({
        variantId: `var_${index}`,
        cta: variant,
        impressions: 1000,
        clicks: 80 + (index * 10),
        conversions: 15 + (index * 5),
        conversionRate: (15 + (index * 5)) / 10,
        confidence: 0.95
      }))

      // 5. Analyze results
      const analysis = await ctaGenerator.analyzeABTest(testConfig, testResults)
      expect(analysis).toBeDefined()
      expect(analysis.variants.length).toBe(3)
    })
  })
})
