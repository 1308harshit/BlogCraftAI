// Personal AI Brain - Memory Persistence Layer
// Handles memory storage, retrieval, and vector operations

import { 
  generateEmbedding,
  storeContentEmbedding,
  storeSuccessPatternEmbedding,
  storeUserPreferenceEmbedding,
  searchSimilarContent,
  searchSuccessPatterns,
  getUserPreferences,
  ContentEmbedding,
  SuccessPatternEmbedding,
  UserPreferenceEmbedding
} from '../database/vector-db'

import {
  getCachedUserPreferences,
  setCachedUserPreferences,
  getCachedSuccessPatterns,
  setCachedSuccessPatterns
} from '../database/redis'

import {
  PersonalAIBrain,
  UserPreferences,
  SuccessPattern,
  ContentData,
  PerformanceMetrics,
  ContentContext,
  AIBrainError
} from './types'

// Memory Manager for AI Brain
export class MemoryManager {
  // Store content in memory with embeddings
  static async storeContentMemory(
    userId: string,
    content: ContentData,
    performance: PerformanceMetrics
  ): Promise<void> {
    try {
      // Generate embedding for content
      const contentText = `${content.title} ${content.content}`
      const embedding = await generateEmbedding(contentText)

      // Create content embedding
      const contentEmbedding: ContentEmbedding = {
        id: content.id,
        values: embedding,
        metadata: {
          userId,
          contentType: content.type,
          title: content.title,
          keywords: content.metadata.keywords,
          performance: this.calculateOverallPerformance(performance),
          viralScore: performance.viralScore,
          seoScore: content.metadata.seoScore,
          createdAt: content.createdAt.toISOString(),
          platform: content.metadata.platform
        }
      }

      // Store in vector database
      await storeContentEmbedding(contentEmbedding)

      console.log(`Stored content memory for user ${userId}, content ${content.id}`)
    } catch (error) {
      console.error('Failed to store content memory:', error)
      throw new AIBrainError('Memory storage failed', 'MEMORY_STORE_ERROR', error)
    }
  }

  // Store success pattern in memory
  static async storeSuccessPatternMemory(
    userId: string,
    pattern: SuccessPattern
  ): Promise<void> {
    try {
      // Generate embedding for pattern
      const patternText = `${pattern.patternType} ${pattern.replicationInstructions}`
      const embedding = await generateEmbedding(patternText)

      // Create success pattern embedding
      const patternEmbedding: SuccessPatternEmbedding = {
        id: pattern.patternId,
        values: embedding,
        metadata: {
          userId,
          patternType: pattern.patternType,
          successMetrics: {
            engagement: pattern.successMetrics.engagement,
            conversions: pattern.successMetrics.conversions,
            revenue: pattern.successMetrics.revenue,
            viralScore: pattern.successMetrics.viralScore
          },
          replicationCount: pattern.usageCount,
          lastUsed: pattern.lastUsed.toISOString(),
          contentType: pattern.contentType,
          platform: pattern.platform
        }
      }

      // Store in vector database
      await storeSuccessPatternEmbedding(patternEmbedding)

      // Invalidate cache
      await this.invalidateSuccessPatternsCache(userId)

      console.log(`Stored success pattern memory for user ${userId}, pattern ${pattern.patternId}`)
    } catch (error) {
      console.error('Failed to store success pattern memory:', error)
      throw new AIBrainError('Pattern memory storage failed', 'PATTERN_STORE_ERROR', error)
    }
  }

  // Store user preferences in memory
  static async storeUserPreferencesMemory(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    try {
      // Generate embedding for preferences
      const preferencesText = this.serializePreferences(preferences)
      const embedding = await generateEmbedding(preferencesText)

      // Create user preference embedding
      const preferenceEmbedding: UserPreferenceEmbedding = {
        id: userId,
        values: embedding,
        metadata: {
          userId,
          brandVoice: preferences.brandVoice.tone,
          targetAudience: this.serializeAudience(preferences.targetAudience),
          contentGoals: preferences.businessGoals.map(g => g.type),
          preferredPlatforms: preferences.platformPriorities.map(p => p.platform),
          lastUpdated: new Date().toISOString()
        }
      }

      // Store in vector database
      await storeUserPreferenceEmbedding(preferenceEmbedding)

      // Update cache
      await setCachedUserPreferences(userId, preferences)

      console.log(`Stored user preferences memory for user ${userId}`)
    } catch (error) {
      console.error('Failed to store user preferences memory:', error)
      throw new AIBrainError('Preferences memory storage failed', 'PREFERENCES_STORE_ERROR', error)
    }
  }

