// Viral Content Optimizer
// Optimizes content specifically for viral potential

import {
  ViralScore,
  ViralContext,
  ViralOptimization,
  ViralChange,
  ViralElement,
  ViralPredictionError
} from './types'
import { viralEngine } from './viral-engine'

export interface ViralTimingRecommendation {
  platform: string
  optimalTime: Date
  expectedReach: number
  confidence: number
  reasoning: string[]
}

export interface PlatformViralStrategy {
  platform: string
  contentFormat: string
  optimalLength: number
  keyElements: string[]
  timingStrategy: string
  expectedScore: number
}

export class ViralOptimizer {
  private static instance: ViralOptimizer

  static getInstance(): ViralOptimizer {
    if (!ViralOptimizer.instance) {
      ViralOptimizer.instance = new ViralOptimizer()
    }
    return ViralOptimizer.instance
  }

  // Optimize content for maximum viral potential
  async optimizeForMaximumVirality(
    content: string,
    context: ViralContext
  ): Promise<ViralOptimization> {
    try {
      // Get current viral score
      const currentScore = await viralEngine.predictViralScore(content, context)
      
      // Identify optimization opportunities
      const opportunities = await this.identifyOptimizationOpportunities(content, currentScore)
      
      // Generate optimized content
      const optimizedContent = await this.applyViralOptimizations(content, opportunities)
      
      // Calculate new score
      const newScore = await viralEngine.predictViralScore(optimizedContent, context)
      
      return {
        optimizationId: `viral_opt_${Date.now()}`,
        originalContent: content,
        optimizedContent,
        originalScore: currentScore.overallScore,
        optimizedScore: newScore.overallScore,
        improvement: newScore.overallScore - currentScore.overallScore,
        changes: opportunities,
        expectedOutcome: {
          expectedViews: newScore.expectedReach,
          expectedShares: newScore.expectedShares,
          expectedEngagement: newScore.expectedReach * 0.05,
          viralProbability: newScore.viralProbability,
          timeToViral: 24,
          confidence: newScore.confidence
        }
      }
    } catch (error) {
      throw new ViralPredictionError('Failed to optimize for virality', 'OPTIMIZE_VIRAL_ERROR', error)
    }
  }

  // Predict optimal timing for maximum viral potential
  async predictOptimalTiming(
    content: string,
    platforms: string[]
  ): Promise<ViralTimingRecommendation[]> {
    try {
      const recommendations: ViralTimingRecommendation[] = []
      
      for (const platform of platforms) {
        const optimalTimes = this.getOptimalTimesForPlatform(platform)
        
        for (const time of optimalTimes) {
          const context: ViralContext = {
            platform,
            targetAudience: 'general',
            publishTime: time,
            currentTrends: [],
            competitorActivity: 0.5
          }
          
          const score = await viralEngine.predictViralScore(content, context)
          
          recommendations.push({
            platform,
            optimalTime: time,
            expectedReach: score.expectedReach,
            confidence: score.confidence,
            reasoning: this.generateTimingReasoning(platform, time, score)
          })
        }
      }
      
      return recommendations.sort((a, b) => b.expectedReach - a.expectedReach)
    } catch (error) {
      throw new ViralPredictionError('Failed to predict optimal timing', 'TIMING_ERROR', error)
    }
  }

  // Generate platform-specific viral strategies
  async generatePlatformStrategies(
    content: string
  ): Promise<PlatformViralStrategy[]> {
    try {
      const platforms = ['twitter', 'linkedin', 'instagram', 'blog', 'tiktok', 'youtube']
      const strategies: PlatformViralStrategy[] = []
      
      for (const platform of platforms) {
        const strategy = await this.createPlatformStrategy(content, platform)
        strategies.push(strategy)
      }
      
      return strategies.sort((a, b) => b.expectedScore - a.expectedScore)
    } catch (error) {
      throw new ViralPredictionError('Failed to generate platform strategies', 'STRATEGY_ERROR', error)
    }
  }

  // Predict engagement across platforms
  async predictCrossPlatformEngagement(
    content: string
  ): Promise<Record<string, { score: number, reach: number, engagement: number }>> {
    try {
      const platforms = ['twitter', 'linkedin', 'instagram', 'blog']
      const predictions: Record<string, any> = {}
      
      for (const platform of platforms) {
        const context: ViralContext = {
          platform,
          targetAudience: 'general',
          publishTime: new Date(),
          currentTrends: [],
          competitorActivity: 0.5
        }
        
        const score = await viralEngine.predictViralScore(content, context)
        
        predictions[platform] = {
          score: score.overallScore,
          reach: score.expectedReach,
          engagement: score.expectedReach * 0.05
        }
      }
      
      return predictions
    } catch (error) {
      throw new ViralPredictionError('Failed to predict cross-platform engagement', 'CROSS_PLATFORM_ERROR', error)
    }
  }

  // Private helper methods
  private async identifyOptimizationOpportunities(
    content: string,
    score: ViralScore
  ): Promise<ViralChange[]> {
    const changes: ViralChange[] = []
    
    // Emotional optimization
    if (score.components.emotionalTrigger < 70) {
      changes.push({
        changeId: `change_${Date.now()}_1`,
        type: 'emotional',
        description: 'Add emotional hooks and triggers',
        before: 'Generic opening',
        after: 'Emotionally compelling opening',
        impact: 0.25,
        confidence: 0.85
      })
    }
    
    // Structural optimization
    if (score.components.structureScore < 70) {
      changes.push({
        changeId: `change_${Date.now()}_2`,
        type: 'structural',
        description: 'Improve content structure and flow',
        before: 'Unstructured content',
        after: 'Well-structured with clear sections',
        impact: 0.20,
        confidence: 0.80
      })
    }
    
    // Hook optimization
    changes.push({
      changeId: `change_${Date.now()}_3`,
      type: 'hook',
      description: 'Add compelling opening hook',
      before: 'Standard introduction',
      after: 'Attention-grabbing hook',
      impact: 0.30,
      confidence: 0.90
    })
    
    return changes
  }

