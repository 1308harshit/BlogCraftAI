// Multi-Platform Domination System - Type Definitions
// Platform-specific content adaptation and management

export type PlatformType = 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok' | 'medium' | 'facebook' | 'blog'

export type ContentFormat = 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'thread' | 'article'

// Platform Configuration
export interface PlatformConfig {
  name: PlatformType
  displayName: string
  constraints: PlatformConstraints
  algorithm: AlgorithmProfile
  optimalTiming: OptimalTiming
  supportedFormats: ContentFormat[]
}

// Platform Constraints
export interface PlatformConstraints {
  maxLength: number
  minLength?: number
  maxHashtags: number
  maxMentions?: number
  supportedFormats: ContentFormat[]
  imageRequirements?: ImageRequirements
  videoRequirements?: VideoRequirements
  characterEncoding?: string
  linkHandling?: 'inline' | 'end' | 'bio'
}

export interface ImageRequirements {
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
  aspectRatios: string[]
  maxFileSize: number // in MB
  formats: string[]
}

export interface VideoRequirements {
  minDuration: number // seconds
  maxDuration: number
  maxFileSize: number // in MB
  formats: string[]
  aspectRatios: string[]
}

// Algorithm Profile
export interface AlgorithmProfile {
  prioritizes: string[]
  penalizes: string[]
  optimalPostingFrequency: {
    min: number
    max: number
    unit: 'hour' | 'day' | 'week'
  }
  engagementWindow: number // hours
  viralityFactors: string[]
}

// Optimal Timing
export interface OptimalTiming {
  bestDays: string[]
  bestHours: number[]
  timezone: string
  audienceActivityPeaks: number[]
}

// Platform Content
export interface PlatformContent {
  id?: string
  contentId: string
  platform: PlatformType
  adaptedContent: string
  format: ContentFormat
  metadata: PlatformMetadata
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledTime?: Date
  publishedTime?: Date
  performanceMetrics?: PerformanceMetrics
}

export interface PlatformMetadata {
  hashtags?: string[]
  mentions?: string[]
  mediaUrls?: string[]
  thumbnailUrl?: string
  title?: string
  description?: string
  tags?: string[]
  category?: string
  customFields?: Record<string, any>
}

// Performance Metrics
export interface PerformanceMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  clicks: number
  engagement: number
  reach: number
  impressions: number
  saves?: number
  retweets?: number
  lastUpdated: Date
}

// Content Adaptation Request
export interface AdaptationRequest {
  content: string
  title?: string
  targetPlatform: PlatformType
  targetFormat?: ContentFormat
  userId: string
  brandVoice?: string
  targetAudience?: string
  keywords?: string[]
  includeHashtags?: boolean
  includeCTA?: boolean
  optimizeForViral?: boolean
}

// Adapted Content Result
export interface AdaptedContent {
  platform: PlatformType
  format: ContentFormat
  content: string
  metadata: PlatformMetadata
  optimizations: string[]
  viralScore?: number
  estimatedReach?: number
  warnings?: string[]
}

// Multi-Platform Publishing
export interface PublishingSchedule {
  platforms: PlatformType[]
  scheduleStrategy: 'immediate' | 'optimal' | 'custom'
  customTimes?: Record<PlatformType, Date>
  timezone?: string
  staggerDelay?: number // minutes between posts
}

export interface PublishingResult {
  platform: PlatformType
  success: boolean
  platformContentId?: string
  scheduledTime?: Date
  publishedTime?: Date
  error?: string
}

// Cross-Platform Analytics
export interface CrossPlatformMetrics {
  contentId: string
  totalReach: number
  totalEngagement: number
  totalClicks: number
  platformBreakdown: Record<PlatformType, PerformanceMetrics>
  bestPerformingPlatform: PlatformType
  worstPerformingPlatform: PlatformType
  overallEngagementRate: number
  lastUpdated: Date
}

// Platform Strategy
export interface PlatformStrategy {
  platform: PlatformType
  contentTypes: ContentFormat[]
  postingFrequency: number
  optimalTimes: Date[]
  hashtagStrategy: string[]
  engagementTactics: string[]
  performanceGoals: Record<string, number>
}
