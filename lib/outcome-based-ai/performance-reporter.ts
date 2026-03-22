// Performance Reporter - Reporting and forecasting system
// Generates performance reports and forecasts future performance

import { query, queryWithMetrics } from '../database/connection'
import {
  PerformanceMetrics,
  BusinessMetric,
  OutcomePrediction,
  ROIAnalysis,
  OutcomeAIError
} from './types'
import { performanceTracker } from './performance-tracker'
import { roiCalculator } from './roi-calculator'

export interface PerformanceReport {
  reportId: string
  userId: string
  period: {
    start: Date
    end: Date
  }
  summary: PerformanceSummary
  contentPerformance: ContentPerformanceItem[]
  trends: PerformanceTrend[]
  insights: PerformanceInsight[]
  recommendations: string[]
  generatedAt: Date
}

export interface PerformanceSummary {
  totalContent: number
  totalViews: number
  totalEngagement: number
  totalConversions: number
  totalRevenue: number
  averageROI: number
  topPerformingContent: string[]
  underperformingContent: string[]
}

export interface ContentPerformanceItem {
  contentId: string
  title: string
  metrics: PerformanceMetrics
  roi: number
  rank: number
  trend: 'up' | 'down' | 'stable'
}

export interface PerformanceTrend {
  metric: string
  direction: 'increasing' | 'decreasing' | 'stable'
  changePercentage: number
  significance: 'high' | 'medium' | 'low'
  period: number
}

export interface PerformanceInsight {
  insightId: string
  type: 'opportunity' | 'risk' | 'achievement' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  suggestedActions: string[]
}

export interface PerformanceForecast {
  forecastId: string
  metric: string
  currentValue: number
  forecastedValue: number
  timeframe: number
  confidence: number
  assumptions: string[]
  scenarios: ForecastScenario[]
}

export interface ForecastScenario {
  scenario: 'best' | 'expected' | 'worst'
  value: number
  probability: number
  factors: string[]
}

export class PerformanceReporter {
  private static instance: PerformanceReporter

  static getInstance(): PerformanceReporter {
    if (!PerformanceReporter.instance) {
      PerformanceReporter.instance = new PerformanceReporter()
    }
    return PerformanceReporter.instance
  }

  // Generate comprehensive performance report
  async generateReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport> {
    try {
      const summary = await this.generateSummary(userId, startDate, endDate)
      const contentPerformance = await this.getContentPerformance(userId, startDate, endDate)
      const trends = await this.analyzeTrends(userId, startDate, endDate)
      const insights = await this.generateInsights(summary, trends, contentPerformance)
      const recommendations = await this.generateRecommendations(insights, trends)

      const report: PerformanceReport = {
        reportId: `report_${Date.now()}`,
        userId,
        period: { start: startDate, end: endDate },
        summary,
        contentPerformance,
        trends,
        insights,
        recommendations,
        generatedAt: new Date()
      }

      // Store report
      await this.storeReport(userId, report)

      return report
    } catch (error) {
      throw new OutcomeAIError('Failed to generate performance report', 'REPORT_ERROR', error)
    }
  }

  // Forecast future performance
  async forecastPerformance(
    userId: string,
    metric: keyof PerformanceMetrics,
    days: number = 30
  ): Promise<PerformanceForecast> {
    try {
      // Get historical data
      const aggregated = await performanceTracker.getAggregatedMetrics(userId, 90)
      const currentValue = aggregated[metric] || 0

      // Calculate growth rate from recent trends
      const growthRate = await this.calculateHistoricalGrowthRate(userId, metric, 30)
      
      // Forecast future value
      const forecastedValue = currentValue * (1 + growthRate / 100)

      // Generate scenarios
      const scenarios: ForecastScenario[] = [
        {
          scenario: 'best',
          value: forecastedValue * 1.3,
          probability: 0.2,
          factors: ['Viral content success', 'Market expansion', 'Improved conversion rates']
        },
        {
          scenario: 'expected',
          value: forecastedValue,
          probability: 0.6,
          factors: ['Consistent growth', 'Normal market conditions', 'Current strategies']
        },
        {
          scenario: 'worst',
          value: forecastedValue * 0.7,
          probability: 0.2,
          factors: ['Market challenges', 'Increased competition', 'Algorithm changes']
        }
      ]

      const forecast: PerformanceForecast = {
        forecastId: `forecast_${Date.now()}`,
        metric: metric.toString(),
        currentValue,
        forecastedValue,
        timeframe: days,
        confidence: this.calculateForecastConfidence(growthRate, currentValue),
        assumptions: [
          'Historical trends continue',
          'No major market disruptions',
          'Current strategies maintained'
        ],
        scenarios
      }

      return forecast
    } catch (error) {
      throw new OutcomeAIError('Failed to forecast performance', 'FORECAST_ERROR', error)
    }
  }

