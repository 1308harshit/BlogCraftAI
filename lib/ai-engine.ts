// Multi-model AI orchestration engine for BlogCraft AI
import type OpenAI from 'openai'
import type Anthropic from '@anthropic-ai/sdk'

export interface AIModel {
  name: string
  provider: 'openai' | 'anthropic' | 'groq' | 'cohere'
  costPer1kTokens: number
  maxTokens: number
  strengths: string[]
}

export interface ContentRequest {
  type: 'blog' | 'social' | 'email' | 'video_script' | 'podcast_outline'
  topic: string
  keywords?: string[]
  targetAudience?: string
  brandVoice?: 'professional' | 'casual' | 'technical' | 'creative'
  length?: 'short' | 'medium' | 'long'
  platform?: string
}

export interface ContentResponse {
  content: string
  title: string
  metadata: {
    wordCount: number
    readingTime: number
    seoScore: number
    viralityScore: number
    model: string
    cost: number
  }
}

export class AIEngine {
  private openai?: OpenAI
  private anthropic?: Anthropic
  private groqApiKey?: string

  constructor() {
    // Initialize AI clients with dynamic imports
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = require('openai')
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
      } catch (error) {
        console.warn('OpenAI SDK not available')
      }
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = require('@anthropic-ai/sdk')
        this.anthropic = new Anthropic.default({
          apiKey: process.env.ANTHROPIC_API_KEY
        })
      } catch (error) {
        console.warn('Anthropic SDK not available')
      }
    }

    this.groqApiKey = process.env.GROQ_API_KEY
  }

  // Available AI models with their capabilities
  getAvailableModels(): AIModel[] {
    return [
      {
        name: 'GPT-4 Turbo',
        provider: 'openai',
        costPer1kTokens: 0.01,
        maxTokens: 4096,
        strengths: ['creativity', 'complex reasoning', 'code generation']
      },
      {
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        costPer1kTokens: 0.002,
        maxTokens: 4096,
        strengths: ['speed', 'cost-effective', 'general purpose']
      },
      {
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        costPer1kTokens: 0.003,
        maxTokens: 4096,
        strengths: ['analysis', 'safety', 'nuanced writing']
      },
      {
        name: 'Llama 3.1 8B',
        provider: 'groq',
        costPer1kTokens: 0.00005,
        maxTokens: 8192,
        strengths: ['speed', 'ultra-low cost', 'efficiency']
      }
    ]
  }

  // Smart model selection based on content type and requirements
  selectOptimalModel(request: ContentRequest, userPlan: string): AIModel {
    const models = this.getAvailableModels()
    
    // Enterprise users get premium models
    if (userPlan === 'enterprise') {
      return models.find(m => m.name === 'GPT-4 Turbo') || models[0]
    }
    
    // Pro users get balanced performance
    if (userPlan === 'pro' || userPlan === 'founder') {
      if (request.type === 'blog' && request.length === 'long') {
        return models.find(m => m.name === 'Claude 3 Sonnet') || models[0]
      }
      return models.find(m => m.name === 'GPT-3.5 Turbo') || models[0]
    }
    
    // Free users get cost-effective model
    return models.find(m => m.name === 'Llama 3.1 8B') || models[0]
  }

  // Generate content using the optimal model
  async generateContent(request: ContentRequest, userPlan: string = 'free'): Promise<ContentResponse> {
    const model = this.selectOptimalModel(request, userPlan)
    
    try {
      let content: string
      let cost: number

      switch (model.provider) {
        case 'openai':
          ({ content, cost } = await this.generateWithOpenAI(request, model))
          break
        case 'anthropic':
          ({ content, cost } = await this.generateWithAnthropic(request, model))
          break
        case 'groq':
          ({ content, cost } = await this.generateWithGroq(request, model))
          break
        default:
          throw new Error(`Unsupported provider: ${model.provider}`)
      }

      // Extract title from content
      const title = this.extractTitle(content, request.topic)
      
      // Calculate metadata
      const metadata = {
        wordCount: this.countWords(content),
        readingTime: this.calculateReadingTime(content),
        seoScore: await this.calculateSEOScore(content, request.keywords),
        viralityScore: await this.predictVirality(content, request),
        model: model.name,
        cost
      }

      return {
        content,
        title,
        metadata
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      // Fallback to mock content
      return this.generateFallbackContent(request)
    }
  }

  // OpenAI generation
  private async generateWithOpenAI(request: ContentRequest, model: AIModel): Promise<{content: string, cost: number}> {
    if (!this.openai) throw new Error('OpenAI not configured')

    const prompt = this.buildPrompt(request)
    const response = await this.openai.chat.completions.create({
      model: model.name.toLowerCase().replace(' ', '-'),
      messages: [
        { role: 'system', content: this.getSystemPrompt(request.type) },
        { role: 'user', content: prompt }
      ],
      max_tokens: model.maxTokens,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content || ''
    const tokens = response.usage?.total_tokens || 0
    const cost = (tokens / 1000) * model.costPer1kTokens

    return { content, cost }
  }

  // Anthropic generation
  private async generateWithAnthropic(request: ContentRequest, model: AIModel): Promise<{content: string, cost: number}> {
    if (!this.anthropic) throw new Error('Anthropic not configured')

    const prompt = this.buildPrompt(request)
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: model.maxTokens,
      messages: [
        { role: 'user', content: prompt }
      ]
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const tokens = response.usage.input_tokens + response.usage.output_tokens
    const cost = (tokens / 1000) * model.costPer1kTokens

    return { content, cost }
  }

  // Groq generation (existing implementation)
  private async generateWithGroq(request: ContentRequest, model: AIModel): Promise<{content: string, cost: number}> {
    if (!this.groqApiKey) throw new Error('Groq not configured')

    const prompt = this.buildPrompt(request)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.groqApiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: this.getSystemPrompt(request.type) },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: model.maxTokens
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    const tokens = data.usage?.total_tokens || 0
    const cost = (tokens / 1000) * model.costPer1kTokens

    return { content, cost }
  }

  // Build optimized prompts for different content types
  private buildPrompt(request: ContentRequest): string {
    const keywordText = request.keywords?.length ? 
      `Focus on these keywords: ${request.keywords.join(', ')}` : ''
    
    const audienceText = request.targetAudience ? 
      `Target audience: ${request.targetAudience}` : ''
    
    const voiceText = request.brandVoice ? 
      `Brand voice: ${request.brandVoice}` : ''

    switch (request.type) {
      case 'blog':
        return `Write a comprehensive, SEO-optimized blog post about "${request.topic}".

Requirements:
- ${this.getLengthRequirement(request.length)}
- Include an engaging title
- Use proper heading structure (H1, H2, H3)
- Write in a ${request.brandVoice || 'professional'} tone
- Include actionable tips and insights
- Optimize for search engines
- ${keywordText}
- ${audienceText}
- ${voiceText}

Structure:
1. Compelling title
2. Introduction that hooks the reader
3. Main content with subheadings
4. Conclusion with key takeaways

Make it valuable, informative, and engaging.`

      case 'social':
        return `Create engaging social media posts about "${request.topic}" for ${request.platform || 'multiple platforms'}.

Requirements:
- Platform-optimized format
- Include relevant hashtags
- Engaging and shareable
- ${keywordText}
- ${audienceText}
- ${voiceText}

Create 5 variations for different platforms.`

      case 'email':
        return `Write a compelling email campaign about "${request.topic}".

Requirements:
- Attention-grabbing subject line
- Personalized content
- Clear call-to-action
- ${keywordText}
- ${audienceText}
- ${voiceText}

Include subject line, preview text, and email body.`

      case 'video_script':
        return `Create a video script about "${request.topic}".

Requirements:
- Hook within first 5 seconds
- Clear structure with timestamps
- Engaging narration
- Visual cues
- ${keywordText}
- ${audienceText}
- ${voiceText}

Format: [Timestamp] Action/Narration`

      case 'podcast_outline':
        return `Create a detailed podcast episode outline about "${request.topic}".

Requirements:
- Episode structure with timestamps
- Key talking points
- Guest questions (if applicable)
- Call-to-action
- ${keywordText}
- ${audienceText}
- ${voiceText}

Include intro, main segments, and outro.`

      default:
        return `Create content about "${request.topic}". ${keywordText} ${audienceText} ${voiceText}`
    }
  }

  private getSystemPrompt(contentType: string): string {
    const basePrompt = "You are an expert content creator who produces engaging, high-quality content that drives results."
    
    switch (contentType) {
      case 'blog':
        return `${basePrompt} You specialize in SEO-optimized blog posts that rank well on Google and provide genuine value to readers.`
      case 'social':
        return `${basePrompt} You create viral social media content that maximizes engagement and shares.`
      case 'email':
        return `${basePrompt} You write email campaigns that achieve high open rates and conversions.`
      case 'video_script':
        return `${basePrompt} You create video scripts that capture attention and maintain viewer engagement.`
      case 'podcast_outline':
        return `${basePrompt} You design podcast episodes that inform, entertain, and build audience loyalty.`
      default:
        return basePrompt
    }
  }

  private getLengthRequirement(length?: string): string {
    switch (length) {
      case 'short': return '300-500 words'
      case 'medium': return '800-1200 words'
      case 'long': return '1500-2500 words'
      default: return '800-1200 words'
    }
  }

  // Utility methods
  private extractTitle(content: string, fallbackTopic: string): string {
    const titleMatch = content.match(/^#\s*(.+)$/m)
    return titleMatch ? titleMatch[1].trim() : fallbackTopic
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200
    return Math.ceil(this.countWords(text) / wordsPerMinute)
  }

  private async calculateSEOScore(content: string, keywords?: string[]): Promise<number> {
    let score = 50 // Base score
    
    // Check for proper heading structure
    if (content.includes('# ') && content.includes('## ')) score += 10
    
    // Check for keyword usage
    if (keywords?.length) {
      const contentLower = content.toLowerCase()
      const keywordUsage = keywords.filter(keyword => 
        contentLower.includes(keyword.toLowerCase())
      ).length
      score += (keywordUsage / keywords.length) * 20
    }
    
    // Check content length
    const wordCount = this.countWords(content)
    if (wordCount >= 800 && wordCount <= 2000) score += 10
    
    // Check for meta elements (simplified)
    if (content.includes('Introduction') || content.includes('Conclusion')) score += 10
    
    return Math.min(100, Math.max(0, score))
  }

  private async predictVirality(content: string, request: ContentRequest): Promise<number> {
    let score = 50 // Base score
    
    // Emotional triggers
    const emotionalWords = ['amazing', 'incredible', 'shocking', 'secret', 'proven', 'ultimate']
    const emotionalCount = emotionalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    score += emotionalCount * 5
    
    // Question-based content
    if (content.includes('?')) score += 10
    
    // List format
    if (content.includes('1.') || content.includes('•')) score += 15
    
    // Trending topics (simplified)
    const trendingKeywords = ['ai', 'automation', '2024', 'guide', 'tips']
    const trendingCount = trendingKeywords.filter(keyword => 
      request.topic.toLowerCase().includes(keyword)
    ).length
    score += trendingCount * 8
    
    return Math.min(100, Math.max(0, score))
  }

  private generateFallbackContent(request: ContentRequest): ContentResponse {
    const fallbackContent = `# ${request.topic}

This is a fallback response generated when AI services are unavailable.

## Introduction

${request.topic} is an important topic that deserves detailed coverage. This content would normally be generated by our AI engine.

## Key Points

• Important aspect 1
• Important aspect 2  
• Important aspect 3

## Conclusion

This fallback content ensures the system remains functional even when external AI services are down.`

    return {
      content: fallbackContent,
      title: request.topic,
      metadata: {
        wordCount: this.countWords(fallbackContent),
        readingTime: this.calculateReadingTime(fallbackContent),
        seoScore: 60,
        viralityScore: 40,
        model: 'Fallback Generator',
        cost: 0
      }
    }
  }

  // Simple text generation for platform adaptation (no external API calls)
  async generateText(prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string> {
    // Try to use available AI services, fallback to simple generation
    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options?.maxTokens || 500,
          temperature: options?.temperature || 0.7
        })
        return response.choices[0]?.message?.content || this.generateSimpleText(prompt)
      }
      
      if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: options?.maxTokens || 500,
          messages: [{ role: 'user', content: prompt }]
        })
        return response.content[0]?.type === 'text' ? response.content[0].text : this.generateSimpleText(prompt)
      }

      // Fallback to simple generation
      return this.generateSimpleText(prompt)
    } catch (error) {
      console.error('AI text generation failed, using fallback:', error)
      return this.generateSimpleText(prompt)
    }
  }

  // Simple text generation without external APIs (for testing and fallback)
  private generateSimpleText(prompt: string): string {
    // Extract key information from prompt
    const lines = prompt.split('\n')
    const contentLine = lines.find(l => l.includes('Original Content:'))
    const titleLine = lines.find(l => l.includes('Title:'))
    
    if (contentLine) {
      const content = contentLine.replace('Original Content:', '').trim()
      const title = titleLine ? titleLine.replace('Title:', '').trim() : ''
      
      // Return adapted content based on platform hints in prompt
      if (prompt.includes('Twitter')) {
        return this.adaptForTwitterSimple(content, title)
      } else if (prompt.includes('LinkedIn')) {
        return this.adaptForLinkedInSimple(content, title)
      } else if (prompt.includes('Instagram')) {
        return this.adaptForInstagramSimple(content, title)
      } else if (prompt.includes('YouTube')) {
        return this.adaptForYouTubeSimple(content, title)
      } else if (prompt.includes('TikTok')) {
        return this.adaptForTikTokSimple(content, title)
      } else if (prompt.includes('Medium')) {
        return this.adaptForMediumSimple(content, title)
      } else if (prompt.includes('Facebook')) {
        return this.adaptForFacebookSimple(content, title)
      } else if (prompt.includes('blog')) {
        return this.adaptForBlogSimple(content, title)
      }
    }
    
    return 'Generated content based on your requirements.'
  }

  private adaptForTwitterSimple(content: string, title: string): string {
    const text = title || content
    return text.substring(0, 250) + ' #AI #Tech'
  }

  private adaptForLinkedInSimple(content: string, title: string): string {
    return `${title}\n\n${content.substring(0, 500)}\n\nWhat are your thoughts? #Professional #Business`
  }

  private adaptForInstagramSimple(content: string, title: string): string {
    return `✨ ${title}\n\n${content.substring(0, 400)}\n\n#Instagram #Content #Engagement`
  }

  private adaptForYouTubeSimple(content: string, title: string): string {
    return `${title}\n\n${content}\n\n🔔 Subscribe for more content!\n\n#YouTube #Video`
  }

  private adaptForTikTokSimple(content: string, title: string): string {
    return `${title} 🎵\n\n${content.substring(0, 300)}\n\n#TikTok #Viral #Trending`
  }

  private adaptForMediumSimple(content: string, title: string): string {
    const intro = `${content}\n\nThis topic deserves deeper exploration and analysis.`
    const body = `\n\n## Key Insights\n\n${content}\n\nThese insights provide valuable perspective on the subject matter.`
    const conclusion = `\n\n## Conclusion\n\nIn summary, ${title.toLowerCase()} represents an important area worthy of continued attention and discussion.`
    return `# ${title}\n\n## Introduction\n\n${intro}${body}${conclusion}`
  }

  private adaptForFacebookSimple(content: string, title: string): string {
    return `${title}\n\n${content.substring(0, 500)}\n\nWhat do you think? Let us know in the comments!`
  }

  private adaptForBlogSimple(content: string, title: string): string {
    const intro = `${content}\n\nThis comprehensive guide explores the key aspects and implications.`
    const body = `\n\n## Main Content\n\n${content}\n\nThese points highlight the most important considerations.`
    const conclusion = `\n\n## Conclusion\n\nTo summarize, ${title.toLowerCase()} offers valuable insights and actionable takeaways for readers.`
    return `# ${title}\n\n## Introduction\n\n${intro}${body}${conclusion}`
  }
}

// Export singleton instance
export const aiEngine = new AIEngine()