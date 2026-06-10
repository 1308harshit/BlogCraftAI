// Automation System - Main Export File
// Centralized exports for automation and content pipeline

import { contentPipeline, type ContentPipelineConfig, type GeneratedContent } from './content-pipeline'
import { researchEngine } from './research-engine'
import { contentQualityValidator } from './content-quality-validator'

// Core types and models
export * from './types'
export * from './models'

// Content Pipeline System
export { 
  ContentPipeline, 
  contentPipeline,
  type ContentPipelineConfig,
  type PipelineResult,
  type GeneratedContent
} from './content-pipeline'

// Research Engine
export {
  ResearchEngine,
  researchEngine,
  type TrendAnalysis,
  type RealTimeTrendUpdate,
  type CompetitorAnalysis,
  type CompetitorProfile,
  type CompetitorContent,
  type ContentGap,
  type OpportunityInsight,
  type PerformanceTrend,
  type TopicSuggestion,
  type ResearchContext,
  type AutomatedResearchPlan,
  type ContentCalendarEntry
} from './research-engine'

// Bulk Content Generator
export {
  BulkContentGenerator,
  bulkContentGenerator,
  type BulkGenerationConfig,
  type ContentTemplate
} from './bulk-content-generator'

// Content Quality Validator
export {
  ContentQualityValidator,
  contentQualityValidator,
  type ValidationResult,
  type ValidationCheck,
  type ValidationIssue
} from './content-quality-validator'

// Main API class for easy usage
export class AutomationAPI {
  private static instance: AutomationAPI

  static getInstance(): AutomationAPI {
    if (!AutomationAPI.instance) {
      AutomationAPI.instance = new AutomationAPI()
    }
    return AutomationAPI.instance
  }

  // Quick content generation
  async generateContent(
    userId: string,
    days: number = 30,
    options?: Partial<ContentPipelineConfig>
  ) {
    const config: ContentPipelineConfig = {
      userId,
      daysToGenerate: days,
      contentTypes: options?.contentTypes || ['blog'],
      platforms: options?.platforms || ['blog'],
      businessGoals: options?.businessGoals || ['traffic'],
      qualityThreshold: options?.qualityThreshold || 0.7,
      includeResearch: options?.includeResearch ?? true,
      includeOptimization: options?.includeOptimization ?? true,
      includeScheduling: options?.includeScheduling ?? true,
      includeMonetization: (options as any)?.includeMonetization ?? false
    }

    return await contentPipeline.execute(config)
  }

  // Research trends
  async researchTrends(businessGoals: string[]) {
    return await researchEngine.analyzeTrends(businessGoals)
  }

  // Analyze competitors
  async analyzeCompetitors(userId: string) {
    return await researchEngine.analyzeCompetitors(userId)
  }

  // Generate topic suggestions
  async suggestTopics(userId: string, count: number, businessGoals: string[]) {
    return await researchEngine.generateTopicSuggestions({
      userId,
      count,
      contentTypes: ['blog'],
      platforms: ['blog'],
      businessGoals
    })
  }

  // Generate automated research plan with content calendar
  async generateResearchPlan(
    userId: string,
    count: number,
    options?: {
      contentTypes?: string[]
      platforms?: string[]
      businessGoals?: string[]
    }
  ) {
    return await researchEngine.generateAutomatedResearchPlan({
      userId,
      count,
      contentTypes: options?.contentTypes || ['blog'],
      platforms: options?.platforms || ['blog'],
      businessGoals: options?.businessGoals || ['traffic']
    })
  }

  // Start real-time trend monitoring
  startTrendMonitoring(
    userId: string,
    callback: (updates: any[]) => void
  ) {
    researchEngine.startRealTimeTrendMonitoring(userId, callback)
  }

  // Stop real-time trend monitoring
  stopTrendMonitoring() {
    researchEngine.stopRealTimeTrendMonitoring()
  }

  // Validate content quality
  async validateContent(content: GeneratedContent, threshold: number = 0.7) {
    return await contentQualityValidator.validate(content, threshold)
  }
}

// Export singleton instance
export const automationAPI = AutomationAPI.getInstance()
