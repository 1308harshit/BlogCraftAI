// Multi-Platform System Tests
// Tests for platform manager, content adapter, and constraint handling

import { contentAdapter } from '../content-adapter'
import { multiPlatformManager } from '../multi-platform-manager'
import { getPlatformConfig, PLATFORM_CONFIGS } from '../platform-configs'
import { PlatformType } from '../types'

describe('Platform Configuration', () => {
  test('should have configurations for all platforms', () => {
    const platforms: PlatformType[] = [
      'twitter', 'linkedin', 'instagram', 'youtube', 
      'tiktok', 'medium', 'facebook', 'blog'
    ]

    platforms.forEach(platform => {
      const config = getPlatformConfig(platform)
      expect(config).toBeDefined()
      expect(config.name).toBe(platform)
      expect(config.constraints).toBeDefined()
      expect(config.algorithm).toBeDefined()
      expect(config.optimalTiming).toBeDefined()
    })
  })

  test('should have valid character limits for each platform', () => {
    expect(PLATFORM_CONFIGS.twitter.constraints.maxLength).toBe(280)
    expect(PLATFORM_CONFIGS.linkedin.constraints.maxLength).toBe(3000)
    expect(PLATFORM_CONFIGS.instagram.constraints.maxLength).toBe(2200)
    expect(PLATFORM_CONFIGS.youtube.constraints.maxLength).toBe(5000)
    expect(PLATFORM_CONFIGS.tiktok.constraints.maxLength).toBe(2200)
    expect(PLATFORM_CONFIGS.medium.constraints.maxLength).toBe(100000)
    expect(PLATFORM_CONFIGS.facebook.constraints.maxLength).toBe(63206)
    expect(PLATFORM_CONFIGS.blog.constraints.maxLength).toBe(100000)
  })

  test('should have valid hashtag limits for each platform', () => {
    expect(PLATFORM_CONFIGS.twitter.constraints.maxHashtags).toBe(2)
    expect(PLATFORM_CONFIGS.linkedin.constraints.maxHashtags).toBe(5)
    expect(PLATFORM_CONFIGS.instagram.constraints.maxHashtags).toBe(30)
    expect(PLATFORM_CONFIGS.youtube.constraints.maxHashtags).toBe(15)
    expect(PLATFORM_CONFIGS.tiktok.constraints.maxHashtags).toBe(10)
    expect(PLATFORM_CONFIGS.medium.constraints.maxHashtags).toBe(5)
    expect(PLATFORM_CONFIGS.facebook.constraints.maxHashtags).toBe(3)
    expect(PLATFORM_CONFIGS.blog.constraints.maxHashtags).toBe(10)
  })
})

