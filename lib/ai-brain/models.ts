// Personal AI Brain - Database Models
// Database interaction layer for AI brain system

import { query, transaction, queryWithMetrics } from '../database/connection'
import { 
  PersonalAIBrain, 
  UserPreferences, 
  SuccessPattern, 
  LearningModel, 
  AdaptationRecord,
  LearningInsight,
  ContentData,
  PerformanceMetrics,
  UserFeedback,
  AIBrainError
} from './types'
import { RecommendationEngine } from './recommendation-engine'

// AI Personality Model
export class AIPersonalityModel {
  // Create new AI personality
  static async create(userId: string, initialPreferences?: Partial<UserPreferences>): Promise<PersonalAIBrain> {
    try {
      const defaultPreferences: UserPreferences = {
        brandVoice: {
          tone: 'professional',
          personality: ['helpful', 'knowledgeable'],
          vocabulary: {
            preferredTerms: [],
            avoidedTerms: [],
            industryJargon: false,
            technicalLevel: 'intermediate',
            regionalVariations: []
          },
          communicationStyle: {
            directness: 7,
            storytelling: true,
            dataOriented: true,
            conversational: true,
            instructional: true,
            persuasive: true
          },
          emotionalTone: {
            enthusiasm: 6,
            empathy: 7,
            confidence: 8,
            urgency: 4,
            optimism: 7,
            humor: 3
          },
          formalityLevel: 6
        },
        contentTypes: [
          {
            type: 'blog',
            priority: 8,
            preferredLength: 'medium',
            structurePreferences: {
              useHeadings: true,
              useBulletPoints: true,
              useNumberedLists: true,
              includeIntroduction: true,
              includeConclusion: true,
              includeCTA: true,
              preferredSections: ['introduction', 'main_content', 'conclusion']
            },
            engagementTactics: [
              { type: 'question', effectiveness: 7, frequency: 'often' },
              { type: 'statistic', effectiveness: 8, frequency: 'sometimes' }
            ]
          }
        ],
        targetAudience: {
          demographics: {
            ageRange: '25-45',
            location: ['global'],
            occupation: ['business_owner', 'marketer'],
            incomeLevel: 'middle_to_high',
            education: 'college',
            gender: ['all']
          },
          psychographics: {
            values: ['efficiency', 'growth', 'innovation'],
            motivations: ['success', 'recognition', 'impact'],
            challenges: ['time_management', 'competition', 'scaling'],
            goals: ['increase_revenue', 'grow_audience', 'improve_efficiency'],
            lifestyle: ['busy', 'tech_savvy', 'goal_oriented'],
            personalityTraits: ['ambitious', 'analytical', 'creative']
          },
          behaviorPatterns: [],
          painPoints: ['lack_of_time', 'content_creation_difficulty'],
          interests: ['business', 'technology', 'marketing'],
          expertiseLevel: 'intermediate',
          preferredContentFormats: ['blog', 'video', 'infographic']
        },
        businessGoals: [
          {
            type: 'traffic',
            priority: 8,
            target: 10000,
            timeframe: 90,
            metrics: ['page_views', 'unique_visitors'],
            currentPerformance: 0
          }
        ],
        platformPriorities: [
          {
            platform: 'blog',
            priority: 9,
            contentTypes: ['blog'],
            postingFrequency: 'weekly',
            optimalTimes: ['09:00', '14:00'],
            audienceSize: 0,
            engagementRate: 0
          }
        ],
        writingStyle: {
          sentenceLength: 'varied',
          paragraphLength: 'medium',
          complexity: 'moderate',
          activeVoice: true,
          firstPerson: false,
          contractions: true,
          rhetoricalQuestions: true
        },
        tonePreferences: [],
        keywordPreferences: [],
        avoidancePatterns: []
      }

      const preferences = { ...defaultPreferences, ...initialPreferences }

      const result = await query(`
        INSERT INTO ai_personalities (
          user_id, learning_model, adaptation_level, success_patterns, 
          preferences, brand_voice, target_audience, content_goals
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        userId,
        'adaptive-v1',
        0,
        JSON.stringify([]),
        JSON.stringify(preferences),
        JSON.stringify(preferences.brandVoice),
        JSON.stringify(preferences.targetAudience),
        JSON.stringify(preferences.businessGoals)
      ])

      return this.mapToAIBrain(result[0])
    } catch (error) {
      throw new AIBrainError('Failed to create AI personality', 'CREATE_ERROR', error)
    }
  }

  // Get AI personality by user ID
  static async getByUserId(userId: string): Promise<PersonalAIBrain | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT * FROM ai_personalities WHERE user_id = $1
      `, [userId], 'get_ai_personality')

      if (result.length === 0) {
        return null
      }

      return this.mapToAIBrain(result[0])
    } catch (error) {
      throw new AIBrainError('Failed to get AI personality', 'GET_ERROR', error)
    }
  }

