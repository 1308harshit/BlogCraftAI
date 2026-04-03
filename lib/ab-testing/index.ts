// A/B Testing and Real-Time Optimization Module

export {
  ABTestManager,
  abTestManager
} from './ab-test-manager'

export {
  RealTimeOptimizer,
  realTimeOptimizer,
  type OptimizationRule,
  type ContentAdjustment
} from './real-time-optimizer'

export type {
  ABTest,
  TestVariant,
  VariantMetrics,
  TestResults,
  VariantPerformance,
  TestConfig,
  OptimizationRecommendation
} from './types'
