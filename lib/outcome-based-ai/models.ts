// Outcome-Based AI - Data Models
// Database interaction layer for business metrics and outcome predictions

import { query, transaction, queryWithMetrics } from '../database/connection'
import { 
  BusinessMetric, 
  OutcomePrediction, 
  OptimizedContent,
  PerformanceAnalysis,
  OptimizationStrategy,
  OutcomeAIError
} from './types'

// Business Metrics Model
export class BusinessMetricModel {
  // Create business metric
  static async create(
    userId: string, 
    metric: Omit<BusinessMetric, 'metricId' | 'currentValue'>
  ): Promise<BusinessMetric> {
    try {
      // Store metric configuration in user preferences or create a simple metrics table
      const metricData = {
        type: metric.type,
        name: metric.name,
        description: metric.description,
        unit: metric.unit,
        targetValue: metric.targetValue,
        priority: metric.priority,
        timeframe: metric.timeframe,
        calculationMethod: metric.calculationMethod,
        dependencies: metric.dependencies || [],
        benchmarks: metric.benchmarks || []
      }

      // For now, store in business_metrics table with current period
      const result = await query(`
        INSERT INTO business_metrics (
          user_id, period, period_start, period_end, 
          revenue_metrics, traffic_metrics, engagement_metrics, conversion_metrics
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        userId,
        'current',
        new Date(),
        new Date(Date.now() + metric.timeframe * 24 * 60 * 60 * 1000),
        metric.type === 'revenue' ? JSON.stringify(metricData) : '{}',
        metric.type === 'traffic' ? JSON.stringify(metricData) : '{}',
        metric.type === 'engagement' ? JSON.stringify(metricData) : '{}',
        metric.type === 'conversions' ? JSON.stringify(metricData) : '{}'
      ])

      return {
        metricId: result[0].id,
        ...metricData,
        currentValue: 0
      }
    } catch (error) {
      throw new OutcomeAIError('Failed to create business metric', 'CREATE_METRIC_ERROR', error)
    }
  }

  // Get metrics by user
  static async getByUserId(userId: string): Promise<BusinessMetric[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT * FROM business_metrics 
        WHERE user_id = $1 
        ORDER BY calculated_at DESC
      `, [userId], 'get_user_metrics')

      const metrics: BusinessMetric[] = []
      
      for (const row of result) {
        // Extract metrics from JSONB fields
        const revenueMetrics = row.revenue_metrics || {}
        const trafficMetrics = row.traffic_metrics || {}
        const engagementMetrics = row.engagement_metrics || {}
        const conversionMetrics = row.conversion_metrics || {}
        
        if (Object.keys(revenueMetrics).length > 0) {
          metrics.push(this.mapToBusinessMetric(row.id, 'revenue', revenueMetrics))
        }
        if (Object.keys(trafficMetrics).length > 0) {
          metrics.push(this.mapToBusinessMetric(row.id, 'traffic', trafficMetrics))
        }
        if (Object.keys(engagementMetrics).length > 0) {
          metrics.push(this.mapToBusinessMetric(row.id, 'engagement', engagementMetrics))
        }
        if (Object.keys(conversionMetrics).length > 0) {
          metrics.push(this.mapToBusinessMetric(row.id, 'conversions', conversionMetrics))
        }
      }

      return metrics
    } catch (error) {
      throw new OutcomeAIError('Failed to get user metrics', 'GET_METRICS_ERROR', error)
    }
  }

  // Update metric current value
  static async updateCurrentValue(
    userId: string, 
    metricType: BusinessMetric['type'], 
    currentValue: number
  ): Promise<void> {
    try {
      const columnName = `${metricType}_metrics`
      await query(`
        UPDATE business_metrics 
        SET ${columnName} = jsonb_set(${columnName}, '{currentValue}', $1::text::jsonb)
        WHERE user_id = $2 AND period = 'current'
      `, [currentValue, userId])
    } catch (error) {
      throw new OutcomeAIError('Failed to update metric value', 'UPDATE_METRIC_ERROR', error)
    }
  }

