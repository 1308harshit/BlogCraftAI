// Platform-Specific Content Optimization
// Optimize content for each platform's unique characteristics and algorithms

import { PlatformType } from '../platform/types'
import { ContentDNA } from '../content-dna/types'
import { getPlatformConfig } from '../platform/platform-configs'

export interface OptimizationRecommendation {
  type: 'length' | 'format' | 'timing' | 'hashtags' | 'structure' | 'style' | 'engagement'
  priority: 'high' | 'medium' | 'low'
  description: string
  currentValue?: string | number
  recommendedValue?: string | number
  impact: string
  implementation: string
}

export interface PlatformOptimization {
  platform: PlatformType
  contentId: string
  originalContent: string
  optimizedContent: string
  recommendations: OptimizationRecommendation[]
  expectedImprovement: {
    engagement: number
    reach: number
    conversions: number
  }
  confidence: number
  optimizedAt: Date
}

export interface ContentTemplate {
  platform: PlatformType
  name: string
  structure: string[]
  optimalLength: { min: number; max: number }
  keyElements: string[]
  successRate: number
  examples: string[]
}

export class PlatformOptimizer {
  private static instance: PlatformOptimizer
  private optimizations: Map<string, PlatformOptimization> = new Map()
  private templates: Map<string, ContentTemplate> = new Map()

  static getInstance(): PlatformOptimizer {
    if (!PlatformOptimizer.instance) {
      PlatformOptimizer.instance = new PlatformOptimizer()
    }
    return PlatformOptimizer.instance
  }

  // Optimize content for specific platform
  async optimizeForPlatform(
    contentId: string,
    content: string,
    platform: PlatformType,
    contentDNA?: ContentDNA
  ): Promise<PlatformOptimization> {
    console.log(`Optimizing content for ${platform}...`)

    const config = getPlatformConfig(platform)
    const recommendations: OptimizationRecommendation[] = []
    let optimizedContent = content

    // Length optimization
    const lengthRec = this.optimizeLength(content, platform)
    if (lengthRec) {
      recommendations.push(lengthRec)
      optimizedContent = this.applyLengthOptimization(optimizedContent, lengthRec)
    }

    // Format optimization
    const formatRec = this.optimizeFormat(content, platform, contentDNA)
    if (formatRec) {
      recommendations.push(formatRec)
      optimizedContent = this.applyFormatOptimization(optimizedContent, formatRec, platform)
    }

    // Hashtag optimization
    const hashtagRec = this.optimizeHashtags(content, platform)
    if (hashtagRec) {
      recommendations.push(hashtagRec)
      optimizedContent = this.applyHashtagOptimization(optimizedContent, hashtagRec, platform)
    }

    // Structure optimization
    const structureRec = this.optimizeStructure(content, platform, contentDNA)
    if (structureRec) {
      recommendations.push(structureRec)
      optimizedContent = this.applyStructureOptimization(optimizedContent, structureRec, platform)
    }

    // Engagement optimization
    const engagementRec = this.optimizeEngagement(content, platform)
    if (engagementRec) {
      recommendations.push(engagementRec)
      optimizedContent = this.applyEngagementOptimization(optimizedContent, engagementRec, platform)
    }

    const optimization: PlatformOptimization = {
      platform,
      contentId,
      originalContent: content,
      optimizedContent,
      recommendations,
      expectedImprovement: this.calculateExpectedImprovement(recommendations),
      confidence: this.calculateConfidence(recommendations),
      optimizedAt: new Date()
    }

    this.optimizations.set(`${contentId}_${platform}`, optimization)

    console.log(`Optimization complete for ${platform}:`)
    console.log(`  Recommendations: ${recommendations.length}`)
    console.log(`  Expected engagement improvement: ${optimization.expectedImprovement.engagement}%`)

    return optimization
  }

  // Optimize content length
  private optimizeLength(content: string, platform: PlatformType): OptimizationRecommendation | null {
    const config = getPlatformConfig(platform)
    const currentLength = content.length

    if (currentLength > config.constraints.maxLength) {
      return {
        type: 'length',
        priority: 'high',
        description: `Content exceeds ${platform} maximum length`,
        currentValue: currentLength,
        recommendedValue: config.constraints.maxLength,
        impact: 'Content will be truncated, reducing effectiveness',
        implementation: 'Trim content to fit platform constraints while maintaining key messages'
      }
    }

    if (config.constraints.minLength && currentLength < config.constraints.minLength) {
      return {
        type: 'length',
        priority: 'medium',
        description: `Content below optimal length for ${platform}`,
        currentValue: currentLength,
        recommendedValue: config.constraints.minLength,
        impact: 'May not provide enough value or context',
        implementation: 'Expand content with additional details, examples, or context'
      }
    }

    return null
  }