  private async applyViralOptimizations(
    content: string,
    changes: ViralChange[]
  ): Promise<string> {
    let optimized = content
    
    // Apply emotional enhancements
    if (changes.some(c => c.type === 'emotional')) {
      optimized = this.enhanceEmotionalImpact(optimized)
    }
    
    // Apply structural improvements
    if (changes.some(c => c.type === 'structural')) {
      optimized = this.improveStructure(optimized)
    }
    
    // Add hooks
    if (changes.some(c => c.type === 'hook')) {
      optimized = this.addCompellingHook(optimized)
    }
    
    return optimized
  }

  private enhanceEmotionalImpact(content: string): string {
    // Add emotional power words
    const powerPhrases = [
      'You won\'t believe',
      'This changed everything',
      'The shocking truth',
      'What nobody tells you'
    ]
    
    const randomPhrase = powerPhrases[Math.floor(Math.random() * powerPhrases.length)]
    return `${randomPhrase}...\n\n${content}`
  }

  private improveStructure(content: string): string {
    // Add clear sections if missing
    const paragraphs = content.split('\n\n')
    
    if (paragraphs.length > 3 && !content.includes('##')) {
      const structured = []
      for (let i = 0; i < paragraphs.length; i++) {
        if (i % 3 === 0 && i > 0) {
          structured.push(`## Key Point ${Math.floor(i/3)}`)
        }
        structured.push(paragraphs[i])
      }
      return structured.join('\n\n')
    }
    
    return content
  }

  private addCompellingHook(content: string): string {
    const hooks = [
      '🔥 This is going viral right now...',
      '⚡ Everyone\'s talking about this...',
      '💡 The secret that changed everything...',
      '🚀 This breakthrough discovery...'
    ]
    
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)]
    return `${randomHook}\n\n${content}`
  }

  private getOptimalTimesForPlatform(platform: string): Date[] {
    const now = new Date()
    const times: Date[] = []
    
    // Platform-specific optimal times
    const optimalHours: Record<string, number[]> = {
      twitter: [9, 12, 17, 20],
      linkedin: [8, 12, 17],
      instagram: [11, 14, 19],
      blog: [9, 14, 20],
      tiktok: [12, 18, 21],
      youtube: [14, 18, 20]
    }
    
    const hours = optimalHours[platform] || [9, 14, 20]
    
    for (const hour of hours) {
      const time = new Date(now)
      time.setHours(hour, 0, 0, 0)
      if (time < now) {
        time.setDate(time.getDate() + 1)
      }
      times.push(time)
    }
    
    return times
  }

  private generateTimingReasoning(platform: string, time: Date, score: ViralScore): string[] {
    const hour = time.getHours()
    const reasons = []
    
    if (hour >= 9 && hour <= 11) {
      reasons.push('Morning peak engagement time')
    } else if (hour >= 14 && hour <= 16) {
      reasons.push('Afternoon engagement window')
    } else if (hour >= 19 && hour <= 21) {
      reasons.push('Evening prime time')
    }
    
    if (score.components.timingScore > 70) {
      reasons.push('High timing score for this content')
    }
    
    reasons.push(`${platform} algorithm favors this time slot`)
    
    return reasons
  }

  private async createPlatformStrategy(
    content: string,
    platform: string
  ): Promise<PlatformViralStrategy> {
    const context: ViralContext = {
      platform,
      targetAudience: 'general',
      publishTime: new Date(),
      currentTrends: [],
      competitorActivity: 0.5
    }
    
    const score = await viralEngine.predictViralScore(content, context)
    
    const strategies: Record<string, Partial<PlatformViralStrategy>> = {
      twitter: {
        contentFormat: 'Thread or single tweet',
        optimalLength: 280,
        keyElements: ['Hook', 'Controversy', 'Call to engage'],
        timingStrategy: 'Post during work hours for B2B, evenings for B2C'
      },
      linkedin: {
        contentFormat: 'Professional post with insights',
        optimalLength: 1500,
        keyElements: ['Professional insight', 'Data/stats', 'Call to discuss'],
        timingStrategy: 'Tuesday-Thursday mornings'
      },
      instagram: {
        contentFormat: 'Visual-first with caption',
        optimalLength: 150,
        keyElements: ['Visual hook', 'Story', 'Hashtags'],
        timingStrategy: 'Lunch time and evenings'
      },
      blog: {
        contentFormat: 'Long-form article',
        optimalLength: 1500,
        keyElements: ['SEO keywords', 'Comprehensive info', 'CTAs'],
        timingStrategy: 'Morning publishing for maximum day reach'
      }
    }
    
    const platformConfig = strategies[platform] || strategies.blog
    
    return {
      platform,
      contentFormat: platformConfig.contentFormat!,
      optimalLength: platformConfig.optimalLength!,
      keyElements: platformConfig.keyElements!,
      timingStrategy: platformConfig.timingStrategy!,
      expectedScore: score.overallScore
    }
  }
}

export const viralOptimizer = ViralOptimizer.getInstance()
