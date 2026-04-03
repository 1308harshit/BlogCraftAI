// Real-Time Content Optimizer
// Dynamic content adjustment based on performance data

import { ABTest, TestVariant } from './types'
import { abTestManager } from './ab-test-manager'

export interface OptimizationRule {
  id: string
  name: string
  condition: string
  action: string
  threshold: number
  enabled: boolean
}

export interface ContentAdjustment {
  contentId: string
  adjustmentType: 'headline' | 'cta' | 'image' | 'layout'
  originalValue: string
  newValue: string
  reason: string
  expectedImpact: number
  appliedAt: Date
}

export class RealTimeOptimizer {
  private static instance: RealTimeOptimizer
  private rules: Map<string, OptimizationRule> = new Map()
  private adjustments: Map<string, ContentAdjustment[]> = new Map()
  private monitoringInterval: NodeJS.Timeout | null = null

  static getInstance(): RealTimeOptimizer {
    if (!RealTimeOptimizer.instance) {
      RealTimeOptimizer.instance = new RealTimeOptimizer()
    }
    return RealTimeOptimizer.instance
  }

  // Start real-time monitoring
  startMonitoring(intervalMs: number = 60000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    console.log('Starting real-time optimization monitoring...')

    this.monitoringInterval = setInterval(async () => {
      await this.checkAndOptimize()
    }, intervalMs)
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
      console.log('Stopped real-time optimization monitoring')
    }
  }

  // Check and optimize
  private async checkAndOptimize(): Promise<void> {
    const runningTests = abTestManager.getRunningTests()

    for (const test of runningTests) {
      await this.optimizeTest(test)
    }
  }

  // Optimize test
  private async optimizeTest(test: ABTest): Promise<void> {
    // Check if any variant is significantly underperforming
    const control = test.variants.find(v => v.isControl)
    if (!control) return

    const controlRate = control.metrics.conversions / Math.max(1, control.metrics.impressions)

    for (const variant of test.variants) {
      if (variant.isControl) continue

      const variantRate = variant.metrics.conversions / Math.max(1, variant.metrics.impressions)
      const relativePerformance = (variantRate - controlRate) / controlRate

      // If variant is performing 50% worse and has enough data, pause it
      if (relativePerformance < -0.5 && variant.sampleSize >= 50) {
        console.log(`Variant ${variant.name} underperforming by ${(relativePerformance * 100).toFixed(1)}%`)
        // In production, you might want to reduce traffic to this variant
      }

      // If variant is performing 30% better and has enough data, increase traffic
      if (relativePerformance > 0.3 && variant.sampleSize >= 100) {
        console.log(`Variant ${variant.name} outperforming by ${(relativePerformance * 100).toFixed(1)}%`)
        // In production, you might want to increase traffic to this variant
      }
    }
  }

  // Add optimization rule
  addRule(rule: OptimizationRule): void {
    this.rules.set(rule.id, rule)
    console.log(`Added optimization rule: ${rule.name}`)
  }

  // Apply content adjustment
  async applyAdjustment(
    contentId: string,
    adjustmentType: ContentAdjustment['adjustmentType'],
    originalValue: string,
    newValue: string,
    reason: string,
    expectedImpact: number
  ): Promise<ContentAdjustment> {
    const adjustment: ContentAdjustment = {
      contentId,
      adjustmentType,
      originalValue,
      newValue,
      reason,
      expectedImpact,
      appliedAt: new Date()
    }

    const existing = this.adjustments.get(contentId) || []
    existing.push(adjustment)
    this.adjustments.set(contentId, existing)

    console.log(`Applied ${adjustmentType} adjustment to ${contentId}`)
    console.log(`  Reason: ${reason}`)
    console.log(`  Expected impact: ${expectedImpact}%`)

    return adjustment
  }

  // Get adjustments for content
  getAdjustments(contentId: string): ContentAdjustment[] {
    return this.adjustments.get(contentId) || []
  }

  // Get all rules
  getRules(): OptimizationRule[] {
    return Array.from(this.rules.values())
  }
}

export const realTimeOptimizer = RealTimeOptimizer.getInstance()
