// CTA Generator - Call-To-Action Generation and Optimization System
// Intelligent CTA creation based on business goals with A/B testing and performance optimization

import { ContentContext, MonetizationError } from './types'
import { getMonetizationConfig, getABTestingConfig } from '../config'

// Get configuration
const monetizationConfig = getMonetizationConfig()
const testConfig = getABTestingConfig()

export interface CTAGenerationRequest {
  content: string
  context: ContentContext
  goal: ConversionGoal
  targetAudience?: string
  brandVoice?: string
}

export interface ConversionGoal {
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue' | 'lead_generation'
  targetAction: string
  targetValue: number
  priority: number
}

export interface CTA {
  id: string
  text: string
  type: 'button' | 'link' | 'form' | 'popup'
  placement: CTAPlacement
  design: CTADesign
  targetAction: string
  goal: ConversionGoal
  expectedConversion: number
  performanceMetrics?: CTAPerformanceMetrics
  createdAt: Date
}

export interface CTAPlacement {
  location: 'header' | 'inline' | 'sidebar' | 'footer' | 'popup' | 'exit_intent'
  position: number
  context: string
}

export interface CTADesign {
  color: string
  size: 'small' | 'medium' | 'large'
  style: 'primary' | 'secondary' | 'outline' | 'text'
  urgency: boolean
  personalization: boolean
  animation?: string
}

export interface CTAPerformanceMetrics {
  impressions: number
  clicks: number
  conversions: number
  clickThroughRate: number
  conversionRate: number
  revenue: number
  lastUpdated: Date
}

export interface OptimizedCTA extends CTA {
  optimizations: CTAOptimization[]
  abTestResults?: ABTestResults
  confidence: number
}

export interface CTAOptimization {
  type: 'text' | 'design' | 'placement' | 'timing'
  description: string
  oldValue: any
  newValue: any
  expectedImpact: number
  reason: string
}

export interface ABTestResults {
  testId: string
  variants: CTAVariant[]
  winner?: CTAVariant
  statisticalSignificance: number
  testDuration: number
  totalSamples: number
}

export interface CTAVariant {
  variantId: string
  cta: CTA
  impressions: number
  clicks: number
  conversions: number
  conversionRate: number
  confidence: number
}

export interface CTATestConfig {
  variants: CTA[]
  trafficSplit: number[]
  successMetric: 'clicks' | 'conversions' | 'revenue'
  minSampleSize: number
  maxDuration: number
  significanceThreshold: number
}

export class CTAGenerator {
  private static instance: CTAGenerator

  static getInstance(): CTAGenerator {
    if (!CTAGenerator.instance) {
      CTAGenerator.instance = new CTAGenerator()
    }
    return CTAGenerator.instance
  }

