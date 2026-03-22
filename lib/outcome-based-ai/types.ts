// Outcome-Based AI - Core Types and Interfaces
// Type definitions for outcome-focused AI optimization system

import { PerformanceMetrics, ContentContext, UserPreferences } from '../ai-brain/types'

// Core Outcome-Based AI Interface
export interface OutcomeBasedAI {
  optimizeForMetric(
    content: string,
    targetMetric: BusinessMetric,
    context?: PublishingContext
  ): Promise<OptimizedContent>
  
  predictOutcome(
    content: string,
    context: PublishingContext
  ): Promise<OutcomePrediction[]>
  
  generateVariations(
    content: string,
    optimizationGoals: OptimizationGoal[]
  ): Promise<ContentVariation[]>
}

// Content Data for processing
export interface ContentData {
  id: string
  userId: string
  title: string
  content: string
  type: 'blog' | 'social' | 'email' | 'video_script' | 'landing_page'
  platform?: string
  metadata: ContentMetadata
  currentMetrics?: PerformanceMetrics
  targetOutcomes: BusinessOutcome[]
  optimizationHistory: OptimizationRecord[]
  createdAt: Date
  lastOptimized?: Date
}

// Business Metrics and Outcomes
export interface BusinessMetric {
  metricId: string
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue' | 'brand_awareness' | 'lead_generation'
  name: string
  description: string
  unit: string
  targetValue: number
  currentValue: number
  priority: number // 1-10 scale
  timeframe: number // days
  calculationMethod: string
  dependencies: string[]
  benchmarks: MetricBenchmark[]
}

export interface MetricBenchmark {
  source: string
  value: number
  percentile: number
  industry: string
  dateRecorded: Date
}

// Outcome Prediction
export interface OutcomePrediction {
  predictionId: string
  targetMetric: BusinessMetric
  predictedValue: number
  confidence: number
  timeframe: number
  factors: PredictionFactor[]
  scenarios: PredictionScenario[]
  recommendations: string[]
  createdAt: Date
}

export interface PredictionFactor {
  factor: string
  impact: number // -1 to 1
  confidence: number
  description: string
  category: string
}

export interface PredictionScenario {
  scenario: 'optimistic' | 'realistic' | 'pessimistic'
  predictedValue: number
  probability: number
  assumptions: string[]
  riskFactors: string[]
}

export interface ContentMetadata {
  keywords: string[]
  readingTime: number
  wordCount: number
  sentiment: number
  complexity: number
  structure: ContentStructure
  monetizationElements: MonetizationElement[]
  seoElements: SEOElement[]
}

export interface ContentStructure {
  hasIntroduction: boolean
  hasConclusion: boolean
  headingCount: number
  paragraphCount: number
  bulletPointCount: number
  imageCount: number
  linkCount: number
  ctaCount: number
}

export interface SEOElement {
  type: 'title_tag' | 'meta_description' | 'heading' | 'internal_link' | 'keyword'
  value: string
  score: number
  optimization: string[]
}

export interface PerformanceMetrics {
  views: number
  engagement: number
  shares: number
  comments: number
  clicks: number
  conversions: number
  revenue: number
  viralScore: number
  seoScore: number
  roi: number
  engagementRate: number
  conversionRate: number
}

export interface BusinessOutcome {
  outcomeId: string
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue'
  name: string
  description: string
  targetMetrics: BusinessMetric[]
  priority: number
  deadline: Date
  currentProgress: number
  expectedROI: number
  successCriteria: SuccessCriteria[]
}

export interface SuccessCriteria {
  criterion: string
  targetValue: number
  currentValue: number
  unit: string
  weight: number
  achieved: boolean
}

export interface OptimizationRecord {
  recordId: string
  timestamp: Date
  optimizationType: string
  changes: OptimizationChange[]
  results: OptimizationResults
  learnings: string[]
}

export interface OptimizationChange {
  field: string
  oldValue: any
  newValue: any
  reason: string
  impact: number
}

export interface OptimizationResults {
  beforeMetrics: PerformanceMetrics
  afterMetrics: PerformanceMetrics
  improvement: number
  statisticalSignificance: number
  testDuration: number
  sampleSize: number
}

export interface BusinessOutcome {
  outcomeId: string
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue'
  name: string
  description: string
  targetMetrics: BusinessMetric[]
  priority: number
  deadline: Date
  currentProgress: number
  expectedROI: number
  successCriteria: SuccessCriteria[]
}

export interface SuccessCriteria {
  criterion: string
  targetValue: number
  currentValue: number
  unit: string
  weight: number
  achieved: boolean
}

