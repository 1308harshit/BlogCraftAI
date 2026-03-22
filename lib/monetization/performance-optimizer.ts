// Monetization Performance Optimizer
// Analyzes and optimizes monetization element performance with automatic testing and revenue attribution

import { query, queryWithMetrics } from '../database/connection'
import { performanceTracker } from '../outcome-based-ai/performance-tracker'
import { roiCalculator } from '../outcome-based-ai/roi-calculator'
import {
  MonetizationElement,
  MonetizationPerformance,
  MonetizationOptimization,
  MonetizationStrategy,
  MonetizationTest,
  MonetizationTestResults,
  RevenueAttribution,
  ElementPerformanceMetrics,
  OptimizationRecommendation,
  MonetizationError
} from './types'

export interface MonetizationPerformanceOptimizer {
  analyzeElementPerformance(contentId: string): Promise<MonetizationPerformance>
  attributeRevenue(contentId: string): Promise<RevenueAttribution>
  optimizeStrategy(contentId: string, performanceData: MonetizationPerformance): Promise<MonetizationOptimization>
  createPerformanceTest(contentId: string, testType: string): Promise<MonetizationTest>
  analyzeTestResults(testId: string): Promise<MonetizationTestResults>
  getTopPerformingElements(userId: string, limit?: number): Promise<ElementPerformanceMetrics[]>
}

export class MonetizationPerformanceOptimizerImpl implements MonetizationPerformanceOptimizer {
  private static instance: MonetizationPerformanceOptimizerImpl

  static getInstance(): MonetizationPerformanceOptimizerImpl {
    if (!MonetizationPerformanceOptimizerImpl.instance) {
      MonetizationPerformanceOptimizerImpl.instance = new MonetizationPerformanceOptimizerImpl()
    }
    return MonetizationPerformanceOptimizerImpl.instance
  }

  /**
   * Analyze performance of all monetization elements in content
   */
  async analyzeElementPerformance(contentId: string): Promise<MonetizationPerformance> {
    try {
      // Get all monetization elements for this content
      const elements = await this.getMonetizationElements(contentId)
      
      if (elements.length === 0) {
        return {
          contentId,
          totalRevenue: 0,
          totalConversions: 0,
          averageConversionRate: 0,
          elementPerformance: [],
          topPerformers: [],
          underperformers: [],
          recommendations: ['No monetization elements found. Consider adding affiliate links, CTAs, or lead magnets.'],
          lastAnalyzed: new Date()
        }
      }

      // Analyze each element's performance
      const elementPerformance: ElementPerformanceMetrics[] = []
      let totalRevenue = 0
      let totalConversions = 0
      let totalImpressions = 0

      for (const element of elements) {
        const metrics = await this.getElementMetrics(element.id)
        
        elementPerformance.push({
          elementId: element.id,
          elementType: element.element_type,
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          conversions: metrics.conversions,
          revenue: metrics.revenue,
          clickThroughRate: metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0,
          conversionRate: metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0,
          revenuePerImpression: metrics.impressions > 0 ? metrics.revenue / metrics.impressions : 0,
          revenuePerClick: metrics.clicks > 0 ? metrics.revenue / metrics.clicks : 0,
          placement: element.placement_info,
          lastUpdated: new Date()
        })

        totalRevenue += metrics.revenue
        totalConversions += metrics.conversions
        totalImpressions += metrics.impressions
      }

      // Sort by revenue to identify top performers and underperformers
      const sortedByRevenue = [...elementPerformance].sort((a, b) => b.revenue - a.revenue)
      const topPerformers = sortedByRevenue.slice(0, 3)
      const underperformers = sortedByRevenue.slice(-3).filter(e => e.revenue < totalRevenue / elements.length * 0.5)

      // Generate recommendations
      const recommendations = this.generatePerformanceRecommendations(
        elementPerformance,
        topPerformers,
        underperformers
      )

      return {
        contentId,
        totalRevenue,
        totalConversions,
        averageConversionRate: totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0,
        elementPerformance,
        topPerformers,
        underperformers,
        recommendations,
        lastAnalyzed: new Date()
      }
    } catch (error) {
      throw new MonetizationError('Failed to analyze element performance', 'PERFORMANCE_ANALYSIS_ERROR', error)
    }
  }

