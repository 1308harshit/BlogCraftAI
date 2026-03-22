// Personal AI Brain - Core Types and Interfaces
// Comprehensive type definitions for the AI brain system

// Core AI Brain Interface
export interface PersonalAIBrain {
  userId: string
  preferences: UserPreferences
  successPatterns: SuccessPattern[]
  learningModel: LearningModel
  adaptationHistory: AdaptationRecord[]
  lastUpdated: Date
  adaptationLevel: number
  confidenceScore: number
}

// User Preferences
export interface UserPreferences {
  brandVoice: BrandVoice
  contentTypes: ContentTypePreference[]
  targetAudience: AudienceProfile
  businessGoals: BusinessGoal[]
  platformPriorities: PlatformPriority[]
  writingStyle: WritingStyle
  tonePreferences: TonePreference[]
  keywordPreferences: string[]
  avoidancePatterns: string[]
}

// Brand Voice Configuration
export interface BrandVoice {
  tone: 'professional' | 'casual' | 'technical' | 'creative' | 'authoritative' | 'friendly'
  personality: string[]
  vocabulary: VocabularyPreference
  communicationStyle: CommunicationStyle
  emotionalTone: EmotionalTone
  formalityLevel: number // 1-10 scale
}

// Vocabulary Preferences
export interface VocabularyPreference {
  preferredTerms: string[]
  avoidedTerms: string[]
  industryJargon: boolean
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  regionalVariations: string[]
}

// Communication Style
export interface CommunicationStyle {
  directness: number // 1-10 scale
  storytelling: boolean
  dataOriented: boolean
  conversational: boolean
  instructional: boolean
  persuasive: boolean
}

// Emotional Tone
export interface EmotionalTone {
  enthusiasm: number // 1-10 scale
  empathy: number
  confidence: number
  urgency: number
  optimism: number
  humor: number
}

// Content Type Preferences
export interface ContentTypePreference {
  type: 'blog' | 'social' | 'email' | 'video_script' | 'podcast_outline' | 'infographic'
  priority: number // 1-10 scale
  preferredLength: 'short' | 'medium' | 'long'
  structurePreferences: StructurePreference
  engagementTactics: EngagementTactic[]
}

// Structure Preferences
export interface StructurePreference {
  useHeadings: boolean
  useBulletPoints: boolean
  useNumberedLists: boolean
  includeIntroduction: boolean
  includeConclusion: boolean
  includeCTA: boolean
  preferredSections: string[]
}

// Engagement Tactics
export interface EngagementTactic {
  type: 'question' | 'statistic' | 'story' | 'quote' | 'controversy' | 'humor' | 'urgency'
  effectiveness: number // 1-10 based on past performance
  frequency: 'always' | 'often' | 'sometimes' | 'rarely' | 'never'
}

// Audience Profile
export interface AudienceProfile {
  demographics: Demographics
  psychographics: Psychographics
  behaviorPatterns: BehaviorPattern[]
  painPoints: string[]
  interests: string[]
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  preferredContentFormats: string[]
}

// Demographics
export interface Demographics {
  ageRange: string
  location: string[]
  occupation: string[]
  incomeLevel: string
  education: string
  gender: string[]
}

// Psychographics
export interface Psychographics {
  values: string[]
  motivations: string[]
  challenges: string[]
  goals: string[]
  lifestyle: string[]
  personalityTraits: string[]
}

// Behavior Patterns
export interface BehaviorPattern {
  pattern: string
  frequency: number
  context: string
  effectiveness: number
  lastObserved: Date
}

// Business Goals
export interface BusinessGoal {
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue' | 'brand_awareness' | 'lead_generation'
  priority: number // 1-10 scale
  target: number
  timeframe: number // days
  metrics: string[]
  currentPerformance: number
}

// Platform Priorities
export interface PlatformPriority {
  platform: string
  priority: number // 1-10 scale
  contentTypes: string[]
  postingFrequency: string
  optimalTimes: string[]
  audienceSize: number
  engagementRate: number
}

// Writing Style
export interface WritingStyle {
  sentenceLength: 'short' | 'medium' | 'long' | 'varied'
  paragraphLength: 'short' | 'medium' | 'long'
  complexity: 'simple' | 'moderate' | 'complex'
  activeVoice: boolean
  firstPerson: boolean
  contractions: boolean
  rhetoricalQuestions: boolean
}

// Tone Preferences
export interface TonePreference {
  context: string
  preferredTone: string
  effectiveness: number
  examples: string[]
}

