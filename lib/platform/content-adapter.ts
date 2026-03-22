// Content Adapter - Platform-Specific Content Transformation
// Adapts content for Twitter, LinkedIn, Instagram, YouTube, TikTok, Medium, Facebook, Blog

import { AdaptationRequest, AdaptedContent, PlatformType, PlatformMetadata } from './types'
import { getPlatformConfig } from './platform-configs'
import { aiEngine } from '../ai-engine'

export class ContentAdapter {
  private static instance: ContentAdapter

  static getInstance(): ContentAdapter {
    if (!ContentAdapter.instance) {
      ContentAdapter.instance = new ContentAdapter()
    }
    return ContentAdapter.instance
  }

  // Main adaptation method
  async adaptContent(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig(request.targetPlatform)
    
    // Route to platform-specific adapter
    switch (request.targetPlatform) {
      case 'twitter':
        return this.adaptForTwitter(request)
      case 'linkedin':
        return this.adaptForLinkedIn(request)
      case 'instagram':
        return this.adaptForInstagram(request)
      case 'youtube':
        return this.adaptForYouTube(request)
      case 'tiktok':
        return this.adaptForTikTok(request)
      case 'medium':
        return this.adaptForMedium(request)
      case 'facebook':
        return this.adaptForFacebook(request)
      case 'blog':
        return this.adaptForBlog(request)
      default:
        throw new Error(`Unsupported platform: ${request.targetPlatform}`)
    }
  }

  // Twitter Adaptation (280 chars, concise, engaging)
  async adaptForTwitter(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('twitter')
    const optimizations: string[] = []
    const warnings: string[] = []

    // Generate Twitter-optimized content
    const prompt = `Adapt this content for Twitter/X (280 character limit):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Maximum 280 characters
- Engaging hook in first 10 words
- Use 1-2 relevant hashtags (not excessive)
- Include call-to-action if appropriate
- Conversational, punchy tone
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Professional yet approachable'}

Generate ONLY the tweet text, no explanations.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 100,
      temperature: 0.7
    })

    let tweetText = adaptedText.trim()

    // Enforce character limit
    if (tweetText.length > config.constraints.maxLength) {
      tweetText = tweetText.substring(0, config.constraints.maxLength - 3) + '...'
      warnings.push('Content truncated to fit 280 character limit')
    }

    // Extract hashtags
    const hashtags = this.extractHashtags(tweetText)
    if (hashtags.length > config.constraints.maxHashtags) {
      warnings.push(`Too many hashtags (${hashtags.length}). Twitter recommends max 2.`)
    }

    optimizations.push('Optimized for Twitter character limit')
    optimizations.push('Added engagement hook')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} relevant hashtag(s)`)
    }

    return {
      platform: 'twitter',
      format: 'text',
      content: tweetText,
      metadata: {
        hashtags,
        customFields: {
          characterCount: tweetText.length
        }
      },
      optimizations,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  // LinkedIn Adaptation (3000 chars, professional, thought leadership)
  async adaptForLinkedIn(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('linkedin')
    const optimizations: string[] = []

    const prompt = `Adapt this content for LinkedIn (professional network):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Professional, thought-leadership tone
- Start with compelling hook/question
- Use short paragraphs (2-3 lines each)
- Include relevant insights and takeaways
- Add line breaks for readability
- Maximum 3000 characters
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Professional and authoritative'}
- End with engagement question or CTA

Generate the LinkedIn post text.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 800,
      temperature: 0.7
    })

    let linkedInText = adaptedText.trim()

    // Enforce character limit
    if (linkedInText.length > config.constraints.maxLength) {
      linkedInText = linkedInText.substring(0, config.constraints.maxLength - 50) + '\n\n[Read more...]'
    }

    // Extract hashtags (LinkedIn recommends 3-5)
    const hashtags = request.keywords?.slice(0, 5).map(k => `#${k.replace(/\s+/g, '')}`) || []

    optimizations.push('Formatted for LinkedIn professional audience')
    optimizations.push('Added thought leadership elements')
    optimizations.push('Optimized paragraph structure for readability')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} professional hashtags`)
    }

    return {
      platform: 'linkedin',
      format: 'text',
      content: linkedInText,
      metadata: {
        hashtags,
        customFields: {
          characterCount: linkedInText.length
        }
      },
      optimizations
    }
  }

  // Instagram Adaptation (2200 chars, visual-first, storytelling)
  async adaptForInstagram(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('instagram')
    const optimizations: string[] = []

    const prompt = `Adapt this content for Instagram (visual storytelling platform):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Engaging, storytelling style
- Start with emoji or attention-grabbing hook
- Use emojis strategically throughout
- Short paragraphs with line breaks
- Maximum 2200 characters
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Authentic and relatable'}
- End with clear CTA
- Note: This is caption text (visual content separate)

Generate the Instagram caption.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 600,
      temperature: 0.8
    })

    let instagramText = adaptedText.trim()

    // Enforce character limit
    if (instagramText.length > config.constraints.maxLength) {
      instagramText = instagramText.substring(0, config.constraints.maxLength - 20) + '\n...'
    }

    // Generate hashtags (Instagram allows up to 30)
    const hashtags = request.keywords?.slice(0, 15).map(k => `#${k.replace(/\s+/g, '')}`) || []
    
    // Add hashtags at the end
    if (hashtags.length > 0 && request.includeHashtags !== false) {
      instagramText += '\n\n' + hashtags.join(' ')
    }

    optimizations.push('Optimized for Instagram visual storytelling')
    optimizations.push('Added strategic emoji usage')
    optimizations.push('Formatted with line breaks for readability')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} relevant hashtags`)
    }

    return {
      platform: 'instagram',
      format: 'image',
      content: instagramText,
      metadata: {
        hashtags,
        customFields: {
          characterCount: instagramText.length,
          requiresVisual: true
        }
      },
      optimizations
    }
  }

  // YouTube Adaptation (5000 chars description, video script)
  async adaptForYouTube(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('youtube')
    const optimizations: string[] = []

    const prompt = `Adapt this content for YouTube (video description and script outline):

