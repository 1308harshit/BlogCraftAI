// Monetization Engine - Types and Interfaces
// Type definitions for affiliate management, CTA generation, and funnel creation

export interface AffiliateProduct {
  id: string
  name: string
  description: string
  category: string
  commission: number
  commissionType: 'percentage' | 'fixed'
  affiliateLink: string
  relevanceScore: number
  conversionRate: number
  averageOrderValue: number
  provider: string
  imageUrl?: string
  price?: number
  rating?: number
}

export interface AffiliateEngine {
  findRelevantProducts(content: string, context: ContentContext): Promise<AffiliateProduct[]>
  insertAffiliateLinks(content: string, products: AffiliateProduct[]): Promise<MonetizedContent>
  trackConversions(contentId: string): Promise<ConversionMetrics>
  optimizeAffiliateStrategy(performanceData: AffiliatePerformance): Promise<OptimizationStrategy>
}

export interface ContentContext {
  contentId?: string
  userId: string
  topic: string
  keywords: string[]
  targetAudience: string
  contentType: 'blog' | 'social' | 'email' | 'video_script'
  platform?: string
}

export interface MonetizedContent {
  originalContent: string
  monetizedContent: string
  insertedProducts: InsertedProduct[]
  totalInsertions: number
  averageRelevance: number
  estimatedRevenue: number
  optimizationSuggestions: string[]
}

export interface InsertedProduct {
  product: AffiliateProduct
  insertionType: 'inline_link' | 'product_card' | 'comparison_table' | 'recommendation_box'
  position: number
  contextSnippet: string
  relevanceScore: number
  naturalness: number
}

export interface ConversionMetrics {
  contentId: string
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  conversionRate: number
  averageOrderValue: number
  clicksByProduct: ProductClickMetrics[]
  conversionsByProduct: ProductConversionMetrics[]
  timeframe: {
    start: Date
    end: Date
  }
}

export interface ProductClickMetrics {
  productId: string
  productName: string
  clicks: number
  clickRate: number
  position: number
}

export interface ProductConversionMetrics {
  productId: string
  productName: string
  conversions: number
  revenue: number
  conversionRate: number
  commission: number
}

export interface AffiliatePerformance {
  contentId: string
  userId: string
  period: {
    start: Date
    end: Date
  }
  metrics: ConversionMetrics
  productPerformance: ProductPerformanceData[]
  insertionTypePerformance: InsertionTypePerformance[]
  contextualRelevance: number
}

export interface ProductPerformanceData {
  product: AffiliateProduct
  clicks: number
  conversions: number
  revenue: number
  roi: number
  relevanceScore: number
}

export interface InsertionTypePerformance {
  type: 'inline_link' | 'product_card' | 'comparison_table' | 'recommendation_box'
  count: number
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number
}

export interface OptimizationStrategy {
  strategyId: string
  recommendations: OptimizationRecommendation[]
  productReplacements: ProductReplacement[]
  insertionAdjustments: InsertionAdjustment[]
  expectedImpact: {
    revenueIncrease: number
    conversionRateIncrease: number
    relevanceImprovement: number
  }
  confidence: number
}

export interface OptimizationRecommendation {
  type: 'product_selection' | 'insertion_placement' | 'insertion_type' | 'content_adjustment'
  description: string
  action: string
  expectedImpact: number
  priority: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
}

export interface ProductReplacement {
  currentProduct: AffiliateProduct
  suggestedProduct: AffiliateProduct
  reason: string
  expectedImprovement: number
}

export interface InsertionAdjustment {
  productId: string
  currentPosition: number
  suggestedPosition: number
  currentType: string
  suggestedType: string
  reason: string
}

export interface AffiliateConversion {
  id: string
  contentId: string
  userId: string
  productId: string
  clickedAt: Date
  convertedAt?: Date
  orderValue: number
  commission: number
  status: 'pending' | 'confirmed' | 'cancelled'
  metadata: Record<string, any>
}

// CTA Generation and Optimization Types
export interface CTAGenerationRequest {
  content: string
  context: ContentContext
  goal: ConversionGoal
  targetAudience?: string
  brandVoice?: string
}

export interface ConversionGoal {
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue' | 'lead_generation'
  targetAction: string
  targetValue: number
  priority: number
}

export interface CTA {
  id: string
  text: string
  type: 'button' | 'link' | 'form' | 'popup'
  placement: CTAPlacement
  design: CTADesign
  targetAction: string
  goal: ConversionGoal
  expectedConversion: number
  performanceMetrics?: CTAPerformanceMetrics
  createdAt: Date
}

export interface CTAPlacement {
  location: 'header' | 'inline' | 'sidebar' | 'footer' | 'popup' | 'exit_intent'
  position: number
  context: string
}

export interface CTADesign {
  color: string
  size: 'small' | 'medium' | 'large'
  style: 'primary' | 'secondary' | 'outline' | 'text'
  urgency: boolean
  personalization: boolean
  animation?: string
}

export interface CTAPerformanceMetrics {
  impressions: number
  clicks: number
  conversions: number
  clickThroughRate: number
  conversionRate: number
  revenue: number
  lastUpdated: Date
}

export interface OptimizedCTA extends CTA {
  optimizations: CTAOptimization[]
  abTestResults?: ABTestResults
  confidence: number
}