// Success Patterns
export interface SuccessPattern {
  patternId: string
  patternType: 'content_structure' | 'engagement_hook' | 'cta_placement' | 'timing' | 'topic_angle'
  contentType: string
  platform?: string
  successMetrics: PerformanceMetrics
  contextFactors: ContextFactor[]
  replicationInstructions: string
  confidence: number
  usageCount: number
  lastUsed: Date
  createdAt: Date
}

// Performance Metrics
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

// Context Factors
export interface ContextFactor {
  factor: string
  value: string | number
  importance: number // 1-10 scale
  correlation: number // -1 to 1
}

// Learning Model
export interface LearningModel {
  modelType: 'neural_network' | 'decision_tree' | 'ensemble' | 'transformer'
  version: string
  trainingData: TrainingDataSummary
  accuracy: number
  lastTrained: Date
  parameters: ModelParameters
  performance: ModelPerformance
}

// Training Data Summary
export interface TrainingDataSummary {
  totalSamples: number
  successfulSamples: number
  failedSamples: number
  contentTypes: Record<string, number>
  platforms: Record<string, number>
  dateRange: {
    start: Date
    end: Date
  }
}

// Model Parameters
export interface ModelParameters {
  learningRate: number
  regularization: number
  hiddenLayers?: number
  neurons?: number
  epochs?: number
  batchSize?: number
  [key: string]: any
}

// Model Performance
export interface ModelPerformance {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  auc: number
  confusionMatrix?: number[][]
  featureImportance?: Record<string, number>
}

// Adaptation Records
export interface AdaptationRecord {
  recordId: string
  adaptationType: 'preference_update' | 'pattern_learning' | 'performance_adjustment' | 'strategy_change'
  trigger: AdaptationTrigger
  changes: AdaptationChange[]
  impact: AdaptationImpact
  confidence: number
  timestamp: Date
  validatedAt?: Date
  rollbackData?: any
}

// Adaptation Trigger
export interface AdaptationTrigger {
  type: 'performance_feedback' | 'user_feedback' | 'pattern_detection' | 'scheduled_update'
  source: string
  data: any
  threshold?: number
}

// Adaptation Changes
export interface AdaptationChange {
  field: string
  oldValue: any
  newValue: any
  reason: string
  confidence: number
}

// Adaptation Impact
export interface AdaptationImpact {
  expectedImprovement: number
  actualImprovement?: number
  affectedMetrics: string[]
  riskLevel: 'low' | 'medium' | 'high'
  rollbackPossible: boolean
}

// Learning Engine Interface
export interface LearningEngine {
  analyzePerformance(content: ContentData, metrics: PerformanceMetrics): Promise<LearningInsight>
  updateModel(insights: LearningInsight[]): Promise<ModelUpdate>
  predictOptimalStrategy(context: ContentContext): Promise<OptimizationStrategy>
  adaptToFeedback(feedback: UserFeedback): Promise<AdaptationResult>
  identifySuccessPatterns(contentHistory: ContentData[]): Promise<SuccessPattern[]>
  generateRecommendations(context: ContentContext): Promise<ContentRecommendation[]>
}

// Content Data
export interface ContentData {
  id: string
  userId: string
  type: string
  title: string
  content: string
  metadata: ContentMetadata
  performance: PerformanceMetrics
  context: ContentContext
  createdAt: Date
  publishedAt?: Date
}

// Content Metadata
export interface ContentMetadata {
  keywords: string[]
  targetAudience: string
  brandVoice: string
  platform?: string
  contentGoals: string[]
  seoScore: number
  viralScore: number
  readingTime: number
  wordCount: number
  language: string
  sentiment: number
  complexity: number
}

// Content Context
export interface ContentContext {
  userId: string
  contentType: string
  platform?: string
  targetAudience: string
  businessGoals: string[]
  competitorContext?: CompetitorContext
  trendContext?: TrendContext
  seasonalContext?: SeasonalContext
}

// Competitor Context
export interface CompetitorContext {
  competitors: string[]
  topPerformingContent: ContentData[]
  contentGaps: string[]
  opportunities: string[]
}

// Trend Context
export interface TrendContext {
  trendingTopics: string[]
  trendingKeywords: string[]
  viralPatterns: string[]
  seasonalTrends: string[]
}

// Seasonal Context
export interface SeasonalContext {
  season: string
  holidays: string[]
  events: string[]
  historicalPerformance: Record<string, number>
}

// Learning Insights
export interface LearningInsight {
  insightId: string
  type: 'success_pattern' | 'failure_pattern' | 'preference_drift' | 'performance_correlation'
  description: string
  confidence: number
  evidence: Evidence[]
  recommendations: string[]
  impact: InsightImpact
  createdAt: Date
}

