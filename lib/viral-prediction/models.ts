// Viral Prediction - Data Models
// Database interaction layer for viral scores and predictions

import { query, queryWithMetrics } from '../database/connection'
import { ViralScore, ViralAnalysis, ViralPredictionError } from './types'

export class ViralScoreModel {
  // Store viral score
  static async create(
    userId: string,
    contentId: string,
    score: ViralScore
  ): Promise<void> {
    try {
      await query(`
        UPDATE content 
        SET viral_metrics = jsonb_set(
          COALESCE(viral_metrics, '{}'),
          '{score}',
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(score), contentId, userId])
    } catch (error) {
      throw new ViralPredictionError('Failed to store viral score', 'STORE_SCORE_ERROR', error)
    }
  }

  // Get viral score by content ID
  static async getByContentId(contentId: string): Promise<ViralScore | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT viral_metrics FROM content WHERE id = $1
      `, [contentId], 'get_viral_score')

      if (result.length === 0 || !result[0].viral_metrics?.score) {
        return null
      }

      return this.mapToViralScore(result[0].viral_metrics.score)
    } catch (error) {
      throw new ViralPredictionError('Failed to get viral score', 'GET_SCORE_ERROR', error)
    }
  }

  // Get top viral content
  static async getTopViralContent(
    userId: string,
    limit: number = 10
  ): Promise<Array<{ contentId: string, score: number, reach: number }>> {
    try {
      const result = await queryWithMetrics(`
        SELECT id, viral_metrics FROM content 
        WHERE user_id = $1 
          AND viral_metrics->'score' IS NOT NULL
        ORDER BY (viral_metrics->'score'->>'overallScore')::numeric DESC
        LIMIT $2
      `, [userId, limit], 'get_top_viral_content')

      return result.map(row => ({
        contentId: row.id,
        score: parseFloat(row.viral_metrics.score.overallScore),
        reach: parseInt(row.viral_metrics.score.expectedReach)
      }))
    } catch (error) {
      throw new ViralPredictionError('Failed to get top viral content', 'GET_TOP_ERROR', error)
    }
  }

  // Update actual viral performance
  static async updateActualPerformance(
    contentId: string,
    actualViews: number,
    actualShares: number
  ): Promise<void> {
    try {
      await query(`
        UPDATE content 
        SET viral_metrics = jsonb_set(
          viral_metrics,
          '{actual_performance}',
          $1::jsonb
        )
        WHERE id = $2
      `, [
        JSON.stringify({ actualViews, actualShares, recordedAt: new Date() }),
        contentId
      ])
    } catch (error) {
      throw new ViralPredictionError('Failed to update actual performance', 'UPDATE_ACTUAL_ERROR', error)
    }
  }

  // Calculate prediction accuracy
  static async calculatePredictionAccuracy(
    userId: string,
    days: number = 30
  ): Promise<{ accuracy: number, avgError: number, count: number }> {
    try {
      const result = await queryWithMetrics(`
        SELECT viral_metrics FROM content 
        WHERE user_id = $1 
          AND viral_metrics->'score' IS NOT NULL
          AND viral_metrics->'actual_performance' IS NOT NULL
          AND created_at >= NOW() - INTERVAL '${days} days'
      `, [userId], 'calculate_prediction_accuracy')

      let totalAccuracy = 0
      let totalError = 0
      let count = 0

      for (const row of result) {
        const score = row.viral_metrics.score
        const actual = row.viral_metrics.actual_performance

        if (score && actual) {
          const predictedShares = score.expectedShares
          const actualShares = actual.actualShares
          
          if (predictedShares > 0) {
            const error = Math.abs(actualShares - predictedShares) / predictedShares
            const accuracy = Math.max(0, 1 - error)
            
            totalAccuracy += accuracy
            totalError += error
            count++
          }
        }
      }

      return {
        accuracy: count > 0 ? totalAccuracy / count : 0,
        avgError: count > 0 ? totalError / count : 0,
        count
      }
    } catch (error) {
      throw new ViralPredictionError('Failed to calculate accuracy', 'ACCURACY_ERROR', error)
    }
  }

  private static mapToViralScore(data: any): ViralScore {
    return {
      scoreId: data.scoreId,
      contentId: data.contentId,
      overallScore: data.overallScore,
      confidence: data.confidence,
      viralProbability: data.viralProbability,
      expectedReach: data.expectedReach,
      expectedShares: data.expectedShares,
      peakTime: new Date(data.peakTime),
      components: data.components,
      factors: data.factors,
      predictions: data.predictions,
      createdAt: new Date(data.createdAt)
    }
  }
}

export class ViralAnalysisModel {
  // Store viral analysis
  static async create(
    userId: string,
    contentId: string,
    analysis: ViralAnalysis
  ): Promise<void> {
    try {
      await query(`
        UPDATE content 
        SET viral_metrics = jsonb_set(
          COALESCE(viral_metrics, '{}'),
          '{analysis}',
          $1::jsonb
        )
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(analysis), contentId, userId])
    } catch (error) {
      throw new ViralPredictionError('Failed to store viral analysis', 'STORE_ANALYSIS_ERROR', error)
    }
  }

  // Get viral analysis
  static async getByContentId(contentId: string): Promise<ViralAnalysis | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT viral_metrics FROM content WHERE id = $1
      `, [contentId], 'get_viral_analysis')

      if (result.length === 0 || !result[0].viral_metrics?.analysis) {
        return null
      }

      return result[0].viral_metrics.analysis
    } catch (error) {
      throw new ViralPredictionError('Failed to get viral analysis', 'GET_ANALYSIS_ERROR', error)
    }
  }
}