  /**
   * Attribute revenue to specific monetization elements
   */
  async attributeRevenue(contentId: string): Promise<RevenueAttribution> {
    try {
      // Get all monetization elements
      const elements = await this.getMonetizationElements(contentId)
      
      // Get conversion data
      const conversions = await this.getConversions(contentId)
      
      // Attribution model: Multi-touch with position-based weighting
      const attributionMap: Record<string, number> = {}
      
      for (const conversion of conversions) {
        const touchpoints = conversion.touchpoints || []
        
        if (touchpoints.length === 0) continue
        
        // Position-based attribution: 40% first touch, 40% last touch, 20% middle touches
        touchpoints.forEach((touchpoint: any, index: number) => {
          let weight = 0
          
          if (touchpoints.length === 1) {
            weight = 1.0
          } else if (index === 0) {
            weight = 0.4
          } else if (index === touchpoints.length - 1) {
            weight = 0.4
          } else {
            weight = 0.2 / (touchpoints.length - 2)
          }
          
          const elementId = touchpoint.elementId
          if (!attributionMap[elementId]) {
            attributionMap[elementId] = 0
          }
          attributionMap[elementId] += conversion.revenue * weight
        })
      }

      // Build attribution breakdown
      const attributionBreakdown = elements.map(element => ({
        elementId: element.id,
        elementType: element.element_type,
        attributedRevenue: attributionMap[element.id] || 0,
        directRevenue: element.performance_metrics?.revenue || 0,
        attributionPercentage: 0, // Will calculate after total
        conversionCount: element.performance_metrics?.conversions || 0
      }))

      const totalAttributedRevenue = Object.values(attributionMap).reduce((sum, val) => sum + val, 0)
      
      // Calculate attribution percentages
      attributionBreakdown.forEach(item => {
        item.attributionPercentage = totalAttributedRevenue > 0 
          ? (item.attributedRevenue / totalAttributedRevenue) * 100 
          : 0
      })

      // Store attribution data
      await this.storeRevenueAttribution(contentId, attributionBreakdown, totalAttributedRevenue)

      return {
        contentId,
        attributionModel: 'position-based',
        totalRevenue: totalAttributedRevenue,
        attributionBreakdown,
        conversionPaths: conversions.map((c: any) => ({
          conversionId: c.id,
          touchpoints: c.touchpoints || [],
          revenue: c.revenue,
          timestamp: c.converted_at
        })),
        confidence: this.calculateAttributionConfidence(conversions.length, elements.length),
        lastUpdated: new Date()
      }
    } catch (error) {
      throw new MonetizationError('Failed to attribute revenue', 'REVENUE_ATTRIBUTION_ERROR', error)
    }
  }