describe('Content Adapter', () => {
  const sampleContent = `
    Artificial Intelligence is transforming how we work and live. 
    From automating routine tasks to enabling breakthrough discoveries, 
    AI is reshaping every industry. Here are 5 key trends to watch in 2024.
  `.trim()

  const sampleTitle = 'AI Trends 2024: What You Need to Know'

  test('should adapt content for Twitter within character limit', async () => {
    const result = await contentAdapter.adaptForTwitter({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'twitter',
      userId: 'test-user',
      keywords: ['AI', 'technology', 'trends']
    })

    expect(result.platform).toBe('twitter')
    expect(result.format).toBe('text')
    expect(result.content.length).toBeLessThanOrEqual(280)
    expect(result.optimizations.length).toBeGreaterThan(0)
    expect(result.metadata).toBeDefined()
  })

  test('should adapt content for LinkedIn with professional tone', async () => {
    const result = await contentAdapter.adaptForLinkedIn({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'linkedin',
      userId: 'test-user',
      keywords: ['AI', 'technology', 'business']
    })

    expect(result.platform).toBe('linkedin')
    expect(result.format).toBe('text')
    expect(result.content.length).toBeLessThanOrEqual(3000)
    expect(result.optimizations).toContain('Formatted for LinkedIn professional audience')
    expect(result.metadata.hashtags).toBeDefined()
  })

  test('should adapt content for Instagram with visual focus', async () => {
    const result = await contentAdapter.adaptForInstagram({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'instagram',
      userId: 'test-user',
      keywords: ['AI', 'tech', 'innovation'],
      includeHashtags: true
    })

    expect(result.platform).toBe('instagram')
    expect(result.format).toBe('image')
    expect(result.content.length).toBeLessThanOrEqual(2200)
    expect(result.metadata.hashtags).toBeDefined()
    expect(result.metadata.hashtags!.length).toBeGreaterThan(0)
  })

  test('should adapt content for YouTube with description format', async () => {
    const result = await contentAdapter.adaptForYouTube({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'youtube',
      userId: 'test-user',
      keywords: ['AI', 'technology']
    })

    expect(result.platform).toBe('youtube')
    expect(result.format).toBe('video')
    expect(result.content.length).toBeLessThanOrEqual(5000)
    expect(result.metadata.title).toBeDefined()
  })

  test('should adapt content for TikTok with viral elements', async () => {
    const result = await contentAdapter.adaptForTikTok({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'tiktok',
      userId: 'test-user',
      keywords: ['AI', 'tech']
    })

    expect(result.platform).toBe('tiktok')
    expect(result.format).toBe('video')
    expect(result.content.length).toBeLessThanOrEqual(2200)
    expect(result.optimizations).toContain('Optimized for TikTok algorithm')
  })

  test('should adapt content for Medium as long-form article', async () => {
    const result = await contentAdapter.adaptForMedium({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'medium',
      userId: 'test-user',
      keywords: ['AI', 'technology', 'future']
    })

    expect(result.platform).toBe('medium')
    expect(result.format).toBe('article')
    expect(result.content.length).toBeGreaterThanOrEqual(300)
    expect(result.content.length).toBeLessThanOrEqual(100000)
    expect(result.metadata.tags).toBeDefined()
  })

  test('should adapt content for Facebook with community focus', async () => {
    const result = await contentAdapter.adaptForFacebook({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'facebook',
      userId: 'test-user',
      keywords: ['AI', 'technology']
    })

    expect(result.platform).toBe('facebook')
    expect(result.format).toBe('text')
    expect(result.content.length).toBeLessThanOrEqual(63206)
    expect(result.optimizations).toContain('Optimized for Facebook community engagement')
  })

  test('should adapt content for Blog with SEO optimization', async () => {
    const result = await contentAdapter.adaptForBlog({
      content: sampleContent,
      title: sampleTitle,
      targetPlatform: 'blog',
      userId: 'test-user',
      keywords: ['AI', 'technology', 'trends', '2024']
    })

    expect(result.platform).toBe('blog')
    expect(result.format).toBe('article')
    expect(result.content.length).toBeGreaterThanOrEqual(300)
    expect(result.optimizations).toContain('Optimized for SEO and search rankings')
  })
})

describe('Multi-Platform Manager', () => {
  const sampleContent = 'AI is revolutionizing content creation and marketing strategies.'
  const sampleTitle = 'AI Revolution in Marketing'

  test('should distribute content to multiple platforms', async () => {
    const result = await multiPlatformManager.distributeContent({
      userId: 'test-user',
      contentId: 'test-content-123',
      content: sampleContent,
      title: sampleTitle,
      platforms: ['twitter', 'linkedin', 'instagram'],
      keywords: ['AI', 'marketing']
    })

    expect(result.contentId).toBe('test-content-123')
    expect(result.totalPlatforms).toBe(3)
    expect(result.successfulAdaptations).toBeGreaterThan(0)
    expect(result.platformContent.length).toBeGreaterThan(0)
  })

  test('should validate content against platform constraints', () => {
    const longContent = 'a'.repeat(300)
    const validation = multiPlatformManager.validateContent(longContent, 'twitter')

    expect(validation.valid).toBe(false)
    expect(validation.violations.length).toBeGreaterThan(0)
    expect(validation.violations[0]).toContain('exceeds maximum length')
  })

  test('should validate hashtag limits', () => {
    const contentWithManyHashtags = 'Content #tag1 #tag2 #tag3 #tag4 #tag5'
    const validation = multiPlatformManager.validateContent(contentWithManyHashtags, 'twitter')

    expect(validation.valid).toBe(false)
    expect(validation.violations.some(v => v.includes('hashtags'))).toBe(true)
  })

  test('should get supported platforms', () => {
    const platforms = multiPlatformManager.getSupportedPlatforms()

    expect(platforms).toContain('twitter')
    expect(platforms).toContain('linkedin')
    expect(platforms).toContain('instagram')
    expect(platforms).toContain('youtube')
    expect(platforms).toContain('tiktok')
    expect(platforms).toContain('medium')
    expect(platforms).toContain('facebook')
    expect(platforms).toContain('blog')
  })

  test('should get platforms by format', () => {
    const textPlatforms = multiPlatformManager.getPlatformsByFormat('text')
    const videoPlatforms = multiPlatformManager.getPlatformsByFormat('video')

    expect(textPlatforms).toContain('twitter')
    expect(textPlatforms).toContain('linkedin')
    expect(videoPlatforms).toContain('youtube')
    expect(videoPlatforms).toContain('tiktok')
  })

  test('should get platform constraints', () => {
    const constraints = multiPlatformManager.getPlatformConstraints('twitter')

    expect(constraints.maxLength).toBe(280)
    expect(constraints.maxHashtags).toBe(2)
    expect(constraints.supportedFormats).toContain('text')
  })

  test('should batch adapt content for multiple platforms', async () => {
    const results = await multiPlatformManager.batchAdaptContent(
      sampleContent,
      sampleTitle,
      'test-user',
      ['twitter', 'linkedin', 'facebook']
    )

    expect(results.size).toBe(3)
    expect(results.has('twitter')).toBe(true)
    expect(results.has('linkedin')).toBe(true)
    expect(results.has('facebook')).toBe(true)

    const twitterContent = results.get('twitter')
    expect(twitterContent).toBeDefined()
    expect(twitterContent!.platform).toBe('twitter')
  })

  test('should generate platform strategy', async () => {
    const strategy = await multiPlatformManager.generatePlatformStrategy(
      'twitter',
      'test-user'
    )

    expect(strategy.platform).toBe('twitter')
    expect(strategy.contentTypes.length).toBeGreaterThan(0)
    expect(strategy.postingFrequency).toBeGreaterThan(0)
    expect(strategy.optimalTimes.length).toBeGreaterThan(0)
    expect(strategy.engagementTactics.length).toBeGreaterThan(0)
  })
})

