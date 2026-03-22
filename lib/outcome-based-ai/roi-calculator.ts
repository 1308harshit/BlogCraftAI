// ROI Calculator - Revenue attribution and ROI analysis
// Calculates return on investment for content and campaigns

import { query, queryWithMetrics } from '../database/connection'
import {
  ROICalculator,
  ROIAnalysis,
  ROIForecast,
  ContentCosts,
  Campaign,
  CampaignResults,
  ROIAssumptions,
  OutcomeStrategy,
  PerformanceMetrics,
  ContentData,
  ChannelROI,
  ROIScenario,
  SensitivityFactor,
  OutcomeAIError,
  ROICalculationError
} from './types'

export class ROICalculatorImpl implements ROICalculator {
  private static instance: ROICalculatorImpl

  static getInstance(): ROICalculatorImpl {
    if (!ROICalculatorImpl.instance) {
      ROICalculatorImpl.instance = new ROICalculatorImpl()
    }
    return ROICalculatorImpl.instance
  }

  // Calculate ROI for individual content
  async calculateContentROI(
    content: ContentData,
    metrics: PerformanceMetrics,
    costs: ContentCosts
  ): Promise<ROIAnalysis> {
    try {
      const totalInvestment = this.calculateTotalInvestment(costs)
      const totalReturn = this.calculateTotalReturn(metrics)
      const netReturn = totalReturn - totalInvestment
      const roiPercentage = totalInvestment > 0 ? (netReturn / totalInvestment) * 100 : 0

      // Calculate channel breakdown
      const breakdownByChannel = await this.calculateChannelBreakdown(content.id, metrics, costs)
      
      // Calculate time to ROI
      const timeToROI = await this.calculateTimeToROI(content.id, totalInvestment, metrics)

      const analysis: ROIAnalysis = {
        analysisId: `roi_${Date.now()}`,
        totalInvestment,
        totalReturn,
        netReturn,
        roiPercentage,
        paybackPeriod: this.calculatePaybackPeriod(totalInvestment, totalReturn, 30),
        breakdownByChannel,
        timeToROI,
        confidenceLevel: this.calculateConfidenceLevel(metrics, costs)
      }

      // Store ROI analysis
      await this.storeROIAnalysis(content.userId, content.id, analysis)

      return analysis
    } catch (error) {
      throw new ROICalculationError('Failed to calculate content ROI', error)
    }
  }

  // Calculate ROI for campaigns
  async calculateCampaignROI(
    campaign: Campaign,
    results: CampaignResults
  ): Promise<ROIAnalysis> {
    try {
      const totalInvestment = campaign.budget
      const totalReturn = results.totalRevenue
      const netReturn = totalReturn - totalInvestment
      const roiPercentage = totalInvestment > 0 ? (netReturn / totalInvestment) * 100 : 0

      // Calculate per-content breakdown
      const breakdownByChannel: ChannelROI[] = []
      
      for (const content of campaign.content) {
        const contentMetrics = content.currentMetrics
        if (contentMetrics) {
          const contentInvestment = totalInvestment / campaign.content.length
          const contentReturn = contentMetrics.revenue
          
          breakdownByChannel.push({
            channel: content.platform || 'blog',
            investment: contentInvestment,
            return: contentReturn,
            roi: contentInvestment > 0 ? ((contentReturn - contentInvestment) / contentInvestment) * 100 : 0,
            attribution: contentReturn / totalReturn
          })
        }
      }

      const analysis: ROIAnalysis = {
        analysisId: `campaign_roi_${Date.now()}`,
        totalInvestment,
        totalReturn,
        netReturn,
        roiPercentage,
        paybackPeriod: this.calculatePaybackPeriod(totalInvestment, totalReturn, campaign.duration),
        breakdownByChannel,
        timeToROI: campaign.duration,
        confidenceLevel: this.calculateCampaignConfidence(results)
      }

      return analysis
    } catch (error) {
      throw new ROICalculationError('Failed to calculate campaign ROI', error)
    }
  }

  // Forecast future ROI
  async forecastROI(
    strategy: OutcomeStrategy,
    assumptions: ROIAssumptions
  ): Promise<ROIForecast> {
    try {
      const timeHorizon = strategy.timeline.totalDuration
      
      // Generate scenarios
      const scenarios = this.generateROIScenarios(strategy, assumptions)
      
      // Calculate expected ROI (weighted average of scenarios)
      const expectedROI = scenarios.reduce((sum, scenario) => 
        sum + (scenario.roi * scenario.probability), 0
      )

      // Calculate confidence interval
      const confidenceInterval = this.calculateConfidenceInterval(scenarios)
      
      // Identify key drivers
      const keyDrivers = this.identifyKeyDrivers(strategy, assumptions)
      
      // Perform sensitivity analysis
      const sensitivityAnalysis = this.performSensitivityAnalysis(assumptions)

      const forecast: ROIForecast = {
        forecastId: `forecast_${Date.now()}`,
        timeHorizon,
        scenarios,
        expectedROI,
        confidenceInterval,
        keyDrivers,
        sensitivityAnalysis
      }

      return forecast
    } catch (error) {
      throw new ROICalculationError('Failed to forecast ROI', error)
    }
  }