  // Private helper methods
  private async generateSummary(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceSummary> {
    const result = await queryWithMetrics(`
      SELECT id, performance FROM content 
      WHERE user_id = $1 
        AND created_at BETWEEN $2 AND $3
    `, [userId, startDate, endDate], 'generate_summary')

    const aggregated: PerformanceMetrics = {
      views: 0, engagement: 0, shares: 0, comments: 0,
      clicks: 0, conversions: 0, revenue: 0, viralScore: 0,
      seoScore: 0, roi: 0, engagementRate: 0, conversionRate: 0
    }

    const contentROIs: Array<{ id: string, roi: number }> = []

    for (const row of result) {
      const metrics = row.performance?.current_metrics
      if (metrics) {
        aggregated.views += metrics.views || 0
        aggregated.engagement += metrics.engagement || 0
        aggregated.conversions += metrics.conversions || 0
        aggregated.revenue += metrics.revenue || 0
      }

      const roiAnalysis = row.performance?.roi_analysis
      if (roiAnalysis) {
        contentROIs.push({ id: row.id, roi: roiAnalysis.roiPercentage })
      }
    }

    const avgROI = contentROIs.length > 0 ?
      contentROIs.reduce((sum, item) => sum + item.roi, 0) / contentROIs.length : 0

    const sortedByROI = contentROIs.sort((a, b) => b.roi - a.roi)

    return {
      totalContent: result.length,
      totalViews: aggregated.views,
      totalEngagement: aggregated.engagement,
      totalConversions: aggregated.conversions,
      totalRevenue: aggregated.revenue,
      averageROI: avgROI,
      topPerformingContent: sortedByROI.slice(0, 5).map(item => item.id),
      underperformingContent: sortedByROI.slice(-5).map(item => item.id)
    }
  }

  private async getContentPerformance(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ContentPerformanceItem[]> {
    const result = await queryWithMetrics(`
      SELECT id, title, performance FROM content 
      WHERE user_id = $1 
        AND created_at BETWEEN $2 AND $3
      ORDER BY (performance->'current_metrics'->>'revenue')::numeric DESC
    `, [userId, startDate, endDate], 'get_content_performance')

    return result.map((row, index) => ({
      contentId: row.id,
      title: row.title || 'Untitled',
      metrics: row.performance?.current_metrics || this.getEmptyMetrics(),
      roi: row.performance?.roi_analysis?.roiPercentage || 0,
      rank: index + 1,
      trend: this.determineTrend(row.performance)
    }))
  }

  private async analyzeTrends(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceTrend[]> {
    const trends: PerformanceTrend[] = []
    const metrics = ['views', 'engagement', 'conversions', 'revenue'] as const

    for (const metric of metrics) {
      const growthRate = await this.calculateHistoricalGrowthRate(
        userId, 
        metric, 
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      )

      trends.push({
        metric,
        direction: growthRate > 5 ? 'increasing' : growthRate < -5 ? 'decreasing' : 'stable',
        changePercentage: growthRate,
        significance: Math.abs(growthRate) > 20 ? 'high' : Math.abs(growthRate) > 10 ? 'medium' : 'low',
        period: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      })
    }

    return trends
  }

  private async generateInsights(
    summary: PerformanceSummary,
    trends: PerformanceTrend[],
    contentPerformance: ContentPerformanceItem[]
  ): Promise<PerformanceInsight[]> {
    const insights: PerformanceInsight[] = []

    // Revenue insights
    if (summary.totalRevenue > 10000) {
      insights.push({
        insightId: `insight_${Date.now()}_1`,
        type: 'achievement',
        title: 'Strong Revenue Performance',
        description: `Generated ${summary.totalRevenue.toFixed(2)} in revenue with ${summary.averageROI.toFixed(1)}% average ROI`,
        impact: 'high',
        actionable: false,
        suggestedActions: []
      })
    }

    // Growth opportunities
    const growingMetrics = trends.filter(t => t.direction === 'increasing' && t.significance === 'high')
    if (growingMetrics.length > 0) {
      insights.push({
        insightId: `insight_${Date.now()}_2`,
        type: 'opportunity',
        title: 'Strong Growth Momentum',
        description: `${growingMetrics.map(m => m.metric).join(', ')} showing significant growth`,
        impact: 'high',
        actionable: true,
        suggestedActions: ['Double down on successful content types', 'Increase content production', 'Expand to similar topics']
      })
    }

    // Underperformance risks
    if (summary.underperformingContent.length > 0) {
      insights.push({
        insightId: `insight_${Date.now()}_3`,
        type: 'risk',
        title: 'Underperforming Content Detected',
        description: `${summary.underperformingContent.length} pieces of content need optimization`,
        impact: 'medium',
        actionable: true,
        suggestedActions: ['Review and optimize underperforming content', 'Analyze success patterns', 'Consider content refresh']
      })
    }

    return insights
  }

  private async generateRecommendations(
    insights: PerformanceInsight[],
    trends: PerformanceTrend[]
  ): Promise<string[]> {
    const recommendations: string[] = []

    // Based on insights
    for (const insight of insights) {
      if (insight.actionable && insight.suggestedActions.length > 0) {
        recommendations.push(...insight.suggestedActions)
      }
    }

    // Based on trends
    const decliningMetrics = trends.filter(t => t.direction === 'decreasing')
    if (decliningMetrics.length > 0) {
      recommendations.push(`Focus on improving ${decliningMetrics.map(m => m.metric).join(', ')}`)
    }

    return [...new Set(recommendations)] // Remove duplicates
  }

  private async calculateHistoricalGrowthRate(
    userId: string,
    metric: keyof PerformanceMetrics,
    days: number
  ): Promise<number> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content 
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY created_at ASC
      `, [userId], 'calculate_growth_rate')

      if (result.length < 2) return 0

      const firstMetrics = result[0].performance?.current_metrics
      const lastMetrics = result[result.length - 1].performance?.current_metrics

      if (!firstMetrics || !lastMetrics) return 0

      const firstValue = firstMetrics[metric] || 0
      const lastValue = lastMetrics[metric] || 0

      if (firstValue === 0) return lastValue > 0 ? 100 : 0

      return ((lastValue - firstValue) / firstValue) * 100
    } catch (error) {
      return 0
    }
  }

  private determineTrend(performance: any): 'up' | 'down' | 'stable' {
    if (!performance?.history || performance.history.length < 2) {
      return 'stable'
    }

    const history = performance.history
    const recent = history.slice(-3)
    
    if (recent.length < 2) return 'stable'

    const firstRevenue = recent[0].metrics.revenue || 0
    const lastRevenue = recent[recent.length - 1].metrics.revenue || 0

    if (lastRevenue > firstRevenue * 1.1) return 'up'
    if (lastRevenue < firstRevenue * 0.9) return 'down'
    return 'stable'
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      views: 0, engagement: 0, shares: 0, comments: 0,
      clicks: 0, conversions: 0, revenue: 0, viralScore: 0,
      seoScore: 0, roi: 0, engagementRate: 0, conversionRate: 0
    }
  }

  private calculateForecastConfidence(growthRate: number, currentValue: number): number {
    let confidence = 0.5

    // Higher confidence with stable growth
    if (Math.abs(growthRate) < 20) confidence += 0.2
    
    // Higher confidence with more data
    if (currentValue > 1000) confidence += 0.2
    
    // Lower confidence with extreme volatility
    if (Math.abs(growthRate) > 50) confidence -= 0.1

    return Math.max(0.1, Math.min(confidence, 0.95))
  }

  private async storeReport(userId: string, report: PerformanceReport): Promise<void> {
    try {
      await query(`
        INSERT INTO business_metrics (
          user_id, period, period_start, period_end,
          revenue_metrics, traffic_metrics, engagement_metrics, conversion_metrics
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        userId,
        'report',
        report.period.start,
        report.period.end,
        JSON.stringify({ revenue: report.summary.totalRevenue, roi: report.summary.averageROI }),
        JSON.stringify({ views: report.summary.totalViews }),
        JSON.stringify({ engagement: report.summary.totalEngagement }),
        JSON.stringify({ conversions: report.summary.totalConversions })
      ])
    } catch (error) {
      throw new OutcomeAIError('Failed to store report', 'STORE_REPORT_ERROR', error)
    }
  }