  /**
   * Optimize monetization strategy based on performance data
   */
  async optimizeStrategy(
    contentId: string,
    performanceData: MonetizationPerformance
  ): Promise<MonetizationOptimization> {
    try {
      const optimizations: OptimizationRecommendation[] = []
      
      // Analyze underperformers and generate optimizations
      for (const underperformer of performanceData.underperformers) {
        // Low CTR optimization
        if (underperformer.clickThroughRate < 1.0) {
          optimizations.push({
            elementId: underperformer.elementId,
            type: 'placement',
            description: 'Move element to more prominent position',
            currentValue: underperformer.placement,
            suggestedValue: this.suggestBetterPlacement(underperformer),
            expectedImpact: 0.25,
            priority: 'high',
            reason: `CTR of ${underperformer.clickThroughRate.toFixed(2)}% is below 1% threshold`
          })
        }

        // Low conversion rate optimization
        if (underperformer.conversionRate < 2.0 && underperformer.clicks > 10) {
          optimizations.push({
            elementId: underperformer.elementId,
            type: 'content',
            description: 'Improve element copy and value proposition',
            currentValue: 'Current copy',
            suggestedValue: 'Enhanced copy with stronger value proposition',
            expectedImpact: 0.30,
            priority: 'high',
            reason: `Conversion rate of ${underperformer.conversionRate.toFixed(2)}% is below 2% threshold`
          })
        }

        // Element type optimization
        if (underperformer.elementType === 'inline_link' && underperformer.revenue < 10) {
          optimizations.push({
            elementId: underperformer.elementId,
            type: 'element_type',
            description: 'Convert inline link to product card for better visibility',
            currentValue: 'inline_link',
            suggestedValue: 'product_card',
            expectedImpact: 0.40,
            priority: 'medium',
            reason: 'Inline links typically have lower conversion rates than product cards'
          })
        }
      }

      // Replicate top performer strategies
      if (performanceData.topPerformers.length > 0) {
        const topPerformer = performanceData.topPerformers[0]
        
        optimizations.push({
          elementId: 'new',
          type: 'replication',
          description: 'Add similar element based on top performer',
          currentValue: null,
          suggestedValue: {
            type: topPerformer.elementType,
            placement: this.findOptimalPlacementForReplication(topPerformer)
          },
          expectedImpact: 0.50,
          priority: 'high',
          reason: `Top performer generates $${topPerformer.revenue.toFixed(2)} revenue`
        })
      }

      // Calculate expected impact
      const totalExpectedImpact = optimizations.reduce((sum, opt) => sum + opt.expectedImpact, 0)
      const expectedRevenueIncrease = performanceData.totalRevenue * totalExpectedImpact

      return {
        contentId,
        currentPerformance: performanceData,
        optimizations,
        expectedRevenueIncrease,
        expectedConversionRateIncrease: totalExpectedImpact * 100,
        implementationPriority: this.prioritizeOptimizations(optimizations),
        confidence: 0.75,
        createdAt: new Date()
      }
    } catch (error) {
      throw new MonetizationError('Failed to optimize strategy', 'STRATEGY_OPTIMIZATION_ERROR', error)
    }
  }

  /**
   * Create performance test for monetization elements
   */
  async createPerformanceTest(
    contentId: string,
    testType: 'placement' | 'element_type' | 'copy' | 'timing'
  ): Promise<MonetizationTest> {
    try {
      const elements = await this.getMonetizationElements(contentId)
      
      if (elements.length === 0) {
        throw new MonetizationError('No monetization elements found to test', 'NO_ELEMENTS_ERROR')
      }

      // Select element to test (lowest performing)
      const elementMetrics = await Promise.all(
        elements.map(async e => ({
          element: e,
          metrics: await this.getElementMetrics(e.id)
        }))
      )
      
      const sortedByRevenue = elementMetrics.sort((a, b) => a.metrics.revenue - b.metrics.revenue)
      const testElement = sortedByRevenue[0].element

      // Create test variants based on test type
      const variants = this.createTestVariants(testElement, testType)

      const test: MonetizationTest = {
        testId: `test_${Date.now()}`,
        contentId,
        testType,
        elementId: testElement.id,
        variants,
        trafficSplit: variants.map(() => 1 / variants.length),
        successMetric: 'revenue',
        status: 'running',
        startedAt: new Date(),
        minSampleSize: 100,
        maxDuration: 14 // days
      }

      // Store test in database
      await this.storeMonetizationTest(test)

      return test
    } catch (error) {
      throw new MonetizationError('Failed to create performance test', 'TEST_CREATION_ERROR', error)
    }
  }

