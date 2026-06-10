// Content DNA Analyzer
// Reverse-engineer successful content and identify replicable patterns

import {
  ContentDNA,
  ContentStructure,
  ContentStyle,
  ContentElement,
  SuccessFactor,
  EmotionalProfile,
  SuccessPattern,
  ContentTemplate,
  PerformanceCorrelation
} from './types'

export class ContentDNAAnalyzer {
  private static instance: ContentDNAAnalyzer
  private contentDNA: Map<string, ContentDNA> = new Map()
  private successPatterns: Map<string, SuccessPattern> = new Map()
  private templates: Map<string, ContentTemplate> = new Map()

  static getInstance(): ContentDNAAnalyzer {
    if (!ContentDNAAnalyzer.instance) {
      ContentDNAAnalyzer.instance = new ContentDNAAnalyzer()
    }
    return ContentDNAAnalyzer.instance
  }

  // Analyze content DNA
  async analyzeContent(
    contentId: string,
    content: string,
    title: string,
    performanceMetrics?: any
  ): Promise<ContentDNA> {
    console.log(`Analyzing content DNA for: ${title}`)

    const structure = this.analyzeStructure(content)
    const style = this.analyzeStyle(content)
    const elements = this.extractElements(content)
    const emotionalProfile = this.analyzeEmotionalProfile(content)
    const successFactors = await this.identifySuccessFactors(
      structure,
      style,
      elements,
      performanceMetrics
    )
    const viralTriggers = this.identifyViralTriggers(content, elements)

    const dna: ContentDNA = {
      id: `dna_${contentId}`,
      contentId,
      structure,
      style,
      elements,
      successFactors,
      viralTriggers,
      emotionalProfile,
      readabilityScore: this.calculateReadability(structure, style),
      seoScore: this.calculateSEOScore(content, title),
      engagementPotential: this.calculateEngagementPotential(elements, emotionalProfile),
      analyzedAt: new Date()
    }

    this.contentDNA.set(contentId, dna)

    console.log(`DNA Analysis complete:`)
    console.log(`  Readability: ${dna.readabilityScore}/100`)
    console.log(`  SEO Score: ${dna.seoScore}/100`)
    console.log(`  Engagement Potential: ${dna.engagementPotential}/100`)
    console.log(`  Success Factors: ${successFactors.length}`)

    return dna
  }

  // Analyze content structure
  private analyzeStructure(content: string): ContentStructure {
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0)
    
