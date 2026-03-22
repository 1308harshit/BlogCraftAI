// Performance Tracker - Real-time metrics collection and monitoring
// Tracks content performance across all business metrics in real-time

import { query, queryWithMetrics } from '../database/connection'
import { redisClient } from '../database/redis'
import {
  PerformanceMetrics,
  BusinessMetric,
  OutcomeAIError
} from './types'

export interface PerformanceSnapshot {
  contentId: string
  timestamp: Date
  metrics: PerformanceMetrics
  platform: string
  source: string
}

export interface PerformanceAlert {
  alertId: string
  contentId: string
  metricType: string
  threshold: number
  currentValue: number
  severity: 'info' | 'warning' | 'critical'
  message: string
  createdAt: Date
}

export class PerformanceTracker {
  private static instance: PerformanceTracker
  private metricsCache: Map<string, PerformanceMetrics> = new Map()
  private alertThresholds: Map<string, number> = new Map()

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Track real-time performance metrics
  async trackMetrics(
    contentId: string,
    metrics: Partial<PerformanceMetrics>,
    platform: string = 'blog'
  ): Promise<void> {
    try {
      const timestamp = new Date()
      
      // Store in Redis for real-time access
      const cacheKey = `perf:${contentId}:latest`
      await redisClient.setex(cacheKey, 3600, JSON.stringify({
        contentId,
        timestamp,
        metrics,
        platform
      }))

      // Update database with latest metrics
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{current_metrics}',
          $1::jsonb
        ),
        updated_at = NOW()
        WHERE id = $2
      `, [JSON.stringify(metrics), contentId])

      // Check for performance alerts
      await this.checkPerformanceAlerts(contentId, metrics)
      
      // Update cache
      this.metricsCache.set(contentId, metrics as PerformanceMetrics)
    } catch (error) {
      throw new OutcomeAIError('Failed to track performance metrics', 'TRACK_METRICS_ERROR', error)
    }
  }

  // Get current performance metrics
  async getCurrentMetrics(contentId: string): Promise<PerformanceMetrics | null> {
    try {
      // Check cache first
      const cached = this.metricsCache.get(contentId)
      if (cached) return cached

      // Check Redis
      const cacheKey = `perf:${contentId}:latest`
      const redisData = await redisClient.get(cacheKey)
      
      if (redisData) {
        const snapshot = JSON.parse(redisData)
        return snapshot.metrics
      }

      // Fallback to database
      const result = await queryWithMetrics(`
        SELECT performance FROM content WHERE id = $1
      `, [contentId], 'get_current_metrics')

      if (result.length === 0 || !result[0].performance?.current_metrics) {
        return null
      }

      return result[0].performance.current_metrics
    } catch (error) {
      throw new OutcomeAIError('Failed to get current metrics', 'GET_METRICS_ERROR', error)
    }
  }

  // Track performance over time
  async trackPerformanceHistory(
    contentId: string,
    metrics: PerformanceMetrics
  ): Promise<void> {
    try {
      const snapshot: PerformanceSnapshot = {
        contentId,
        timestamp: new Date(),
        metrics,
        platform: 'blog',
        source: 'tracker'
      }

      // Store snapshot in time-series format
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{history}',
          COALESCE(performance->'history', '[]'::jsonb) || $1::jsonb
        )
        WHERE id = $2
      `, [JSON.stringify(snapshot), contentId])
    } catch (error) {
      throw new OutcomeAIError('Failed to track performance history', 'TRACK_HISTORY_ERROR', error)
    }
  }

  // Get performance trends
  async getPerformanceTrends(
    contentId: string,
    days: number = 30
  ): Promise<PerformanceSnapshot[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content 
        WHERE id = $1
      `, [contentId], 'get_performance_trends')

      if (result.length === 0 || !result[0].performance?.history) {
        return []
      }

      const history = result[0].performance.history
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      
      return history
        .filter((snapshot: any) => new Date(snapshot.timestamp) >= cutoffDate)
        .map((snapshot: any) => ({
          contentId: snapshot.contentId,
          timestamp: new Date(snapshot.timestamp),
          metrics: snapshot.metrics,
          platform: snapshot.platform,
          source: snapshot.source
        }))
    } catch (error) {
      throw new OutcomeAIError('Failed to get performance trends', 'GET_TRENDS_ERROR', error)
    }
  }

  // Calculate performance growth rate
  async calculateGrowthRate(
    contentId: string,
    metricType: keyof PerformanceMetrics,
    days: number = 7
  ): Promise<number> {
    try {
      const trends = await this.getPerformanceTrends(contentId, days)
      
      if (trends.length < 2) return 0

      const firstValue = trends[0].metrics[metricType] || 0
      const lastValue = trends[trends.length - 1].metrics[metricType] || 0
      
      if (firstValue === 0) return lastValue > 0 ? 100 : 0
      
      return ((lastValue - firstValue) / firstValue) * 100
    } catch (error) {
      throw new OutcomeAIError('Failed to calculate growth rate', 'GROWTH_RATE_ERROR', error)
    }
  }

  // Get aggregated metrics for user
  async getAggregatedMetrics(
    userId: string,
    days: number = 30
  ): Promise<PerformanceMetrics> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content 
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '${days} days'
      `, [userId], 'get_aggregated_metrics')

      const aggregated: PerformanceMetrics = {
        views: 0,
        engagement: 0,
        shares: 0,
        comments: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        viralScore: 0,
        seoScore: 0,
        roi: 0,
        engagementRate: 0,
        conversionRate: 0
      }

      for (const row of result) {
        const currentMetrics = row.performance?.current_metrics
        if (currentMetrics) {
          aggregated.views += currentMetrics.views || 0
          aggregated.engagement += currentMetrics.engagement || 0
          aggregated.shares += currentMetrics.shares || 0
          aggregated.comments += currentMetrics.comments || 0
          aggregated.clicks += currentMetrics.clicks || 0
          aggregated.conversions += currentMetrics.conversions || 0
          aggregated.revenue += currentMetrics.revenue || 0
        }
      }

      // Calculate derived metrics
      if (aggregated.views > 0) {
        aggregated.engagementRate = (aggregated.engagement / aggregated.views) * 100
        aggregated.conversionRate = (aggregated.conversions / aggregated.views) * 100
      }

      return aggregated
    } catch (error) {
      throw new OutcomeAIError('Failed to get aggregated metrics', 'AGGREGATE_ERROR', error)
    }
  }

  // Set performance alert threshold
  setAlertThreshold(metricType: string, threshold: number): void {
    this.alertThresholds.set(metricType, threshold)
  }

  // Check for performance alerts
  private async checkPerformanceAlerts(
    contentId: string,
    metrics: Partial<PerformanceMetrics>
  ): Promise<void> {
    const alerts: PerformanceAlert[] = []

    for (const [metricType, value] of Object.entries(metrics)) {
      const threshold = this.alertThresholds.get(metricType)
      
      if (threshold && typeof value === 'number') {
        if (value < threshold * 0.5) {
          alerts.push({
            alertId: `alert_${Date.now()}`,
            contentId,
            metricType,
            threshold,
            currentValue: value,
            severity: 'critical',
            message: `${metricType} is critically low (${value} vs ${threshold} threshold)`,
            createdAt: new Date()
          })
        } else if (value < threshold * 0.8) {
          alerts.push({
            alertId: `alert_${Date.now()}`,
            contentId,
            metricType,
            threshold,
            currentValue: value,
            severity: 'warning',
            message: `${metricType} is below target (${value} vs ${threshold} threshold)`,
            createdAt: new Date()
          })
        }
      }
    }

    // Store alerts if any
    if (alerts.length > 0) {
      await this.storeAlerts(contentId, alerts)
    }
  }

  private async storeAlerts(contentId: string, alerts: PerformanceAlert[]): Promise<void> {
    try {
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{alerts}',
          COALESCE(performance->'alerts', '[]'::jsonb) || $1::jsonb
        )
        WHERE id = $2
      `, [JSON.stringify(alerts), contentId])
    } catch (error) {
      throw new OutcomeAIError('Failed to store alerts', 'STORE_ALERTS_ERROR', error)
    }
  }

  // Get performance alerts
  async getAlerts(
    contentId: string,
    severity?: PerformanceAlert['severity']
  ): Promise<PerformanceAlert[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content WHERE id = $1
      `, [contentId], 'get_alerts')

      if (result.length === 0 || !result[0].performance?.alerts) {
        return []
      }

      const alerts = result[0].performance.alerts
      
      if (severity) {
        return alerts.filter((alert: PerformanceAlert) => alert.severity === severity)
      }

      return alerts
    } catch (error) {
      throw new OutcomeAIError('Failed to get alerts', 'GET_ALERTS_ERROR', error)
    }
  }

  // Compare performance against benchmarks
  async compareAgainstBenchmarks(
    contentId: string,
    benchmarks: BusinessMetric[]
  ): Promise<Record<string, { current: number, benchmark: number, percentile: number }>> {
    try {
      const currentMetrics = await this.getCurrentMetrics(contentId)
      if (!currentMetrics) {
        throw new OutcomeAIError('No metrics found for content', 'NO_METRICS_ERROR')
      }

      const comparison: Record<string, any> = {}

      for (const benchmark of benchmarks) {
        const metricKey = benchmark.type as keyof PerformanceMetrics
        const currentValue = currentMetrics[metricKey] || 0
        const benchmarkValue = benchmark.targetValue

        comparison[benchmark.type] = {
          current: currentValue,
          benchmark: benchmarkValue,
          percentile: this.calculatePercentile(currentValue, benchmarkValue),
          status: currentValue >= benchmarkValue ? 'above' : 'below'
        }
      }

      return comparison
    } catch (error) {
      throw new OutcomeAIError('Failed to compare against benchmarks', 'BENCHMARK_ERROR', error)
    }
  }

  private calculatePercentile(current: number, benchmark: number): number {
    if (benchmark === 0) return 100
    return Math.min((current / benchmark) * 100, 100)
  }

  // Real-time metric updates via streaming
  async streamMetrics(
    contentId: string,
    callback: (metrics: PerformanceMetrics) => void
  ): Promise<void> {
    const cacheKey = `perf:${contentId}:latest`
    
    // Poll Redis for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const data = await redisClient.get(cacheKey)
        if (data) {
          const snapshot = JSON.parse(data)
          callback(snapshot.metrics)
        }
      } catch (error) {
        console.error('Error streaming metrics:', error)
      }
    }, 5000)

    // Return cleanup function
    return () => clearInterval(interval)
  }
}

export const performanceTracker = PerformanceTracker.getInstance()
