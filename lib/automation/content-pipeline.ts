// Content Pipeline - High-Volume Content Generation System
// Supports research → generate → design → schedule → analyze → optimize workflow
// Target: 30 days of content in 10 minutes

import {
  AutomationStep,
  StepResult,
  AutomationError
} from './types'

import { ResearchEngine } from './research-engine'
import { BulkContentGenerator } from './bulk-content-generator'
import { ContentQualityValidator } from './content-quality-validator'
import { outcomeBasedAI } from '../outcome-based-ai'
import { viralPrediction } from '../viral-prediction'
import { recommendationEngine } from '../ai-brain/recommendation-engine'
import { monetizationEngine } from '../monetization'

// Content Pipeline Configuration
export interface ContentPipelineConfig {
  userId: string
  daysToGenerate: number
  contentTypes: string[]
  platforms: string[]
  businessGoals: string[]
  qualityThreshold: number
  includeResearch: boolean
  includeOptimization: boolean
  includeScheduling: boolean
  includeMonetization: boolean
}

// Pipeline Result
export interface PipelineResult {
  success: boolean
  contentGenerated: number
  timeElapsed: number
  qualityScore: number
  steps: StepResult[]
  generatedContent: GeneratedContent[]
  errors: string[]
}

// Generated Content Item
export interface GeneratedContent {
  contentId: string
  title: string
  content: string
  contentType: string
  platform: string
  scheduledDate: Date
  qualityScore: number
  viralScore: number
  seoScore: number
  optimizations: string[]
  monetizationData?: {
    insertedProducts: number
    averageRelevance: number
    estimatedRevenue: number
  }
  metadata: Record<string, any>
}

// Main Content Pipeline Orchestrator
export class ContentPipeline {
  private static instance: ContentPipeline
  private researchEngine: ResearchEngine
  private bulkGenerator: BulkContentGenerator
  private qualityValidator: ContentQualityValidator

  private constructor() {
    this.researchEngine = ResearchEngine.getInstance()
    this.bulkGenerator = BulkContentGenerator.getInstance()
    this.qualityValidator = ContentQualityValidator.getInstance()
  }

  static getInstance(): ContentPipeline {
    if (!ContentPipeline.instance) {
      ContentPipeline.instance = new ContentPipeline()
    }
    return ContentPipeline.instance
  }

