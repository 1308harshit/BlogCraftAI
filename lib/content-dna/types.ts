// Content DNA Analyzer - Type Definitions
// Pattern recognition and success element identification

export interface ContentDNA {
  id: string
  contentId: string
  structure: ContentStructure
  style: ContentStyle
  elements: ContentElement[]
  successFactors: SuccessFactor[]
  viralTriggers: string[]
  emotionalProfile: EmotionalProfile
  readabilityScore: number
  seoScore: number
  engagementPotential: number
  analyzedAt: Date
}

export interface ContentStructure {
  wordCount: number
  paragraphCount: number
  sentenceCount: number
  averageSentenceLength: number
  headingCount: number
  listCount: number
  imageCount: number
  videoCount: number
  linkCount: number
  codeBlockCount: number
  quoteCount: number
}

export interface ContentStyle {
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'humorous' | 'inspirational'
  voice: 'first_person' | 'second_person' | 'third_person'
  complexity: 'simple' | 'moderate' | 'complex'
  formality: 'informal' | 'neutral' | 'formal'
  sentiment: 'positive' | 'neutral' | 'negative'
  readingLevel: number // Grade level
}

export interface ContentElement {
  type: 'hook' | 'story' | 'data' | 'example' | 'cta' | 'question' | 'quote' | 'list' | 'visual'
  position: number
  content: string
  effectiveness: number
  impact: 'high' | 'medium' | 'low'
}

export interface SuccessFactor {
  factor: string
  category: 'structure' | 'style' | 'timing' | 'topic' | 'format' | 'distribution'
  importance: number
  correlation: number
  examples: string[]
  recommendations: string[]
}

export interface EmotionalProfile {
  primaryEmotion: string
  emotionalIntensity: number
  emotionalArc: 'rising' | 'falling' | 'stable' | 'rollercoaster'
  triggers: string[]
  resonanceScore: number
}

export interface SuccessPattern {
  id: string
  name: string
  description: string
  category: string
  occurrences: number
  averagePerformance: {
    views: number
    engagement: number
    conversions: number
    shares: number
  }
  characteristics: string[]
  examples: string[]
  replicability: number
  confidence: number
}

export interface ContentTemplate {
  id: string
  name: string
  description: string
  structure: string[]
  elements: ContentElement[]
  successRate: number
  averagePerformance: Record<string, number>
  bestFor: string[]
  examples: string[]
}

export interface PerformanceCorrelation {
  element: string
  metric: string
  correlation: number
  significance: number
  sampleSize: number
  recommendation: string
}