  // Update AI personality
  static async update(userId: string, updates: Partial<PersonalAIBrain>): Promise<PersonalAIBrain> {
    try {
      const updateFields: string[] = []
      const updateValues: any[] = []
      let paramIndex = 1

      if (updates.preferences) {
        updateFields.push(`preferences = $${paramIndex++}`)
        updateValues.push(JSON.stringify(updates.preferences))
      }

      if (updates.successPatterns) {
        updateFields.push(`success_patterns = $${paramIndex++}`)
        updateValues.push(JSON.stringify(updates.successPatterns))
      }

      if (updates.adaptationLevel !== undefined) {
        updateFields.push(`adaptation_level = $${paramIndex++}`)
        updateValues.push(updates.adaptationLevel)
      }

      if (updates.learningModel) {
        updateFields.push(`learning_model = $${paramIndex++}`)
        updateValues.push(updates.learningModel.modelType)
      }

      updateFields.push(`updated_at = NOW()`)
      updateValues.push(userId)

      const result = await queryWithMetrics(`
        UPDATE ai_personalities 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramIndex}
        RETURNING *
      `, updateValues, 'update_ai_personality')

      if (result.length === 0) {
        throw new AIBrainError('AI personality not found', 'NOT_FOUND')
      }

      return this.mapToAIBrain(result[0])
    } catch (error) {
      throw new AIBrainError('Failed to update AI personality', 'UPDATE_ERROR', error)
    }
  }

  // Add success pattern
  static async addSuccessPattern(userId: string, pattern: SuccessPattern): Promise<void> {
    try {
      await transaction(async (client) => {
        // Get current patterns
        const result = await client.query(
          'SELECT success_patterns FROM ai_personalities WHERE user_id = $1',
          [userId]
        )

        if (result.rows.length === 0) {
          throw new AIBrainError('AI personality not found', 'NOT_FOUND')
        }

        const currentPatterns = result.rows[0].success_patterns || []
        const updatedPatterns = [...currentPatterns, pattern]

        // Update with new pattern
        await client.query(`
          UPDATE ai_personalities 
          SET success_patterns = $1, updated_at = NOW()
          WHERE user_id = $2
        `, [JSON.stringify(updatedPatterns), userId])
      })
    } catch (error) {
      throw new AIBrainError('Failed to add success pattern', 'ADD_PATTERN_ERROR', error)
    }
  }

  // Get success patterns by criteria
  static async getSuccessPatterns(
    userId: string, 
    contentType?: string, 
    platform?: string,
    limit: number = 10
  ): Promise<SuccessPattern[]> {
    try {
      const aiPersonality = await this.getByUserId(userId)
      if (!aiPersonality) {
        return []
      }

      let patterns = aiPersonality.successPatterns

      // Filter by content type
      if (contentType) {
        patterns = patterns.filter(p => p.contentType === contentType)
      }

      // Filter by platform
      if (platform) {
        patterns = patterns.filter(p => !p.platform || p.platform === platform)
      }

      // Sort by confidence and usage count
      patterns.sort((a, b) => {
        const scoreA = a.confidence * 0.7 + (a.usageCount / 100) * 0.3
        const scoreB = b.confidence * 0.7 + (b.usageCount / 100) * 0.3
        return scoreB - scoreA
      })

      return patterns.slice(0, limit)
    } catch (error) {
      throw new AIBrainError('Failed to get success patterns', 'GET_PATTERNS_ERROR', error)
    }
  }