  // Revenue attribution across touchpoints
  async attributeRevenue(
    contentId: string,
    revenue: number,
    touchpoints: string[]
  ): Promise<Record<string, number>> {
    try {
      // Multi-touch attribution using linear model
      const attribution: Record<string, number> = {}
      const attributionPerTouch = revenue / touchpoints.length

      for (const touchpoint of touchpoints) {
        attribution[touchpoint] = attributionPerTouch
      }

      // Store attribution data
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{revenue_attribution}',
          $1::jsonb
        )
        WHERE id = $2
      `, [JSON.stringify(attribution), contentId])

      return attribution
    } catch (error) {
      throw new ROICalculationError('Failed to attribute revenue', error)
    }
  }

  // Private helper methods
  private calculateTotalInvestment(costs: ContentCosts): number {
    return costs.creationCost + costs.promotionCost + costs.toolCosts + costs.opportunityCost
  }

  private calculateTotalReturn(metrics: PerformanceMetrics): number {
    return metrics.revenue || 0
  }

  private async calculateChannelBreakdown(
    contentId: string,
    metrics: PerformanceMetrics,
    costs: ContentCosts
  ): Promise<ChannelROI[]> {
    // Simplified channel breakdown - in production would track per-channel metrics
    const totalInvestment = this.calculateTotalInvestment(costs)
    const totalReturn = metrics.revenue || 0

    return [{
      channel: 'organic',
      investment: totalInvestment * 0.7,
      return: totalReturn * 0.6,
      roi: totalInvestment > 0 ? ((totalReturn * 0.6 - totalInvestment * 0.7) / (totalInvestment * 0.7)) * 100 : 0,
      attribution: 0.6
    }, {
      channel: 'social',
      investment: totalInvestment * 0.2,
      return: totalReturn * 0.3,
      roi: totalInvestment > 0 ? ((totalReturn * 0.3 - totalInvestment * 0.2) / (totalInvestment * 0.2)) * 100 : 0,
      attribution: 0.3
    }, {
      channel: 'email',
      investment: totalInvestment * 0.1,
      return: totalReturn * 0.1,
      roi: totalInvestment > 0 ? ((totalReturn * 0.1 - totalInvestment * 0.1) / (totalInvestment * 0.1)) * 100 : 0,
      attribution: 0.1
    }]
  }

  private async calculateTimeToROI(
    contentId: string,
    investment: number,
    metrics: PerformanceMetrics
  ): Promise<number> {
    // Estimate based on current revenue rate
    const dailyRevenue = (metrics.revenue || 0) / 30
    
    if (dailyRevenue === 0) return 365 // Default to 1 year if no revenue yet
    
    return Math.ceil(investment / dailyRevenue)
  }

  private calculatePaybackPeriod(
    investment: number,
    totalReturn: number,
    duration: number
  ): number {
    if (totalReturn <= investment) return duration
    
    const dailyReturn = totalReturn / duration
    return Math.ceil(investment / dailyReturn)
  }

  private calculateConfidenceLevel(metrics: PerformanceMetrics, costs: ContentCosts): number {
    // Higher confidence with more data points and consistent performance
    let confidence = 0.5

    if (metrics.views > 1000) confidence += 0.1
    if (metrics.conversions > 10) confidence += 0.15
    if (metrics.revenue > 0) confidence += 0.2
    if (costs.creationCost > 0) confidence += 0.05

    return Math.min(confidence, 1.0)
  }

  private calculateCampaignConfidence(results: CampaignResults): number {
    let confidence = 0.5

    if (results.totalReach > 10000) confidence += 0.1
    if (results.totalConversions > 100) confidence += 0.15
    if (results.totalRevenue > 1000) confidence += 0.2
    if (results.costPerAcquisition > 0) confidence += 0.05

    return Math.min(confidence, 1.0)
  }

  private generateROIScenarios(
    strategy: OutcomeStrategy,
    assumptions: ROIAssumptions
  ): ROIScenario[] {
    const baseROI = this.estimateBaseROI(strategy, assumptions)

    return [
      {
        scenario: 'conservative',
        probability: 0.25,
        roi: baseROI * 0.6,
        assumptions: [
          'Lower than expected conversion rates',
          'Higher customer acquisition costs',
          'Market headwinds'
        ],
        keyRisks: [
          'Competition increases',
          'Market saturation',
          'Economic downturn'
        ]
      },
      {
        scenario: 'expected',
        probability: 0.5,
        roi: baseROI,
        assumptions: [
          'Normal market conditions',
          'Expected conversion rates',
          'Stable competition'
        ],
        keyRisks: [
          'Market volatility',
          'Execution challenges'
        ]
      },
      {
        scenario: 'optimistic',
        probability: 0.25,
        roi: baseROI * 1.5,
        assumptions: [
          'Higher than expected engagement',
          'Viral content success',
          'Market tailwinds'
        ],
        keyRisks: [
          'Unsustainable growth',
          'Resource constraints'
        ]
      }
    ]
  }

  private estimateBaseROI(strategy: OutcomeStrategy, assumptions: ROIAssumptions): number {
    // Simplified ROI estimation based on strategy and assumptions
    const expectedRevenue = assumptions.averageOrderValue * assumptions.conversionRate * 1000
    const expectedCost = 10000 // Base cost estimate
    
    return ((expectedRevenue - expectedCost) / expectedCost) * 100
  }

  private calculateConfidenceInterval(scenarios: ROIScenario[]): [number, number] {
    const rois = scenarios.map(s => s.roi).sort((a, b) => a - b)
    return [rois[0], rois[rois.length - 1]]
  }

  private identifyKeyDrivers(strategy: OutcomeStrategy, assumptions: ROIAssumptions): string[] {
    return [
      'Conversion rate optimization',
      'Customer lifetime value growth',
      'Content quality and engagement',
      'Market positioning and differentiation',
      'Operational efficiency'
    ]
  }

  private performSensitivityAnalysis(assumptions: ROIAssumptions): SensitivityFactor[] {
    return [
      {
        factor: 'conversion_rate',
        baseValue: assumptions.conversionRate,
        impact: 0.8,
        elasticity: 1.5
      },
      {
        factor: 'average_order_value',
        baseValue: assumptions.averageOrderValue,
        impact: 0.7,
        elasticity: 1.2
      },
      {
        factor: 'customer_lifetime_value',
        baseValue: assumptions.customerLifetimeValue,
        impact: 0.9,
        elasticity: 1.8
      },
      {
        factor: 'churn_rate',
        baseValue: assumptions.churnRate,
        impact: -0.6,
        elasticity: -1.3
      }
    ]
  }

  private async storeROIAnalysis(
    userId: string,
    contentId: string,
    analysis: ROIAnalysis
  ): Promise<void> {
    try {
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'),
          '{roi_analysis}',
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(analysis), contentId, userId])
    } catch (error) {
      throw new OutcomeAIError('Failed to store ROI analysis', 'STORE_ROI_ERROR', error)
    }
  }

  // Get ROI analysis history
  async getROIHistory(
    userId: string,
    days: number = 30
  ): Promise<ROIAnalysis[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content 
        WHERE user_id = $1 
          AND performance->'roi_analysis' IS NOT NULL
          AND created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY created_at DESC
      `, [userId], 'get_roi_history')

