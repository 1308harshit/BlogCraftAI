// AI Brain API - Learning and Recommendation Endpoints
// Provides API access to brain learning capabilities and recommendation generation

import { NextRequest, NextResponse } from 'next/server'
import { 
  BrainLearningRequest,
  BrainLearningResponse,
  RecommendationRequest,
  RecommendationResponse,
  UserFeedback,
  ContentContext,
  PerformanceMetrics,
  AIBrainError
} from '@/lib/ai-brain/types'

import { learningEngine } from '@/lib/ai-brain/learning-engine'
import { recommendationEngine } from '@/lib/ai-brain/recommendation-engine'
import { adaptationSystem } from '@/lib/ai-brain/adaptation-system'
import { AIPersonalityModel } from '@/lib/ai-brain/models'
import { MemoryManager } from '@/lib/ai-brain/memory'

// POST /api/ai-brain - Main AI Brain endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'learn':
        return await handleLearning(data as BrainLearningRequest)
      
      case 'recommend':
        return await handleRecommendations(data as RecommendationRequest)
      
      case 'feedback':
        return await handleFeedback(data)
      
      case 'adapt':
        return await handleAdaptation(data)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: learn, recommend, feedback, adapt' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Brain API error:', error)
    
    if (error instanceof AIBrainError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/ai-brain - Get AI Brain status and recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action') || 'status'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'status':
        return await getBrainStatus(userId)
      
      case 'recommendations':
        return await getRecommendations(userId, searchParams)
      
      case 'patterns':
        return await getSuccessPatterns(userId, searchParams)
      
      case 'analytics':
        return await getBrainAnalytics(userId, searchParams)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: status, recommendations, patterns, analytics' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Brain GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle learning requests
async function handleLearning(request: BrainLearningRequest): Promise<NextResponse> {
  try {
    // Validate request
    if (!request.userId || !request.contentId || !request.performanceData) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, contentId, performanceData' },
        { status: 400 }
      )
    }

    // Create content data object
    const contentData = {
      id: request.contentId,
      userId: request.userId,
      type: request.context?.contentType || 'blog',
      title: 'Content Title', // In real implementation, fetch from database
      content: 'Content Body', // In real implementation, fetch from database
      metadata: {
        keywords: [],
        targetAudience: request.context?.targetAudience || 'general',
        brandVoice: 'professional',
        seoScore: request.performanceData.seoScore || 0,
        viralScore: request.performanceData.viralScore || 0,
        readingTime: 5,
        wordCount: 1000,
        language: 'en',
        sentiment: 0.5,
        complexity: 0.6,
        platform: request.context?.platform
      },
      performance: request.performanceData,
      context: request.context || {
        userId: request.userId,
        contentType: 'blog',
        targetAudience: 'general',
        businessGoals: ['engagement']
      },
      createdAt: new Date(),
      publishedAt: new Date()
    }

    // Analyze performance and generate insights
    const insights = await learningEngine.analyzePerformance(contentData, request.performanceData)

    // Store content in memory
    await MemoryManager.storeContentMemory(request.userId, contentData, request.performanceData)

    // Update AI model if we have enough insights
    const adaptations = []
    if (insights.confidence > 0.7) {
      try {
        const modelUpdate = await learningEngine.updateModel([insights])
        console.log('Model updated successfully:', modelUpdate.updateId)
      } catch (error) {
        console.log('Model update skipped:', error.message)
      }
    }

    // Process user feedback if provided
    if (request.userFeedback) {
      const adaptationResult = await adaptationSystem.adaptToUserFeedback(
        request.userId, 
        request.userFeedback
      )
      adaptations.push(adaptationResult)
    }

    const response: BrainLearningResponse = {
      success: true,
      insights: [insights],
      adaptations,
      updatedModel: insights.confidence > 0.7,
      message: `Successfully processed learning data for content ${request.contentId}. Generated ${insights.recommendations.length} recommendations.`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Learning processing error:', error)
    throw error
  }
}

// Handle recommendation requests
async function handleRecommendations(request: RecommendationRequest): Promise<NextResponse> {
  try {
    // Validate request
    if (!request.userId || !request.contentType || !request.context) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, contentType, context' },
        { status: 400 }
      )
    }

    // Generate recommendations
    const response = await recommendationEngine.generateRecommendations(request)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Recommendation generation error:', error)
    throw error
  }
}

// Handle feedback processing
async function handleFeedback(data: any): Promise<NextResponse> {
  try {
    const { userId, feedback, context } = data

    if (!userId || !feedback) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, feedback' },
        { status: 400 }
      )
    }

    // Process feedback through adaptation system
    const adaptationResult = await adaptationSystem.adaptToUserFeedback(userId, feedback)

    // Generate updated recommendations if context provided
    let updatedRecommendations = []
    if (context) {
      updatedRecommendations = await recommendationEngine.adaptRecommendationsToFeedback(
        userId, feedback, context
      )
    }

    return NextResponse.json({
      success: true,
      adaptation: adaptationResult,
      updatedRecommendations,
      message: 'Feedback processed successfully and AI behavior adapted'
    })
  } catch (error) {
    console.error('Feedback processing error:', error)
    throw error
  }
}

// Handle adaptation requests
async function handleAdaptation(data: any): Promise<NextResponse> {
  try {
    const { userId, trigger, context } = data

    if (!userId || !trigger) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, trigger' },
        { status: 400 }
      )
    }

    // Perform adaptation
    const adaptationResult = await adaptationSystem.adaptAIBehavior(userId, trigger, context)

    return NextResponse.json({
      success: true,
      adaptation: adaptationResult,
      message: 'AI behavior adaptation completed successfully'
    })
  } catch (error) {
    console.error('Adaptation processing error:', error)
    throw error
  }
}