  // Optimize content format
  private optimizeFormat(
    content: string,
    platform: PlatformType,
    contentDNA?: ContentDNA
  ): OptimizationRecommendation | null {
    const config = getPlatformConfig(platform)

    // Platform-specific format recommendations
    switch (platform) {
      case 'twitter':
        if (!content.includes('\n\n') && content.length > 200) {
          return {
            type: 'format',
            priority: 'medium',
            description: 'Consider breaking into Twitter thread',
            impact: 'Threads get higher engagement and reach',
            implementation: 'Split content into 2-3 connected tweets'
          }
        }
        break

      case 'linkedin':
        if (contentDNA && contentDNA.structure.paragraphCount < 3) {
          return {
            type: 'format',
            priority: 'medium',
            description: 'Add more paragraph breaks for LinkedIn readability',
            impact: 'Better readability increases engagement',
            implementation: 'Break content into shorter paragraphs (2-3 sentences each)'
          }
        }
        break

      case 'instagram':
        if (!content.includes('#')) {
          return {
            type: 'format',
            priority: 'high',
            description: 'Instagram content needs hashtags for discovery',
            impact: 'Missing hashtags severely limits reach',
            implementation: 'Add 15-30 relevant hashtags'
          }
        }
        break

      case 'medium':
        if (contentDNA && contentDNA.structure.headingCount < 3) {
          return {
            type: 'format',
            priority: 'medium',
            description: 'Add more headings for Medium article structure',
            impact: 'Better structure improves reading experience',
            implementation: 'Add H2/H3 headings to break up content sections'
          }
        }
        break
    }

    return null
  }

