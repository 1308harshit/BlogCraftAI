// Affiliate Engine Tests
// Unit tests for affiliate product matching and link insertion

import { affiliateEngine } from '../../lib/monetization/affiliate-engine'
import { ContentContext } from '../../lib/monetization/types'

describe('AffiliateEngine', () => {
  describe('findRelevantProducts', () => {
    it('should find relevant products based on content context', async () => {
      const content = `
        Looking for the best productivity tools for remote work? 
        In this comprehensive guide, we'll explore top software solutions 
        that can help you stay organized and efficient while working from home.
        From project management to time tracking, we've got you covered.
      `

      const context: ContentContext = {
        userId: 'test-user',
        topic: 'productivity tools',
        keywords: ['productivity', 'remote work', 'software', 'tools'],
        targetAudience: 'remote workers',
        contentType: 'blog'
      }

      const products = await affiliateEngine.findRelevantProducts(content, context)

      expect(products).toBeDefined()
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
      
      // Verify all products meet 90%+ relevance threshold
      products.forEach(product => {
        expect(product.relevanceScore).toBeGreaterThanOrEqual(0.90)
        expect(product.affiliateLink).toBeDefined()
        expect(product.commission).toBeGreaterThan(0)
      })
    })

    it('should return empty array for irrelevant content', async () => {
      const content = 'The quick brown fox jumps over the lazy dog.'

      const context: ContentContext = {
        userId: 'test-user',
        topic: 'random',
        keywords: [],
        targetAudience: 'general',
        contentType: 'blog'
      }

      const products = await affiliateEngine.findRelevantProducts(content, context)

      expect(products).toBeDefined()
      expect(Array.isArray(products)).toBe(true)
    })
  })

  describe('insertAffiliateLinks', () => {
    it('should insert affiliate links naturally into content', async () => {
      const content = `
        Looking for the best productivity tools for remote work? 
        In this comprehensive guide, we'll explore top software solutions 
        that can help you stay organized and efficient while working from home.
      `

      const context: ContentContext = {
        userId: 'test-user',
        topic: 'productivity tools',
        keywords: ['productivity', 'tools', 'software'],
        targetAudience: 'remote workers',
        contentType: 'blog'
      }

      const products = await affiliateEngine.findRelevantProducts(content, context)
      const monetized = await affiliateEngine.insertAffiliateLinks(content, products)

      expect(monetized).toBeDefined()
      expect(monetized.monetizedContent).toBeDefined()
      expect(monetized.totalInsertions).toBeGreaterThanOrEqual(0)
      
      if (monetized.totalInsertions > 0) {
        expect(monetized.averageRelevance).toBeGreaterThanOrEqual(0.90)
        expect(monetized.insertedProducts.length).toBe(monetized.totalInsertions)
        
        // Verify each insertion has high naturalness
        monetized.insertedProducts.forEach(insertion => {
          expect(insertion.naturalness).toBeGreaterThanOrEqual(0.85)
          expect(insertion.relevanceScore).toBeGreaterThanOrEqual(0.90)
        })
      }
    })

    it('should handle empty product list gracefully', async () => {
      const content = 'Test content'
      const products: any[] = []

      const monetized = await affiliateEngine.insertAffiliateLinks(content, products)

      expect(monetized).toBeDefined()
      expect(monetized.monetizedContent).toBe(content)
      expect(monetized.totalInsertions).toBe(0)
      expect(monetized.insertedProducts).toEqual([])
    })

    it('should provide optimization suggestions', async () => {
      const content = 'Short content'
      const products: any[] = []

      const monetized = await affiliateEngine.insertAffiliateLinks(content, products)

      expect(monetized.optimizationSuggestions).toBeDefined()
      expect(Array.isArray(monetized.optimizationSuggestions)).toBe(true)
    })
  })

  describe('trackConversions', () => {
    it('should return conversion metrics structure', async () => {
      const contentId = 'test-content-123'

      const metrics = await affiliateEngine.trackConversions(contentId)

      expect(metrics).toBeDefined()
      expect(metrics.contentId).toBe(contentId)
      expect(metrics.totalClicks).toBeDefined()
      expect(metrics.totalConversions).toBeDefined()
      expect(metrics.totalRevenue).toBeDefined()
      expect(metrics.conversionRate).toBeDefined()
      expect(metrics.timeframe).toBeDefined()
      expect(metrics.timeframe.start).toBeInstanceOf(Date)
      expect(metrics.timeframe.end).toBeInstanceOf(Date)
    })
  })

  describe('optimizeAffiliateStrategy', () => {
    it('should generate optimization strategy', async () => {
      const performanceData = {
        contentId: 'test-content',
        userId: 'test-user',
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        metrics: {
          contentId: 'test-content',
          totalClicks: 100,
          totalConversions: 2,
          totalRevenue: 50,
          conversionRate: 2,
          averageOrderValue: 25,
          clicksByProduct: [],
          conversionsByProduct: [],
          timeframe: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date()
          }
        },
        productPerformance: [],
        insertionTypePerformance: [],
        contextualRelevance: 0.85
      }

      const strategy = await affiliateEngine.optimizeAffiliateStrategy(performanceData)

      expect(strategy).toBeDefined()
      expect(strategy.strategyId).toBeDefined()
      expect(strategy.recommendations).toBeDefined()
      expect(Array.isArray(strategy.recommendations)).toBe(true)
      expect(strategy.expectedImpact).toBeDefined()
      expect(strategy.confidence).toBeGreaterThan(0)
    })
  })
})
