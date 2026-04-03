// A/B Testing System - Type Definitions
// Automated testing for headlines, hooks, CTAs, and formats

export interface ABTest {
  id: string
  name: string
  type: 'headline' | 'hook' | 'cta' | 'format' | 'image' | 'layout'
  status: 'draft' | 'running' | 'completed' | 'paused'
  variants: TestVariant[]
  trafficAllocation: Record<string, number>
  startDate: Date
  endDate?: Date
  targetMetric: 'clicks' | 'conversions' | 'engagement' | 'revenue'
  minimumSampleSize: number
  confidenceLevel: number
  winner?: string
  results?: TestResults
  createdAt: Date
  updatedAt: Date
}

export interface TestVariant {
  id: string
  name: string
  content: string
  isControl: boolean
  metrics: VariantMetrics
  sampleSize: number
}

export interface VariantMetrics {
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  engagement: number
  bounceRate: number
  timeOnPage: number
}

export interface TestResults {
  winner: string
  confidence: number
  improvement: number
  statisticalSignificance: boolean
  pValue: number
  variantPerformance: Record<string, VariantPerformance>
  recommendation: string
  insights: string[]
}

export interface VariantPerformance {
  variantId: string
  conversionRate: number
  clickThroughRate: number
  engagementRate: number
  revenuePerVisitor: number
  relativeImprovement: number
  confidence: number
}

export interface TestConfig {
  minSampleSize: number
  maxDuration: number // days
  confidenceLevel: number
  trafficSplit: 'even' | 'weighted' | 'adaptive'
  autoImplementWinner: boolean
}

export interface OptimizationRecommendation {
  testId: string
  type: string
  priority: 'high' | 'medium' | 'low'
  description: string
  expectedImpact: number
  effort: 'low' | 'medium' | 'high'
  suggestedVariants: string[]
}