// Optimization Results
export interface OptimizationResult {
  resultId: string
  originalContent: ContentData
  optimizedContent: ContentData
  targetOutcome: BusinessOutcome
  optimizations: ContentOptimization[]
  predictedImpact: OutcomePrediction
  confidence: number
  implementationSteps: string[]
  validationPlan: ValidationPlan
  createdAt: Date
}

export interface ContentOptimization {
  optimizationId: string
  type: 'structure' | 'content' | 'seo' | 'monetization' | 'engagement'
  description: string
  changes: OptimizationChange[]
  expectedImpact: number
  confidence: number
  priority: number
  effort: 'low' | 'medium' | 'high'
}

export interface OptimizationChange {
  field: string
  oldValue: any
  newValue: any
  reason: string
  impact: number
}

export interface ValidationPlan {
  metrics: string[]
  testDuration: number
  sampleSize: number
  successThreshold: number
  checkpoints: Date[]
  rollbackCriteria: string[]
}

// Outcome Strategy
export interface OutcomeStrategy {
  strategyId: string
  targetOutcome: BusinessOutcome
  approach: 'content_optimization' | 'traffic_generation' | 'conversion_optimization' | 'revenue_maximization'
  tactics: StrategyTactic[]
  timeline: StrategyTimeline
  resourceRequirements: ResourceRequirement[]
  expectedResults: ExpectedResult[]
  riskAssessment: RiskAssessment
}

export interface StrategyTactic {
  tacticId: string
  name: string
  description: string
  type: 'content' | 'seo' | 'social' | 'email' | 'paid' | 'conversion'
  priority: number
  effort: 'low' | 'medium' | 'high'
  expectedImpact: number
  dependencies: string[]
  implementation: string[]
}

export interface StrategyTimeline {
  totalDuration: number
  phases: StrategyPhase[]
  milestones: Milestone[]
  criticalPath: string[]
}

export interface StrategyPhase {
  phaseId: string
  name: string
  duration: number
  startDate: Date
  endDate: Date
  deliverables: string[]
  successMetrics: string[]
}

export interface Milestone {
  milestoneId: string
  name: string
  date: Date
  criteria: string[]
  dependencies: string[]
}

export interface ResourceRequirement {
  type: 'time' | 'budget' | 'tools' | 'skills'
  description: string
  quantity: number
  unit: string
  priority: 'essential' | 'important' | 'nice_to_have'
}

export interface ExpectedResult {
  metric: string
  currentValue: number
  targetValue: number
  timeframe: number
  confidence: number
  assumptions: string[]
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high'
  risks: Risk[]
  mitigationStrategies: MitigationStrategy[]
}

export interface Risk {
  riskId: string
  description: string
  probability: number
  impact: number
  category: 'technical' | 'market' | 'competitive' | 'resource'
  mitigation: string[]
}

export interface MitigationStrategy {
  strategyId: string
  description: string
  triggers: string[]
  actions: string[]
  owner: string
}

// Optimization Records
export interface OptimizationRecord {
  recordId: string
  timestamp: Date
  optimizationType: string
  changes: OptimizationChange[]
  results: OptimizationResults
  learnings: string[]
}

export interface OptimizationResults {
  beforeMetrics: PerformanceMetrics
  afterMetrics: PerformanceMetrics
  improvement: number
  statisticalSignificance: number
  testDuration: number
  sampleSize: number
}

// Content Optimization Algorithms
export interface ContentOptimizer {
  optimizeForTraffic(content: ContentData, context: ContentContext): Promise<ContentOptimization[]>
  optimizeForEngagement(content: ContentData, context: ContentContext): Promise<ContentOptimization[]>
  optimizeForConversions(content: ContentData, context: ContentContext): Promise<ContentOptimization[]>
  optimizeForRevenue(content: ContentData, context: ContentContext): Promise<ContentOptimization[]>
}

// ROI and Performance Tracking
export interface ROICalculator {
  calculateContentROI(
    content: ContentData,
    metrics: PerformanceMetrics,
    costs: ContentCosts
  ): Promise<ROIAnalysis>
  
  calculateCampaignROI(
    campaign: Campaign,
    results: CampaignResults
  ): Promise<ROIAnalysis>
  
  forecastROI(
    strategy: OutcomeStrategy,
    assumptions: ROIAssumptions
  ): Promise<ROIForecast>
}

export interface ContentCosts {
  creationTime: number
  creationCost: number
  promotionCost: number
  toolCosts: number
  opportunityCost: number
}