      return result
        .filter(row => row.performance?.roi_analysis)
        .map(row => this.mapToROIAnalysis(row.performance.roi_analysis))
    } catch (error) {
      throw new OutcomeAIError('Failed to get ROI history', 'GET_ROI_HISTORY_ERROR', error)
    }
  }

  // Calculate average ROI for user
  async calculateAverageROI(userId: string, days: number = 30): Promise<number> {
    try {
      const history = await this.getROIHistory(userId, days)
      
      if (history.length === 0) return 0

      const totalROI = history.reduce((sum, analysis) => sum + analysis.roiPercentage, 0)
      return totalROI / history.length
    } catch (error) {
      throw new OutcomeAIError('Failed to calculate average ROI', 'AVG_ROI_ERROR', error)
    }
  }

  // Identify best performing content by ROI
  async getBestPerformingContent(
    userId: string,
    limit: number = 10
  ): Promise<Array<{ contentId: string, roi: number, revenue: number }>> {
    try {
      const result = await queryWithMetrics(`
        SELECT id, performance FROM content 
        WHERE user_id = $1 
          AND performance->'roi_analysis' IS NOT NULL
        ORDER BY (performance->'roi_analysis'->>'roiPercentage')::numeric DESC
        LIMIT $2
      `, [userId, limit], 'get_best_performing_content')

      return result.map(row => ({
        contentId: row.id,
        roi: parseFloat(row.performance.roi_analysis.roiPercentage),
        revenue: parseFloat(row.performance.roi_analysis.totalReturn)
      }))
    } catch (error) {
      throw new OutcomeAIError('Failed to get best performing content', 'BEST_CONTENT_ERROR', error)
    }
  }

  private mapToROIAnalysis(data: any): ROIAnalysis {
    return {
      analysisId: data.analysisId,
      totalInvestment: data.totalInvestment,
      totalReturn: data.totalReturn,
      netReturn: data.netReturn,
      roiPercentage: data.roiPercentage,
      paybackPeriod: data.paybackPeriod,
      breakdownByChannel: data.breakdownByChannel || [],
      timeToROI: data.timeToROI,
      confidenceLevel: data.confidenceLevel
    }
  }
}

export const roiCalculator = ROICalculatorImpl.getInstance()