export interface CTAOptimization {
  type: 'text' | 'design' | 'placement' | 'timing'
  description: string
  oldValue: any
  newValue: any
  expectedImpact: number
  reason: string
}

export interface ABTestResults {
  testId: string
  variants: CTAVariant[]
  winner?: CTAVariant
  statisticalSignificance: number
  testDuration: number
  totalSamples: number
}

export interface CTAVariant {
  variantId: string
  cta: CTA
  impressions: number
  clicks: number
  conversions: number
  conversionRate: number
  confidence: number
}

export interface CTATestConfig {
  variants: CTA[]
  trafficSplit: number[]
  successMetric: 'clicks' | 'conversions' | 'revenue'
  minSampleSize: number
  maxDuration: number
  significanceThreshold: number
}

export interface CTAGenerator {
  generateCTA(request: CTAGenerationRequest): Promise<CTA>
  optimizeCTA(cta: CTA, performanceData: CTAPerformanceMetrics): Promise<OptimizedCTA>
  createABTest(baseCTA: CTA, variationCount?: number): Promise<CTATestConfig>
  analyzeABTest(testConfig: CTATestConfig, results: CTAVariant[]): Promise<ABTestResults>
}

// Monetization Performance Optimization Types
export interface MonetizationPerformance {
  contentId: string
  totalRevenue: number
  totalConversions: number
  averageConversionRate: number
  elementPerformance: ElementPerformanceMetrics[]
  topPerformers: ElementPerformanceMetrics[]
  underperformers: ElementPerformanceMetrics[]
  recommendations: string[]
  lastAnalyzed: Date
}

export interface ElementPerformanceMetrics {
  elementId: string
  elementType: string
  contentTitle?: string
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  clickThroughRate: number
  conversionRate: number
  revenuePerImpression: number
  revenuePerClick: number
  placement: any
  lastUpdated: Date
}

export interface RevenueAttribution {
  contentId: string
  attributionModel: 'first-touch' | 'last-touch' | 'multi-touch' | 'position-based'
  totalRevenue: number
  attributionBreakdown: AttributionBreakdownItem[]
  conversionPaths: ConversionPath[]
  confidence: number
  lastUpdated: Date
}

export interface AttributionBreakdownItem {
  elementId: string
  elementType: string
  attributedRevenue: number
  directRevenue: number
  attributionPercentage: number
  conversionCount: number
}

export interface ConversionPath {
  conversionId: string
  touchpoints: Touchpoint[]
  revenue: number
  timestamp: Date
}

export interface Touchpoint {
  elementId: string
  elementType: string
  timestamp: Date
  action: string
}

export interface MonetizationOptimization {
  contentId: string
  currentPerformance: MonetizationPerformance
  optimizations: OptimizationRecommendation[]
  expectedRevenueIncrease: number
  expectedConversionRateIncrease: number
  implementationPriority: OptimizationRecommendation[]
  confidence: number
  createdAt: Date
}

export interface OptimizationRecommendation {
  elementId: string
  type: 'placement' | 'content' | 'element_type' | 'replication' | 'timing'
  description: string
  currentValue: any
  suggestedValue: any
  expectedImpact: number
  priority: 'high' | 'medium' | 'low'
  reason: string
}

export interface MonetizationStrategy {
  strategyId: string
  contentId: string
  strategyType: 'aggressive' | 'balanced' | 'conservative'
  elements: MonetizationElement[]
  expectedRevenue: number
  expectedConversionRate: number
  riskLevel: 'low' | 'medium' | 'high'
  createdAt: Date
}

export interface MonetizationElement {
  elementId: string
  type: 'affiliate_link' | 'cta' | 'lead_magnet' | 'product_card' | 'recommendation_box'
  content: string
  placement: any
  targetRevenue: number
  priority: number
}

export interface MonetizationTest {
  testId: string
  contentId: string
  testType: 'placement' | 'element_type' | 'copy' | 'timing'
  elementId: string
  variants: TestVariant[]
  trafficSplit: number[]
  successMetric: 'revenue' | 'conversions' | 'clicks'
  status: 'running' | 'completed' | 'paused'
  startedAt: Date
  endedAt?: Date
  minSampleSize: number
  maxDuration: number
}

export interface TestVariant {
  variantId: string
  description: string
  changes: Record<string, any>
}

export interface MonetizationTestResults {
  testId: string
  test: MonetizationTest
  variantResults: VariantResult[]
  winner?: VariantResult
  statisticalSignificance: number
  testDuration: number
  totalSamples: number
  recommendation: string
  completedAt: Date
}

export interface VariantResult {
  variantId: string
  variant: TestVariant
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  conversionRate: number
}

// Error types
export class MonetizationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'MonetizationError'
  }
}

export class AffiliateEngineError extends MonetizationError {
  constructor(message: string, details?: any) {
    super(message, 'AFFILIATE_ENGINE_ERROR', details)
  }
}

export class ConversionTrackingError extends MonetizationError {
  constructor(message: string, details?: any) {
    super(message, 'CONVERSION_TRACKING_ERROR', details)
  }
}

export class CTAGenerationError extends MonetizationError {
  constructor(message: string, details?: any) {
    super(message, 'CTA_GENERATION_ERROR', details)
  }
}