  // Execute complete content pipeline
  async execute(config: ContentPipelineConfig): Promise<PipelineResult> {
    const startTime = Date.now()
    const steps: StepResult[] = []
    const generatedContent: GeneratedContent[] = []
    const errors: string[] = []

    try {
      console.log(`Starting content pipeline for ${config.daysToGenerate} days...`)

      // Step 1: Research Phase
      let researchData: any = null
      if (config.includeResearch) {
        const researchResult = await this.executeResearchPhase(config)
        steps.push(researchResult)
        
        if (researchResult.success) {
          researchData = researchResult.output
        } else {
          errors.push('Research phase failed')
        }
      }

      // Step 2: Content Generation Phase
      const generationResult = await this.executeGenerationPhase(config, researchData)
      steps.push(generationResult)
      
      if (generationResult.success) {
        generatedContent.push(...generationResult.output.content)
      } else {
        errors.push('Generation phase failed')
        throw new AutomationError('Content generation failed', 'GENERATION_ERROR')
      }

      // Step 3: Quality Validation Phase
      const validationResult = await this.executeValidationPhase(generatedContent, config)
      steps.push(validationResult)
      
      if (!validationResult.success) {
        errors.push('Some content failed quality validation')
      }

      // Step 4: Optimization Phase
      if (config.includeOptimization) {
        const optimizationResult = await this.executeOptimizationPhase(generatedContent, config)
        steps.push(optimizationResult)
        
        if (optimizationResult.success) {
          // Update generated content with optimizations
          const optimizedContent = optimizationResult.output.optimizedContent
          optimizedContent.forEach((opt: any, index: number) => {
            if (generatedContent[index]) {
              generatedContent[index].content = opt.content
              generatedContent[index].optimizations = opt.optimizations
              generatedContent[index].viralScore = opt.viralScore
            }
          })
        }
      }

      // Step 5: Scheduling Phase
      if (config.includeScheduling) {
        const schedulingResult = await this.executeSchedulingPhase(generatedContent, config)
        steps.push(schedulingResult)
      }

      // Step 6: Monetization Phase
      if (config.includeMonetization) {
        const monetizationResult = await this.executeMonetizationPhase(generatedContent, config)
        steps.push(monetizationResult)
        
        if (monetizationResult.success) {
          // Update generated content with monetization data
          const monetizedContent = monetizationResult.output.monetizedContent
          monetizedContent.forEach((mon: any, index: number) => {
            if (generatedContent[index]) {
              generatedContent[index].content = mon.monetizedContent
              generatedContent[index].monetizationData = {
                insertedProducts: mon.totalInsertions,
                averageRelevance: mon.averageRelevance,
                estimatedRevenue: mon.estimatedRevenue
              }
            }
          })
        }
      }

      const timeElapsed = Date.now() - startTime
      const avgQuality = generatedContent.reduce((sum, c) => sum + c.qualityScore, 0) / generatedContent.length

      console.log(`Pipeline completed: ${generatedContent.length} pieces in ${timeElapsed}ms`)

      return {
        success: errors.length === 0,
        contentGenerated: generatedContent.length,
        timeElapsed,
        qualityScore: avgQuality,
        steps,
        generatedContent,
        errors
      }
    } catch (error) {
      const timeElapsed = Date.now() - startTime
      
      return {
        success: false,
        contentGenerated: generatedContent.length,
        timeElapsed,
        qualityScore: 0,
        steps,
        generatedContent,
        errors: [...errors, error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  // Research Phase: Trend analysis and topic generation
  private async executeResearchPhase(config: ContentPipelineConfig): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log('Executing research phase...')
      
      // Analyze trends
      const trends = await this.researchEngine.analyzeTrends(config.businessGoals)
      
      // Analyze competitors
      const competitors = await this.researchEngine.analyzeCompetitors(config.userId)
      
      // Generate topic suggestions
      const topics = await this.researchEngine.generateTopicSuggestions({
        userId: config.userId,
        count: config.daysToGenerate,
        contentTypes: config.contentTypes,
        platforms: config.platforms,
        businessGoals: config.businessGoals
      })

      return {
        success: true,
        output: {
          trends,
          competitors,
          topics
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'RESEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Research phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Generation Phase: Bulk content creation
  private async executeGenerationPhase(
    config: ContentPipelineConfig,
    researchData: any
  ): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log(`Generating ${config.daysToGenerate} days of content...`)
      
      const content = await this.bulkGenerator.generateBulkContent({
        userId: config.userId,
        count: config.daysToGenerate,
        contentTypes: config.contentTypes,
        platforms: config.platforms,
        businessGoals: config.businessGoals,
        researchData,
        qualityThreshold: config.qualityThreshold
      })

      return {
        success: true,
        output: {
          content,
          count: content.length
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Generation phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Validation Phase: Quality checks
  private async executeValidationPhase(
    content: GeneratedContent[],
    config: ContentPipelineConfig
  ): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log(`Validating ${content.length} content pieces...`)
      
      const validationResults = await this.qualityValidator.validateBatch(
        content,
        config.qualityThreshold
      )

      const passedCount = validationResults.filter(r => r.passed).length
      const failedCount = validationResults.length - passedCount

      return {
        success: failedCount === 0,
        output: {
          validationResults,
          passedCount,
          failedCount,
          passRate: passedCount / validationResults.length
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Validation phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Optimization Phase: Enhance content for outcomes
  private async executeOptimizationPhase(
    content: GeneratedContent[],
    config: ContentPipelineConfig
  ): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log(`Optimizing ${content.length} content pieces...`)
      
      const optimizedContent = await Promise.all(
        content.map(async (item) => {
          // Get viral score
          const viralScore = await viralPrediction.predictViralScore(
            item.content,
            item.platform
          )

          // Optimize for primary business goal
          const primaryGoal = config.businessGoals[0] || 'traffic'
          let optimized = item.content
          const optimizations: string[] = []

          if (primaryGoal === 'traffic') {
            const result = await outcomeBasedAI.optimizeForTraffic(item.content)
            optimized = result.optimizedContent || item.content
            optimizations.push('SEO optimization applied')
          } else if (primaryGoal === 'engagement') {
            const result = await outcomeBasedAI.optimizeForEngagement(item.content)
            optimized = result.optimizedContent || item.content
            optimizations.push('Engagement optimization applied')
          }

          return {
            ...item,
            content: optimized,
            viralScore: viralScore.overallScore,
            optimizations
          }
        })
      )

      return {
        success: true,
        output: {
          optimizedContent,
          avgViralScore: optimizedContent.reduce((sum, c) => sum + c.viralScore, 0) / optimizedContent.length
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'OPTIMIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Optimization phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Scheduling Phase: Assign optimal publish times
  private async executeSchedulingPhase(
    content: GeneratedContent[],
    config: ContentPipelineConfig
  ): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log(`Scheduling ${content.length} content pieces...`)
      
      // Assign optimal publish times
      const now = new Date()
      const optimalHours = [9, 14, 19] // 9 AM, 2 PM, 7 PM
      
      content.forEach((item, index) => {
        const daysAhead = Math.floor(index / optimalHours.length)
        const hourIndex = index % optimalHours.length
        const hour = optimalHours[hourIndex]
        
        const scheduledDate = new Date(now)
        scheduledDate.setDate(scheduledDate.getDate() + daysAhead)
        scheduledDate.setHours(hour, 0, 0, 0)
        
        item.scheduledDate = scheduledDate
      })

      return {
        success: true,
        output: {
          scheduledContent: content,
          dateRange: {
            start: content[0]?.scheduledDate,
            end: content[content.length - 1]?.scheduledDate
          }
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'SCHEDULING_ERROR',
          message: error instanceof Error ? error.message : 'Scheduling phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Monetization Phase: Insert affiliate links and CTAs
  private async executeMonetizationPhase(
    content: GeneratedContent[],
    config: ContentPipelineConfig
  ): Promise<StepResult> {
    const startTime = Date.now()
    
    try {
      console.log(`Monetizing ${content.length} content pieces...`)
      
      const monetizedContent = await Promise.all(
        content.map(async (item) => {
          // Monetize content with affiliate links
          const monetized = await monetizationEngine.monetizeContent(
            item.content,
            {
              userId: config.userId,
              topic: item.title,
              keywords: item.metadata.keywords || [],
              targetAudience: item.metadata.targetAudience || 'general',
              contentType: item.contentType as any
            }
          )

          return monetized
        })
      )

      const avgRelevance = monetizedContent.reduce((sum, m) => sum + m.averageRelevance, 0) / monetizedContent.length
      const totalRevenue = monetizedContent.reduce((sum, m) => sum + m.estimatedRevenue, 0)

      return {
        success: true,
        output: {
          monetizedContent,
          avgRelevance,
          totalRevenue,
          totalInsertions: monetizedContent.reduce((sum, m) => sum + m.totalInsertions, 0)
        },
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        error: {
          code: 'MONETIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Monetization phase failed',
          details: error,
          timestamp: new Date(),
          retryable: true
        }
      }
    }
  }

  // Quick generation for testing (simplified pipeline)
  async quickGenerate(
    userId: string,
    count: number,
    contentType: string = 'blog'
  ): Promise<GeneratedContent[]> {
    const config: ContentPipelineConfig = {
      userId,
      daysToGenerate: count,
      contentTypes: [contentType],
      platforms: ['blog'],
      businessGoals: ['traffic'],
      qualityThreshold: 0.7,
      includeResearch: false,
      includeOptimization: false,
      includeScheduling: true,
      includeMonetization: false
    }

    const result = await this.execute(config)
    return result.generatedContent
  }
}

// Export singleton instance
export const contentPipeline = ContentPipeline.getInstance()