describe('Platform Constraint Handling', () => {
  test('should enforce Twitter character limit', async () => {
    const longContent = 'a'.repeat(500)
    const result = await contentAdapter.adaptForTwitter({
      content: longContent,
      targetPlatform: 'twitter',
      userId: 'test-user'
    })

    expect(result.content.length).toBeLessThanOrEqual(280)
    // Warnings may or may not be present depending on AI generation
    if (result.warnings) {
      expect(result.warnings.some(w => w.includes('truncated'))).toBe(true)
    }
  })

  test('should enforce LinkedIn character limit', async () => {
    const longContent = 'a'.repeat(5000)
    const result = await contentAdapter.adaptForLinkedIn({
      content: longContent,
      targetPlatform: 'linkedin',
      userId: 'test-user'
    })

    expect(result.content.length).toBeLessThanOrEqual(3000)
  })

  test('should enforce Instagram character limit', async () => {
    const longContent = 'a'.repeat(3000)
    const result = await contentAdapter.adaptForInstagram({
      content: longContent,
      targetPlatform: 'instagram',
      userId: 'test-user'
    })

    expect(result.content.length).toBeLessThanOrEqual(2200)
  })

  test('should enforce Medium minimum length', async () => {
    const shortContent = 'Short content'
    const result = await contentAdapter.adaptForMedium({
      content: shortContent,
      targetPlatform: 'medium',
      userId: 'test-user'
    })

    // Content should be expanded or have optimization note
    expect(result.optimizations.length).toBeGreaterThan(0)
  })
})

describe('Format Adaptation', () => {
  test('should adapt text content for text-based platforms', async () => {
    const content = 'Sample text content for adaptation'
    
    const twitterResult = await contentAdapter.adaptForTwitter({
      content,
      targetPlatform: 'twitter',
      userId: 'test-user'
    })

    const linkedinResult = await contentAdapter.adaptForLinkedIn({
      content,
      targetPlatform: 'linkedin',
      userId: 'test-user'
    })

    expect(twitterResult.format).toBe('text')
    expect(linkedinResult.format).toBe('text')
  })

  test('should adapt content for video platforms', async () => {
    const content = 'Video content description and script'
    
    const youtubeResult = await contentAdapter.adaptForYouTube({
      content,
      targetPlatform: 'youtube',
      userId: 'test-user'
    })

    const tiktokResult = await contentAdapter.adaptForTikTok({
      content,
      targetPlatform: 'tiktok',
      userId: 'test-user'
    })

    expect(youtubeResult.format).toBe('video')
    expect(tiktokResult.format).toBe('video')
    expect(youtubeResult.metadata.customFields?.requiresVideo).toBe(true)
    expect(tiktokResult.metadata.customFields?.requiresVideo).toBe(true)
  })

  test('should adapt content for article platforms', async () => {
    const content = 'Long-form article content with detailed information'
    
    const mediumResult = await contentAdapter.adaptForMedium({
      content,
      targetPlatform: 'medium',
      userId: 'test-user'
    })

    const blogResult = await contentAdapter.adaptForBlog({
      content,
      targetPlatform: 'blog',
      userId: 'test-user'
    })

    expect(mediumResult.format).toBe('article')
    expect(blogResult.format).toBe('article')
  })
})