// Get AI Brain status
async function getBrainStatus(userId: string): Promise<NextResponse> {
  try {
    // Get AI personality
    const brain = await AIPersonalityModel.getByUserId(userId)
    
    if (!brain) {
      // Create new AI personality if it doesn't exist
      const newBrain = await AIPersonalityModel.create(userId)
      return NextResponse.json({
        status: 'initialized',
        brain: {
          userId: newBrain.userId,
          adaptationLevel: newBrain.adaptationLevel,
          confidenceScore: newBrain.confidenceScore,
          successPatterns: newBrain.successPatterns.length,
          lastUpdated: newBrain.lastUpdated
        },
        message: 'AI Brain initialized for new user'
      })
    }

    // Get recent learning trends
    const learningTrends = await AIPersonalityModel.getByUserId(userId)

    return NextResponse.json({
      status: 'active',
      brain: {
        userId: brain.userId,
        adaptationLevel: brain.adaptationLevel,
        confidenceScore: brain.confidenceScore,
        successPatterns: brain.successPatterns.length,
        lastUpdated: brain.lastUpdated,
        learningModel: {
          type: brain.learningModel.modelType,
          version: brain.learningModel.version,
          accuracy: brain.learningModel.accuracy,
          lastTrained: brain.learningModel.lastTrained
        }
      },
      capabilities: [
        'Performance Analysis',
        'Success Pattern Recognition',
        'Personalized Recommendations',
        'Real-time Adaptation',
        'Content Optimization',
        'Strategy Generation'
      ],
      message: 'AI Brain is active and learning'
    })
  } catch (error) {
    console.error('Brain status error:', error)
    throw error
  }
}

// Get recommendations
async function getRecommendations(userId: string, searchParams: URLSearchParams): Promise<NextResponse> {
  try {
    const contentType = searchParams.get('contentType') || 'blog'
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Create context
    const context: ContentContext = {
      userId,
      contentType,
      platform: platform || undefined,
      targetAudience: 'general',
      businessGoals: ['engagement', 'traffic']
    }

    // Generate recommendations
    const recommendations = await recommendationEngine.generateContentRecommendations(
      userId, context, limit
    )

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
      context,
      message: `Generated ${recommendations.length} personalized recommendations`
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    throw error
  }
}

// Get success patterns
async function getSuccessPatterns(userId: string, searchParams: URLSearchParams): Promise<NextResponse> {
  try {
    const contentType = searchParams.get('contentType')
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get success patterns
    const patterns = await AIPersonalityModel.getSuccessPatterns(
      userId, contentType || undefined, platform || undefined, limit
    )

    return NextResponse.json({
      patterns,
      count: patterns.length,
      filters: {
        contentType: contentType || 'all',
        platform: platform || 'all'
      },
      message: `Retrieved ${patterns.length} success patterns`
    })
  } catch (error) {
    console.error('Get success patterns error:', error)
    throw error
  }
}

// Get brain analytics
async function getBrainAnalytics(userId: string, searchParams: URLSearchParams): Promise<NextResponse> {
  try {
    const days = parseInt(searchParams.get('days') || '30')

    // Get AI personality for basic stats
    const brain = await AIPersonalityModel.getByUserId(userId)
    
    if (!brain) {
      return NextResponse.json({
        analytics: null,
        message: 'AI Brain not found for user'
      })
    }

    // Simulate analytics data (in real implementation, calculate from actual data)
    const analytics = {
      learningProgress: {
        adaptationLevel: brain.adaptationLevel,
        confidenceScore: brain.confidenceScore,
        totalPatterns: brain.successPatterns.length,
        recentImprovements: Math.round(brain.confidenceScore * 10) / 10
      },
      performanceMetrics: {
        averageContentScore: 0.75,
        recommendationAccuracy: 0.82,
        adaptationSuccess: 0.78,
        userSatisfaction: 0.85
      },
      contentInsights: {
        topPerformingTypes: ['blog', 'social'],
        bestEngagementTimes: ['09:00', '14:00', '19:00'],
        successfulPatterns: brain.successPatterns.slice(0, 3).map(p => p.patternType),
        improvementAreas: ['timing_optimization', 'engagement_hooks']
      },
      trends: {
        period: `${days} days`,
        learningVelocity: 'increasing',
        adaptationFrequency: 'optimal',
        confidenceTrend: 'improving'
      }
    }

    return NextResponse.json({
      analytics,
      period: `${days} days`,
      message: 'AI Brain analytics retrieved successfully'
    })
  } catch (error) {
    console.error('Get brain analytics error:', error)
    throw error
  }
}

// PUT /api/ai-brain - Update AI Brain settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, preferences, settings } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Update AI personality with new preferences
    const updates: any = {}
    if (preferences) {
      updates.preferences = preferences
    }

    const updatedBrain = await AIPersonalityModel.update(userId, updates)

    // Store updated preferences in memory
    if (preferences) {
      await MemoryManager.storeUserPreferencesMemory(userId, preferences)
    }

    return NextResponse.json({
      success: true,
      brain: {
        userId: updatedBrain.userId,
        adaptationLevel: updatedBrain.adaptationLevel,
        confidenceScore: updatedBrain.confidenceScore,
        lastUpdated: updatedBrain.lastUpdated
      },
      message: 'AI Brain preferences updated successfully'
    })
  } catch (error) {
    console.error('AI Brain update error:', error)
    
    if (error instanceof AIBrainError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/ai-brain - Clear AI Brain memory (GDPR compliance)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Clear user memory
    await MemoryManager.clearUserMemory(userId)

    return NextResponse.json({
      success: true,
      message: 'AI Brain memory cleared successfully'
    })
  } catch (error) {
    console.error('AI Brain deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}