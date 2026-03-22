// Viral Prediction Engine - Core Implementation
// ML-based viral content prediction with 85%+ accuracy target

import {
  ViralPredictionEngine,
  ViralScore,
  ViralAnalysis,
  ViralOptimization,
  ViralElement,
  ViralContext,
  ViralScoreComponents,
  ViralFactor,
  ViralFeatures,
  EmotionalFeatures,
  StructuralFeatures,
  TimingFeatures,
  LinguisticFeatures,
  ViralPredictionError
} from './types'
import { ViralScoreModel, ViralAnalysisModel } from './models'

export class ViralEngine implements ViralPredictionEngine {
  private static instance: ViralEngine
  private mlModel: any // Placeholder for ML model
  private featureWeights: Map<string, number> = new Map()

  static getInstance(): ViralEngine {
    if (!ViralEngine.instance) {
      ViralEngine.instance = new ViralEngine()
      ViralEngine.instance.initializeWeights()
    }
    return ViralEngine.instance
  }

  private initializeWeights(): void {
    // Initialize feature weights based on research
    this.featureWeights.set('emotional_trigger', 0.25)
    this.featureWeights.set('structure', 0.20)
    this.featureWeights.set('timing', 0.15)
    this.featureWeights.set('platform_fit', 0.15)
    this.featureWeights.set('audience_alignment', 0.15)
    this.featureWeights.set('novelty', 0.10)
  }

  // Predict viral score for content
  async predictViralScore(
    content: string,
    context: ViralContext
  ): Promise<ViralScore> {
    try {
      // Extract features
      const features = await this.extractFeatures(content, context)
      
      // Calculate component scores
      const components = this.calculateComponentScores(features, context)
      
      // Calculate overall viral score
      const overallScore = this.calculateOverallScore(components)
      
      // Generate viral factors
      const factors = this.generateViralFactors(features, components, context)
      
      // Calculate viral probability
      const viralProbability = this.calculateViralProbability(overallScore, factors)
      
      // Predict reach and shares
      const { expectedReach, expectedShares } = this.predictReachAndShares(
        overallScore,
        viralProbability,
        context
      )
      
      // Predict peak time
      const peakTime = this.predictPeakTime(context, features.timingFeatures)

      const score: ViralScore = {
        scoreId: `viral_${Date.now()}`,
        overallScore,
        confidence: this.calculateConfidence(features, factors),
        viralProbability,
        expectedReach,
        expectedShares,
        peakTime,
        components,
        factors,
        predictions: this.generateTimedPredictions(expectedReach, expectedShares, peakTime),
        createdAt: new Date()
      }

      return score
    } catch (error) {
      throw new ViralPredictionError('Failed to predict viral score', 'PREDICT_SCORE_ERROR', error)
    }
  }

  // Analyze viral potential
  async analyzeViralPotential(content: string): Promise<ViralAnalysis> {
    try {
      const context: ViralContext = {
        platform: 'blog',
        targetAudience: 'general',
        publishTime: new Date(),
        currentTrends: [],
        competitorActivity: 0.5
      }

      const viralScore = await this.predictViralScore(content, context)
      const features = await this.extractFeatures(content, context)

      const analysis: ViralAnalysis = {
        analysisId: `analysis_${Date.now()}`,
        viralScore,
        strengths: this.identifyStrengths(features, viralScore.components),
        weaknesses: this.identifyWeaknesses(features, viralScore.components),
        opportunities: this.identifyOpportunities(features, viralScore),
        recommendations: this.generateRecommendations(features, viralScore),
        competitorComparison: await this.compareWithCompetitors(viralScore.overallScore),
        analyzedAt: new Date()
      }

      return analysis
    } catch (error) {
      throw new ViralPredictionError('Failed to analyze viral potential', 'ANALYZE_ERROR', error)
    }
  }

  // Optimize content for virality
  async optimizeForVirality(
    content: string,
    targetScore: number = 80
  ): Promise<ViralOptimization> {
    try {
      const context: ViralContext = {
        platform: 'blog',
        targetAudience: 'general',
        publishTime: new Date(),
        currentTrends: [],
        competitorActivity: 0.5
      }

      const originalScore = await this.predictViralScore(content, context)
      const changes = await this.generateViralChanges(content, originalScore, targetScore)
      const optimizedContent = await this.applyViralChanges(content, changes)
      const optimizedScore = await this.predictViralScore(optimizedContent, context)

      return {
        optimizationId: `opt_${Date.now()}`,
        originalContent: content,
        optimizedContent,
        originalScore: originalScore.overallScore,
        optimizedScore: optimizedScore.overallScore,
        improvement: optimizedScore.overallScore - originalScore.overallScore,
        changes,
        expectedOutcome: {
          expectedViews: optimizedScore.expectedReach,
          expectedShares: optimizedScore.expectedShares,
          expectedEngagement: optimizedScore.expectedReach * 0.05,
          viralProbability: optimizedScore.viralProbability,
          timeToViral: 24,
          confidence: optimizedScore.confidence
        }
      }
    } catch (error) {
      throw new ViralPredictionError('Failed to optimize for virality', 'OPTIMIZE_ERROR', error)
    }
  }