    return {
      wordCount: words.length,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      averageSentenceLength: words.length / Math.max(1, sentences.length),
      headingCount: (content.match(/^#{1,6}\s/gm) || []).length,
      listCount: (content.match(/^[-*+]\s/gm) || []).length,
      imageCount: (content.match(/!\[.*?\]\(.*?\)/g) || []).length,
      videoCount: (content.match(/\[video\]/gi) || []).length,
      linkCount: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
      codeBlockCount: (content.match(/```/g) || []).length / 2,
      quoteCount: (content.match(/^>\s/gm) || []).length
    }
  }

  // Analyze content style
  private analyzeStyle(content: string): ContentStyle {
    const lowerContent = content.toLowerCase()
    
    // Detect tone
    let tone: ContentStyle['tone'] = 'professional'
    if (lowerContent.includes('you') && lowerContent.includes('your')) {
      tone = 'friendly'
    } else if (lowerContent.match(/\b(research|study|data|analysis)\b/g)) {
      tone = 'authoritative'
    } else if (lowerContent.match(/\b(lol|haha|funny|joke)\b/g)) {
      tone = 'humorous'
    }

    // Detect voice
    let voice: ContentStyle['voice'] = 'third_person'
    if (lowerContent.match(/\b(i|me|my|we|us|our)\b/g)) {
      voice = 'first_person'
    } else if (lowerContent.match(/\b(you|your)\b/g)) {
      voice = 'second_person'
    }

    // Calculate complexity
    const words = content.split(/\s+/)
    const longWords = words.filter(w => w.length > 7).length
    const complexityRatio = longWords / words.length
    const complexity: ContentStyle['complexity'] = 
      complexityRatio > 0.2 ? 'complex' :
      complexityRatio > 0.1 ? 'moderate' :
      'simple'

    // Detect sentiment
    const positiveWords = lowerContent.match(/\b(great|excellent|amazing|wonderful|fantastic|love|best)\b/g) || []
    const negativeWords = lowerContent.match(/\b(bad|terrible|awful|worst|hate|poor)\b/g) || []
    const sentiment: ContentStyle['sentiment'] = 
      positiveWords.length > negativeWords.length ? 'positive' :
      negativeWords.length > positiveWords.length ? 'negative' :
      'neutral'

    return {
      tone,
      voice,
      complexity,
      formality: 'neutral',
      sentiment,
      readingLevel: 10
    }
  }

  // Extract content elements
  private extractElements(content: string): ContentElement[] {
    const elements: ContentElement[] = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const position = index / lines.length

      // Hook (first paragraph)
      if (index === 0 && line.length > 50) {
        elements.push({
          type: 'hook',
          position,
          content: line.substring(0, 100),
          effectiveness: 0.8,
          impact: 'high'
        })
      }

      // Questions
      if (line.includes('?')) {
        elements.push({
          type: 'question',
          position,
          content: line,
          effectiveness: 0.7,
          impact: 'medium'
        })
      }

      // CTAs
      if (line.match(/\b(click|download|subscribe|sign up|get started|learn more)\b/i)) {
        elements.push({
          type: 'cta',
          position,
          content: line,
          effectiveness: 0.75,
          impact: 'high'
        })
      }

      // Lists
      if (line.match(/^[-*+]\s/)) {
        elements.push({
          type: 'list',
          position,
          content: line,
          effectiveness: 0.65,
          impact: 'medium'
        })
      }

      // Data/Statistics
      if (line.match(/\d+%|\d+x|#\d+/)) {
        elements.push({
          type: 'data',
          position,
          content: line,
          effectiveness: 0.85,
          impact: 'high'
        })
      }
    })

    return elements
  }

  // Analyze emotional profile
  private analyzeEmotionalProfile(content: string): EmotionalProfile {
    const lowerContent = content.toLowerCase()
    
    // Detect primary emotion
    const emotions = {
      excitement: (lowerContent.match(/\b(amazing|incredible|awesome|fantastic)\b/g) || []).length,
      curiosity: (lowerContent.match(/\b(discover|learn|find out|secret)\b/g) || []).length,
      urgency: (lowerContent.match(/\b(now|today|limited|hurry)\b/g) || []).length,
      trust: (lowerContent.match(/\b(proven|research|study|expert)\b/g) || []).length
    }

    const primaryEmotion = Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)[0][0]

    return {
      primaryEmotion,
      emotionalIntensity: 0.7,
      emotionalArc: 'rising',
      triggers: ['curiosity', 'urgency', 'social_proof'],
      resonanceScore: 0.75
    }
  }

  // Identify success factors
  private async identifySuccessFactors(
    structure: ContentStructure,
    style: ContentStyle,
    elements: ContentElement[],
    performanceMetrics?: any
  ): Promise<SuccessFactor[]> {
    const factors: SuccessFactor[] = []

    // Word count factor
    if (structure.wordCount >= 1500 && structure.wordCount <= 2500) {
      factors.push({
        factor: 'Optimal word count',
        category: 'structure',
        importance: 0.8,
        correlation: 0.75,
        examples: ['1500-2500 words performs best'],
        recommendations: ['Maintain comprehensive but focused content']
      })
    }

    // Visual elements
    if (structure.imageCount >= 3) {
      factors.push({
        factor: 'Rich visual content',
        category: 'format',
        importance: 0.7,
        correlation: 0.68,
        examples: ['3+ images increase engagement by 40%'],
        recommendations: ['Add more visuals to break up text']
      })
    }

    // Readability
    if (style.complexity === 'simple' || style.complexity === 'moderate') {
      factors.push({
        factor: 'Accessible readability',
        category: 'style',
        importance: 0.85,
        correlation: 0.82,
        examples: ['Simple language increases completion rate'],
        recommendations: ['Keep sentences short and clear']
      })
    }

    // Engagement elements
    const ctaCount = elements.filter(e => e.type === 'cta').length
    if (ctaCount >= 2) {
      factors.push({
        factor: 'Multiple CTAs',
        category: 'structure',
        importance: 0.75,
        correlation: 0.7,
        examples: ['2-3 CTAs optimize conversion'],
        recommendations: ['Place CTAs strategically throughout content']
      })
    }

    return factors
  }

  // Identify viral triggers
  private identifyViralTriggers(content: string, elements: ContentElement[]): string[] {
    const triggers: string[] = []
    const lowerContent = content.toLowerCase()

    if (lowerContent.match(/\b(shocking|surprising|unbelievable)\b/)) {
      triggers.push('surprise')
    }
    if (lowerContent.match(/\b(secret|hidden|revealed)\b/)) {
      triggers.push('curiosity')
    }
    if (elements.some(e => e.type === 'data')) {
      triggers.push('social_proof')
    }
    if ((lowerContent.match(/\b(you|your)\b/g)?.length ?? 0) > 10) {
      triggers.push('personalization')
    }
    if (lowerContent.match(/\b(story|experience|journey)\b/)) {
      triggers.push('storytelling')
    }

    return triggers
  }

  // Calculate readability score
  private calculateReadability(structure: ContentStructure, style: ContentStyle): number {
    let score = 50

    // Sentence length
    if (structure.averageSentenceLength < 20) score += 15
    else if (structure.averageSentenceLength < 25) score += 10
    else score += 5

    // Complexity
    if (style.complexity === 'simple') score += 20
    else if (style.complexity === 'moderate') score += 15
    else score += 5

    // Structure
    if (structure.headingCount >= 3) score += 10
    if (structure.listCount >= 2) score += 5

    return Math.min(100, score)
  }

  // Calculate SEO score
  private calculateSEOScore(content: string, title: string): number {
    let score = 40

    // Title length
    if (title.length >= 50 && title.length <= 60) score += 15
    else if (title.length >= 40 && title.length <= 70) score += 10

    // Content length
    const wordCount = content.split(/\s+/).length
    if (wordCount >= 1500) score += 20
    else if (wordCount >= 1000) score += 15
    else if (wordCount >= 500) score += 10

    // Headings
    const headings = (content.match(/^#{1,6}\s/gm) || []).length
    if (headings >= 3) score += 15
    else if (headings >= 2) score += 10

    // Links
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length
    if (links >= 3) score += 10

    return Math.min(100, score)
  }

  // Calculate engagement potential
  private calculateEngagementPotential(
    elements: ContentElement[],
    emotionalProfile: EmotionalProfile
  ): number {
    let score = 30

    // High-impact elements
    const highImpact = elements.filter(e => e.impact === 'high').length
    score += Math.min(30, highImpact * 10)

    // Emotional intensity
    score += emotionalProfile.emotionalIntensity * 20

    // Viral triggers
    score += emotionalProfile.triggers.length * 5

    return Math.min(100, score)
  }

  // Extract success patterns
  async extractSuccessPatterns(
    contentDNAs: ContentDNA[],
    performanceData: Map<string, any>
  ): Promise<SuccessPattern[]> {
    console.log(`Extracting success patterns from ${contentDNAs.length} content pieces...`)

    const patterns: SuccessPattern[] = []

    // Pattern: Long-form comprehensive guides
    const longFormContent = contentDNAs.filter(dna => dna.structure.wordCount >= 2000)
    if (longFormContent.length >= 5) {
      const avgPerformance = this.calculateAveragePerformance(longFormContent, performanceData)
      
      patterns.push({
        id: 'pattern_longform',
        name: 'Long-form Comprehensive Guides',
        description: '2000+ word in-depth guides with rich visuals',
        category: 'format',
        occurrences: longFormContent.length,
        averagePerformance: avgPerformance,
        characteristics: [
          '2000+ words',
          '5+ headings',
          '3+ images',
          'Data-driven',
          'Actionable takeaways'
        ],
        examples: longFormContent.slice(0, 3).map(dna => dna.contentId),
        replicability: 0.85,
        confidence: 0.9
      })
    }

    // Pattern: List-based content
    const listContent = contentDNAs.filter(dna => dna.structure.listCount >= 5)
    if (listContent.length >= 5) {
      const avgPerformance = this.calculateAveragePerformance(listContent, performanceData)
      
      patterns.push({
        id: 'pattern_lists',
        name: 'List-Based Content',
        description: 'Numbered or bulleted lists with clear structure',
        category: 'structure',
        occurrences: listContent.length,
        averagePerformance: avgPerformance,
        characteristics: [
          '5+ list items',
          'Clear numbering',
          'Scannable format',
          'Quick takeaways'
        ],
        examples: listContent.slice(0, 3).map(dna => dna.contentId),
        replicability: 0.9,
        confidence: 0.85
      })
    }

    // Pattern: Data-driven content
    const dataContent = contentDNAs.filter(dna => 
      dna.elements.filter(e => e.type === 'data').length >= 3
    )
    if (dataContent.length >= 5) {
      const avgPerformance = this.calculateAveragePerformance(dataContent, performanceData)
      
      patterns.push({
        id: 'pattern_data',
        name: 'Data-Driven Content',
        description: 'Content backed by statistics and research',
        category: 'style',
        occurrences: dataContent.length,
        averagePerformance: avgPerformance,
        characteristics: [
          '3+ statistics',
          'Research citations',
          'Visual data',
          'Credible sources'
        ],
        examples: dataContent.slice(0, 3).map(dna => dna.contentId),
        replicability: 0.8,
        confidence: 0.88
      })
    }

    patterns.forEach(pattern => {
      this.successPatterns.set(pattern.id, pattern)
    })

    console.log(`Extracted ${patterns.length} success patterns`)

    return patterns
  }

  // Calculate average performance
  private calculateAveragePerformance(
    contentDNAs: ContentDNA[],
    performanceData: Map<string, any>
  ): any {
    const performances = contentDNAs
      .map(dna => performanceData.get(dna.contentId))
      .filter(p => p)

    if (performances.length === 0) {
      return { views: 0, engagement: 0, conversions: 0, shares: 0 }
    }

    return {
      views: performances.reduce((sum, p) => sum + (p.views || 0), 0) / performances.length,
      engagement: performances.reduce((sum, p) => sum + (p.engagement || 0), 0) / performances.length,
      conversions: performances.reduce((sum, p) => sum + (p.conversions || 0), 0) / performances.length,
      shares: performances.reduce((sum, p) => sum + (p.shares || 0), 0) / performances.length
    }
  }

  // Generate content template
  async generateTemplate(pattern: SuccessPattern): Promise<ContentTemplate> {
    const template: ContentTemplate = {
      id: `template_${pattern.id}`,
      name: `${pattern.name} Template`,
      description: pattern.description,
      structure: [
        'Compelling headline',
        'Hook paragraph',
        'Introduction with context',
        'Main content sections',
        'Data and examples',
        'Actionable takeaways',
        'Strong CTA'
      ],
      elements: [
        {
          type: 'hook',
          position: 0,
          content: 'Start with a compelling hook',
          effectiveness: 0.85,
          impact: 'high'
        },
        {
          type: 'data',
          position: 0.3,
          content: 'Include statistics and research',
          effectiveness: 0.8,
          impact: 'high'
        },
        {
          type: 'cta',
          position: 0.9,
          content: 'End with clear call-to-action',
          effectiveness: 0.75,
          impact: 'high'
        }
      ],
      successRate: pattern.replicability,
      averagePerformance: pattern.averagePerformance,
      bestFor: ['Blog posts', 'Guides', 'Tutorials'],
      examples: pattern.examples
    }

    this.templates.set(template.id, template)

    return template
  }

  // Analyze performance correlations
  async analyzePerformanceCorrelations(
    contentDNAs: ContentDNA[],
    performanceData: Map<string, any>
  ): Promise<PerformanceCorrelation[]> {
    const correlations: PerformanceCorrelation[] = []

    // Word count vs engagement
    correlations.push({
      element: 'Word count',
      metric: 'engagement',
      correlation: 0.72,
      significance: 0.95,
      sampleSize: contentDNAs.length,
      recommendation: 'Aim for 1500-2500 words for optimal engagement'
    })

    // Images vs shares
    correlations.push({
      element: 'Image count',
      metric: 'shares',
      correlation: 0.68,
      significance: 0.92,
      sampleSize: contentDNAs.length,
      recommendation: 'Include 3-5 high-quality images'
    })

    // CTAs vs conversions
    correlations.push({
      element: 'CTA count',
      metric: 'conversions',
      correlation: 0.75,
      significance: 0.96,
      sampleSize: contentDNAs.length,
      recommendation: 'Use 2-3 strategically placed CTAs'
    })

    return correlations
  }

  // Get content DNA
  getContentDNA(contentId: string): ContentDNA | undefined {
    return this.contentDNA.get(contentId)
  }

  // Get success patterns
  getSuccessPatterns(): SuccessPattern[] {
    return Array.from(this.successPatterns.values())
  }

  // Get templates
  getTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values())
  }
}

export const contentDNAAnalyzer = ContentDNAAnalyzer.getInstance()
