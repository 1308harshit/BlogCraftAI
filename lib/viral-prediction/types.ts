// Viral Prediction Engine - Types and Interfaces
// Type definitions for viral content prediction and analysis

export interface ViralPredictionEngine {
  predictViralScore(content: string, context: ViralContext): Promise<ViralScore>
  analyzeViralPotential(content: string): Promise<ViralAnalysis>
  optimizeForVirality(content: string, targetScore: number): Promise<ViralOptimization>
  extractViralElements(content: string): Promise<ViralElement[]>
}

export interface ViralScore {
  scoreId: string
  contentId?: string
  overallScore: number // 0-100
  confidence: number // 0-1
  viralProbability: number // 0-1
  expectedReach: number
  expectedShares: number
  peakTime: Date
  components: ViralScoreComponents
  factors: ViralFactor[]
  predictions: ViralPrediction[]
  createdAt: Date
}

export interface ViralScoreComponents {
  emotionalTrigger: number // 0-100
  structureScore: number // 0-100
  timingScore: number // 0-100
  platformFit: number // 0-100
  audienceAlignment: number // 0-100
  noveltyScore: number // 0-100
  shareability: number // 0-100
}

export interface ViralFactor {
  factor: string
  impact: number // -1 to 1
  confidence: number
  description: string
  category: 'emotional' | 'structural' | 'timing' | 'platform' | 'audience'
  weight: number
}

export interface ViralPrediction {
  timeframe: number // hours
  expectedViews: number
  expectedShares: number
  expectedEngagement: number
  confidence: number
  peakHour: number
}

export interface ViralContext {
  platform: string
  targetAudience: string
  publishTime: Date
  currentTrends: string[]
  competitorActivity: number
}

export interface ViralAnalysis {
  analysisId: string
  contentId?: string
  viralScore: ViralScore
  strengths: ViralStrength[]
  weaknesses: ViralWeakness[]
  opportunities: ViralOpportunity[]
  recommendations: ViralRecommendation[]
  competitorComparison: CompetitorComparison
  analyzedAt: Date
}

export interface ViralStrength {
  element: string
  score: number
  description: string
  examples: string[]
}

export interface ViralWeakness {
  element: string
  score: number
  description: string
  impact: number
  suggestions: string[]
}

export interface ViralOpportunity {
  opportunity: string
  potentialImpact: number
  effort: 'low' | 'medium' | 'high'
  priority: number
  implementation: string[]
}

export interface ViralRecommendation {
  recommendationId: string
  type: 'content' | 'timing' | 'platform' | 'audience'
  title: string
  description: string
  expectedImpact: number
  confidence: number
  priority: number
}

export interface CompetitorComparison {
  averageCompetitorScore: number
  yourScore: number
  percentile: number
  gap: number
  competitorStrengths: string[]
}

export interface ViralOptimization {
  optimizationId: string
  originalContent: string
  optimizedContent: string
  originalScore: number
  optimizedScore: number
  improvement: number
  changes: ViralChange[]
  expectedOutcome: ViralOutcome
}

export interface ViralChange {
  changeId: string
  type: 'emotional' | 'structural' | 'timing' | 'hook' | 'cta'
  description: string
  before: string
  after: string
  impact: number
  confidence: number
}

export interface ViralOutcome {
  expectedViews: number
  expectedShares: number
  expectedEngagement: number
  viralProbability: number
  timeToViral: number // hours
  confidence: number
}

export interface ViralElement {
  elementId: string
  type: 'hook' | 'trigger' | 'story' | 'controversy' | 'humor' | 'surprise'
  content: string
  position: number
  strength: number
  viralPotential: number
}

// ML Feature Extraction
export interface ViralFeatures {
  emotionalFeatures: EmotionalFeatures
  structuralFeatures: StructuralFeatures
  timingFeatures: TimingFeatures
  linguisticFeatures: LinguisticFeatures
}

export interface EmotionalFeatures {
  sentiment: number // -1 to 1
  emotionalIntensity: number // 0-1
  emotionalVariety: number // 0-1
  primaryEmotion: string
  emotionalArc: number[]
  triggers: EmotionalTrigger[]
}

export interface EmotionalTrigger {
  type: 'joy' | 'surprise' | 'anger' | 'fear' | 'sadness' | 'disgust' | 'anticipation'
  intensity: number
  position: number
  context: string
}

export interface StructuralFeatures {
  length: number
  paragraphCount: number
  sentenceCount: number
  avgSentenceLength: number
  headingCount: number
  listCount: number
  imageCount: number
  linkCount: number
  readabilityScore: number
  structurePattern: string
}

export interface TimingFeatures {
  dayOfWeek: number
  hourOfDay: number
  seasonality: number
  trendAlignment: number
  competitorActivity: number
  optimalTimingScore: number
}

export interface LinguisticFeatures {
  vocabularyRichness: number
  readingLevel: number
  powerWords: string[]
  questionCount: number
  exclamationCount: number
  personalPronouns: number
  actionVerbs: number
}

// Error types
export class ViralPredictionError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'ViralPredictionError'
  }
}