export interface ROIAnalysis {
  analysisId: string
  totalInvestment: number
  totalReturn: number
  netReturn: number
  roiPercentage: number
  paybackPeriod: number
  breakdownByChannel: ChannelROI[]
  timeToROI: number
  confidenceLevel: number
}

export interface ChannelROI {
  channel: string
  investment: number
  return: number
  roi: number
  attribution: number
}

export interface Campaign {
  campaignId: string
  name: string
  type: string
  content: ContentData[]
  budget: number
  duration: number
  targetMetrics: BusinessMetric[]
}

export interface CampaignResults {
  totalReach: number
  totalEngagement: number
  totalConversions: number
  totalRevenue: number
  costPerAcquisition: number
  lifetimeValue: number
}

export interface ROIAssumptions {
  conversionRate: number
  averageOrderValue: number
  customerLifetimeValue: number
  churnRate: number
  marketGrowthRate: number
}

export interface ROIForecast {
  forecastId: string
  timeHorizon: number
  scenarios: ROIScenario[]
  expectedROI: number
  confidenceInterval: [number, number]
  keyDrivers: string[]
  sensitivityAnalysis: SensitivityFactor[]
}

export interface ROIScenario {
  scenario: 'conservative' | 'expected' | 'optimistic'
  probability: number
  roi: number
  assumptions: string[]
  keyRisks: string[]
}

export interface SensitivityFactor {
  factor: string
  baseValue: number
  impact: number
  elasticity: number
}

// Error Types
export class OutcomeOptimizationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'OutcomeOptimizationError'
  }
}

export class PredictionError extends OutcomeOptimizationError {
  constructor(message: string, details?: any) {
    super(message, 'PREDICTION_ERROR', details)
  }
}

export class OptimizationError extends OutcomeOptimizationError {
  constructor(message: string, details?: any) {
    super(message, 'OPTIMIZATION_ERROR', details)
  }
}

export class ROICalculationError extends OutcomeOptimizationError {
  constructor(message: string, details?: any) {
    super(message, 'ROI_CALCULATION_ERROR', details)
  }
}

export class OutcomeAIError extends OutcomeOptimizationError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, details)
    this.name = 'OutcomeAIError'
  }
}

// Additional interfaces for models
export interface OptimizedContent {
  originalContent: string
  optimizedContent: string
  title: string
  optimizationGoals: OptimizationGoal[]
  appliedOptimizations: AppliedOptimization[]
  predictedOutcomes: OutcomePrediction[]
  seoKeywords: string[]
  engagementHooks: EngagementHook[]
  ctas: CallToAction[]
  monetizationElements: MonetizationElement[]
  qualityScore: number
  confidenceScore: number
}

export interface AppliedOptimization {
  type: string
  description: string
  location: string
  impact: number
  confidence: number
}

export interface EngagementHook {
  type: 'question' | 'statistic' | 'story' | 'controversy' | 'humor'
  content: string
  placement: 'opening' | 'middle' | 'end'
  expectedEngagement: number
}

export interface CallToAction {
  type: 'button' | 'link' | 'form'
  text: string
  action: string
  placement: string
  design: {
    color: string
    size: string
    style: string
    urgency: boolean
    personalization: boolean
  }
  expectedConversion: number
}

export interface MonetizationElement {
  type: 'affiliate_link' | 'product_mention' | 'lead_magnet' | 'cta'
  content: string
  placement: string
  relevanceScore: number
  expectedRevenue: number
  conversionRate: number
}

export interface OptimizationStrategy {
  strategyId: string
  name: string
  description: string
  targetMetrics: BusinessMetric[]
  tactics: any[]
  expectedOutcome: any
  implementation: any
  riskAssessment: any
}

export interface OptimizationRecommendation {
  id: string
  type: string
  description: string
  implementation: string
  expectedImpact: number
  confidence: number
  priority: number
  effort: string
  category: string
}

export interface PerformanceAnalysis {
  contentId: string
  actualVsPredicted: any[]
  successFactors: any[]
  improvementAreas: any[]
  learningInsights: any[]
  confidenceCalibration: number
}

export interface OptimizationGoal {
  metric: BusinessMetric
  weight: number
  constraints: any[]
  acceptableRange: {
    min: number
    max: number
  }
}

export interface PublishingContext {
  platform: string
  scheduledTime: Date
  targetAudience: string
}

export interface ContentVariation {
  id: string
  title: string
  content: string
  optimizationFocus: string
  changes: any[]
  predictedOutcome: OutcomePrediction
  testingPriority: number
}