  // Get metrics by type
  static async getByType(
    userId: string, 
    type: BusinessMetric['type']
  ): Promise<BusinessMetric[]> {
    try {
      const columnName = `${type}_metrics`
      const result = await queryWithMetrics(`
        SELECT id, ${columnName} as metrics FROM business_metrics 
        WHERE user_id = $1 AND ${columnName} != '{}'
        ORDER BY calculated_at DESC
      `, [userId], 'get_metrics_by_type')

      return result.map(row => this.mapToBusinessMetric(row.id, type, row.metrics))
    } catch (error) {
      throw new OutcomeAIError('Failed to get metrics by type', 'GET_METRICS_TYPE_ERROR', error)
    }
  }

  // Calculate metric progress
  static async calculateProgress(userId: string): Promise<Record<string, number>> {
    try {
      const result = await queryWithMetrics(`
        SELECT 
          revenue_metrics,
          traffic_metrics,
          engagement_metrics,
          conversion_metrics
        FROM business_metrics 
        WHERE user_id = $1 AND period = 'current'
        ORDER BY calculated_at DESC
        LIMIT 1
      `, [userId], 'calculate_metric_progress')

      const progress: Record<string, number> = {}
      
      if (result.length > 0) {
        const row = result[0]
        const metricTypes = ['revenue', 'traffic', 'engagement', 'conversions'] as const
        
        for (const type of metricTypes) {
          const metrics = row[`${type}_metrics`] || {}
          if (metrics.targetValue && metrics.currentValue) {
            progress[type] = (metrics.currentValue / metrics.targetValue) * 100
          }
        }
      }

      return progress
    } catch (error) {
      throw new OutcomeAIError('Failed to calculate metric progress', 'PROGRESS_ERROR', error)
    }
  }

  private static mapToBusinessMetric(id: string, type: BusinessMetric['type'], metricsData: any): BusinessMetric {
    return {
      metricId: id,
      type,
      name: metricsData.name || `${type} metric`,
      description: metricsData.description || `${type} performance metric`,
      unit: metricsData.unit || 'count',
      targetValue: metricsData.targetValue || 1000,
      currentValue: metricsData.currentValue || 0,
      priority: metricsData.priority || 5,
      timeframe: metricsData.timeframe || 30,
      calculationMethod: metricsData.calculationMethod || 'sum',
      dependencies: metricsData.dependencies || [],
      benchmarks: metricsData.benchmarks || []
    }
  }
}

// Outcome Predictions Model
export class OutcomePredictionModel {
  // Create outcome prediction
  static async create(
    userId: string,
    contentId: string,
    prediction: OutcomePrediction
  ): Promise<void> {
    try {
      // Store prediction in content table's outcome_metrics field
      await query(`
        UPDATE content 
        SET outcome_metrics = jsonb_set(
          COALESCE(outcome_metrics, '{}'), 
          '{predictions}', 
          COALESCE(outcome_metrics->'predictions', '[]'::jsonb) || $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [
        JSON.stringify({
          predictionId: `pred_${Date.now()}`,
          targetMetric: prediction.targetMetric,
          predictedValue: prediction.predictedValue,
          confidence: prediction.confidence,
          factors: prediction.factors,
          scenarios: prediction.scenarios,
          recommendations: prediction.recommendations,
          createdAt: new Date().toISOString()
        }),
        contentId,
        userId
      ])
    } catch (error) {
      throw new OutcomeAIError('Failed to create outcome prediction', 'CREATE_PREDICTION_ERROR', error)
    }
  }

  // Get predictions for content
  static async getByContentId(contentId: string): Promise<OutcomePrediction[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT outcome_metrics FROM content 
        WHERE id = $1
      `, [contentId], 'get_content_predictions')

      if (result.length === 0 || !result[0].outcome_metrics?.predictions) {
        return []
      }

      const predictions = result[0].outcome_metrics.predictions
      return predictions.map((pred: any) => this.mapToOutcomePrediction(pred))
    } catch (error) {
      throw new OutcomeAIError('Failed to get content predictions', 'GET_PREDICTIONS_ERROR', error)
    }
  }