  // Optimize hashtags
  private optimizeHashtags(content: string, platform: PlatformType): OptimizationRecommendation | null {
    const config = getPlatformConfig(platform)
    const currentHashtags = (content.match(/#[\w]+/g) || []).length

    if (currentHashtags > config.constraints.maxHashtags) {
      return {
        type: 'hashtags',
        priority: 'high',
        description: `Too many hashtags for ${platform}`,
        currentValue: currentHashtags,
        recommendedValue: config.constraints.maxHashtags,
        impact: 'Excessive hashtags may be flagged as spam',
        implementation: `Reduce to ${config.constraints.maxHashtags} most relevant hashtags`
      }
    }

    // Platform-specific hashtag recommendations
    if (platform === 'instagram' && currentHashtags < 10) {
      return {
        type: 'hashtags',
        priority: 'medium',
        description: 'Instagram benefits from more hashtags',
        currentValue: currentHashtags,
        recommendedValue: 15,
        impact: 'More hashtags increase discoverability',
        implementation: 'Add relevant niche and broad hashtags'
      }
    }

    if (platform === 'twitter' && currentHashtags > 2) {
      return {
        type: 'hashtags',
        priority: 'medium',
        description: 'Twitter performs better with fewer hashtags',
        currentValue: currentHashtags,
        recommendedValue: 2,
        impact: 'Too many hashtags reduce engagement',
        implementation: 'Use only 1-2 most relevant hashtags'
      }
    }

    return null
  }

  // Optimize content structure
  private optimizeStructure(
    content: string,
    platform: PlatformType,
    contentDNA?: ContentDNA
  ): OptimizationRecommendation | null {
    if (!contentDNA) return null

    // Platform-specific structure recommendations
    switch (platform) {
      case 'linkedin':
        if (contentDNA.elements.filter(e => e.type === 'question').length === 0) {
          return {
            type: 'structure',
            priority: 'medium',
            description: 'LinkedIn content benefits from engagement questions',
            impact: 'Questions drive comments and algorithm favor',
            implementation: 'Add a thought-provoking question at the end'
          }
        }
        break

      case 'facebook':
        if (contentDNA.structure.paragraphCount > 5) {
          return {
            type: 'structure',
            priority: 'medium',
            description: 'Facebook favors shorter, more digestible content',
            impact: 'Long posts get less engagement',
            implementation: 'Condense to 3-4 short paragraphs'
          }
        }
        break

      case 'tiktok':
        if (!content.toLowerCase().includes('hook')) {
          return {
            type: 'structure',
            priority: 'high',
            description: 'TikTok needs strong hook in first 3 seconds',
            impact: 'Weak hooks lead to immediate scroll-away',
            implementation: 'Start with compelling question or surprising statement'
          }
        }
        break
    }

    return null
  }

  // Optimize for engagement
  private optimizeEngagement(content: string, platform: PlatformType): OptimizationRecommendation | null {
    const config = getPlatformConfig(platform)
    const lowerContent = content.toLowerCase()

    // Check for engagement elements
    const hasQuestion = content.includes('?')
    const hasCTA = lowerContent.match(/\b(comment|share|like|follow|subscribe)\b/)
    const hasPersonalization = (lowerContent.match(/\b(you|your)\b/g)?.length ?? 0) > 5

    if (!hasQuestion && !hasCTA) {
      return {
        type: 'engagement',
        priority: 'high',
        description: 'Content lacks engagement drivers',
        impact: 'Low engagement signals hurt algorithm performance',
        implementation: 'Add questions or clear calls-to-action'
      }
    }

    // Platform-specific engagement optimization
    if (platform === 'instagram' && !lowerContent.includes('story')) {
      return {
        type: 'engagement',
        priority: 'low',
        description: 'Consider mentioning Instagram Stories',
        impact: 'Cross-promotion increases overall engagement',
        implementation: 'Add "Share this to your story" or similar'
      }
    }

    return null
  }

  // Apply length optimization
  private applyLengthOptimization(content: string, rec: OptimizationRecommendation): string {
    if (rec.type === 'length' && rec.recommendedValue) {
      const maxLength = rec.recommendedValue as number
      if (content.length > maxLength) {
        // Trim content intelligently
        const sentences = content.split(/[.!?]+/)
        let trimmed = ''
        for (const sentence of sentences) {
          if ((trimmed + sentence).length <= maxLength - 3) {
            trimmed += sentence + '.'
          } else {
            break
          }
        }
        return trimmed + '...'
      }
    }
    return content
  }

  // Apply format optimization
  private applyFormatOptimization(
    content: string,
    rec: OptimizationRecommendation,
    platform: PlatformType
  ): string {
    if (rec.type === 'format') {
      switch (platform) {
        case 'twitter':
          if (rec.description.includes('thread')) {
            // Split into thread format
            const parts = content.match(/.{1,250}/g) || [content]
            return parts.map((part, i) => `${i + 1}/${parts.length} ${part}`).join('\n\n')
          }
          break

        case 'linkedin':
          if (rec.description.includes('paragraph')) {
            // Add more paragraph breaks
            return content.replace(/\. /g, '.\n\n')
          }
          break
      }
    }
    return content
  }

  // Apply hashtag optimization
  private applyHashtagOptimization(
    content: string,
    rec: OptimizationRecommendation,
    platform: PlatformType
  ): string {
    if (rec.type === 'hashtags') {
      const currentHashtags = content.match(/#[\w]+/g) || []
      
      if (rec.description.includes('Too many')) {
        // Remove excess hashtags
        const maxHashtags = rec.recommendedValue as number
        const keepHashtags = currentHashtags.slice(0, maxHashtags)
        let result = content
        currentHashtags.slice(maxHashtags).forEach(tag => {
          result = result.replace(tag, '')
        })
        return result.trim()
      }

      if (rec.description.includes('more hashtags')) {
        // Add platform-appropriate hashtags
        const additionalHashtags = this.generateHashtags(platform, content)
        return content + '\n\n' + additionalHashtags.join(' ')
      }
    }
    return content
  }

  // Apply structure optimization
  private applyStructureOptimization(
    content: string,
    rec: OptimizationRecommendation,
    platform: PlatformType
  ): string {
    if (rec.type === 'structure') {
      if (rec.description.includes('question')) {
        return content + '\n\nWhat are your thoughts on this?'
      }
      
      if (rec.description.includes('hook')) {
        return '🔥 You won\'t believe this... ' + content
      }
    }
    return content
  }

  // Apply engagement optimization
  private applyEngagementOptimization(
    content: string,
    rec: OptimizationRecommendation,
    platform: PlatformType
  ): string {
    if (rec.type === 'engagement') {
      if (rec.description.includes('engagement drivers')) {
        return content + '\n\n💭 What do you think? Share your experience in the comments!'
      }
      
      if (rec.description.includes('Stories')) {
        return content + '\n\n📱 Share this to your story!'
      }
    }
    return content
  }

  // Generate platform-appropriate hashtags
  private generateHashtags(platform: PlatformType, content: string): string[] {
    const baseHashtags = ['#contentmarketing', '#digitalmarketing', '#marketing']
    
    const platformHashtags: Record<PlatformType, string[]> = {
      instagram: ['#instagood', '#photooftheday', '#instadaily', '#follow', '#like4like'],
      twitter: ['#TwitterTips', '#SocialMedia'],
      linkedin: ['#LinkedIn', '#Professional', '#Business', '#Career'],
      tiktok: ['#fyp', '#viral', '#trending', '#foryou'],
      youtube: ['#YouTube', '#Subscribe', '#Video'],
      facebook: ['#Facebook', '#Social', '#Community'],
      medium: ['#Writing', '#Blog', '#Article'],
      blog: ['#Blog', '#SEO', '#Content']
    }

    return [...baseHashtags, ...platformHashtags[platform]].slice(0, 5)
  }

  // Calculate expected improvement
  private calculateExpectedImprovement(recommendations: OptimizationRecommendation[]): {
    engagement: number
    reach: number
    conversions: number
  } {
    let engagement = 0
    let reach = 0
    let conversions = 0

    recommendations.forEach(rec => {
      switch (rec.priority) {
        case 'high':
          engagement += 15
          reach += 20
          conversions += 10
          break
        case 'medium':
          engagement += 8
          reach += 10
          conversions += 5
          break
        case 'low':
          engagement += 3
          reach += 5
          conversions += 2
          break
      }
    })

    return {
      engagement: Math.min(50, engagement),
      reach: Math.min(60, reach),
      conversions: Math.min(30, conversions)
    }
  }

  // Calculate optimization confidence
  private calculateConfidence(recommendations: OptimizationRecommendation[]): number {
    if (recommendations.length === 0) return 0.5

    const highPriority = recommendations.filter(r => r.priority === 'high').length
    const mediumPriority = recommendations.filter(r => r.priority === 'medium').length
    
    let confidence = 0.6
    confidence += highPriority * 0.15
    confidence += mediumPriority * 0.08

    return Math.min(0.95, confidence)
  }

  // Generate platform-specific template
  async generatePlatformTemplate(platform: PlatformType): Promise<ContentTemplate> {
    const config = getPlatformConfig(platform)
    
    const templates: Record<PlatformType, Partial<ContentTemplate>> = {
      twitter: {
        name: 'Twitter Thread Template',
        structure: [
          'Hook tweet (1/n)',
          'Context/problem (2/n)',
          'Solution/insight (3/n)',
          'Call to action (n/n)'
        ],
        optimalLength: { min: 100, max: 280 },
        keyElements: ['Hook', 'Thread numbering', 'Hashtags (1-2)', 'Mention']
      },
      linkedin: {
        name: 'LinkedIn Professional Post',
        structure: [
          'Personal hook/story',
          'Professional insight',
          'Data/example',
          'Key takeaway',
          'Engagement question'
        ],
        optimalLength: { min: 500, max: 1300 },
        keyElements: ['Personal story', 'Professional value', 'Question', 'Hashtags']
      },
      instagram: {
        name: 'Instagram Engagement Post',
        structure: [
          'Visual hook',
          'Story/context',
          'Value/tip',
          'Call to action',
          'Hashtag block'
        ],
        optimalLength: { min: 300, max: 2200 },
        keyElements: ['Visual focus', 'Story', 'Value', 'Hashtags (15-30)']
      },
      youtube: {
        name: 'YouTube Video Description',
        structure: [
          'Video summary',
          'Timestamps',
          'Links/resources',
          'Subscribe CTA',
          'Social links'
        ],
        optimalLength: { min: 200, max: 5000 },
        keyElements: ['Summary', 'Timestamps', 'CTAs', 'Links']
      },
      tiktok: {
        name: 'TikTok Viral Format',
        structure: [
          'Hook (first 3 seconds)',
          'Quick value delivery',
          'Visual demonstration',
          'Strong ending',
          'Trending hashtags'
        ],
        optimalLength: { min: 50, max: 300 },
        keyElements: ['Strong hook', 'Quick value', 'Trending elements']
      },
      medium: {
        name: 'Medium Article Structure',
        structure: [
          'Compelling headline',
          'Introduction hook',
          'Subheadings (H2/H3)',
          'Supporting evidence',
          'Conclusion/CTA'
        ],
        optimalLength: { min: 1000, max: 3000 },
        keyElements: ['Headlines', 'Structure', 'Evidence', 'Readability']
      },
      facebook: {
        name: 'Facebook Engagement Post',
        structure: [
          'Attention-grabbing opener',
          'Short story/context',
          'Value/insight',
          'Community question',
          'Minimal hashtags'
        ],
        optimalLength: { min: 200, max: 500 },
        keyElements: ['Community focus', 'Questions', 'Short format']
      },
      blog: {
        name: 'SEO Blog Post Template',
        structure: [
          'SEO-optimized title',
          'Introduction with hook',
          'H2/H3 subheadings',
          'Supporting content',
          'Conclusion with CTA'
        ],
        optimalLength: { min: 1500, max: 3000 },
        keyElements: ['SEO optimization', 'Structure', 'Internal links', 'CTAs']
      }
    }

    const template: ContentTemplate = {
      platform,
      ...templates[platform],
      successRate: 0.75,
      examples: [`Example ${platform} content`]
    } as ContentTemplate

    this.templates.set(`${platform}_template`, template)

    return template
  }

  // Get optimization
  getOptimization(contentId: string, platform: PlatformType): PlatformOptimization | undefined {
    return this.optimizations.get(`${contentId}_${platform}`)
  }

  // Get all optimizations
  getOptimizations(): PlatformOptimization[] {
    return Array.from(this.optimizations.values())
  }

  // Get templates
  getTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values())
  }
}

export const platformOptimizer = PlatformOptimizer.getInstance()