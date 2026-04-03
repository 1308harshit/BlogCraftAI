// Business Intelligence System - Type Definitions
// Advanced analytics, forecasting, and insights

export interface BusinessMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  changePercentage: number
  timestamp: Date
}

export interface Forecast {
  metric: string
  currentValue: number
  forecastedValue: number
  confidenceInterval: {
    lower: number
    upper: number
  }
  confidence: number
  timeframe: string
  methodology: string
  factors: string[]
}

export interface GrowthOpportunity {
  id: string
  title: string
  description: string
  category: 'content' | 'channel' | 'monetization' | 'audience' | 'technical'
  potentialImpact: {
    revenue: number
    traffic: number
    engagement: number
  }
  effort: 'low' | 'medium' | 'high'
  priority: number
  confidence: number
  actionItems: string[]
  estimatedTimeframe: string
}

export interface CustomerJourney {
  stage: 'awareness' | 'consideration' | 'decision' | 'retention' | 'advocacy'
  touchpoints: number
  averageTime: number // days
  conversionRate: number
  dropoffRate: number
  topContent: string[]
  topChannels: string[]
  recommendations: string[]
}

export interface PerformanceInsight {
  id: string
  type: 'success' | 'warning' | 'opportunity' | 'trend'
  category: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  metrics: Record<string, number>
  recommendations: string[]
  priority: number
  detectedAt: Date
}

export interface CompetitorAnalysis {
  competitor: string
  metrics: {
    estimatedTraffic: number
    contentVolume: number
    engagementRate: number
    topKeywords: string[]
    contentGaps: string[]
  }
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface TrendAnalysis {
  trend: string
  category: string
  momentum: 'rising' | 'stable' | 'declining'
  growthRate: number
  searchVolume: number
  competition: 'low' | 'medium' | 'high'
  seasonality: boolean
  peakMonths: string[]
  recommendations: string[]
}

export interface RevenueBreakdown {
  source: string
  revenue: number
  percentage: number
  growth: number
  trend: 'up' | 'down' | 'stable'
}

export interface AudienceSegment {
  id: string
  name: string
  size: number
  characteristics: Record<string, any>
  behavior: {
    averageSessionDuration: number
    pagesPerSession: number
    conversionRate: number
    lifetimeValue: number
  }
  topContent: string[]
  topChannels: string[]
  growthRate: number
}
