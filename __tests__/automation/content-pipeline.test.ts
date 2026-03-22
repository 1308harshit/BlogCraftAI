// Content Pipeline Tests
// Tests for high-volume content generation pipeline

import { researchEngine } from '../../lib/automation/research-engine'
import { bulkContentGenerator } from '../../lib/automation/bulk-content-generator'
import { contentQualityValidator } from '../../lib/automation/content-quality-validator'

describe('Content Pipeline', () => {
  describe('Research Engine', () => {
    it('should analyze trends', async () => {
      const trends = await researchEngine.analyzeTrends(['traffic', 'engagement'])
      
      expect(trends).toBeDefined()
      expect(trends.trendingTopics).toBeInstanceOf(Array)
      expect(trends.trendingTopics.length).toBeGreaterThan(0)
      expect(trends.trendingKeywords).toBeInstanceOf(Array)
      expect(trends.confidence).toBeGreaterThan(0)
      expect(trends.confidence).toBeLessThanOrEqual(1)
    })

    it('should analyze competitors', async () => {
      const competitors = await researchEngine.analyzeCompetitors('test-user')
      
      expect(competitors).toBeDefined()
      expect(competitors.competitors).toBeInstanceOf(Array)
      expect(competitors.contentGaps).toBeInstanceOf(Array)
      expect(competitors.opportunities).toBeInstanceOf(Array)
      expect(competitors.averagePerformance).toBeGreaterThanOrEqual(0)
    })

    it('should generate topic suggestions', async () => {
      const topics = await researchEngine.generateTopicSuggestions({
        userId: 'test-user',
        count: 5,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })
      
      expect(topics).toBeInstanceOf(Array)
      expect(topics.length).toBe(5)
      expect(topics[0]).toHaveProperty('topic')
      expect(topics[0]).toHaveProperty('relevanceScore')
      expect(topics[0]).toHaveProperty('viralPotential')
      expect(topics[0]).toHaveProperty('keywords')
    })
  })

  describe('Bulk Content Generator', () => {
    it('should generate multiple content pieces', async () => {
      const content = await bulkContentGenerator.generateBulkContent({
        userId: 'test-user',
        count: 3,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic'],
        qualityThreshold: 0.7
      })
      
      expect(content).toBeInstanceOf(Array)
      expect(content.length).toBe(3)
      
      for (const item of content) {
        expect(item).toHaveProperty('contentId')
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('content')
        expect(item.content.length).toBeGreaterThan(100)
        expect(item.qualityScore).toBeGreaterThan(0)
      }
    })

    it('should generate content with proper structure', async () => {
      const content = await bulkContentGenerator.generateBulkContent({
        userId: 'test-user',
        count: 1,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic'],
        qualityThreshold: 0.7
      })
      
      const item = content[0]
      expect(item.content).toContain('##') // Has headings
      expect(item.content.split('\n\n').length).toBeGreaterThan(3) // Has paragraphs
      expect(item.metadata.wordCount).toBeGreaterThan(100)
    })
  })

  describe('Content Quality Validator', () => {
    it('should validate content quality', async () => {
      const testContent = {
        contentId: 'test-1',
        title: 'Complete Guide to Content Marketing Success',
        content: `## Introduction

Content marketing has become essential for business growth. This guide will help you master it.

## Key Strategies

### 1. Understanding Your Audience
Know who you're writing for and what they need.

### 2. Creating Quality Content
Focus on providing real value to your readers.

### 3. Optimizing for SEO
Use keywords naturally and structure content well.

## Conclusion

By following these strategies, you'll see improved results. Subscribe for more tips!`,
        contentType: 'blog',
        platform: 'blog',
        scheduledDate: new Date(),
        qualityScore: 0.8,
        viralScore: 0,
        seoScore: 75,
        optimizations: [],
        metadata: { wordCount: 100 }
      }
      
      const result = await contentQualityValidator.validate(testContent, 0.7)
      
      expect(result).toBeDefined()
      expect(result.contentId).toBe('test-1')
      expect(result.overallScore).toBeGreaterThan(0)
      expect(result.checks).toBeInstanceOf(Array)
      expect(result.checks.length).toBeGreaterThan(0)
      
      // Check that all validation checks ran
      const checkNames = result.checks.map(c => c.name)
      expect(checkNames).toContain('length')
      expect(checkNames).toContain('structure')
      expect(checkNames).toContain('readability')
      expect(checkNames).toContain('engagement')
      expect(checkNames).toContain('seo')
      expect(checkNames).toContain('completeness')
    })

    it('should identify quality issues', async () => {
      const poorContent = {
        contentId: 'test-2',
        title: 'Short',
        content: 'This is too short.',
        contentType: 'blog',
        platform: 'blog',
        scheduledDate: new Date(),
        qualityScore: 0.3,
        viralScore: 0,
        seoScore: 30,
        optimizations: [],
        metadata: { wordCount: 4 }
      }
      
      const result = await contentQualityValidator.validate(poorContent, 0.7)
      
      expect(result.passed).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('Integration Tests', () => {
    it('should generate and validate content end-to-end', async () => {
      // Generate content
      const content = await bulkContentGenerator.generateBulkContent({
        userId: 'test-user',
        count: 5,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic'],
        qualityThreshold: 0.6
      })
      
      expect(content.length).toBe(5)
      
      // Validate all content
      const validationResults = await contentQualityValidator.validateBatch(content, 0.6)
      
      expect(validationResults.length).toBe(5)
      
      // Most content should pass validation
      const passedCount = validationResults.filter(r => r.passed).length
      expect(passedCount).toBeGreaterThan(0)
      
      console.log(`${passedCount}/5 content pieces passed validation`)
    })

    it('should generate content with different types', async () => {
      const contentTypes = ['blog', 'social', 'email']
      
      for (const type of contentTypes) {
        const content = await bulkContentGenerator.generateBulkContent({
          userId: 'test-user',
          count: 1,
          contentTypes: [type],
          platforms: [type === 'social' ? 'twitter' : type],
          businessGoals: ['engagement'],
          qualityThreshold: 0.6
        })
        
        expect(content.length).toBe(1)
        expect(content[0].contentType).toBe(type)
        expect(content[0].content.length).toBeGreaterThan(0)
        
        console.log(`Generated ${type} content: ${content[0].content.length} characters`)
      }
    })
  })

  describe('Performance Benchmarks', () => {
    it('should generate content quickly', async () => {
      const testCases = [
        { days: 1, maxTime: 2000 },   // 1 day in 2 seconds
        { days: 5, maxTime: 5000 },   // 5 days in 5 seconds
        { days: 10, maxTime: 10000 }  // 10 days in 10 seconds
      ]

      for (const testCase of testCases) {
        const startTime = Date.now()
        
        const content = await bulkContentGenerator.generateBulkContent({
          userId: 'test-user',
          count: testCase.days,
          contentTypes: ['blog'],
          platforms: ['blog'],
          businessGoals: ['traffic'],
          qualityThreshold: 0.6
        })
        
        const timeElapsed = Date.now() - startTime
        
        expect(content.length).toBe(testCase.days)
        expect(timeElapsed).toBeLessThan(testCase.maxTime)
        
        console.log(`${testCase.days} days: ${timeElapsed}ms (target: ${testCase.maxTime}ms)`)
      }
    }, 30000) // 30 second timeout
  })
})