// Evidence
export interface Evidence {
  type: 'performance_data' | 'user_behavior' | 'content_analysis' | 'external_data'
  source: string
  data: any
  weight: number
  reliability: number
}

// Insight Impact
export interface InsightImpact {
  affectedAreas: string[]
  expectedImprovement: number
  confidence: number
  timeToImpact: number // days
  riskLevel: 'low' | 'medium' | 'high'
}

// Model Updates
export interface ModelUpdate {
  updateId: string
  updateType: 'parameter_adjustment' | 'architecture_change' | 'training_data_update' | 'feature_addition'
  changes: ModelChange[]
  expectedImpact: ModelImpact
  rollbackData: any
  timestamp: Date
}

// Model Changes
export interface ModelChange {
  component: string
  changeType: string
  oldValue: any
  newValue: any
  reason: string
}

// Model Impact
export interface ModelImpact {
  accuracyChange: number
  performanceChange: number
  confidenceChange: number
  affectedFeatures: string[]
}

// Optimization Strategy
export interface OptimizationStrategy {
  strategyId: string
  strategyType: 'content_optimization' | 'timing_optimization' | 'platform_optimization' | 'audience_optimization'
  recommendations: StrategyRecommendation[]
  expectedOutcome: ExpectedOutcome
  confidence: number
  priority: number
  implementationSteps: string[]
  validationMetrics: string[]
}

// Strategy Recommendations
export interface StrategyRecommendation {
  type: string
  description: string
  implementation: string
  expectedImpact: number
  confidence: number
  priority: number
}

// Expected Outcome
export interface ExpectedOutcome {
  metrics: Record<string, number>
  timeframe: number // days
  confidence: number
  riskFactors: string[]
}

// User Feedback
export interface UserFeedback {
  feedbackId: string
  userId: string
  contentId?: string
  feedbackType: 'rating' | 'preference' | 'correction' | 'suggestion'
  rating?: number // 1-10 scale
  feedback: string
  category: string
  timestamp: Date
  processed: boolean
}

// Adaptation Result
export interface AdaptationResult {
  resultId: string
  adaptationType: string
  success: boolean
  changes: AdaptationChange[]
  impact: AdaptationImpact
  nextSteps: string[]
  monitoringPlan: MonitoringPlan
}

// Monitoring Plan
export interface MonitoringPlan {
  metrics: string[]
  checkpoints: Date[]
  thresholds: Record<string, number>
  rollbackTriggers: string[]
}

// Content Recommendations
export interface ContentRecommendation {
  recommendationId: string
  type: 'topic' | 'structure' | 'tone' | 'timing' | 'platform' | 'cta'
  title: string
  description: string
  rationale: string
  confidence: number
  expectedImpact: number
  implementation: string
  priority: number
  validUntil: Date
}

// API Request/Response Types
export interface BrainLearningRequest {
  userId: string
  contentId: string
  performanceData: PerformanceMetrics
  userFeedback?: UserFeedback
  context?: ContentContext
}

export interface BrainLearningResponse {
  success: boolean
  insights: LearningInsight[]
  adaptations: AdaptationRecord[]
  updatedModel: boolean
  message: string
}

export interface RecommendationRequest {
  userId: string
  contentType: string
  context: ContentContext
  preferences?: Partial<UserPreferences>
}

export interface RecommendationResponse {
  strategy: OptimizationStrategy
  confidence: number
  reasoning: string
  alternatives: AlternativeStrategy[]
  implementation: ImplementationGuide
}

// Alternative Strategy
export interface AlternativeStrategy {
  strategyId: string
  description: string
  confidence: number
  expectedOutcome: ExpectedOutcome
  tradeoffs: string[]
}

// Implementation Guide
export interface ImplementationGuide {
  steps: ImplementationStep[]
  timeline: string
  resources: string[]
  successMetrics: string[]
  checkpoints: string[]
}

// Implementation Step
export interface ImplementationStep {
  stepId: string
  description: string
  order: number
  estimatedTime: string
  dependencies: string[]
  validation: string
}

// Error Types
export class AIBrainError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'AIBrainError'
  }
}

export class LearningError extends AIBrainError {
  constructor(message: string, details?: any) {
    super(message, 'LEARNING_ERROR', details)
  }
}

export class AdaptationError extends AIBrainError {
  constructor(message: string, details?: any) {
    super(message, 'ADAPTATION_ERROR', details)
  }
}

export class ModelError extends AIBrainError {
  constructor(message: string, details?: any) {
    super(message, 'MODEL_ERROR', details)
  }
}