  // Get predictions by user and metric type
  static async getByUserAndMetric(
    userId: string, 
    metricType: string,
    limit: number = 50
  ): Promise<OutcomePrediction[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT outcome_metrics FROM content 
        WHERE user_id = $1 
          AND outcome_metrics->'predictions' IS NOT NULL
        ORDER BY created_at DESC 
        LIMIT $2
      `, [userId, limit], 'get_user_metric_predictions')

      const allPredictions: OutcomePrediction[] = []
      
      for (const row of result) {
        if (row.outcome_metrics?.predictions) {
          const predictions = row.outcome_metrics.predictions
            .filter((pred: any) => pred.targetMetric?.type === metricType)
            .map((pred: any) => this.mapToOutcomePrediction(pred))
          allPredictions.push(...predictions)
        }
      }

      return allPredictions.slice(0, limit)
    } catch (error) {
      throw new OutcomeAIError('Failed to get user metric predictions', 'GET_USER_PREDICTIONS_ERROR', error)
    }
  }

  // Update prediction accuracy
  static async updateAccuracy(
    contentId: string,
    predictionId: string,
    actualValue: number,
    accuracy: number
  ): Promise<void> {
    try {
      // Update specific prediction in the predictions array
      await query(`
        UPDATE content 
        SET outcome_metrics = jsonb_set(
          outcome_metrics,
          '{predictions}',
          (
            SELECT jsonb_agg(
              CASE 
                WHEN pred->>'predictionId' = $2 
                THEN jsonb_set(jsonb_set(pred, '{actualValue}', $3::text::jsonb), '{accuracy}', $4::text::jsonb)
                ELSE pred
              END
            )
            FROM jsonb_array_elements(outcome_metrics->'predictions') AS pred
          )
        )
        WHERE id = $1
      `, [contentId, predictionId, actualValue, accuracy])
    } catch (error) {
      throw new OutcomeAIError('Failed to update prediction accuracy', 'UPDATE_ACCURACY_ERROR', error)
    }
  }

  // Analyze prediction accuracy trends
  static async analyzePredictionAccuracy(
    userId: string,
    metricType?: string,
    days: number = 30
  ): Promise<any> {
    try {
      const result = await queryWithMetrics(`
        SELECT outcome_metrics FROM content 
        WHERE user_id = $1 
          AND outcome_metrics->'predictions' IS NOT NULL
          AND created_at >= NOW() - INTERVAL '${days} days'
      `, [userId], 'analyze_prediction_accuracy')

      const accuracyData: any[] = []
      
      for (const row of result) {
        if (row.outcome_metrics?.predictions) {
          const predictions = row.outcome_metrics.predictions
            .filter((pred: any) => {
              return pred.actualValue !== undefined && 
                     (!metricType || pred.targetMetric?.type === metricType)
            })
          
          for (const pred of predictions) {
            accuracyData.push({
              metricType: pred.targetMetric?.type,
              accuracy: pred.accuracy || 0,
              confidence: pred.confidence || 0
            })
          }
        }
      }

      const groupedByMetric = accuracyData.reduce((acc, item) => {
        const type = item.metricType || 'unknown'
        if (!acc[type]) {
          acc[type] = { accuracies: [], confidences: [] }
        }
        acc[type].accuracies.push(item.accuracy)
        acc[type].confidences.push(item.confidence)
        return acc
      }, {} as Record<string, { accuracies: number[], confidences: number[] }>)

      const accuracyByMetric = Object.entries(groupedByMetric).map(([type, data]) => ({
        metric_type: type,
        avg_accuracy: data.accuracies.reduce((sum, acc) => sum + acc, 0) / data.accuracies.length,
        prediction_count: data.accuracies.length,
        avg_confidence: data.confidences.reduce((sum, conf) => sum + conf, 0) / data.confidences.length,
        accuracy_stddev: this.calculateStdDev(data.accuracies)
      }))

      return {
        accuracyByMetric,
        overallAccuracy: accuracyByMetric.length > 0 ? 
          accuracyByMetric.reduce((sum, row) => sum + row.avg_accuracy, 0) / accuracyByMetric.length : 0,
        totalPredictions: accuracyByMetric.reduce((sum, row) => sum + row.prediction_count, 0),
        confidenceCalibration: this.calculateConfidenceCalibration(accuracyByMetric)
      }
    } catch (error) {
      throw new OutcomeAIError('Failed to analyze prediction accuracy', 'ANALYZE_ACCURACY_ERROR', error)
    }
  }

  private static calculateStdDev(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length
    return Math.sqrt(avgSquaredDiff)
  }

  private static calculateConfidenceCalibration(accuracyData: any[]): number {
    // Calculate how well confidence scores match actual accuracy
    let totalCalibration = 0
    let count = 0

    for (const row of accuracyData) {
      if (row.avg_confidence && row.avg_accuracy) {
        const calibration = 1 - Math.abs(row.avg_confidence - row.avg_accuracy)
        totalCalibration += calibration
        count++
      }
    }

    return count > 0 ? totalCalibration / count : 0
  }

  private static mapToOutcomePrediction(predData: any): OutcomePrediction {
    return {
      predictionId: predData.predictionId,
      targetMetric: predData.targetMetric,
      predictedValue: predData.predictedValue,
      confidence: predData.confidence,
      timeframe: predData.timeframe || 30,
      factors: predData.factors || [],
      scenarios: predData.scenarios || [],
      recommendations: predData.recommendations || [],
      createdAt: new Date(predData.createdAt)
    }
  }
}

// Optimized Content Model
export class OptimizedContentModel {
  // Store optimized content
  static async create(
    userId: string,
    contentId: string,
    optimizedContent: OptimizedContent
  ): Promise<void> {
    try {
      // Store optimization data in content table's metadata field
      await query(`
        UPDATE content 
        SET metadata = jsonb_set(
          COALESCE(metadata, '{}'), 
          '{optimization}', 
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [
        JSON.stringify({
          originalContent: optimizedContent.originalContent,
          optimizedContent: optimizedContent.optimizedContent,
          title: optimizedContent.title,
          optimizationGoals: optimizedContent.optimizationGoals,
          appliedOptimizations: optimizedContent.appliedOptimizations,
          predictedOutcomes: optimizedContent.predictedOutcomes,
          seoKeywords: optimizedContent.seoKeywords || [],
          engagementHooks: optimizedContent.engagementHooks || [],
          ctas: optimizedContent.ctas || [],
          monetizationElements: optimizedContent.monetizationElements || [],
          qualityScore: optimizedContent.qualityScore,
          confidenceScore: optimizedContent.confidenceScore,
          optimizedAt: new Date().toISOString()
        }),
        contentId,
        userId
      ])
    } catch (error) {
      throw new OutcomeAIError('Failed to store optimized content', 'STORE_CONTENT_ERROR', error)
    }
  }

  // Get optimized content by content ID
  static async getByContentId(contentId: string): Promise<OptimizedContent | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT metadata FROM content 
        WHERE id = $1
      `, [contentId], 'get_optimized_content')

      if (result.length === 0 || !result[0].metadata?.optimization) {
        return null
      }

      return this.mapToOptimizedContent(result[0].metadata.optimization)
    } catch (error) {
      throw new OutcomeAIError('Failed to get optimized content', 'GET_CONTENT_ERROR', error)
    }
  }

  // Get optimization history for user
  static async getOptimizationHistory(
    userId: string,
    limit: number = 20
  ): Promise<OptimizedContent[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT metadata FROM content 
        WHERE user_id = $1 
          AND metadata->'optimization' IS NOT NULL
        ORDER BY created_at DESC 
        LIMIT $2
      `, [userId, limit], 'get_optimization_history')

      return result
        .filter(row => row.metadata?.optimization)
        .map(row => this.mapToOptimizedContent(row.metadata.optimization))
    } catch (error) {
      throw new OutcomeAIError('Failed to get optimization history', 'GET_HISTORY_ERROR', error)
    }
  }

  // Analyze optimization effectiveness
  static async analyzeOptimizationEffectiveness(
    userId: string,
    days: number = 30
  ): Promise<any> {
    try {
      const result = await queryWithMetrics(`
        SELECT metadata FROM content 
        WHERE user_id = $1 
          AND metadata->'optimization' IS NOT NULL
          AND created_at >= NOW() - INTERVAL '${days} days'
      `, [userId], 'analyze_optimization_effectiveness')

      const optimizations = result
        .filter(row => row.metadata?.optimization)
        .map(row => row.metadata.optimization)

      if (optimizations.length === 0) {
        return {
          summary: { avg_quality_score: 0, avg_confidence_score: 0, optimization_count: 0 },
          optimizationTypes: [],
          trends: []
        }
      }

      const summary = {
        avg_quality_score: optimizations.reduce((sum, opt) => sum + (opt.qualityScore || 0), 0) / optimizations.length,
        avg_confidence_score: optimizations.reduce((sum, opt) => sum + (opt.confidenceScore || 0), 0) / optimizations.length,
        optimization_count: optimizations.length,
        avg_optimizations_per_content: optimizations.reduce((sum, opt) => sum + (opt.appliedOptimizations?.length || 0), 0) / optimizations.length
      }

      const optimizationTypes = this.analyzeOptimizationTypes(optimizations)

      return {
        summary,
        optimizationTypes,
        trends: await this.getOptimizationTrends(userId, days)
      }
    } catch (error) {
      throw new OutcomeAIError('Failed to analyze optimization effectiveness', 'ANALYZE_EFFECTIVENESS_ERROR', error)
    }
  }

  private static analyzeOptimizationTypes(optimizations: any[]): any[] {
    const typeStats: Record<string, { count: number, totalImpact: number }> = {}
    
    for (const opt of optimizations) {
      if (opt.appliedOptimizations) {
        for (const applied of opt.appliedOptimizations) {
          if (!typeStats[applied.type]) {
            typeStats[applied.type] = { count: 0, totalImpact: 0 }
          }
          typeStats[applied.type].count++
          typeStats[applied.type].totalImpact += applied.impact || 0
        }
      }
    }

    return Object.entries(typeStats).map(([type, stats]) => ({
      optimization_type: type,
      usage_count: stats.count,
      avg_impact: stats.totalImpact / stats.count
    })).sort((a, b) => b.usage_count - a.usage_count)
  }

  private static async getOptimizationTrends(userId: string, days: number): Promise<any[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          metadata
        FROM content 
        WHERE user_id = $1 
          AND metadata->'optimization' IS NOT NULL
          AND created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY date ASC
      `, [userId], 'get_optimization_trends')

      const trendsByDate: Record<string, { qualityScores: number[], confidenceScores: number[], count: number }> = {}
      
      for (const row of result) {
        const dateKey = row.date.toISOString().split('T')[0]
        const opt = row.metadata?.optimization
        
        if (!trendsByDate[dateKey]) {
          trendsByDate[dateKey] = { qualityScores: [], confidenceScores: [], count: 0 }
        }
        
        if (opt) {
          trendsByDate[dateKey].qualityScores.push(opt.qualityScore || 0)
          trendsByDate[dateKey].confidenceScores.push(opt.confidenceScore || 0)
          trendsByDate[dateKey].count++
        }
      }

      return Object.entries(trendsByDate).map(([date, data]) => ({
        date,
        avg_quality: data.qualityScores.reduce((sum, score) => sum + score, 0) / data.qualityScores.length,
        avg_confidence: data.confidenceScores.reduce((sum, score) => sum + score, 0) / data.confidenceScores.length,
        content_count: data.count
      }))
    } catch (error) {
      throw new OutcomeAIError('Failed to get optimization trends', 'TRENDS_ERROR', error)
    }
  }

  private static mapToOptimizedContent(optData: any): OptimizedContent {
    return {
      originalContent: optData.originalContent || '',
      optimizedContent: optData.optimizedContent || '',
      title: optData.title || '',
      optimizationGoals: optData.optimizationGoals || [],
      appliedOptimizations: optData.appliedOptimizations || [],
      predictedOutcomes: optData.predictedOutcomes || [],
      seoKeywords: optData.seoKeywords || [],
      engagementHooks: optData.engagementHooks || [],
      ctas: optData.ctas || [],
      monetizationElements: optData.monetizationElements || [],
      qualityScore: optData.qualityScore || 0,
      confidenceScore: optData.confidenceScore || 0
    }
  }
}

// Performance Analysis Model
export class PerformanceAnalysisModel {
  // Store performance analysis
  static async create(
    userId: string,
    contentId: string,
    analysis: PerformanceAnalysis
  ): Promise<void> {
    try {
      // Store analysis in content table's performance field
      await query(`
        UPDATE content 
        SET performance = jsonb_set(
          COALESCE(performance, '{}'), 
          '{analysis}', 
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [
        JSON.stringify({
          contentId: analysis.contentId,
          actualVsPredicted: analysis.actualVsPredicted,
          successFactors: analysis.successFactors,
          improvementAreas: analysis.improvementAreas,
          learningInsights: analysis.learningInsights,
          confidenceCalibration: analysis.confidenceCalibration,
          analyzedAt: new Date().toISOString()
        }),
        contentId,
        userId
      ])
    } catch (error) {
      throw new OutcomeAIError('Failed to store performance analysis', 'STORE_ANALYSIS_ERROR', error)
    }
  }

  // Get analysis by content ID
  static async getByContentId(contentId: string): Promise<PerformanceAnalysis | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT performance FROM content 
        WHERE id = $1
      `, [contentId], 'get_performance_analysis')

      if (result.length === 0 || !result[0].performance?.analysis) {
        return null
      }

      return this.mapToPerformanceAnalysis(result[0].performance.analysis)
    } catch (error) {
      throw new OutcomeAIError('Failed to get performance analysis', 'GET_ANALYSIS_ERROR', error)
    }
  }

  // Get learning insights for user
  static async getLearningInsights(
    userId: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT id, performance FROM content 
        WHERE user_id = $1 
          AND performance->'analysis'->'learningInsights' IS NOT NULL
        ORDER BY created_at DESC 
        LIMIT $2
      `, [userId, limit], 'get_learning_insights')

      const insights: any[] = []
      
      for (const row of result) {
        const analysis = row.performance?.analysis
        if (analysis?.learningInsights) {
          for (const insight of analysis.learningInsights) {
            insights.push({
              contentId: row.id,
              insight,
              createdAt: analysis.analyzedAt
            })
          }
        }
      }

      return insights
    } catch (error) {
      throw new OutcomeAIError('Failed to get learning insights', 'GET_INSIGHTS_ERROR', error)
    }
  }

  private static mapToPerformanceAnalysis(analysisData: any): PerformanceAnalysis {
    return {
      contentId: analysisData.contentId,
      actualVsPredicted: analysisData.actualVsPredicted || [],
      successFactors: analysisData.successFactors || [],
      improvementAreas: analysisData.improvementAreas || [],
      learningInsights: analysisData.learningInsights || [],
      confidenceCalibration: analysisData.confidenceCalibration || 0
    }
  }
}