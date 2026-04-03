// Revenue Attribution System - Type Definitions
// Multi-touch attribution and revenue tracking

export type AttributionModel = 
  | 'first_touch'
  | 'last_touch'
  | 'linear'
  | 'time_decay'
  | 'position_based'
  | 'data_driven'

export type TouchpointType =
  | 'organic_search'
  | 'paid_search'
  | 'social_media'
  | 'email'
  | 'direct'
  | 'referral'
  | 'content'
  | 'affiliate'

export interface Touchpoint {
  id: string
  userId: string
  sessionId: string
  type: TouchpointType
  source: string
  medium: string
  campaign?: string
  contentId?: string
  timestamp: Date
  value: number
  metadata: Record<string, any>
}

export interface ConversionPath {
  id: string
  userId: string
  touchpoints: Touchpoint[]
  conversionValue: number
  conversionType: string
  conversionDate: Date
  pathLength: number
  timeToConversion: number // hours
}

export interface AttributionResult {
  touchpointId: string
  type: TouchpointType
  source: string
  attributedRevenue: number
  attributionWeight: number
  model: AttributionModel
  confidence: number
}

export interface RevenueAttribution {
  conversionPathId: string
  totalRevenue: number
  attributions: AttributionResult[]
  model: AttributionModel
  calculatedAt: Date
}

export interface RevenueMetrics {
  totalRevenue: number
  attributedRevenue: number
  unattributedRevenue: number
  averageOrderValue: number
  conversionRate: number
  customerLifetimeValue: number
  returnOnAdSpend: number
  costPerAcquisition: number
}

export interface ChannelPerformance {
  channel: TouchpointType
  revenue: number
  conversions: number
  touchpoints: number
  averagePosition: number
  conversionRate: number
  roi: number
  cost: number
}

export interface ContentROI {
  contentId: string
  title: string
  platform: string
  revenue: number
  cost: number
  roi: number
  conversions: number
  assistedConversions: number
  touchpoints: number
  averagePosition: number
}
