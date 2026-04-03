// Revenue Attribution Engine
// Multi-touch attribution with multiple models and ROI calculation

import {
  AttributionModel,
  Touchpoint,
  ConversionPath,
  AttributionResult,
  RevenueAttribution,
  RevenueMetrics,
  ChannelPerformance,
  ContentROI,
  TouchpointType
} from './types'

export class RevenueAttributionEngine {
  private static instance: RevenueAttributionEngine
  private conversionPaths: Map<string, ConversionPath> = new Map()
  private attributions: Map<string, RevenueAttribution> = new Map()

  static getInstance(): RevenueAttributionEngine {
    if (!RevenueAttributionEngine.instance) {
      RevenueAttributionEngine.instance = new RevenueAttributionEngine()
    }
    return RevenueAttributionEngine.instance
  }

  // Track touchpoint
  async trackTouchpoint(touchpoint: Touchpoint): Promise<void> {
    console.log(`Tracking touchpoint: ${touchpoint.type} from ${touchpoint.source}`)
    
    // In production, this would store in database
    // For now, we'll keep in memory
  }

  // Track conversion and create path
  async trackConversion(
    userId: string,
    touchpoints: Touchpoint[],
    conversionValue: number,
    conversionType: string
  ): Promise<ConversionPath> {
    const pathId = `path_${userId}_${Date.now()}`
    
    // Calculate time to conversion
    const firstTouch = touchpoints[0]
    const lastTouch = touchpoints[touchpoints.length - 1]
    const timeToConversion = (lastTouch.timestamp.getTime() - firstTouch.timestamp.getTime()) / (1000 * 60 * 60)

    const conversionPath: ConversionPath = {
      id: pathId,
      userId,
      touchpoints,
      conversionValue,
      conversionType,
      conversionDate: new Date(),
      pathLength: touchpoints.length,
      timeToConversion
    }

    this.conversionPaths.set(pathId, conversionPath)
    
    console.log(`Conversion tracked: ${pathId}`)
    console.log(`  Value: $${conversionValue}`)
    console.log(`  Path length: ${touchpoints.length} touchpoints`)
    console.log(`  Time to conversion: ${timeToConversion.toFixed(1)} hours`)

    return conversionPath
  }

  // Calculate attribution using specified model
  async calculateAttribution(
    conversionPath: ConversionPath,
    model: AttributionModel = 'linear'
  ): Promise<RevenueAttribution> {
    const attributions: AttributionResult[] = []

    switch (model) {
      case 'first_touch':
        attributions.push(...this.firstTouchAttribution(conversionPath))
        break
      case 'last_touch':
        attributions.push(...this.lastTouchAttribution(conversionPath))
        break
      case 'linear':
        attributions.push(...this.linearAttribution(conversionPath))
        break
      case 'time_decay':
        attributions.push(...this.timeDecayAttribution(conversionPath))
        break
      case 'position_based':
        attributions.push(...this.positionBasedAttribution(conversionPath))
        break
      case 'data_driven':
        attributions.push(...this.dataDrivenAttribution(conversionPath))
        break
    }

    const revenueAttribution: RevenueAttribution = {
      conversionPathId: conversionPath.id,
      totalRevenue: conversionPath.conversionValue,
      attributions,
      model,
      calculatedAt: new Date()
    }

    this.attributions.set(conversionPath.id, revenueAttribution)

    return revenueAttribution
  }

  // First-touch attribution: 100% credit to first touchpoint
  private firstTouchAttribution(path: ConversionPath): AttributionResult[] {
    const firstTouchpoint = path.touchpoints[0]
    
    return [{
      touchpointId: firstTouchpoint.id,
      type: firstTouchpoint.type,
      source: firstTouchpoint.source,
      attributedRevenue: path.conversionValue,
      attributionWeight: 1.0,
      model: 'first_touch',
      confidence: 0.7
    }]
  }

  // Last-touch attribution: 100% credit to last touchpoint
  private lastTouchAttribution(path: ConversionPath): AttributionResult[] {
    const lastTouchpoint = path.touchpoints[path.touchpoints.length - 1]
    
    return [{
      touchpointId: lastTouchpoint.id,
      type: lastTouchpoint.type,
      source: lastTouchpoint.source,
      attributedRevenue: path.conversionValue,
      attributionWeight: 1.0,
      model: 'last_touch',
      confidence: 0.7
    }]
  }

  // Linear attribution: Equal credit to all touchpoints
  private linearAttribution(path: ConversionPath): AttributionResult[] {
    const weight = 1 / path.touchpoints.length
    const revenuePerTouch = path.conversionValue * weight

    return path.touchpoints.map(touchpoint => ({
      touchpointId: touchpoint.id,
      type: touchpoint.type,
      source: touchpoint.source,
      attributedRevenue: revenuePerTouch,
      attributionWeight: weight,
      model: 'linear',
      confidence: 0.8
    }))
  }

