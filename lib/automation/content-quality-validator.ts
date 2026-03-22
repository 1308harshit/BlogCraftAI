// Content Quality Validator - Ensures content meets quality standards
// Validates content before publication

import { GeneratedContent } from './content-pipeline'

export interface ValidationResult {
  contentId: string
  passed: boolean
  overallScore: number
  checks: ValidationCheck[]
  issues: ValidationIssue[]
  recommendations: string[]
}

export interface ValidationCheck {
  name: string
  passed: boolean
  score: number
  weight: number
  details: string
}

export interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  location?: string
  suggestion: string
}

// Content Quality Validator
export class ContentQualityValidator {
  private static instance: ContentQualityValidator
  private qualityWeights = {
    length: 0.15,
    structure: 0.20,
    readability: 0.20,
    engagement: 0.15,
    seo: 0.15,
    completeness: 0.15
  }

  static getInstance(): ContentQualityValidator {
    if (!ContentQualityValidator.instance) {
      ContentQualityValidator.instance = new ContentQualityValidator()
    }
    return ContentQualityValidator.instance
  }

  // Validate single content piece
  async validate(
    content: GeneratedContent,
    threshold: number = 0.7
  ): Promise<ValidationResult> {
    const checks: ValidationCheck[] = []
    const issues: ValidationIssue[] = []
    const recommendations: string[] = []

    // Run all validation checks
    checks.push(await this.validateLength(content))
    checks.push(await this.validateStructure(content))
    checks.push(await this.validateReadability(content))
    checks.push(await this.validateEngagement(content))
    checks.push(await this.validateSEO(content))
    checks.push(await this.validateCompleteness(content))

    // Calculate overall score
    const overallScore = checks.reduce((sum, check) => 
      sum + (check.score * this.qualityWeights[check.name as keyof typeof this.qualityWeights]), 0
    )

    // Identify issues
    for (const check of checks) {
      if (!check.passed) {
        issues.push({
          severity: check.score < 0.5 ? 'critical' : 'warning',
          category: check.name,
          message: `${check.name} check failed: ${check.details}`,
          suggestion: this.getSuggestion(check.name, check.score)
        })
      }
    }

    // Generate recommendations
    if (overallScore < threshold) {
      recommendations.push(...this.generateRecommendations(checks, issues))
    }

    return {
      contentId: content.contentId,
      passed: overallScore >= threshold,
      overallScore,
      checks,
      issues,
      recommendations
    }
  }

  // Validate batch of content
  async validateBatch(
    contentList: GeneratedContent[],
    threshold: number = 0.7
  ): Promise<ValidationResult[]> {
    console.log(`Validating ${contentList.length} content pieces...`)
    
    const results = await Promise.all(
      contentList.map(content => this.validate(content, threshold))
    )

    const passedCount = results.filter(r => r.passed).length
    console.log(`Validation complete: ${passedCount}/${contentList.length} passed`)

    return results
  }

  // Individual validation checks
  private async validateLength(content: GeneratedContent): Promise<ValidationCheck> {
    const wordCount = content.content.split(/\s+/).length
    const minLength = this.getMinLength(content.contentType)
    const maxLength = this.getMaxLength(content.contentType)
    const optimalLength = (minLength + maxLength) / 2

    let score = 0
    let details = ''

    if (wordCount >= minLength && wordCount <= maxLength) {
      score = 1.0
      details = `Content length (${wordCount} words) is within optimal range`
    } else if (wordCount >= minLength * 0.8 && wordCount <= maxLength * 1.2) {
      score = 0.7
      details = `Content length (${wordCount} words) is acceptable but not optimal`
    } else if (wordCount < minLength) {
      score = Math.max(wordCount / minLength, 0.3)
      details = `Content is too short (${wordCount} words, minimum ${minLength})`
    } else {
      score = Math.max(1 - ((wordCount - maxLength) / maxLength), 0.3)
      details = `Content is too long (${wordCount} words, maximum ${maxLength})`
    }

    return {
      name: 'length',
      passed: score >= 0.7,
      score,
      weight: this.qualityWeights.length,
      details
    }
  }