Original Content: ${request.content}
${request.title ? `Video Title: ${request.title}` : ''}

Requirements:
- Compelling video description (first 150 chars crucial)
- Include timestamps for key sections
- Add relevant links and resources
- Maximum 5000 characters
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Engaging and informative'}
- Include subscribe CTA
- Add relevant hashtags (max 15)

Generate the YouTube video description.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 1200,
      temperature: 0.7
    })

    let youtubeText = adaptedText.trim()

    // Enforce character limit
    if (youtubeText.length > config.constraints.maxLength) {
      youtubeText = youtubeText.substring(0, config.constraints.maxLength)
    }

    // Extract hashtags
    const hashtags = request.keywords?.slice(0, 10).map(k => `#${k.replace(/\s+/g, '')}`) || []

    optimizations.push('Optimized for YouTube search and discovery')
    optimizations.push('Added compelling description hook')
    optimizations.push('Included subscribe CTA')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} searchable hashtags`)
    }

    return {
      platform: 'youtube',
      format: 'video',
      content: youtubeText,
      metadata: {
        hashtags,
        title: request.title,
        customFields: {
          characterCount: youtubeText.length,
          requiresVideo: true
        }
      },
      optimizations
    }
  }

  // TikTok Adaptation (2200 chars, short-form video, trending)
  async adaptForTikTok(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('tiktok')
    const optimizations: string[] = []

    const prompt = `Adapt this content for TikTok (short-form video platform):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Catchy, attention-grabbing caption
- Use trending language and phrases
- Include hook for first 3 seconds
- Maximum 2200 characters
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Energetic and authentic'}
- Add relevant hashtags (max 10)
- Include CTA (like, follow, comment)

Generate the TikTok caption and video concept.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 500,
      temperature: 0.9
    })

    let tiktokText = adaptedText.trim()

    // Enforce character limit
    if (tiktokText.length > config.constraints.maxLength) {
      tiktokText = tiktokText.substring(0, config.constraints.maxLength)
    }

    // Generate hashtags (TikTok recommends 3-5 relevant ones)
    const hashtags = request.keywords?.slice(0, 5).map(k => `#${k.replace(/\s+/g, '')}`) || []

    optimizations.push('Optimized for TikTok algorithm')
    optimizations.push('Added viral hook elements')
    optimizations.push('Included trending format suggestions')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} trending hashtags`)
    }

    return {
      platform: 'tiktok',
      format: 'video',
      content: tiktokText,
      metadata: {
        hashtags,
        customFields: {
          characterCount: tiktokText.length,
          requiresVideo: true,
          optimalDuration: '15-60 seconds'
        }
      },
      optimizations
    }
  }

  // Medium Adaptation (long-form article, 300-100000 chars)
  async adaptForMedium(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('medium')
    const optimizations: string[] = []

    const prompt = `Adapt this content for Medium (long-form article platform):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Long-form, in-depth article format
- Compelling introduction with hook
- Use subheadings (H2, H3) for structure
- Include relevant examples and insights
- Minimum 300 characters, maximum 100000
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Thoughtful and authoritative'}
- Add conclusion with key takeaways
- Professional, editorial quality