  // Time-decay attribution: More credit to recent touchpoints
  private timeDecayAttribution(path: ConversionPath): AttributionResult[] {
    const halfLife = 7 // days
    const conversionTime = path.conversionDate.getTime()
    
    // Calculate decay weights
    const weights = path.touchpoints.map(touchpoint => {
      const daysSince = (conversionTime - touchpoint.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      return Math.pow(2, -daysSince / halfLife)
    })

    const totalWeight = weights.reduce((sum, w) => sum + w, 0)

    return path.touchpoints.map((touchpoint, index) => {
      const weight = weights[index] / totalWeight
      return {
        touchpointId: touchpoint.id,
        type: touchpoint.type,
        source: touchpoint.source,
        attributedRevenue: path.conversionValue * weight,
        attributionWeight: weight,
        model: 'time_decay',
        confidence: 0.85
      }
    })
  }

  // Position-based attribution: 40% first, 40% last, 20% middle
  private positionBasedAttribution(path: ConversionPath): AttributionResult[] {
    if (path.touchpoints.length === 1) {
      return this.firstTouchAttribution(path)
    }

    if (path.touchpoints.length === 2) {
      return [
        {
          touchpointId: path.touchpoints[0].id,
          type: path.touchpoints[0].type,
          source: path.touchpoints[0].source,
          attributedRevenue: path.conversionValue * 0.5,
          attributionWeight: 0.5,
          model: 'position_based',
          confidence: 0.8
        },
        {
          touchpointId: path.touchpoints[1].id,
          type: path.touchpoints[1].type,
          source: path.touchpoints[1].source,
          attributedRevenue: path.conversionValue * 0.5,
          attributionWeight: 0.5,
          model: 'position_based',
          confidence: 0.8
        }
      ]
    }

    const middleCount = path.touchpoints.length - 2
    const middleWeight = 0.2 / middleCount

    return path.touchpoints.map((touchpoint, index) => {
      let weight: number
      if (index === 0) {
        weight = 0.4 // First touch
      } else if (index === path.touchpoints.length - 1) {
        weight = 0.4 // Last touch
      } else {
        weight = middleWeight // Middle touches
      }

      return {
        touchpointId: touchpoint.id,
        type: touchpoint.type,
        source: touchpoint.source,
        attributedRevenue: path.conversionValue * weight,
        attributionWeight: weight,
        model: 'position_based',
        confidence: 0.85
      }
    })
  }

  // Data-driven attribution: ML-based attribution (simplified)
  private dataDrivenAttribution(path: ConversionPath): AttributionResult[] {
    // In production, this would use ML models trained on historical data
    // For now, use a hybrid approach combining position and time decay
    
    const positionWeights = path.touchpoints.map((_, index) => {
      if (index === 0) return 0.3
      if (index === path.touchpoints.length - 1) return 0.3
      return 0.4 / (path.touchpoints.length - 2)
    })

    const conversionTime = path.conversionDate.getTime()
    const timeWeights = path.touchpoints.map(touchpoint => {
      const daysSince = (conversionTime - touchpoint.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      return Math.pow(2, -daysSince / 7)
    })

    const totalTimeWeight = timeWeights.reduce((sum, w) => sum + w, 0)
    const normalizedTimeWeights = timeWeights.map(w => w / totalTimeWeight)

    // Combine position and time weights
    const combinedWeights = positionWeights.map((pw, index) => 
      (pw * 0.6) + (normalizedTimeWeights[index] * 0.4)
    )

    const totalWeight = combinedWeights.reduce((sum, w) => sum + w, 0)
    const finalWeights = combinedWeights.map(w => w / totalWeight)

    return path.touchpoints.map((touchpoint, index) => ({
      touchpointId: touchpoint.id,
      type: touchpoint.type,
      source: touchpoint.source,
      attributedRevenue: path.conversionValue * finalWeights[index],
      attributionWeight: finalWeights[index],
      model: 'data_driven',
      confidence: 0.9
    }))
  }

  // Calculate revenue metrics
  async calculateRevenueMetrics(
    timeRange: { start: Date; end: Date }
  ): Promise<RevenueMetrics> {
    const paths = Array.from(this.conversionPaths.values()).filter(
      path => path.conversionDate >= timeRange.start && path.conversionDate <= timeRange.end
    )

    const totalRevenue = paths.reduce((sum, path) => sum + path.conversionValue, 0)
    const conversions = paths.length
    const averageOrderValue = conversions > 0 ? totalRevenue / conversions : 0

    // Calculate attributed vs unattributed
    const attributions = Array.from(this.attributions.values())
    const attributedRevenue = attributions.reduce((sum, attr) => sum + attr.totalRevenue, 0)
    const unattributedRevenue = totalRevenue - attributedRevenue

    // Mock additional metrics (would be calculated from real data)
    const conversionRate = 0.025 // 2.5%
    const customerLifetimeValue = averageOrderValue * 3
    const returnOnAdSpend = 4.5
    const costPerAcquisition = averageOrderValue / returnOnAdSpend

    return {
      totalRevenue,
      attributedRevenue,
      unattributedRevenue,
      averageOrderValue,
      conversionRate,
      customerLifetimeValue,
      returnOnAdSpend,
      costPerAcquisition
    }
  }

  // Get channel performance
  async getChannelPerformance(
    timeRange: { start: Date; end: Date }
  ): Promise<ChannelPerformance[]> {
    const attributions = Array.from(this.attributions.values())
    const channelData = new Map<TouchpointType, {
      revenue: number
      conversions: number
      touchpoints: number
      positions: number[]
      cost: number
    }>()

    attributions.forEach(attribution => {
      attribution.attributions.forEach((attr, index) => {
        const existing = channelData.get(attr.type) || {
          revenue: 0,
          conversions: 0,
          touchpoints: 0,
          positions: [],
          cost: 0
        }

        existing.revenue += attr.attributedRevenue
        existing.conversions += attr.attributionWeight
        existing.touchpoints += 1
        existing.positions.push(index)
        existing.cost += attr.attributedRevenue * 0.2 // Mock cost (20% of revenue)

        channelData.set(attr.type, existing)
      })
    })

    return Array.from(channelData.entries()).map(([channel, data]) => {
      const averagePosition = data.positions.reduce((sum, p) => sum + p, 0) / data.positions.length
      const conversionRate = data.conversions / data.touchpoints
      const roi = data.cost > 0 ? ((data.revenue - data.cost) / data.cost) * 100 : 0

      return {
        channel,
        revenue: data.revenue,
        conversions: Math.round(data.conversions),
        touchpoints: data.touchpoints,
        averagePosition,
        conversionRate,
        roi,
        cost: data.cost
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }

  // Get content ROI
  async getContentROI(
    contentIds: string[],
    timeRange: { start: Date; end: Date }
  ): Promise<ContentROI[]> {
    const contentData = new Map<string, {
      revenue: number
      conversions: number
      assistedConversions: number
      touchpoints: number
      positions: number[]
      cost: number
    }>()

    const paths = Array.from(this.conversionPaths.values()).filter(
      path => path.conversionDate >= timeRange.start && path.conversionDate <= timeRange.end
    )

    paths.forEach(path => {
      path.touchpoints.forEach((touchpoint, index) => {
        if (touchpoint.contentId && contentIds.includes(touchpoint.contentId)) {
          const existing = contentData.get(touchpoint.contentId) || {
            revenue: 0,
            conversions: 0,
            assistedConversions: 0,
            touchpoints: 0,
            positions: [],
            cost: 0
          }

          const attribution = this.attributions.get(path.id)
          if (attribution) {
            const attr = attribution.attributions.find(a => a.touchpointId === touchpoint.id)
            if (attr) {
              existing.revenue += attr.attributedRevenue
              if (attr.attributionWeight === 1.0) {
                existing.conversions += 1
              } else {
                existing.assistedConversions += 1
              }
            }
          }

          existing.touchpoints += 1
          existing.positions.push(index)
          existing.cost += 50 // Mock content creation cost

          contentData.set(touchpoint.contentId, existing)
        }
      })
    })

    return Array.from(contentData.entries()).map(([contentId, data]) => {
      const averagePosition = data.positions.reduce((sum, p) => sum + p, 0) / data.positions.length
      const roi = data.cost > 0 ? ((data.revenue - data.cost) / data.cost) * 100 : 0

      return {
        contentId,
        title: `Content ${contentId}`,
        platform: 'blog',
        revenue: data.revenue,
        cost: data.cost,
        roi,
        conversions: data.conversions,
        assistedConversions: data.assistedConversions,
        touchpoints: data.touchpoints,
        averagePosition
      }
    }).sort((a, b) => b.roi - a.roi)
  }

  // Compare attribution models
  async compareAttributionModels(
    conversionPath: ConversionPath
  ): Promise<Map<AttributionModel, RevenueAttribution>> {
    const models: AttributionModel[] = [
      'first_touch',
      'last_touch',
      'linear',
      'time_decay',
      'position_based',
      'data_driven'
    ]

    const results = new Map<AttributionModel, RevenueAttribution>()

    for (const model of models) {
      const attribution = await this.calculateAttribution(conversionPath, model)
      results.set(model, attribution)
    }

    return results
  }

  // Get conversion paths
  getConversionPaths(userId?: string): ConversionPath[] {
    const paths = Array.from(this.conversionPaths.values())
    return userId ? paths.filter(p => p.userId === userId) : paths
  }

  // Get attributions
  getAttributions(pathId?: string): RevenueAttribution[] {
    if (pathId) {
      const attribution = this.attributions.get(pathId)
      return attribution ? [attribution] : []
    }
    return Array.from(this.attributions.values())
  }

  // Clear data (for testing)
  clearData(): void {
    this.conversionPaths.clear()
    this.attributions.clear()
  }
}

export const revenueAttributionEngine = RevenueAttributionEngine.getInstance()