  // Get historical reports
  async getReports(
    userId: string,
    limit: number = 10
  ): Promise<PerformanceReport[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT * FROM business_metrics 
        WHERE user_id = $1 AND period = 'report'
        ORDER BY calculated_at DESC
        LIMIT $2
      `, [userId, limit], 'get_reports')

      return result.map(row => this.mapToReport(row))
    } catch (error) {
      throw new OutcomeAIError('Failed to get reports', 'GET_REPORTS_ERROR', error)
    }
  }

  private mapToReport(row: any): PerformanceReport {
    return {
      reportId: row.id,
      userId: row.user_id,
      period: {
        start: row.period_start,
        end: row.period_end
      },
      summary: {
        totalContent: 0,
        totalViews: row.traffic_metrics?.views || 0,
        totalEngagement: row.engagement_metrics?.engagement || 0,
        totalConversions: row.conversion_metrics?.conversions || 0,
        totalRevenue: row.revenue_metrics?.revenue || 0,
        averageROI: row.revenue_metrics?.roi || 0,
        topPerformingContent: [],
        underperformingContent: []
      },
      contentPerformance: [],
      trends: [],
      insights: [],
      recommendations: [],
      generatedAt: row.calculated_at
    }
  }
}

export const performanceReporter = PerformanceReporter.getInstance()