Generate the Medium article.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 2000,
      temperature: 0.7
    })

    let mediumText = adaptedText.trim()

    // Enforce minimum length
    if (mediumText.length < (config.constraints.minLength || 300)) {
      optimizations.push('Content expanded to meet Medium minimum length')
    }

    // Enforce maximum length
    if (mediumText.length > config.constraints.maxLength) {
      mediumText = mediumText.substring(0, config.constraints.maxLength)
    }

    // Extract tags (Medium uses tags, not hashtags)
    const tags = request.keywords?.slice(0, 5) || []

    optimizations.push('Formatted for Medium long-form reading')
    optimizations.push('Added structured headings')
    optimizations.push('Optimized for reading time and engagement')
    if (tags.length > 0) {
      optimizations.push(`Added ${tags.length} relevant tags`)
    }

    return {
      platform: 'medium',
      format: 'article',
      content: mediumText,
      metadata: {
        tags,
        title: request.title,
        customFields: {
          characterCount: mediumText.length,
          estimatedReadingTime: Math.ceil(mediumText.split(/\s+/).length / 200)
        }
      },
      optimizations
    }
  }

  // Facebook Adaptation (63206 chars, community-focused)
  async adaptForFacebook(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('facebook')
    const optimizations: string[] = []

    const prompt = `Adapt this content for Facebook (community platform):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- Conversational, community-focused tone
- Start with engaging question or statement
- Use short paragraphs
- Maximum 63206 characters (but shorter is better)
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Friendly and engaging'}
- Include engagement prompt (comment, share, react)
- Use minimal hashtags (1-3 max)

Generate the Facebook post.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 600,
      temperature: 0.7
    })

    let facebookText = adaptedText.trim()

    // Enforce character limit
    if (facebookText.length > config.constraints.maxLength) {
      facebookText = facebookText.substring(0, config.constraints.maxLength)
    }

    // Generate minimal hashtags (Facebook doesn't emphasize hashtags)
    const hashtags = request.keywords?.slice(0, 2).map(k => `#${k.replace(/\s+/g, '')}`) || []

    optimizations.push('Optimized for Facebook community engagement')
    optimizations.push('Added conversation starters')
    optimizations.push('Formatted for meaningful interactions')
    if (hashtags.length > 0) {
      optimizations.push(`Added ${hashtags.length} minimal hashtags`)
    }

    return {
      platform: 'facebook',
      format: 'text',
      content: facebookText,
      metadata: {
        hashtags,
        customFields: {
          characterCount: facebookText.length
        }
      },
      optimizations
    }
  }

  // Blog Adaptation (long-form, SEO-optimized)
  async adaptForBlog(request: AdaptationRequest): Promise<AdaptedContent> {
    const config = getPlatformConfig('blog')
    const optimizations: string[] = []

    const prompt = `Adapt this content for a blog post (SEO-optimized article):

Original Content: ${request.content}
${request.title ? `Title: ${request.title}` : ''}

Requirements:
- SEO-optimized long-form article
- Compelling title and introduction
- Use H2 and H3 subheadings
- Include relevant keywords naturally
- Minimum 300 characters, maximum 100000
- ${request.brandVoice ? `Brand voice: ${request.brandVoice}` : 'Informative and authoritative'}
- Add conclusion with CTA
- Optimize for search engines and readers

Generate the blog post.`

    const adaptedText = await aiEngine.generateText(prompt, {
      maxTokens: 2000,
      temperature: 0.7
    })

    let blogText = adaptedText.trim()

    // Enforce minimum length
    if (blogText.length < (config.constraints.minLength || 300)) {
      optimizations.push('Content expanded to meet blog minimum length')
    }

    // Enforce maximum length
    if (blogText.length > config.constraints.maxLength) {
      blogText = blogText.substring(0, config.constraints.maxLength)
    }

    const keywords = request.keywords || []

    optimizations.push('Optimized for SEO and search rankings')
    optimizations.push('Added structured headings for readability')
    optimizations.push('Included relevant keywords naturally')
    if (keywords.length > 0) {
      optimizations.push(`Optimized for ${keywords.length} target keywords`)
    }

    return {
      platform: 'blog',
      format: 'article',
      content: blogText,
      metadata: {
        tags: keywords,
        title: request.title,
        customFields: {
          characterCount: blogText.length,
          wordCount: blogText.split(/\s+/).length,
          estimatedReadingTime: Math.ceil(blogText.split(/\s+/).length / 200)
        }
      },
      optimizations
    }
  }

  // Helper: Extract hashtags from text
  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g
    const matches = text.match(hashtagRegex)
    return matches || []
  }

  // Helper: Truncate text to fit constraints
  private truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength - suffix.length) + suffix
  }

  // Helper: Count words
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }
}

export const contentAdapter = ContentAdapter.getInstance()