  private async validateStructure(content: GeneratedContent): Promise<ValidationCheck> {
    let score = 0.5 // Base score
    const issues: string[] = []

    // Check for headings
    const headingCount = (content.content.match(/^#{1,6}\s/gm) || []).length
    if (headingCount >= 3) {
      score += 0.2
    } else if (headingCount >= 1) {
      score += 0.1
    } else {
      issues.push('No headings found')
    }

    // Check for paragraphs
    const paragraphs = content.content.split('\n\n').filter(p => p.trim().length > 0)
    if (paragraphs.length >= 5) {
      score += 0.15
    } else if (paragraphs.length >= 3) {
      score += 0.1
    } else {
      issues.push('Insufficient paragraph structure')
    }

    // Check for lists
    const listItems = (content.content.match(/^[-*]\s/gm) || []).length
    if (listItems >= 3) {
      score += 0.1
    }

    // Check for CTA
    const hasCTA = content.content.toLowerCase().includes('subscribe') ||
                   content.content.toLowerCase().includes('learn more') ||
                   content.content.toLowerCase().includes('get started') ||
                   content.content.toLowerCase().includes('click here')
    if (hasCTA) {
      score += 0.05
    } else {
      issues.push('No clear call-to-action')
    }

    const details = issues.length > 0 ? issues.join(', ') : 'Content structure is well-organized'

    return {
      name: 'structure',
      passed: score >= 0.7,
      score: Math.min(score, 1.0),
      weight: this.qualityWeights.structure,
      details
    }
  }

  private async validateReadability(content: GeneratedContent): Promise<ValidationCheck> {
    const sentences = content.content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.content.split(/\s+/)
    const avgWordsPerSentence = words.length / (sentences.length || 1)

    let score = 0.5
    let details = ''

    // Optimal: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      score = 1.0
      details = 'Excellent readability with optimal sentence length'
    } else if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25) {
      score = 0.8
      details = 'Good readability'
    } else if (avgWordsPerSentence < 12) {
      score = 0.7
      details = 'Sentences are quite short, may feel choppy'
    } else {
      score = Math.max(0.4, 1 - ((avgWordsPerSentence - 25) / 25))
      details = 'Sentences are too long, may be hard to read'
    }

    // Check for transition words
    const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'additionally', 'consequently']
    const hasTransitions = transitionWords.some(word => 
      content.content.toLowerCase().includes(word)
    )
    if (hasTransitions) {
      score = Math.min(score + 0.1, 1.0)
    }