  /**
   * Analyze test results and determine winner
   */
  async analyzeTestResults(testId: string): Promise<MonetizationTestResults> {
    try {
      const test = await this.getMonetizationTest(testId)
      
      if (!test) {
        throw new MonetizationError('Test not found', 'TEST_NOT_FOUND')
      }

      // Get performance data for each variant
      const variantResults = await Promise.all(
        test.variants.map(async variant => {
          const metrics = await this.getVariantMetrics(testId, variant.variantId)
          return {
            variantId: variant.variantId,
            variant,
            impressions: metrics.impressions,
            clicks: metrics.clicks,
            conversions: metrics.conversions,
            revenue: metrics.revenue,
            conversionRate: metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0
          }
        })
      )

      // Calculate statistical significance
      const significance = this.calculateStatisticalSignificance(variantResults)

      // Determine winner
      const winner = significance >= 0.95 
        ? this.determineWinner(variantResults, test.successMetric)
        : undefined

      // Calculate test duration
      const duration = test.endedAt 
        ? Math.floor((test.endedAt.getTime() - test.startedAt.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((Date.now() - test.startedAt.getTime()) / (1000 * 60 * 60 * 24))

      const results: MonetizationTestResults = {
        testId,
        test,
        variantResults,
        winner,
        statisticalSignificance: significance,
        testDuration: duration,
        totalSamples: variantResults.reduce((sum, v) => sum + v.impressions, 0),
        recommendation: winner 
          ? `Implement variant ${winner.variantId} - ${winner.variant.description}`
          : 'Continue test - insufficient data for conclusive results',
        completedAt: new Date()
      }

      // Update test status if complete
      if (winner || duration >= test.maxDuration) {
        await this.updateTestStatus(testId, 'completed', results)
      }

      return results
    } catch (error) {
      throw new MonetizationError('Failed to analyze test results', 'TEST_ANALYSIS_ERROR', error)
    }
  }

  /**
   * Get top performing monetization elements for user
   */
  async getTopPerformingElements(
    userId: string,
    limit: number = 10
  ): Promise<ElementPerformanceMetrics[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT 
          me.*,
          c.title as content_title
        FROM monetization_elements me
        JOIN content c ON me.content_id = c.id
        WHERE c.user_id = $1
          AND me.performance_metrics IS NOT NULL
        ORDER BY (me.performance_metrics->>'revenue_generated')::numeric DESC
        LIMIT $2
      `, [userId, limit], 'get_top_performing_elements')

      return result.map(row => ({
        elementId: row.id,
        elementType: row.element_type,
        contentTitle: row.content_title,
        impressions: row.performance_metrics?.impressions || 0,
        clicks: row.performance_metrics?.clicks || 0,
        conversions: row.performance_metrics?.conversions || 0,
        revenue: parseFloat(row.revenue_generated) || 0,
        clickThroughRate: row.performance_metrics?.click_through_rate || 0,
        conversionRate: parseFloat(row.conversion_rate) || 0,
        revenuePerImpression: row.performance_metrics?.revenue_per_impression || 0,
        revenuePerClick: row.performance_metrics?.revenue_per_click || 0,
        placement: row.placement_info,
        lastUpdated: row.last_optimized || new Date()
      }))
    } catch (error) {
      throw new MonetizationError('Failed to get top performing elements', 'GET_TOP_ELEMENTS_ERROR', error)
    }
  }

  // Private helper methods

  private async getMonetizationElements(contentId: string): Promise<any[]> {
    const result = await query(`
      SELECT * FROM monetization_elements 
      WHERE content_id = $1
      ORDER BY created_at ASC
    `, [contentId])
    
    return result
  }

  private async getElementMetrics(elementId: string): Promise<any> {
    const result = await query(`
      SELECT performance_metrics, revenue_generated, conversion_rate
      FROM monetization_elements
      WHERE id = $1
    `, [elementId])

    if (result.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    const metrics = result[0].performance_metrics || {}
    return {
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      revenue: parseFloat(result[0].revenue_generated) || 0
    }
  }

  private async getConversions(contentId: string): Promise<any[]> {
    const result = await query(`
      SELECT 
        id,
        order_value as revenue,
        converted_at,
        metadata
      FROM affiliate_conversions
      WHERE content_id = $1
        AND status = 'confirmed'
      ORDER BY converted_at DESC
    `, [contentId])

    return result.map(row => ({
      id: row.id,
      revenue: parseFloat(row.revenue) || 0,
      converted_at: row.converted_at,
      touchpoints: row.metadata?.touchpoints || []
    }))
  }

  private generatePerformanceRecommendations(
    allElements: ElementPerformanceMetrics[],
    topPerformers: ElementPerformanceMetrics[],
    underperformers: ElementPerformanceMetrics[]
  ): string[] {
    const recommendations: string[] = []

    if (underperformers.length > 0) {
      recommendations.push(
        `${underperformers.length} element(s) are underperforming. Consider optimizing placement, copy, or element type.`
      )
    }

    if (topPerformers.length > 0) {
      const topRevenue = topPerformers[0].revenue
      recommendations.push(
        `Top performer generates $${topRevenue.toFixed(2)} revenue. Consider replicating this strategy in other content.`
      )
    }

    const avgCTR = allElements.reduce((sum, e) => sum + e.clickThroughRate, 0) / allElements.length
    if (avgCTR < 2.0) {
      recommendations.push(
        `Average CTR of ${avgCTR.toFixed(2)}% is below optimal. Improve element visibility and placement.`
      )
    }

    const avgConversionRate = allElements.reduce((sum, e) => sum + e.conversionRate, 0) / allElements.length
    if (avgConversionRate < 3.0) {
      recommendations.push(
        `Average conversion rate of ${avgConversionRate.toFixed(2)}% is below optimal. Enhance value propositions and CTAs.`
      )
    }

    return recommendations
  }

  private suggestBetterPlacement(element: ElementPerformanceMetrics): any {
    // Suggest more prominent placement based on current location
    const currentLocation = element.placement?.location || 'inline'
    
    const placementHierarchy = ['exit_intent', 'popup', 'header', 'sidebar', 'inline', 'footer']
    const currentIndex = placementHierarchy.indexOf(currentLocation)
    
    if (currentIndex > 0) {
      return {
        location: placementHierarchy[currentIndex - 1],
        reason: 'More prominent placement for better visibility'
      }
    }
    
    return {
      location: 'header',
      reason: 'Header placement for maximum visibility'
    }
  }

  private findOptimalPlacementForReplication(topPerformer: ElementPerformanceMetrics): any {
    return {
      location: topPerformer.placement?.location || 'inline',
      position: 'similar_context',
      reason: 'Replicate successful placement strategy'
    }
  }

  private prioritizeOptimizations(optimizations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    return optimizations.sort((a, b) => {
      // Sort by priority (high > medium > low) then by expected impact
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityWeight[a.priority]
      const bPriority = priorityWeight[b.priority]
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return b.expectedImpact - a.expectedImpact
    })
  }

  private createTestVariants(element: any, testType: string): any[] {
    const variants = [
      {
        variantId: 'control',
        description: 'Current configuration',
        changes: {}
      }
    ]

    switch (testType) {
      case 'placement':
        variants.push({
          variantId: 'variant_1',
          description: 'Header placement',
          changes: { placement: { location: 'header' } }
        })
        variants.push({
          variantId: 'variant_2',
          description: 'Sidebar placement',
          changes: { placement: { location: 'sidebar' } }
        })
        break
      
      case 'element_type':
        variants.push({
          variantId: 'variant_1',
          description: 'Product card format',
          changes: { element_type: 'product_card' }
        })
        variants.push({
          variantId: 'variant_2',
          description: 'Recommendation box format',
          changes: { element_type: 'recommendation_box' }
        })
        break
      
      case 'copy':
        variants.push({
          variantId: 'variant_1',
          description: 'Urgency-focused copy',
          changes: { copy_style: 'urgency' }
        })
        variants.push({
          variantId: 'variant_2',
          description: 'Value-focused copy',
          changes: { copy_style: 'value' }
        })
        break
      
      case 'timing':
        variants.push({
          variantId: 'variant_1',
          description: 'Early placement (30% through content)',
          changes: { timing: 0.3 }
        })
        variants.push({
          variantId: 'variant_2',
          description: 'Late placement (70% through content)',
          changes: { timing: 0.7 }
        })
        break
    }

    return variants
  }

  private calculateStatisticalSignificance(variants: any[]): number {
    if (variants.length < 2) return 0

    const control = variants[0]
    const treatment = variants[1]

    const p1 = control.conversions / Math.max(control.impressions, 1)
    const p2 = treatment.conversions / Math.max(treatment.impressions, 1)
    const n1 = control.impressions
    const n2 = treatment.impressions

    if (n1 < 30 || n2 < 30) return 0

    const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2)
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2))
    
    if (se === 0) return 0

    const z = Math.abs(p1 - p2) / se
    
    if (z > 2.58) return 0.99
    if (z > 1.96) return 0.95
    if (z > 1.65) return 0.90
    if (z > 1.28) return 0.80
    return 0.50
  }

  private determineWinner(variants: any[], metric: string): any {
    return variants.reduce((best, current) => {
      let bestScore = 0
      let currentScore = 0

      switch (metric) {
        case 'revenue':
          bestScore = best.revenue
          currentScore = current.revenue
          break
        case 'conversions':
          bestScore = best.conversions
          currentScore = current.conversions
          break
        case 'clicks':
          bestScore = best.clicks
          currentScore = current.clicks
          break
        default:
          bestScore = best.revenue
          currentScore = current.revenue
      }

      return currentScore > bestScore ? current : best
    })
  }

  private calculateAttributionConfidence(conversionCount: number, elementCount: number): number {
    let confidence = 0.5

    if (conversionCount > 10) confidence += 0.1
    if (conversionCount > 50) confidence += 0.1
    if (conversionCount > 100) confidence += 0.1
    if (elementCount > 2) confidence += 0.1
    if (elementCount > 5) confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  private async storeRevenueAttribution(
    contentId: string,
    breakdown: any[],
    totalRevenue: number
  ): Promise<void> {
    await query(`
      INSERT INTO revenue_attribution (
        content_id,
        attribution_model,
        direct_revenue,
        indirect_revenue,
        conversion_path,
        confidence_score,
        tracked_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      contentId,
      'position-based',
      totalRevenue,
      0,
      JSON.stringify(breakdown),
      this.calculateAttributionConfidence(breakdown.length, breakdown.length)
    ])
  }

  private async storeMonetizationTest(test: MonetizationTest): Promise<void> {
    await query(`
      INSERT INTO ab_tests (
        id,
        test_name,
        test_type,
        variants,
        traffic_split,
        success_metric,
        status,
        started_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      test.testId,
      `Monetization ${test.testType} test`,
      test.testType,
      JSON.stringify(test.variants),
      JSON.stringify(test.trafficSplit),
      test.successMetric,
      test.status,
      test.startedAt
    ])
  }

  private async getMonetizationTest(testId: string): Promise<MonetizationTest | null> {
    const result = await query(`
      SELECT * FROM ab_tests WHERE id = $1
    `, [testId])

    if (result.length === 0) return null

    const row = result[0]
    return {
      testId: row.id,
      contentId: row.content_id || '',
      testType: row.test_type,
      elementId: row.element_id || '',
      variants: row.variants,
      trafficSplit: row.traffic_split,
      successMetric: row.success_metric,
      status: row.status,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      minSampleSize: 100,
      maxDuration: 14
    }
  }

  private async getVariantMetrics(testId: string, variantId: string): Promise<any> {
    const result = await query(`
      SELECT * FROM ab_test_results
      WHERE test_id = $1 AND variant_id = $2
    `, [testId, variantId])

    if (result.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    const row = result[0]
    return {
      impressions: row.impressions || 0,
      clicks: row.clicks || 0,
      conversions: row.conversions || 0,
      revenue: parseFloat(row.revenue) || 0
    }
  }

  private async updateTestStatus(
    testId: string,
    status: string,
    results: MonetizationTestResults
  ): Promise<void> {
    await query(`
      UPDATE ab_tests
      SET status = $1,
          ended_at = NOW(),
          results = $2,
          winner_variant_id = $3,
          statistical_significance = $4
      WHERE id = $5
    `, [
      status,
      JSON.stringify(results),
      results.winner?.variantId || null,
      results.statisticalSignificance,
      testId
    ])
  }
}

// Export singleton instance
export const monetizationPerformanceOptimizer = MonetizationPerformanceOptimizerImpl.getInstance()
