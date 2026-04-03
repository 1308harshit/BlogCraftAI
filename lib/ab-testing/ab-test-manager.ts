// A/B Test Manager
// Automated A/B testing framework with statistical analysis

import {
  ABTest,
  TestVariant,
  TestResults,
  VariantPerformance,
  TestConfig,
  OptimizationRecommendation
} from './types'

export class ABTestManager {
  private static instance: ABTestManager
  private tests: Map<string, ABTest> = new Map()
  private config: TestConfig = {
    minSampleSize: 100,
    maxDuration: 14,
    confidenceLevel: 0.95,
    trafficSplit: 'even',
    autoImplementWinner: false
  }

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager()
    }
    return ABTestManager.instance
  }

  // Create new A/B test
  async createTest(
    name: string,
    type: ABTest['type'],
    variants: Array<{ name: string; content: string; isControl?: boolean }>,
    targetMetric: ABTest['targetMetric']
  ): Promise<ABTest> {
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const testVariants: TestVariant[] = variants.map((v, index) => ({
      id: `variant_${index}`,
      name: v.name,
      content: v.content,
      isControl: v.isControl || index === 0,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        engagement: 0,
        bounceRate: 0,
        timeOnPage: 0
      },
      sampleSize: 0
    }))

    const trafficAllocation: Record<string, number> = {}
    const splitPercentage = 1 / testVariants.length
    testVariants.forEach(v => {
      trafficAllocation[v.id] = splitPercentage
    })

    const test: ABTest = {
      id: testId,
      name,
      type,
      status: 'draft',
      variants: testVariants,
      trafficAllocation,
      startDate: new Date(),
      targetMetric,
      minimumSampleSize: this.config.minSampleSize,
      confidenceLevel: this.config.confidenceLevel,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.tests.set(testId, test)

    console.log(`Created A/B test: ${name}`)
    console.log(`  Type: ${type}`)
    console.log(`  Variants: ${testVariants.length}`)
    console.log(`  Target metric: ${targetMetric}`)

    return test
  }

  // Start test
  async startTest(testId: string): Promise<void> {
    const test = this.tests.get(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    test.status = 'running'
    test.startDate = new Date()
    test.updatedAt = new Date()

    console.log(`Started A/B test: ${test.name}`)
  }

  // Record test event
  async recordEvent(
    testId: string,
    variantId: string,
    eventType: 'impression' | 'click' | 'conversion' | 'engagement',
    value?: number
  ): Promise<void> {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'running') return

    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return

    switch (eventType) {
      case 'impression':
        variant.metrics.impressions++
        variant.sampleSize++
        break
      case 'click':
        variant.metrics.clicks++
        break
      case 'conversion':
        variant.metrics.conversions++
        if (value) variant.metrics.revenue += value
        break
      case 'engagement':
        variant.metrics.engagement++
        break
    }

    test.updatedAt = new Date()

    // Check if test should be analyzed
    if (this.shouldAnalyzeTest(test)) {
      await this.analyzeTest(testId)
    }
  }

  // Check if test should be analyzed
  private shouldAnalyzeTest(test: ABTest): boolean {
    const minSampleReached = test.variants.every(
      v => v.sampleSize >= test.minimumSampleSize
    )
    
    const maxDurationReached = test.endDate && new Date() >= test.endDate

    return minSampleReached || !!maxDurationReached
  }

  // Analyze test results
  async analyzeTest(testId: string): Promise<TestResults> {
    const test = this.tests.get(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    console.log(`Analyzing A/B test: ${test.name}`)

    const variantPerformance: Record<string, VariantPerformance> = {}
    const control = test.variants.find(v => v.isControl)
    
    if (!control) throw new Error('No control variant found')

    // Calculate performance for each variant
    test.variants.forEach(variant => {
      const conversionRate = variant.metrics.conversions / Math.max(1, variant.metrics.impressions)
      const clickThroughRate = variant.metrics.clicks / Math.max(1, variant.metrics.impressions)
      const engagementRate = variant.metrics.engagement / Math.max(1, variant.metrics.impressions)
      const revenuePerVisitor = variant.metrics.revenue / Math.max(1, variant.metrics.impressions)

      const controlConversionRate = control.metrics.conversions / Math.max(1, control.metrics.impressions)
      const relativeImprovement = variant.isControl ? 0 : 
        ((conversionRate - controlConversionRate) / controlConversionRate) * 100

      variantPerformance[variant.id] = {
        variantId: variant.id,
        conversionRate,
        clickThroughRate,
        engagementRate,
        revenuePerVisitor,
        relativeImprovement,
        confidence: this.calculateConfidence(variant, control)
      }
    })

    // Determine winner
    const winner = this.determineWinner(test.variants, variantPerformance, test.targetMetric)
    const winnerPerformance = variantPerformance[winner]
    const pValue = this.calculatePValue(test.variants.find(v => v.id === winner)!, control)
    const statisticalSignificance = pValue < (1 - test.confidenceLevel)

    const results: TestResults = {
      winner,
      confidence: winnerPerformance.confidence,
      improvement: winnerPerformance.relativeImprovement,
      statisticalSignificance,
      pValue,
      variantPerformance,
      recommendation: this.generateRecommendation(winner, winnerPerformance, statisticalSignificance),
      insights: this.generateInsights(test, variantPerformance)
    }

    test.results = results
    test.winner = winner

    if (statisticalSignificance && this.config.autoImplementWinner) {
      test.status = 'completed'
      console.log(`Test completed. Winner: ${test.variants.find(v => v.id === winner)?.name}`)
    }

    console.log(`Analysis complete:`)
    console.log(`  Winner: ${test.variants.find(v => v.id === winner)?.name}`)
    console.log(`  Improvement: ${winnerPerformance.relativeImprovement.toFixed(2)}%`)
    console.log(`  Confidence: ${(winnerPerformance.confidence * 100).toFixed(1)}%`)
    console.log(`  Statistical significance: ${statisticalSignificance}`)

    return results
  }

  // Calculate confidence interval
  private calculateConfidence(variant: TestVariant, control: TestVariant): number {
    const variantRate = variant.metrics.conversions / Math.max(1, variant.metrics.impressions)
    const controlRate = control.metrics.conversions / Math.max(1, control.metrics.impressions)
    
    const pooledRate = (variant.metrics.conversions + control.metrics.conversions) /
      (variant.metrics.impressions + control.metrics.impressions)
    
    const se = Math.sqrt(
      pooledRate * (1 - pooledRate) * 
      (1 / variant.metrics.impressions + 1 / control.metrics.impressions)
    )
    
    const zScore = Math.abs(variantRate - controlRate) / se
    
    // Convert z-score to confidence level (simplified)
    if (zScore > 2.576) return 0.99
    if (zScore > 1.96) return 0.95
    if (zScore > 1.645) return 0.90
    return 0.80
  }

  // Calculate p-value
  private calculatePValue(variant: TestVariant, control: TestVariant): number {
    const variantRate = variant.metrics.conversions / Math.max(1, variant.metrics.impressions)
    const controlRate = control.metrics.conversions / Math.max(1, control.metrics.impressions)
    
    const pooledRate = (variant.metrics.conversions + control.metrics.conversions) /
      (variant.metrics.impressions + control.metrics.impressions)
    
    const se = Math.sqrt(
      pooledRate * (1 - pooledRate) * 
      (1 / variant.metrics.impressions + 1 / control.metrics.impressions)
    )
    
    const zScore = Math.abs(variantRate - controlRate) / se
    
    // Simplified p-value calculation
    return Math.max(0.01, 1 - (zScore / 3))
  }

  // Determine winner
  private determineWinner(
    variants: TestVariant[],
    performance: Record<string, VariantPerformance>,
    targetMetric: ABTest['targetMetric']
  ): string {
    let bestVariant = variants[0].id
    let bestValue = 0

    variants.forEach(variant => {
      const perf = performance[variant.id]
      let value = 0

      switch (targetMetric) {
        case 'clicks':
          value = perf.clickThroughRate
          break
        case 'conversions':
          value = perf.conversionRate
          break
        case 'engagement':
          value = perf.engagementRate
          break
        case 'revenue':
          value = perf.revenuePerVisitor
          break
      }

      if (value > bestValue) {
        bestValue = value
        bestVariant = variant.id
      }
    })

    return bestVariant
  }

  // Generate recommendation
  private generateRecommendation(
    winnerId: string,
    performance: VariantPerformance,
    significant: boolean
  ): string {
    if (!significant) {
      return 'Results are not statistically significant. Continue testing or try different variants.'
    }

    if (performance.relativeImprovement > 20) {
      return `Strong winner identified! Implement immediately for ${performance.relativeImprovement.toFixed(1)}% improvement.`
    } else if (performance.relativeImprovement > 10) {
      return `Moderate improvement detected. Implement winner for ${performance.relativeImprovement.toFixed(1)}% gain.`
    } else if (performance.relativeImprovement > 5) {
      return `Small but significant improvement. Consider implementing for ${performance.relativeImprovement.toFixed(1)}% gain.`
    } else {
      return 'Minimal difference detected. Consider testing more dramatic variations.'
    }
  }

  // Generate insights
  private generateInsights(
    test: ABTest,
    performance: Record<string, VariantPerformance>
  ): string[] {
    const insights: string[] = []

    const performances = Object.values(performance)
    const avgImprovement = performances.reduce((sum, p) => sum + p.relativeImprovement, 0) / performances.length

    if (avgImprovement > 15) {
      insights.push('High variation in performance suggests strong element sensitivity')
    }

    const topPerformer = performances.sort((a, b) => b.relativeImprovement - a.relativeImprovement)[0]
    if (topPerformer.relativeImprovement > 30) {
      insights.push('Exceptional performance indicates highly effective variation')
    }

    const lowPerformers = performances.filter(p => p.relativeImprovement < -10)
    if (lowPerformers.length > 0) {
      insights.push('Some variants significantly underperformed - avoid similar approaches')
    }

    return insights
  }

  // Get test
  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId)
  }

  // Get all tests
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values())
  }

  // Get running tests
  getRunningTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(t => t.status === 'running')
  }

  // Pause test
  async pauseTest(testId: string): Promise<void> {
    const test = this.tests.get(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    test.status = 'paused'
    test.updatedAt = new Date()
  }

  // Resume test
  async resumeTest(testId: string): Promise<void> {
    const test = this.tests.get(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    test.status = 'running'
    test.updatedAt = new Date()
  }

  // Complete test
  async completeTest(testId: string): Promise<void> {
    const test = this.tests.get(testId)
    if (!test) throw new Error(`Test ${testId} not found`)

    if (!test.results) {
      await this.analyzeTest(testId)
    }

    test.status = 'completed'
    test.endDate = new Date()
    test.updatedAt = new Date()
  }
}

export const abTestManager = ABTestManager.getInstance()