  /**
   * Generate goal-based CTA with optimization for specific business objectives
   */
  async generateCTA(request: CTAGenerationRequest): Promise<CTA> {
    try {
      const { content, context, goal, targetAudience, brandVoice } = request

      // Analyze content to find optimal CTA placement
      const optimalPlacement = this.findOptimalPlacement(content, goal)

      // Generate CTA text based on goal and brand voice
      const ctaText = this.generateCTAText(goal, brandVoice || 'professional', targetAudience)

      // Determine CTA type based on goal and context
      const ctaType = this.selectCTAType(goal, context)

      // Design CTA for maximum conversion
      const design = this.designCTA(goal, context)

      // Calculate expected conversion rate
      const expectedConversion = this.predictConversionRate(goal, ctaType, design, optimalPlacement)

      const cta: CTA = {
        id: `cta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: ctaText,
        type: ctaType,
        placement: optimalPlacement,
        design,
        targetAction: goal.targetAction,
        goal,
        expectedConversion,
        createdAt: new Date()
      }

      return cta
    } catch (error) {
      throw new MonetizationError('Failed to generate CTA', 'CTA_GENERATION_ERROR', error)
    }
  }

  /**
   * Optimize existing CTA based on performance data
   */
  async optimizeCTA(
    cta: CTA,
    performanceData: CTAPerformanceMetrics
  ): Promise<OptimizedCTA> {
    try {
      const optimizations: CTAOptimization[] = []

      // Analyze performance and identify optimization opportunities
      const currentCTR = performanceData.clickThroughRate
      const currentConversionRate = performanceData.conversionRate

      // Optimize text if CTR is low
      if (currentCTR < 2.0) {
        const newText = this.optimizeCTAText(cta.text, cta.goal, 'low_ctr')
        optimizations.push({
          type: 'text',
          description: 'Improved CTA text for higher click-through rate',
          oldValue: cta.text,
          newValue: newText,
          expectedImpact: 0.25,
          reason: 'Current CTR below 2% threshold'
        })
        cta.text = newText
      }

      // Optimize design if conversion rate is low
      if (currentConversionRate < 5.0) {
        const newDesign = this.optimizeCTADesign(cta.design, cta.goal)
        optimizations.push({
          type: 'design',
          description: 'Enhanced CTA design for better visibility and urgency',
          oldValue: cta.design,
          newValue: newDesign,
          expectedImpact: 0.30,
          reason: 'Current conversion rate below 5% threshold'
        })
        cta.design = newDesign
      }

      // Optimize placement if impressions are low
      if (performanceData.impressions < 100) {
        const newPlacement = this.optimizeCTAPlacement(cta.placement, cta.goal)
        optimizations.push({
          type: 'placement',
          description: 'Repositioned CTA for better visibility',
          oldValue: cta.placement,
          newValue: newPlacement,
          expectedImpact: 0.20,
          reason: 'Low impression count indicates poor visibility'
        })
        cta.placement = newPlacement
      }

      // Calculate confidence based on sample size
      const confidence = this.calculateOptimizationConfidence(performanceData)

      return {
        ...cta,
        optimizations,
        confidence,
        performanceMetrics: performanceData
      }
    } catch (error) {
      throw new MonetizationError('Failed to optimize CTA', 'CTA_OPTIMIZATION_ERROR', error)
    }
  }

  /**
   * Create A/B test for CTA variations
   */
  async createABTest(
    baseCTA: CTA,
    variationCount: number = 2
  ): Promise<CTATestConfig> {
    try {
      const variants: CTA[] = [baseCTA]

      // Generate variations
      for (let i = 0; i < variationCount; i++) {
        const variation = await this.generateCTAVariation(baseCTA, i + 1)
        variants.push(variation)
      }

      // Equal traffic split
      const trafficSplit = variants.map(() => 1 / variants.length)

      return {
        variants,
        trafficSplit,
        successMetric: this.selectSuccessMetric(baseCTA.goal),
        minSampleSize: testConfig.minSampleSize,
        maxDuration: testConfig.maxDurationDays,
        significanceThreshold: testConfig.confidenceLevel
      }
    } catch (error) {
      throw new MonetizationError('Failed to create A/B test', 'AB_TEST_CREATION_ERROR', error)
    }
  }

  /**
   * Analyze A/B test results and determine winner
   */
  async analyzeABTest(
    testConfig: CTATestConfig,
    results: CTAVariant[]
  ): Promise<ABTestResults> {
    try {
      // Calculate statistical significance
      const significance = this.calculateStatisticalSignificance(results)

      // Determine winner based on success metric
      const winner = this.determineWinner(results, testConfig.successMetric, significance)

      // Calculate test duration
      const testDuration = this.calculateTestDuration(results)

      // Total samples
      const totalSamples = results.reduce((sum, v) => sum + v.impressions, 0)

      return {
        testId: `test_${Date.now()}`,
        variants: results,
        winner: significance >= testConfig.significanceThreshold ? winner : undefined,
        statisticalSignificance: significance,
        testDuration,
        totalSamples
      }
    } catch (error) {
      throw new MonetizationError('Failed to analyze A/B test', 'AB_TEST_ANALYSIS_ERROR', error)
    }
  }

  // Private helper methods

  private findOptimalPlacement(content: string, goal: ConversionGoal): CTAPlacement {
    const contentLength = content.length
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)

    // Determine optimal location based on goal
    let location: CTAPlacement['location']
    let position: number

    switch (goal.type) {
      case 'lead_generation':
        // Lead generation works best at the end or as popup
        location = 'footer'
        position = contentLength
        break
      case 'traffic':
        // Traffic goals work well inline
        location = 'inline'
        position = Math.floor(contentLength * 0.3)
        break
      case 'conversions':
      case 'revenue':
        // Conversion goals work best after value proposition
        location = 'inline'
        position = Math.floor(contentLength * 0.6)
        break
      default:
        location = 'inline'
        position = Math.floor(contentLength * 0.5)
    }

    // Extract context around placement
    const contextStart = Math.max(0, position - 100)
    const contextEnd = Math.min(contentLength, position + 100)
    const context = content.substring(contextStart, contextEnd)

    return {
      location,
      position,
      context
    }
  }

  private generateCTAText(
    goal: ConversionGoal,
    brandVoice: string,
    targetAudience?: string
  ): string {
    // CTA text templates based on goal type and brand voice
    const templates: Record<string, Record<string, string[]>> = {
      traffic: {
        professional: ['Learn More', 'Read the Full Article', 'Explore Further', 'Discover More'],
        casual: ['Check It Out', 'See More', 'Dive In', 'Keep Reading'],
        technical: ['View Documentation', 'Access Resources', 'Read Technical Details', 'See Implementation'],
        creative: ['Unlock the Story', 'Journey Deeper', 'Explore the Magic', 'Discover the Secret']
      },
      engagement: {
        professional: ['Join the Discussion', 'Share Your Thoughts', 'Connect With Us', 'Get Involved'],
        casual: ['Let\'s Chat', 'Tell Us What You Think', 'Join the Conversation', 'Drop a Comment'],
        technical: ['Contribute to Discussion', 'Share Your Solution', 'Join the Community', 'Collaborate'],
        creative: ['Share Your Story', 'Be Part of Something', 'Join the Movement', 'Make Your Voice Heard']
      },
      conversions: {
        professional: ['Get Started Today', 'Start Your Free Trial', 'Request a Demo', 'Schedule Consultation'],
        casual: ['Try It Free', 'Get Started Now', 'Sign Up Today', 'Join Free'],
        technical: ['Deploy Now', 'Start Building', 'Access API', 'Begin Integration'],
        creative: ['Begin Your Journey', 'Transform Today', 'Unlock Your Potential', 'Start Creating']
      },
      revenue: {
        professional: ['Purchase Now', 'Invest in Your Success', 'Get Premium Access', 'Upgrade Today'],
        casual: ['Buy Now', 'Grab Your Copy', 'Get It Today', 'Shop Now'],
        technical: ['Purchase License', 'Upgrade Plan', 'Get Enterprise Access', 'Buy Credits'],
        creative: ['Claim Your Power', 'Invest in Excellence', 'Unlock Premium', 'Elevate Your Game']
      },
      lead_generation: {
        professional: ['Download Free Guide', 'Get Your Free Resource', 'Access Exclusive Content', 'Subscribe for Updates'],
        casual: ['Grab Your Freebie', 'Get the Guide', 'Download Now', 'Join Our List'],
        technical: ['Download Whitepaper', 'Access Technical Guide', 'Get Documentation', 'Subscribe to Updates'],
        creative: ['Unlock Your Gift', 'Claim Your Resource', 'Get Instant Access', 'Discover the Secret']
      }
    }

    const goalTemplates = templates[goal.type]?.[brandVoice] || templates[goal.type]?.professional || []
    
    // Select random template or use target action
    return goalTemplates[Math.floor(Math.random() * goalTemplates.length)] || goal.targetAction
  }

  private selectCTAType(goal: ConversionGoal, context: ContentContext): CTA['type'] {
    // Select CTA type based on goal and content type
    if (goal.type === 'lead_generation') {
      return 'form'
    } else if (goal.type === 'revenue' || goal.type === 'conversions') {
      return 'button'
    } else if (context.contentType === 'email') {
      return 'link'
    } else {
      return 'button'
    }
  }

  private designCTA(goal: ConversionGoal, context: ContentContext): CTADesign {
    // Design CTA based on goal priority and type
    const isHighPriority = goal.priority >= 8

    return {
      color: this.selectCTAColor(goal.type),
      size: isHighPriority ? 'large' : 'medium',
      style: isHighPriority ? 'primary' : 'secondary',
      urgency: goal.type === 'revenue' || goal.type === 'conversions',
      personalization: context.targetAudience !== 'general',
      animation: isHighPriority ? 'pulse' : undefined
    }
  }

  private selectCTAColor(goalType: string): string {
    const colorMap: Record<string, string> = {
      traffic: '#3B82F6', // blue
      engagement: '#8B5CF6', // purple
      conversions: '#10B981', // green
      revenue: '#EF4444', // red
      lead_generation: '#F59E0B' // orange
    }
    return colorMap[goalType] || '#3B82F6'
  }

  private predictConversionRate(
    goal: ConversionGoal,
    type: CTA['type'],
    design: CTADesign,
    placement: CTAPlacement
  ): number {
    // Base conversion rates by goal type
    const baseRates: Record<string, number> = {
      traffic: 5.0,
      engagement: 3.0,
      conversions: 2.5,
      revenue: 1.5,
      lead_generation: 4.0
    }

    let rate = baseRates[goal.type] || 2.0

    // Adjust for CTA type
    if (type === 'button') rate *= 1.2
    if (type === 'form') rate *= 0.8

    // Adjust for design
    if (design.urgency) rate *= 1.15
    if (design.personalization) rate *= 1.10
    if (design.size === 'large') rate *= 1.05

    // Adjust for placement
    if (placement.location === 'header') rate *= 1.10
    if (placement.location === 'popup') rate *= 0.9
    if (placement.location === 'exit_intent') rate *= 0.7

    return Math.min(rate, 15.0) // Cap at 15%
  }

  private optimizeCTAText(currentText: string, goal: ConversionGoal, reason: string): string {
    // Add urgency or value proposition
    if (reason === 'low_ctr') {
      const urgencyPrefixes = ['Start Now:', 'Limited Time:', 'Today Only:', 'Don\'t Miss:']
      const prefix = urgencyPrefixes[Math.floor(Math.random() * urgencyPrefixes.length)]
      return `${prefix} ${currentText}`
    }
    return currentText
  }

  private optimizeCTADesign(currentDesign: CTADesign, goal: ConversionGoal): CTADesign {
    return {
      ...currentDesign,
      size: 'large',
      urgency: true,
      animation: 'pulse'
    }
  }

  private optimizeCTAPlacement(currentPlacement: CTAPlacement, goal: ConversionGoal): CTAPlacement {
    // Move to more prominent location
    return {
      ...currentPlacement,
      location: 'header'
    }
  }

  private calculateOptimizationConfidence(metrics: CTAPerformanceMetrics): number {
    // Confidence based on sample size
    const sampleSize = metrics.impressions
    if (sampleSize < 100) return 0.5
    if (sampleSize < 500) return 0.7
    if (sampleSize < 1000) return 0.85
    return 0.95
  }

  private async generateCTAVariation(baseCTA: CTA, variationNumber: number): Promise<CTA> {
    const variation = { ...baseCTA }
    variation.id = `${baseCTA.id}_var${variationNumber}`

    // Vary different aspects
    switch (variationNumber % 3) {
      case 0:
        // Text variation
        variation.text = this.generateCTAText(baseCTA.goal, 'casual')
        break
      case 1:
        // Design variation
        variation.design = {
          ...baseCTA.design,
          color: '#10B981',
          urgency: !baseCTA.design.urgency
        }
        break
      case 2:
        // Placement variation
        variation.placement = {
          ...baseCTA.placement,
          location: baseCTA.placement.location === 'inline' ? 'footer' : 'inline'
        }
        break
    }

    return variation
  }

  private selectSuccessMetric(goal: ConversionGoal): 'clicks' | 'conversions' | 'revenue' {
    if (goal.type === 'revenue') return 'revenue'
    if (goal.type === 'conversions' || goal.type === 'lead_generation') return 'conversions'
    return 'clicks'
  }

  private calculateStatisticalSignificance(variants: CTAVariant[]): number {
    if (variants.length < 2) return 0

    // Simple z-test for conversion rate difference
    const control = variants[0]
    const treatment = variants[1]

    const p1 = control.conversionRate / 100
    const p2 = treatment.conversionRate / 100
    const n1 = control.impressions
    const n2 = treatment.impressions

    if (n1 < 30 || n2 < 30) return 0 // Insufficient sample size

    const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2)
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2))
    
    if (se === 0) return 0

    const z = Math.abs(p1 - p2) / se
    
    // Convert z-score to confidence level (simplified)
    if (z > 2.58) return 0.99
    if (z > 1.96) return 0.95
    if (z > 1.65) return 0.90
    if (z > 1.28) return 0.80
    return 0.50
  }

  private determineWinner(
    variants: CTAVariant[],
    metric: 'clicks' | 'conversions' | 'revenue',
    significance: number
  ): CTAVariant | undefined {
    if (significance < 0.90) return undefined

    return variants.reduce((best, current) => {
      let bestScore = 0
      let currentScore = 0

      switch (metric) {
        case 'clicks':
          bestScore = (best.clicks / best.impressions) * 100
          currentScore = (current.clicks / current.impressions) * 100
          break
        case 'conversions':
          bestScore = best.conversionRate
          currentScore = current.conversionRate
          break
        case 'revenue':
          bestScore = best.conversions * 100 // Simplified revenue calculation
          currentScore = current.conversions * 100
          break
      }

      return currentScore > bestScore ? current : best
    })
  }

  private calculateTestDuration(variants: CTAVariant[]): number {
    // Estimate test duration based on impression velocity
    // For now, return a fixed value (would be calculated from timestamps in production)
    return 7 // days
  }
}

// Export singleton instance
export const ctaGenerator = CTAGenerator.getInstance()
