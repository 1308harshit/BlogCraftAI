// Adaptive Strategy Adjustment System
// Automatically adjusts content strategies based on performance data

import { query, queryWithMetrics } from '../database/connection'
import {
  BusinessMetric,
  PerformanceMetrics,
  OptimizationStrategy,
  ContentData,
  OutcomeAIError
} from './types'
import { performanceTracker } from './performance-tracker'
import { outcomeOptimizer } from './outcome-optimizer'
import { getAIBrainConfig } from '../config'

// Get configuration
const config = getAIBrainConfig()

export interface PerformanceBenchmark {
  metricType: string
  expectedValue: number
  actualValue: number
  variance: number
  status: 'exceeding' | 'meeting' | 'below' | 'critical'
}

export interface StrategyAdjustment {
  adjustmentId: string
  contentId: string
  reason: string
  originalStrategy: string
  newStrategy: string
  expectedImpact: number
  confidence: number
  appliedAt: Date
}

export interface PerformanceGap {
  metric: string
  target: number
  actual: number
  gap: number
  gapPercentage: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export class AdaptiveStrategyEngine {
  private static instance: AdaptiveStrategyEngine
  private adjustmentThreshold = config.adaptation.performanceDropThreshold

  static getInstance(): AdaptiveStrategyEngine {
    if (!AdaptiveStrategyEngine.instance) {
      AdaptiveStrategyEngine.instance = new AdaptiveStrategyEngine()
    }
    return AdaptiveStrategyEngine.instance
  }

  // Monitor content performance and trigger adjustments
  async monitorAndAdjust(
    userId: string,
    contentId: string,
    targetMetrics: BusinessMetric[]
  ): Promise<StrategyAdjustment | null> {
    try {
      // Get current performance
      const currentMetrics = await performanceTracker.getCurrentMetrics(contentId)
      if (!currentMetrics) return null

      // Identify performance gaps
      const gaps = this.identifyPerformanceGaps(currentMetrics, targetMetrics)
      
      // Check if adjustment is needed
      const needsAdjustment = gaps.some(gap => 
        gap.severity === 'critical' || gap.severity === 'high'
      )

      if (!needsAdjustment) return null

      // Generate and apply strategy adjustment
      const adjustment = await this.generateStrategyAdjustment(
        userId,
        contentId,
        gaps,
        currentMetrics
      )

      // Apply the adjustment
      await this.applyStrategyAdjustment(userId, contentId, adjustment)

      return adjustment
    } catch (error) {
      throw new OutcomeAIError('Failed to monitor and adjust strategy', 'MONITOR_ADJUST_ERROR', error)
    }
  }

  // Identify performance gaps
  identifyPerformanceGaps(
    currentMetrics: PerformanceMetrics,
    targetMetrics: BusinessMetric[]
  ): PerformanceGap[] {
    const gaps: PerformanceGap[] = []

    for (const target of targetMetrics) {
      const metricKey = target.type as keyof PerformanceMetrics
      const actualValue = currentMetrics[metricKey] || 0
      const targetValue = target.targetValue
      const gap = targetValue - actualValue
      const gapPercentage = targetValue > 0 ? (gap / targetValue) * 100 : 0

      gaps.push({
        metric: target.type,
        target: targetValue,
        actual: actualValue,
        gap,
        gapPercentage,
        severity: this.determineSeverity(gapPercentage)
      })
    }

    return gaps.sort((a, b) => b.gapPercentage - a.gapPercentage)
  }

  // Generate strategy adjustment
  private async generateStrategyAdjustment(
    userId: string,
    contentId: string,
    gaps: PerformanceGap[],
    currentMetrics: PerformanceMetrics
  ): Promise<StrategyAdjustment> {
    const primaryGap = gaps[0]
    
    // Determine new strategy based on gap
    const newStrategy = await this.determineNewStrategy(primaryGap, currentMetrics)
    
    return {
      adjustmentId: `adj_${Date.now()}`,
      contentId,
      reason: `${primaryGap.metric} is ${primaryGap.gapPercentage.toFixed(1)}% below target`,
      originalStrategy: 'current_strategy',
      newStrategy,
      expectedImpact: this.estimateAdjustmentImpact(primaryGap),
      confidence: this.calculateAdjustmentConfidence(gaps, currentMetrics),
      appliedAt: new Date()
    }
  }

  // Determine new optimization strategy
  private async determineNewStrategy(
    gap: PerformanceGap,
    currentMetrics: PerformanceMetrics
  ): Promise<string> {
    const strategies: Record<string, string[]> = {
      traffic: [
        'Increase SEO optimization and keyword targeting',
        'Improve content structure and readability',
        'Add more internal and external links',
        'Optimize meta descriptions and titles'
      ],
      engagement: [
        'Add more interactive elements and questions',
        'Incorporate storytelling and emotional triggers',
        'Improve content hooks and opening paragraphs',
        'Add visual elements and multimedia'
      ],
      conversions: [
        'Strengthen calls-to-action and urgency',
        'Add social proof and testimonials',
        'Improve value proposition clarity',
        'Reduce friction in conversion process'
      ],
      revenue: [
        'Optimize monetization element placement',
        'Increase affiliate link relevance',
        'Create more compelling lead magnets',
        'Improve upsell and cross-sell opportunities'
      ]
    }

    const metricStrategies = strategies[gap.metric] || []
    return metricStrategies[Math.floor(Math.random() * metricStrategies.length)] || 'General optimization'
  }

  // Apply strategy adjustment
  private async applyStrategyAdjustment(
    userId: string,
    contentId: string,
    adjustment: StrategyAdjustment
  ): Promise<void> {
    try {
      // Store adjustment in database
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{strategy_adjustments}',
          COALESCE(performance->'strategy_adjustments', '[]'::jsonb) || $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(adjustment), contentId, userId])

      // Trigger content regeneration if needed
      if (adjustment.expectedImpact > 0.3) {
        await this.triggerContentRegeneration(userId, contentId, adjustment)
      }
    } catch (error) {
      throw new OutcomeAIError('Failed to apply strategy adjustment', 'APPLY_ADJUSTMENT_ERROR', error)
    }
  }

  // Trigger content regeneration with improved strategy
  private async triggerContentRegeneration(
    userId: string,
    contentId: string,
    adjustment: StrategyAdjustment
  ): Promise<void> {
    try {
      // Mark content for regeneration
      await query(`
        UPDATE content 
        SET metadata = jsonb_set(
          COALESCE(metadata, '{}'),
          '{regeneration_needed}',
          'true'::jsonb
        ),
        metadata = jsonb_set(
          metadata,
          '{regeneration_reason}',
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(adjustment.reason), contentId, userId])
    } catch (error) {
      throw new OutcomeAIError('Failed to trigger regeneration', 'REGENERATION_ERROR', error)
    }
  }

  // Benchmark performance against targets
  async benchmarkPerformance(
    contentId: string,
    targetMetrics: BusinessMetric[]
  ): Promise<PerformanceBenchmark[]> {
    try {
      const currentMetrics = await performanceTracker.getCurrentMetrics(contentId)
      if (!currentMetrics) {
        throw new OutcomeAIError('No metrics found for content', 'NO_METRICS_ERROR')
      }

      const benchmarks: PerformanceBenchmark[] = []

      for (const target of targetMetrics) {
        const metricKey = target.type as keyof PerformanceMetrics
        const actualValue = currentMetrics[metricKey] || 0
        const expectedValue = target.targetValue
        const variance = expectedValue > 0 ? ((actualValue - expectedValue) / expectedValue) * 100 : 0

        benchmarks.push({
          metricType: target.type,
          expectedValue,
          actualValue,
          variance,
          status: this.determineBenchmarkStatus(variance)
        })
      }

      return benchmarks
    } catch (error) {
      throw new OutcomeAIError('Failed to benchmark performance', 'BENCHMARK_ERROR', error)
    }
  }

  // Analyze performance gaps
  async analyzePerformanceGaps(
    userId: string,
    days: number = 30
  ): Promise<PerformanceGap[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT id, performance FROM content 
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '${days} days'
          AND performance->'current_metrics' IS NOT NULL
      `, [userId], 'analyze_performance_gaps')

      const allGaps: PerformanceGap[] = []

      for (const row of result) {
        const metrics = row.performance?.current_metrics
        const targetMetrics = row.performance?.target_metrics

        if (metrics && targetMetrics) {
          const gaps = this.identifyPerformanceGaps(metrics, targetMetrics)
          allGaps.push(...gaps)
        }
      }

      // Aggregate and prioritize gaps
      return this.aggregateGaps(allGaps)
    } catch (error) {
      throw new OutcomeAIError('Failed to analyze performance gaps', 'ANALYZE_GAPS_ERROR', error)
    }
  }

  // Get adjustment history
  async getAdjustmentHistory(
    contentId: string
  ): Promise<StrategyAdjustment[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content WHERE id = $1
      `, [contentId], 'get_adjustment_history')

      if (result.length === 0 || !result[0].performance?.strategy_adjustments) {
        return []
      }

      return result[0].performance.strategy_adjustments.map((adj: any) => ({
        adjustmentId: adj.adjustmentId,
        contentId: adj.contentId,
        reason: adj.reason,
        originalStrategy: adj.originalStrategy,
        newStrategy: adj.newStrategy,
        expectedImpact: adj.expectedImpact,
        confidence: adj.confidence,
        appliedAt: new Date(adj.appliedAt)
      }))
    } catch (error) {
      throw new OutcomeAIError('Failed to get adjustment history', 'GET_HISTORY_ERROR', error)
    }
  }

  // Private helper methods
  private determineSeverity(gapPercentage: number): PerformanceGap['severity'] {
    if (gapPercentage >= 50) return 'critical'
    if (gapPercentage >= 30) return 'high'
    if (gapPercentage >= 15) return 'medium'
    return 'low'
  }

  private determineBenchmarkStatus(variance: number): PerformanceBenchmark['status'] {
    if (variance > 20) return 'exceeding'
    if (variance >= -10) return 'meeting'
    if (variance >= -30) return 'below'
    return 'critical'
  }

  private estimateAdjustmentImpact(gap: PerformanceGap): number {
    // Estimate how much the adjustment will close the gap
    const baseImpact = 0.3 // 30% improvement baseline
    
    if (gap.severity === 'critical') return baseImpact * 1.5
    if (gap.severity === 'high') return baseImpact * 1.2
    if (gap.severity === 'medium') return baseImpact
    return baseImpact * 0.7
  }

  private calculateAdjustmentConfidence(
    gaps: PerformanceGap[],
    metrics: PerformanceMetrics
  ): number {
    let confidence = 0.6 // Base confidence

    // Higher confidence with more data
    if (metrics.views > 1000) confidence += 0.1
    if (metrics.conversions > 10) confidence += 0.1

    // Lower confidence with multiple critical gaps
    const criticalGaps = gaps.filter(g => g.severity === 'critical').length
    if (criticalGaps > 2) confidence -= 0.2

    return Math.max(0.3, Math.min(confidence, 0.9))
  }

  private aggregateGaps(gaps: PerformanceGap[]): PerformanceGap[] {
    const aggregated: Record<string, PerformanceGap> = {}

    for (const gap of gaps) {
      if (!aggregated[gap.metric]) {
        aggregated[gap.metric] = gap
      } else {
        // Average the gaps for the same metric
        const existing = aggregated[gap.metric]
        aggregated[gap.metric] = {
          metric: gap.metric,
          target: (existing.target + gap.target) / 2,
          actual: (existing.actual + gap.actual) / 2,
          gap: (existing.gap + gap.gap) / 2,
          gapPercentage: (existing.gapPercentage + gap.gapPercentage) / 2,
          severity: this.determineSeverity((existing.gapPercentage + gap.gapPercentage) / 2)
        }
      }
    }

    return Object.values(aggregated).sort((a, b) => b.gapPercentage - a.gapPercentage)
  }

  // Automatic content regeneration for underperforming content
  async regenerateUnderperformingContent(
    userId: string,
    contentId: string,
    targetMetrics: BusinessMetric[]
  ): Promise<string> {
    try {
      // Get current content
      const result = await query(`
        SELECT title, content FROM content WHERE id = $1 AND user_id = $2
      `, [contentId, userId])

      if (result.length === 0) {
        throw new OutcomeAIError('Content not found', 'CONTENT_NOT_FOUND')
      }

      const originalContent = result[0].content
      
      // Identify gaps
      const currentMetrics = await performanceTracker.getCurrentMetrics(contentId)
      if (!currentMetrics) {
        throw new OutcomeAIError('No metrics found', 'NO_METRICS_ERROR')
      }

      const gaps = this.identifyPerformanceGaps(currentMetrics, targetMetrics)
      const primaryGap = gaps[0]

      // Generate improved content using outcome optimizer
      const optimized = await outcomeOptimizer.optimizeForMetric(
        originalContent,
        targetMetrics.find(m => m.type === primaryGap.metric) || targetMetrics[0]
      )

      // Update content with regenerated version
      await query(`
        UPDATE content 
        SET content = $1,
            metadata = jsonb_set(
              COALESCE(metadata, '{}'),
              '{regenerated}',
              'true'::jsonb
            ),
            metadata = jsonb_set(
              metadata,
              '{regeneration_date}',
              $2::jsonb
            )
        WHERE id = $3 AND user_id = $4
      `, [optimized.optimizedContent, JSON.stringify(new Date()), contentId, userId])

      return optimized.optimizedContent
    } catch (error) {
      throw new OutcomeAIError('Failed to regenerate content', 'REGENERATE_ERROR', error)
    }
  }

  // Batch process underperforming content
  async batchAdjustUnderperforming(
    userId: string,
    threshold: number = config.adaptation.performanceDropThreshold
  ): Promise<StrategyAdjustment[]> {
    try {
      // Find underperforming content
      const result = await queryWithMetrics(`
        SELECT id, performance FROM content 
        WHERE user_id = $1 
          AND performance->'current_metrics' IS NOT NULL
          AND (performance->'current_metrics'->>'roi')::numeric < $2
        ORDER BY created_at DESC
        LIMIT 20
      `, [userId, threshold], 'find_underperforming_content')

      const adjustments: StrategyAdjustment[] = []

      for (const row of result) {
        const targetMetrics = row.performance?.target_metrics || []
        const adjustment = await this.monitorAndAdjust(userId, row.id, targetMetrics)
        
        if (adjustment) {
          adjustments.push(adjustment)
        }
      }

      return adjustments
    } catch (error) {
      throw new OutcomeAIError('Failed to batch adjust content', 'BATCH_ADJUST_ERROR', error)
    }
  }

  // Set adjustment threshold
  setAdjustmentThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new OutcomeAIError('Threshold must be between 0 and 1', 'INVALID_THRESHOLD')
    }
    this.adjustmentThreshold = threshold
  }
}

export const adaptiveStrategy = AdaptiveStrategyEngine.getInstance()
