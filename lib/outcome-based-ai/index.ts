// Outcome-Based AI - Main Export File
// Centralized exports for the outcome-based AI system

// Core interfaces and types
export * from './types'

// Database models
export * from './models'

// Core optimization engines
export { OutcomeOptimizer, outcomeOptimizer } from './outcome-optimizer'
export { ContentOptimizer, contentOptimizer } from './content-optimizer'

// Performance tracking and ROI
export { PerformanceTracker, performanceTracker } from './performance-tracker'
export { ROICalculatorImpl, roiCalculator } from './roi-calculator'
export { PerformanceReporter, performanceReporter } from './performance-reporter'

// Adaptive strategy adjustment
export { AdaptiveStrategyEngine, adaptiveStrategy } from './adaptive-strategy'

// Main API class for easy usage
export class OutcomeBasedAIEngine {
  private static instance: OutcomeBasedAIEngine

  static getInstance(): OutcomeBasedAIEngine {
    if (!OutcomeBasedAIEngine.instance) {
      OutcomeBasedAIEngine.instance = new OutcomeBasedAIEngine()
    }
    return OutcomeBasedAIEngine.instance
  }

  // Convenience methods that delegate to the appropriate optimizers
  async optimizeForTraffic(content: string, targetValue: number = 5000) {
    const targetMetric = {
      metricId: 'traffic_' + Date.now(),
      type: 'traffic' as const,
      name: 'Traffic Growth',
      description: 'Optimize content for increased organic traffic',
      unit: 'views',
      targetValue,
      currentValue: 0,
      priority: 8,
      timeframe: 30,
      calculationMethod: 'sum',
      dependencies: [],
      benchmarks: []
    }

    return await contentOptimizer.optimizeForTraffic(content, targetMetric)
  }

  async optimizeForEngagement(content: string, targetValue: number = 200) {
    const targetMetric = {
      metricId: 'engagement_' + Date.now(),
      type: 'engagement' as const,
      name: 'Engagement Growth',
      description: 'Optimize content for increased user engagement',
      unit: 'interactions',
      targetValue,
      currentValue: 0,
      priority: 8,
      timeframe: 30,
      calculationMethod: 'sum',
      dependencies: [],
      benchmarks: []
    }

    return await contentOptimizer.optimizeForEngagement(content, targetMetric)
  }

  async optimizeForConversions(content: string, targetValue: number = 50) {
    const targetMetric = {
      metricId: 'conversions_' + Date.now(),
      type: 'conversions' as const,
      name: 'Conversion Growth',
      description: 'Optimize content for increased conversions',
      unit: 'conversions',
      targetValue,
      currentValue: 0,
      priority: 9,
      timeframe: 30,
      calculationMethod: 'sum',
      dependencies: [],
      benchmarks: []
    }

    return await contentOptimizer.optimizeForConversions(content, targetMetric)
  }

  async optimizeForRevenue(content: string, targetValue: number = 1000) {
    const targetMetric = {
      metricId: 'revenue_' + Date.now(),
      type: 'revenue' as const,
      name: 'Revenue Growth',
      description: 'Optimize content for increased revenue generation',
      unit: 'dollars',
      targetValue,
      currentValue: 0,
      priority: 10,
      timeframe: 30,
      calculationMethod: 'sum',
      dependencies: [],
      benchmarks: []
    }

    return await contentOptimizer.optimizeForRevenue(content, targetMetric)
  }

  async predictOutcomes(content: string, platform: string = 'blog') {
    const context = {
      platform,
      scheduledTime: new Date(),
      targetAudience: 'general'
    }

    return await outcomeOptimizer.predictOutcome(content, context)
  }

  async generateContentVariations(content: string, goals: string[] = ['traffic']) {
    const optimizationGoals = goals.map(goal => ({
      metric: {
        metricId: goal + '_' + Date.now(),
        type: goal as any,
        name: `${goal} optimization`,
        description: `Optimize for ${goal}`,
        unit: 'count',
        targetValue: 1000,
        currentValue: 0,
        priority: 8,
        timeframe: 30,
        calculationMethod: 'sum',
        dependencies: [],
        benchmarks: []
      },
      weight: 1 / goals.length,
      constraints: [],
      acceptableRange: { min: 0, max: 1000 }
    }))

    return await outcomeOptimizer.generateVariations(content, optimizationGoals)
  }
}

// Export singleton instance
export const outcomeBasedAI = OutcomeBasedAIEngine.getInstance()