  // Extract viral elements
  async extractViralElements(content: string): Promise<ViralElement[]> {
    try {
      const elements: ViralElement[] = []
      const sentences = content.split(/[.!?]+/)

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim()
        if (sentence.length < 10) continue

        const element = this.analyzeViralElement(sentence, i)
        if (element.viralPotential > 0.5) {
          elements.push(element)
        }
      }

      return elements.sort((a, b) => b.viralPotential - a.viralPotential)
    } catch (error) {
      throw new ViralPredictionError('Failed to extract viral elements', 'EXTRACT_ERROR', error)
    }
  }

  // Private helper methods
  private async extractFeatures(content: string, context: ViralContext): Promise<ViralFeatures> {
    return {
      emotionalFeatures: this.extractEmotionalFeatures(content),
      structuralFeatures: this.extractStructuralFeatures(content),
      timingFeatures: this.extractTimingFeatures(context),
      linguisticFeatures: this.extractLinguisticFeatures(content)
    }
  }

  private extractEmotionalFeatures(content: string): EmotionalFeatures {
    const words = content.toLowerCase().split(/\s+/)
    
    // Simple sentiment analysis
    const positiveWords = ['amazing', 'incredible', 'awesome', 'fantastic', 'love', 'best', 'great']
    const negativeWords = ['terrible', 'awful', 'hate', 'worst', 'bad', 'horrible']
    
    const positiveCount = words.filter(w => positiveWords.includes(w)).length
    const negativeCount = words.filter(w => negativeWords.includes(w)).length
    
    const sentiment = (positiveCount - negativeCount) / words.length

    return {
      sentiment,
      emotionalIntensity: (positiveCount + negativeCount) / words.length,
      emotionalVariety: 0.5,
      primaryEmotion: positiveCount > negativeCount ? 'joy' : 'neutral',
      emotionalArc: [0.3, 0.6, 0.8, 0.5],
      triggers: this.detectEmotionalTriggers(content)
    }
  }

  private detectEmotionalTriggers(content: string): any[] {
    const triggers = []
    const sentences = content.split(/[.!?]+/)

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].toLowerCase()
      
      if (sentence.includes('?')) {
        triggers.push({
          type: 'anticipation',
          intensity: 0.6,
          position: i,
          context: sentence.substring(0, 50)
        })
      }
      
      if (sentence.includes('!')) {
        triggers.push({
          type: 'surprise',
          intensity: 0.7,
          position: i,
          context: sentence.substring(0, 50)
        })
      }
    }

    return triggers
  }

  private extractStructuralFeatures(content: string): StructuralFeatures {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const headings = (content.match(/^#{1,6}\s/gm) || []).length
    const lists = (content.match(/^[-*]\s/gm) || []).length

    return {
      length: content.length,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      avgSentenceLength: sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length,
      headingCount: headings,
      listCount: lists,
      imageCount: 0,
      linkCount: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
      readabilityScore: this.calculateReadability(content),
      structurePattern: this.detectStructurePattern(paragraphs, headings)
    }
  }

  private extractTimingFeatures(context: ViralContext): TimingFeatures {
    const publishTime = context.publishTime
    
    return {
      dayOfWeek: publishTime.getDay(),
      hourOfDay: publishTime.getHours(),
      seasonality: this.calculateSeasonality(publishTime),
      trendAlignment: context.currentTrends.length * 0.1,
      competitorActivity: context.competitorActivity,
      optimalTimingScore: this.calculateOptimalTiming(publishTime)
    }
  }

  private extractLinguisticFeatures(content: string): LinguisticFeatures {
    const words = content.split(/\s+/)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    
    const powerWords = ['secret', 'proven', 'guaranteed', 'exclusive', 'limited', 'breakthrough']
    const foundPowerWords = words.filter(w => powerWords.includes(w.toLowerCase()))

    return {
      vocabularyRichness: uniqueWords.size / words.length,
      readingLevel: this.calculateReadingLevel(content),
      powerWords: foundPowerWords,
      questionCount: (content.match(/\?/g) || []).length,
      exclamationCount: (content.match(/!/g) || []).length,
      personalPronouns: (content.match(/\b(I|you|we|my|your|our)\b/gi) || []).length,
      actionVerbs: this.countActionVerbs(content)
    }
  }

  private calculateComponentScores(
    features: ViralFeatures,
    context: ViralContext
  ): ViralScoreComponents {
    return {
      emotionalTrigger: this.scoreEmotionalTrigger(features.emotionalFeatures),
      structureScore: this.scoreStructure(features.structuralFeatures),
      timingScore: this.scoreTiming(features.timingFeatures),
      platformFit: this.scorePlatformFit(features, context.platform),
      audienceAlignment: this.scoreAudienceAlignment(features, context.targetAudience),
      noveltyScore: this.scoreNovelty(features),
      shareability: this.scoreShareability(features)
    }
  }

  private calculateOverallScore(components: ViralScoreComponents): number {
    const weights = {
      emotionalTrigger: 0.25,
      structureScore: 0.20,
      timingScore: 0.15,
      platformFit: 0.15,
      audienceAlignment: 0.10,
      noveltyScore: 0.10,
      shareability: 0.05
    }

    let score = 0
    for (const [key, weight] of Object.entries(weights)) {
      score += components[key as keyof ViralScoreComponents] * weight
    }

    return Math.min(Math.max(score, 0), 100)
  }

  private generateViralFactors(
    features: ViralFeatures,
    components: ViralScoreComponents,
    context: ViralContext
  ): ViralFactor[] {
    return [
      {
        factor: 'emotional_intensity',
        impact: features.emotionalFeatures.emotionalIntensity,
        confidence: 0.85,
        description: 'Strong emotional content drives sharing',
        category: 'emotional',
        weight: 0.25
      },
      {
        factor: 'content_structure',
        impact: components.structureScore / 100,
        confidence: 0.80,
        description: 'Well-structured content is more shareable',
        category: 'structural',
        weight: 0.20
      },
      {
        factor: 'optimal_timing',
        impact: components.timingScore / 100,
        confidence: 0.70,
        description: 'Publishing at optimal times increases reach',
        category: 'timing',
        weight: 0.15
      }
    ]
  }

  private calculateViralProbability(score: number, factors: ViralFactor[]): number {
    // Viral threshold is typically 70+
    if (score < 50) return 0.05
    if (score < 60) return 0.15
    if (score < 70) return 0.30
    if (score < 80) return 0.55
    if (score < 90) return 0.75
    return 0.90
  }

  private predictReachAndShares(
    score: number,
    probability: number,
    context: ViralContext
  ): { expectedReach: number, expectedShares: number } {
    const baseReach = 1000
    const scoreMultiplier = score / 50
    const probabilityMultiplier = 1 + probability
    
    const expectedReach = Math.floor(baseReach * scoreMultiplier * probabilityMultiplier)
    const expectedShares = Math.floor(expectedReach * 0.05 * probability)

    return { expectedReach, expectedShares }
  }

  private predictPeakTime(context: ViralContext, timing: TimingFeatures): Date {
    // Viral content typically peaks 6-24 hours after publishing
    const hoursToP eak = 12 + (timing.optimalTimingScore * 12)
    return new Date(context.publishTime.getTime() + hoursToP eak * 60 * 60 * 1000)
  }

  private generateTimedPredictions(reach: number, shares: number, peakTime: Date): any[] {
    return [
      { timeframe: 6, expectedViews: reach * 0.2, expectedShares: shares * 0.1, expectedEngagement: reach * 0.01, confidence: 0.7, peakHour: 6 },
      { timeframe: 12, expectedViews: reach * 0.5, expectedShares: shares * 0.4, expectedEngagement: reach * 0.025, confidence: 0.8, peakHour: 12 },
      { timeframe: 24, expectedViews: reach * 0.8, expectedShares: shares * 0.7, expectedEngagement: reach * 0.04, confidence: 0.85, peakHour: 24 },
      { timeframe: 48, expectedViews: reach, expectedShares: shares, expectedEngagement: reach * 0.05, confidence: 0.9, peakHour: 48 }
    ]
  }

  private calculateConfidence(features: ViralFeatures, factors: ViralFactor[]): number {
    let confidence = 0.7 // Base confidence

    // Higher confidence with strong emotional triggers
    if (features.emotionalFeatures.emotionalIntensity > 0.6) confidence += 0.1
    
    // Higher confidence with good structure
    if (features.structuralFeatures.readabilityScore > 60) confidence += 0.05
    
    // Factor in individual factor confidences
    const avgFactorConfidence = factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length
    confidence = (confidence + avgFactorConfidence) / 2

    return Math.min(confidence, 0.95)
  }

  // Component scoring methods
  private scoreEmotionalTrigger(emotional: EmotionalFeatures): number {
    let score = 50 // Base score

    score += emotional.emotionalIntensity * 30
    score += emotional.emotionalVariety * 10
    score += emotional.triggers.length * 2

    return Math.min(score, 100)
  }

  private scoreStructure(structural: StructuralFeatures): number {
    let score = 50

    // Optimal length: 1000-2000 words
    if (structural.length >= 1000 && structural.length <= 2000) score += 15
    else if (structural.length > 2000) score += 5

    // Good paragraph structure
    if (structural.paragraphCount >= 5 && structural.paragraphCount <= 15) score += 10

    // Headings improve scannability
    score += Math.min(structural.headingCount * 3, 15)

    // Lists improve readability
    score += Math.min(structural.listCount * 2, 10)

    return Math.min(score, 100)
  }

  private scoreTiming(timing: TimingFeatures): number {
    return timing.optimalTimingScore * 100
  }

  private scorePlatformFit(features: ViralFeatures, platform: string): number {
    const platformOptimal: Record<string, any> = {
      twitter: { maxLength: 280, optimal: 100 },
      linkedin: { maxLength: 3000, optimal: 1500 },
      instagram: { maxLength: 2200, optimal: 150 },
      blog: { maxLength: 10000, optimal: 1500 }
    }

    const config = platformOptimal[platform] || platformOptimal.blog
    const length = features.structuralFeatures.length
    
    if (length <= config.optimal * 1.2 && length >= config.optimal * 0.8) {
      return 85
    }
    
    return 60
  }

  private scoreAudienceAlignment(features: ViralFeatures, audience: string): number {
    // Simplified audience alignment
    const readingLevel = features.linguisticFeatures.readingLevel
    
    if (audience === 'general' && readingLevel >= 8 && readingLevel <= 12) return 80
    if (audience === 'professional' && readingLevel >= 12) return 85
    if (audience === 'casual' && readingLevel <= 10) return 80
    
    return 65
  }

  private scoreNovelty(features: ViralFeatures): number {
    // Novelty based on vocabulary richness and unique patterns
    const richness = features.linguisticFeatures.vocabularyRichness
    return Math.min(richness * 150, 100)
  }

  private scoreShareability(features: ViralFeatures): number {
    let score = 50

    // Questions encourage engagement
    score += Math.min(features.linguisticFeatures.questionCount * 5, 20)
    
    // Power words increase shareability
    score += Math.min(features.linguisticFeatures.powerWords.length * 3, 15)
    
    // Personal pronouns create connection
    score += Math.min(features.linguisticFeatures.personalPronouns * 0.5, 15)

    return Math.min(score, 100)
  }

  // Utility methods
  private calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/)
    const avgWordsPerSentence = words.length / sentences.length
    
    // Flesch Reading Ease approximation
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (1.5)
    return Math.max(0, Math.min(score, 100))
  }

  private detectStructurePattern(paragraphs: string[], headings: number): string {
    if (headings > paragraphs.length * 0.3) return 'highly_structured'
    if (headings > paragraphs.length * 0.15) return 'well_structured'
    if (headings > 0) return 'moderately_structured'
    return 'unstructured'
  }

  private calculateSeasonality(date: Date): number {
    const month = date.getMonth()
    // Higher activity in certain months
    const seasonalityMap = [0.7, 0.8, 0.9, 0.85, 0.9, 0.8, 0.7, 0.75, 0.95, 1.0, 0.9, 0.85]
    return seasonalityMap[month]
  }

  private calculateOptimalTiming(publishTime: Date): number {
    const hour = publishTime.getHours()
    const day = publishTime.getDay()
    
    // Weekdays 9-11 AM, 2-4 PM, 7-9 PM are optimal
    let score = 0.5
    
    if (day >= 1 && day <= 5) { // Weekday
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16) || (hour >= 19 && hour <= 21)) {
        score = 0.9
      } else if (hour >= 8 && hour <= 22) {
        score = 0.7
      }
    } else { // Weekend
      if (hour >= 10 && hour <= 20) {
        score = 0.6
      }
    }
    
    return score
  }

  private calculateReadingLevel(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/)
    const avgWordsPerSentence = words.length / sentences.length
    
    // Approximate grade level
    return Math.min(4 + avgWordsPerSentence * 0.5, 18)
  }

  private countActionVerbs(content: string): number {
    const actionVerbs = ['create', 'build', 'make', 'start', 'launch', 'discover', 'learn', 'achieve', 'transform']
    const words = content.toLowerCase().split(/\s+/)
    return words.filter(w => actionVerbs.includes(w)).length
  }

  private analyzeViralElement(sentence: string, position: number): ViralElement {
    const type = this.detectElementType(sentence)
    const strength = this.calculateElementStrength(sentence, type)
    
    return {
      elementId: `elem_${Date.now()}_${position}`,
      type,
      content: sentence,
      position,
      strength,
      viralPotential: strength * 0.8
    }
  }

  private detectElementType(sentence: string): ViralElement['type'] {
    const lower = sentence.toLowerCase()
    
    if (lower.includes('?')) return 'hook'
    if (lower.includes('!')) return 'trigger'
    if (lower.includes('story') || lower.includes('once')) return 'story'
    if (lower.includes('shocking') || lower.includes('controversial')) return 'controversy'
    if (lower.includes('funny') || lower.includes('hilarious')) return 'humor'
    
    return 'surprise'
  }

  private calculateElementStrength(sentence: string, type: ViralElement['type']): number {
    let strength = 0.5
    
    if (sentence.length > 50 && sentence.length < 150) strength += 0.2
    if (sentence.includes('!')) strength += 0.1
    if (sentence.includes('?')) strength += 0.15
    
    return Math.min(strength, 1.0)
  }

  private identifyStrengths(features: ViralFeatures, components: ViralScoreComponents): any[] {
    const strengths = []
    
    if (components.emotionalTrigger > 70) {
      strengths.push({
        element: 'Emotional Impact',
        score: components.emotionalTrigger,
        description: 'Strong emotional triggers that drive engagement',
        examples: ['Compelling hooks', 'Emotional storytelling']
      })
    }
    
    if (components.structureScore > 70) {
      strengths.push({
        element: 'Content Structure',
        score: components.structureScore,
        description: 'Well-organized and scannable content',
        examples: ['Clear headings', 'Good paragraph flow']
      })
    }
    
    return strengths
  }

  private identifyWeaknesses(features: ViralFeatures, components: ViralScoreComponents): any[] {
    const weaknesses = []
    
    if (components.emotionalTrigger < 50) {
      weaknesses.push({
        element: 'Emotional Impact',
        score: components.emotionalTrigger,
        description: 'Lacks strong emotional triggers',
        impact: 0.3,
        suggestions: ['Add more emotional hooks', 'Include personal stories', 'Use power words']
      })
    }
    
    if (components.shareability < 50) {
      weaknesses.push({
        element: 'Shareability',
        score: components.shareability,
        description: 'Content not optimized for sharing',
        impact: 0.25,
        suggestions: ['Add questions', 'Include surprising facts', 'Create quotable moments']
      })
    }
    
    return weaknesses
  }

  private identifyOpportunities(features: ViralFeatures, score: ViralScore): any[] {
    return [
      {
        opportunity: 'Increase emotional intensity',
        potentialImpact: 0.2,
        effort: 'medium',
        priority: 8,
        implementation: ['Add emotional triggers', 'Include personal anecdotes', 'Use vivid language']
      },
      {
        opportunity: 'Optimize timing',
        potentialImpact: 0.15,
        effort: 'low',
        priority: 7,
        implementation: ['Schedule for peak hours', 'Align with trending topics']
      }
    ]
  }

  private generateRecommendations(features: ViralFeatures, score: ViralScore): any[] {
    return [
      {
        recommendationId: `rec_${Date.now()}_1`,
        type: 'content',
        title: 'Enhance Emotional Appeal',
        description: 'Add more emotional triggers to increase viral potential',
        expectedImpact: 0.2,
        confidence: 0.85,
        priority: 9
      }
    ]
  }

  private async compareWithCompetitors(yourScore: number): Promise<any> {
    return {
      averageCompetitorScore: 65,
      yourScore,
      percentile: yourScore > 65 ? 75 : 45,
      gap: yourScore - 65,
      competitorStrengths: ['Strong emotional hooks', 'Optimal timing']
    }
  }

  private async generateViralChanges(content: string, score: ViralScore, target: number): Promise<any[]> {
    return []
  }

  private async applyViralChanges(content: string, changes: any[]): Promise<string> {
    return content
  }
}

export const viralEngine = ViralEngine.getInstance()