  // Map database row to AI brain object
  private static mapToAIBrain(row: any): PersonalAIBrain {
    return {
      userId: row.user_id,
      preferences: row.preferences || {},
      successPatterns: row.success_patterns || [],
      learningModel: {
        modelType: 'neural_network',
        version: row.learning_model || 'adaptive-v1',
        trainingData: {
          totalSamples: 0,
          successfulSamples: 0,
          failedSamples: 0,
          contentTypes: {},
          platforms: {},
          dateRange: {
            start: row.created_at,
            end: new Date()
          }
        },
        accuracy: 0.7,
        lastTrained: row.updated_at,
        parameters: { learningRate: 0.01, regularization: 0.001 },
        performance: {
          accuracy: 0.7,
          precision: 0.7,
          recall: 0.7,
          f1Score: 0.7,
          auc: 0.7
        }
      },
      adaptationHistory: [],
      lastUpdated: row.updated_at,
      adaptationLevel: row.adaptation_level || 0,
      confidenceScore: 0.7
    }
  }
}

// Learning Records Model
export class LearningRecordModel {
  // Create learning record
  static async create(
    userId: string,
    contentId: string,
    performanceData: PerformanceMetrics,
    insights: LearningInsight[],
    adaptations: AdaptationRecord[]
  ): Promise<void> {
    try {
      await query(`
        INSERT INTO learning_records (
          user_id, content_id, performance_data, insights, 
          adaptations, learning_type, confidence_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        userId,
        contentId,
        JSON.stringify(performanceData),
        JSON.stringify(insights),
        JSON.stringify(adaptations),
        'performance_analysis',
        0.7
      ])
    } catch (error) {
      throw new AIBrainError('Failed to create learning record', 'CREATE_RECORD_ERROR', error)
    }
  }

  // Get learning records for user
  static async getByUserId(
    userId: string, 
    limit: number = 50,
    learningType?: string
  ): Promise<any[]> {
    try {
      let queryText = `
        SELECT * FROM learning_records 
        WHERE user_id = $1
      `
      const params: any[] = [userId]

      if (learningType) {
        queryText += ` AND learning_type = $2`
        params.push(learningType)
      }

      queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`
      params.push(limit)

      return await queryWithMetrics(queryText, params, 'get_learning_records')
    } catch (error) {
      throw new AIBrainError('Failed to get learning records', 'GET_RECORDS_ERROR', error)
    }
  }

  // Get learning insights for content
  static async getInsightsForContent(contentId: string): Promise<LearningInsight[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT insights FROM learning_records 
        WHERE content_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `, [contentId], 'get_content_insights')

      const allInsights: LearningInsight[] = []
      for (const row of result) {
        if (row.insights) {
          allInsights.push(...row.insights)
        }
      }

      return allInsights
    } catch (error) {
      throw new AIBrainError('Failed to get content insights', 'GET_INSIGHTS_ERROR', error)
    }
  }

  // Analyze learning trends
  static async analyzeLearningTrends(userId: string, days: number = 30): Promise<any> {
    try {
      const result = await queryWithMetrics(`
        SELECT 
          learning_type,
          confidence_score,
          created_at,
          performance_data,
          insights
        FROM learning_records 
        WHERE user_id = $1 
          AND created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY created_at ASC
      `, [userId], 'analyze_learning_trends')

      // Analyze trends in learning effectiveness
      const trends = {
        totalRecords: result.length,
        averageConfidence: 0,
        learningTypes: {} as Record<string, number>,
        confidenceTrend: [] as number[],
        improvementRate: 0
      }

      if (result.length === 0) {
        return trends
      }

      // Calculate averages and trends
      let totalConfidence = 0
      for (const record of result) {
        totalConfidence += record.confidence_score || 0
        
        const learningType = record.learning_type
        trends.learningTypes[learningType] = (trends.learningTypes[learningType] || 0) + 1
        
        trends.confidenceTrend.push(record.confidence_score || 0)
      }

      trends.averageConfidence = totalConfidence / result.length

      // Calculate improvement rate (comparing first half to second half)
      const midPoint = Math.floor(result.length / 2)
      if (midPoint > 0) {
        const firstHalf = trends.confidenceTrend.slice(0, midPoint)
        const secondHalf = trends.confidenceTrend.slice(midPoint)
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
        
        trends.improvementRate = ((secondAvg - firstAvg) / firstAvg) * 100
      }

      return trends
    } catch (error) {
      throw new AIBrainError('Failed to analyze learning trends', 'ANALYZE_TRENDS_ERROR', error)
    }
  }
}

// Backwards-compatible facade used by some integration modules.
export const personalAIBrain = {
  async getRecommendations(
    userId: string,
    context: { contentType: string; topic: string; targetMetric?: string }
  ) {
    const engine = RecommendationEngine.getInstance()
    return engine.generateRecommendations({
      userId,
      context: {
        userId,
        contentType: context.contentType,
        platform: 'blog',
        targetAudience: 'general',
        businessGoals: [],
      } as any,
      preferences: {} as any,
    } as any)
  },
}

// User Feedback Model
export class UserFeedbackModel {
  // Create user feedback
  static async create(feedback: UserFeedback): Promise<void> {
    try {
      await query(`
        INSERT INTO user_feedback (
          user_id, content_id, feedback_type, rating, 
          feedback, category, processed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        feedback.userId,
        feedback.contentId,
        feedback.feedbackType,
        feedback.rating,
        feedback.feedback,
        feedback.category,
        false
      ])
    } catch (error) {
      throw new AIBrainError('Failed to create user feedback', 'CREATE_FEEDBACK_ERROR', error)
    }
  }

  // Get unprocessed feedback
  static async getUnprocessed(userId?: string, limit: number = 50): Promise<UserFeedback[]> {
    try {
      let queryText = `
        SELECT * FROM user_feedback 
        WHERE processed = false
      `
      const params: any[] = []

      if (userId) {
        queryText += ` AND user_id = $1`
        params.push(userId)
      }

      queryText += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`
      params.push(limit)

      const result = await queryWithMetrics(queryText, params, 'get_unprocessed_feedback')

      return result.map(row => ({
        feedbackId: row.id,
        userId: row.user_id,
        contentId: row.content_id,
        feedbackType: row.feedback_type,
        rating: row.rating,
        feedback: row.feedback,
        category: row.category,
        timestamp: row.timestamp,
        processed: row.processed
      }))
    } catch (error) {
      throw new AIBrainError('Failed to get unprocessed feedback', 'GET_FEEDBACK_ERROR', error)
    }
  }

  // Mark feedback as processed
  static async markProcessed(feedbackId: string): Promise<void> {
    try {
      await query(`
        UPDATE user_feedback 
        SET processed = true 
        WHERE id = $1
      `, [feedbackId])
    } catch (error) {
      throw new AIBrainError('Failed to mark feedback as processed', 'MARK_PROCESSED_ERROR', error)
    }
  }

  // Get feedback analytics
  static async getAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const result = await queryWithMetrics(`
        SELECT 
          feedback_type,
          rating,
          category,
          timestamp
        FROM user_feedback 
        WHERE user_id = $1 
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp DESC
      `, [userId], 'get_feedback_analytics')

      const analytics = {
        totalFeedback: result.length,
        averageRating: 0,
        feedbackTypes: {} as Record<string, number>,
        categories: {} as Record<string, number>,
        ratingDistribution: {} as Record<string, number>,
        trend: [] as any[]
      }

      if (result.length === 0) {
        return analytics
      }

      let totalRating = 0
      let ratingCount = 0

      for (const row of result) {
        // Count feedback types
        const feedbackType = row.feedback_type
        analytics.feedbackTypes[feedbackType] = (analytics.feedbackTypes[feedbackType] || 0) + 1

        // Count categories
        const category = row.category
        analytics.categories[category] = (analytics.categories[category] || 0) + 1

        // Rating analysis
        if (row.rating) {
          totalRating += row.rating
          ratingCount++
          
          const ratingKey = row.rating.toString()
          analytics.ratingDistribution[ratingKey] = (analytics.ratingDistribution[ratingKey] || 0) + 1
        }

        // Add to trend data
        analytics.trend.push({
          date: row.timestamp,
          type: row.feedback_type,
          rating: row.rating,
          category: row.category
        })
      }

      if (ratingCount > 0) {
        analytics.averageRating = totalRating / ratingCount
      }

      return analytics
    } catch (error) {
      throw new AIBrainError('Failed to get feedback analytics', 'ANALYTICS_ERROR', error)
    }
  }
}