    return {
      name: 'readability',
      passed: score >= 0.7,
      score,
      weight: this.qualityWeights.readability,
      details
    }
  }

  private async validateEngagement(content: GeneratedContent): Promise<ValidationCheck> {
    let score = 0.5
    const features: string[] = []

    // Check for questions
    const questionCount = (content.content.match(/\?/g) || []).length
    if (questionCount >= 2) {
      score += 0.15
      features.push('engaging questions')
    }

    // Check for emotional words
    const emotionalWords = ['amazing', 'incredible', 'powerful', 'essential', 'critical', 'important']
    const emotionalCount = emotionalWords.filter(word => 
      content.content.toLowerCase().includes(word)
    ).length
    if (emotionalCount >= 2) {
      score += 0.15
      features.push('emotional language')
    }

    // Check for personal pronouns
    const personalPronouns = (content.content.match(/\b(you|your|we|our|I|my)\b/gi) || []).length
    if (personalPronouns >= 5) {
      score += 0.1
      features.push('personal connection')
    }

    // Check for action verbs
    const actionVerbs = ['discover', 'learn', 'master', 'achieve', 'transform', 'improve']
    const actionCount = actionVerbs.filter(verb => 
      content.content.toLowerCase().includes(verb)
    ).length
    if (actionCount >= 2) {
      score += 0.1
      features.push('action-oriented')
    }

    const details = features.length > 0 
      ? `Engagement features: ${features.join(', ')}`
      : 'Limited engagement elements'

    return {
      name: 'engagement',
      passed: score >= 0.7,
      score: Math.min(score, 1.0),
      weight: this.qualityWeights.engagement,
      details
    }
  }

  private async validateSEO(content: GeneratedContent): Promise<ValidationCheck> {
    let score = 0.5
    const seoFeatures: string[] = []

    // Title optimization
    const titleLength = content.title.length
    if (titleLength >= 30 && titleLength <= 60) {
      score += 0.15
      seoFeatures.push('optimized title length')
    }

    // Keyword in title
    const titleWords = content.title.toLowerCase().split(/\s+/)
    const contentLower = content.content.toLowerCase()
    const keywordInContent = titleWords.some(word => 
      word.length > 3 && contentLower.split(word).length > 3
    )
    if (keywordInContent) {
      score += 0.15
      seoFeatures.push('keyword consistency')
    }

    // Headings with keywords
    const headings = content.content.match(/^#{1,6}\s.+$/gm) || []
    if (headings.length >= 3) {
      score += 0.1
      seoFeatures.push('proper heading structure')
    }

    // Content length for SEO
    const wordCount = content.content.split(/\s+/).length
    if (wordCount >= 800) {
      score += 0.1
      seoFeatures.push('sufficient content length')
    }

    const details = seoFeatures.length > 0
      ? `SEO features: ${seoFeatures.join(', ')}`
      : 'Limited SEO optimization'

    return {
      name: 'seo',
      passed: score >= 0.7,
      score: Math.min(score, 1.0),
      weight: this.qualityWeights.seo,
      details
    }
  }

  private async validateCompleteness(content: GeneratedContent): Promise<ValidationCheck> {
    let score = 0.5
    const missingElements: string[] = []

    // Check for title
    if (content.title && content.title.length > 10) {
      score += 0.15
    } else {
      missingElements.push('proper title')
    }

    // Check for introduction
    const firstParagraph = content.content.split('\n\n')[0]
    if (firstParagraph && firstParagraph.length > 100) {
      score += 0.15
    } else {
      missingElements.push('strong introduction')
    }

    // Check for conclusion
    const lastParagraph = content.content.split('\n\n').slice(-1)[0]
    if (lastParagraph && lastParagraph.length > 50) {
      score += 0.1
    } else {
      missingElements.push('proper conclusion')
    }

    // Check for CTA
    const hasCTA = content.content.toLowerCase().includes('subscribe') ||
                   content.content.toLowerCase().includes('learn more') ||
                   content.content.toLowerCase().includes('get started')
    if (hasCTA) {
      score += 0.1
    } else {
      missingElements.push('call-to-action')
    }

    const details = missingElements.length > 0
      ? `Missing elements: ${missingElements.join(', ')}`
      : 'Content is complete with all required elements'

    return {
      name: 'completeness',
      passed: score >= 0.7,
      score: Math.min(score, 1.0),
      weight: this.qualityWeights.completeness,
      details
    }
  }

  // Helper methods
  private getMinLength(contentType: string): number {
    const minLengths: Record<string, number> = {
      blog: 800,
      social: 50,
      email: 200,
      video_script: 500
    }
    return minLengths[contentType] || 500
  }

  private getMaxLength(contentType: string): number {
    const maxLengths: Record<string, number> = {
      blog: 2000,
      social: 280,
      email: 500,
      video_script: 1500
    }
    return maxLengths[contentType] || 2000
  }

  private getSuggestion(checkName: string, score: number): string {
    const suggestions: Record<string, string> = {
      length: 'Adjust content length to meet optimal word count for the content type',
      structure: 'Add more headings, paragraphs, and lists to improve content structure',
      readability: 'Simplify sentence structure and use transition words for better flow',
      engagement: 'Add questions, emotional language, and personal pronouns to increase engagement',
      seo: 'Optimize title length, use keywords consistently, and add proper headings',
      completeness: 'Ensure content has a strong introduction, conclusion, and clear call-to-action'
    }
    return suggestions[checkName] || 'Review and improve this aspect of the content'
  }

  private generateRecommendations(
    checks: ValidationCheck[],
    issues: ValidationIssue[]
  ): string[] {
    const recommendations: string[] = []

    // Prioritize critical issues
    const criticalIssues = issues.filter(i => i.severity === 'critical')
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical issues first: ' + 
        criticalIssues.map(i => i.category).join(', '))
    }

    // Find lowest scoring checks
    const lowestCheck = checks.reduce((min, check) => 
      check.score < min.score ? check : min
    )
    if (lowestCheck.score < 0.7) {
      recommendations.push(`Focus on improving ${lowestCheck.name}: ${lowestCheck.details}`)
    }

    // General recommendations
    if (checks.find(c => c.name === 'engagement')?.score < 0.7) {
      recommendations.push('Add more engaging elements like questions and personal stories')
    }

    if (checks.find(c => c.name === 'seo')?.score < 0.7) {
      recommendations.push('Improve SEO by optimizing title and keyword usage')
    }

    return recommendations.slice(0, 5) // Return top 5 recommendations
  }
}

// Export singleton instance
export const contentQualityValidator = ContentQualityValidator.getInstance()