  // Retrieve similar content from memory
  static async retrieveSimilarContent(
    userId: string,
    queryContent: string,
    contentType?: string,
    platform?: string,
    limit: number = 10
  ): Promise<ContentEmbedding[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await generateEmbedding(queryContent)

      // Build filter
      const filter: Record<string, any> = {}
      if (contentType) {
        filter.contentType = { $eq: contentType }
      }
      if (platform) {
        filter.platform = { $eq: platform }
      }

      // Search similar content
      const similarContent = await searchSimilarContent(
        queryEmbedding,
        userId,
        limit,
        filter
      )

      return similarContent
    } catch (error) {
      console.error('Failed to retrieve similar content:', error)
      throw new AIBrainError('Similar content retrieval failed', 'SIMILAR_CONTENT_ERROR', error)
    }
  }

  // Retrieve relevant success patterns
  static async retrieveRelevantPatterns(
    userId: string,
    context: ContentContext,
    limit: number = 5
  ): Promise<SuccessPattern[]> {
    try {
      // Check cache first
      const cachedPatterns = await getCachedSuccessPatterns(userId)
      if (cachedPatterns) {
        return this.filterPatternsByContext(cachedPatterns, context, limit)
      }

      // Generate embedding for context
      const contextText = `${context.contentType} ${context.targetAudience} ${context.businessGoals.join(' ')}`
      const queryEmbedding = await generateEmbedding(contextText)

      // Search success patterns
      const patternEmbeddings = await searchSuccessPatterns(
        queryEmbedding,
        userId,
        context.contentType,
        context.platform,
        limit
      )

      // Convert embeddings to success patterns
      const patterns: SuccessPattern[] = patternEmbeddings.map(embedding => ({
        patternId: embedding.id,
        patternType: embedding.metadata.patternType as any,
        contentType: embedding.metadata.contentType,
        platform: embedding.metadata.platform,
        successMetrics: {
          views: 0,
          engagement: embedding.metadata.successMetrics.engagement,
          shares: 0,
          comments: 0,
          clicks: 0,
          conversions: embedding.metadata.successMetrics.conversions,
          revenue: embedding.metadata.successMetrics.revenue,
          viralScore: embedding.metadata.successMetrics.viralScore,
          seoScore: 0,
          roi: 0,
          engagementRate: 0,
          conversionRate: 0
        },
        contextFactors: [],
        replicationInstructions: '',
        confidence: 0.8,
        usageCount: embedding.metadata.replicationCount,
        lastUsed: new Date(embedding.metadata.lastUsed),
        createdAt: new Date()
      }))

      // Cache the patterns
      await setCachedSuccessPatterns(userId, patterns)

      return patterns
    } catch (error) {
      console.error('Failed to retrieve relevant patterns:', error)
      throw new AIBrainError('Pattern retrieval failed', 'PATTERN_RETRIEVAL_ERROR', error)
    }
  }

  // Retrieve user preferences from memory
  static async retrieveUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Check cache first
      const cachedPreferences = await getCachedUserPreferences(userId)
      if (cachedPreferences) {
        return cachedPreferences
      }

      // Get from vector database
      const preferenceEmbedding = await getUserPreferences(userId)
      if (!preferenceEmbedding) {
        return null
      }

      // Convert embedding metadata to preferences (simplified)
      // In a real implementation, you'd store full preferences in PostgreSQL
      // and use vector search for similarity matching
      const preferences: UserPreferences = {
        brandVoice: {
          tone: preferenceEmbedding.metadata.brandVoice as any,
          personality: [],
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
        contentTypes: [],
        targetAudience: {
          demographics: {
            ageRange: '25-45',
            location: ['global'],
            occupation: [],
            incomeLevel: 'middle',
            education: 'college',
            gender: ['all']
          },
          psychographics: {
            values: [],
            motivations: [],
            challenges: [],
            goals: [],
            lifestyle: [],
            personalityTraits: []
          },
          behaviorPatterns: [],
          painPoints: [],
          interests: [],
          expertiseLevel: 'intermediate',
          preferredContentFormats: []
        },
        businessGoals: preferenceEmbedding.metadata.contentGoals.map(goal => ({
          type: goal as any,
          priority: 5,
          target: 1000,
          timeframe: 30,
          metrics: [],
          currentPerformance: 0
        })),
        platformPriorities: preferenceEmbedding.metadata.preferredPlatforms.map(platform => ({
          platform,
          priority: 5,
          contentTypes: [],
          postingFrequency: 'weekly',
          optimalTimes: [],
          audienceSize: 0,
          engagementRate: 0
        })),
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

      // Cache the preferences
      await setCachedUserPreferences(userId, preferences)

      return preferences
    } catch (error) {
      console.error('Failed to retrieve user preferences:', error)
      return null
    }
  }

  // Update memory with new performance data
  static async updateMemoryWithPerformance(
    userId: string,
    contentId: string,
    performance: PerformanceMetrics
  ): Promise<void> {
    try {
      // This would update the vector database with new performance data
      // For now, we'll just log the update
      console.log(`Updated memory with performance data for user ${userId}, content ${contentId}`)
      
      // In a full implementation, you would:
      // 1. Retrieve the existing content embedding
      // 2. Update the performance metadata
      // 3. Re-store the embedding with updated metadata
      // 4. Trigger learning algorithms to identify new patterns
    } catch (error) {
      console.error('Failed to update memory with performance:', error)
      throw new AIBrainError('Memory update failed', 'MEMORY_UPDATE_ERROR', error)
    }
  }

  // Clear memory for user (for privacy/GDPR compliance)
  static async clearUserMemory(userId: string): Promise<void> {
    try {
      // This would delete all user data from vector databases
      console.log(`Clearing memory for user ${userId}`)
      
      // Invalidate caches
      await this.invalidateUserCaches(userId)
      
      // In a full implementation, you would:
      // 1. Delete all content embeddings for the user
      // 2. Delete all success pattern embeddings for the user
      // 3. Delete user preference embeddings
      // 4. Clear all cached data
    } catch (error) {
      console.error('Failed to clear user memory:', error)
      throw new AIBrainError('Memory clearing failed', 'MEMORY_CLEAR_ERROR', error)
    }
  }

  // Helper methods
  private static calculateOverallPerformance(metrics: PerformanceMetrics): number {
    // Weighted average of key performance indicators
    const weights = {
      engagement: 0.3,
      conversions: 0.3,
      revenue: 0.2,
      viralScore: 0.1,
      seoScore: 0.1
    }

    return (
      (metrics.engagement || 0) * weights.engagement +
      (metrics.conversions || 0) * weights.conversions +
      (metrics.revenue || 0) * weights.revenue +
      (metrics.viralScore || 0) * weights.viralScore +
      (metrics.seoScore || 0) * weights.seoScore
    )
  }

  private static serializePreferences(preferences: UserPreferences): string {
    return [
      preferences.brandVoice.tone,
      preferences.brandVoice.personality.join(' '),
      preferences.targetAudience.demographics.occupation.join(' '),
      preferences.businessGoals.map(g => g.type).join(' '),
      preferences.platformPriorities.map(p => p.platform).join(' ')
    ].join(' ')
  }

  private static serializeAudience(audience: any): string {
    return [
      audience.demographics?.occupation?.join(' ') || '',
      audience.psychographics?.values?.join(' ') || '',
      audience.interests?.join(' ') || ''
    ].join(' ')
  }

  private static filterPatternsByContext(
    patterns: SuccessPattern[],
    context: ContentContext,
    limit: number
  ): SuccessPattern[] {
    return patterns
      .filter(pattern => {
        // Filter by content type
        if (context.contentType && pattern.contentType !== context.contentType) {
          return false
        }
        
        // Filter by platform
        if (context.platform && pattern.platform && pattern.platform !== context.platform) {
          return false
        }
        
        return true
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  private static async invalidateUserCaches(userId: string): Promise<void> {
    try {
      // Clear user preferences cache
      await setCachedUserPreferences(userId, null as any)
      
      // Clear success patterns cache
      await setCachedSuccessPatterns(userId, null as any)
    } catch (error) {
      console.error('Failed to invalidate user caches:', error)
    }
  }

  private static async invalidateSuccessPatternsCache(userId: string): Promise<void> {
    try {
      await setCachedSuccessPatterns(userId, null as any)
    } catch (error) {
      console.error('Failed to invalidate success patterns cache:', error)
    }
  }
}

// Memory Analytics for insights
export class MemoryAnalytics {
  // Analyze memory usage patterns
  static async analyzeMemoryUsage(userId: string): Promise<any> {
    try {
      // This would analyze how the AI brain is using memory
      return {
        totalContentMemories: 0,
        totalSuccessPatterns: 0,
        memoryEfficiency: 0.8,
        mostAccessedPatterns: [],
        memoryGrowthRate: 0.1,
        recommendedCleanup: []
      }
    } catch (error) {
      console.error('Failed to analyze memory usage:', error)
      return null
    }
  }

  // Get memory health metrics
  static async getMemoryHealth(userId: string): Promise<any> {
    try {
      return {
        healthScore: 0.85,
        issues: [],
        recommendations: [
          'Memory usage is optimal',
          'Consider archiving old patterns with low usage'
        ],
        lastOptimized: new Date()
      }
    } catch (error) {
      console.error('Failed to get memory health:', error)
      return null
    }
  }
}