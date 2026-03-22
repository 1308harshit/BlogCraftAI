// Recommendation Engine Tests
// Tests for personalized recommendation system functionality

import { RecommendationEngine } from '@/lib/ai-brain/recommendation-engine'
import { 
  ContentContext,
  UserPreferences,
  UserFeedback
} from '@/lib/ai-brain/types'

// Mock dependencies
jest.mock('@/lib/ai-brain/models', () => ({
  AIPersonalityModel: {
    getByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    addSuccessPattern: jest.fn(),
    getSuccessPatterns: jest.fn()
  }
}))

jest.mock('@/lib/ai-brain/memory', () => ({
  MemoryManager: {
    retrieveRelevantPatterns: jest.fn(),
    storeContentMemory: jest.fn(),
    storeSuccessPatternMemory: jest.fn(),
    storeUserPreferencesMemory: jest.fn()
  }
}))

jest.mock('@/lib/ai-brain/learning-engine', () => ({
  learningEngine: {
    analyzePerformance: jest.fn(),
    updateModel: jest.fn(),
    predictOptimalStrategy: jest.fn(),
    generateRecommendations: jest.fn()
  }
}))

jest.mock('@/lib/ai-brain/adaptation-system', () => ({
  adaptationSystem: {
    adaptToUserFeedback: jest.fn(),
    adaptAIBehavior: jest.fn()
  }
}))

describe('RecommendationEngine', () => {
  let recommendationEngine: RecommendationEngine
  const mockUserId = 'test-user-123'
  
  const mockContext: ContentContext = {
    userId: mockUserId,
    contentType: 'blog',
    platform: 'linkedin',
    targetAudience: 'business_professionals',
    businessGoals: ['traffic', 'engagement']
  }

  beforeEach(() => {
    jest.clearAllMocks()
    recommendationEngine = RecommendationEngine.getInstance()
  })

  describe('generateContentRecommendations', () => {
    it('should generate basic content recommendations', async () => {
      // Mock AI personality
      const mockBrain = {
        userId: mockUserId,
        preferences: {
          brandVoice: {
            tone: 'professional',
            personality: ['knowledgeable'],
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
            painPoints: ['lack_of_time'],
            interests: [],
            expertiseLevel: 'intermediate',
            preferredContentFormats: []
          },
          businessGoals: [{
            type: 'traffic',
            priority: 9,
            target: 50000,
            timeframe: 90,
            metrics: ['page_views'],
            currentPerformance: 25000
          }],
          platformPriorities: [],
          writingStyle: {
            sentenceLength: 'varied',
            paragraphLength: 'medium',
            complexity: 'moderate',
            activeVoice: true,
            firstPerson: false,
            contractions: false,
            rhetoricalQuestions: true
          },
          tonePreferences: [],
          keywordPreferences: [],
          avoidancePatterns: []
        },
        successPatterns: [],
        learningModel: {
          modelType: 'neural_network' as const,
          version: 'v1.0',
          trainingData: {
            totalSamples: 100,
            successfulSamples: 80,
            failedSamples: 20,
            contentTypes: { blog: 50 },
            platforms: { linkedin: 40 },
            dateRange: { start: new Date('2024-01-01'), end: new Date() }
          },
          accuracy: 0.85,
          lastTrained: new Date(),
          parameters: {},
          performance: {
            accuracy: 0.85,
            precision: 0.82,
            recall: 0.78,
            f1Score: 0.80,
            auc: 0.88
          }
        },
        adaptationHistory: [],
        lastUpdated: new Date(),
        adaptationLevel: 5,
        confidenceScore: 0.85
      }

      // Mock dependencies
      const { AIPersonalityModel } = require('@/lib/ai-brain/models')
      const { MemoryManager } = require('@/lib/ai-brain/memory')
      
      AIPersonalityModel.getByUserId.mockResolvedValue(mockBrain)
      MemoryManager.retrieveRelevantPatterns.mockResolvedValue([])

      const recommendations = await recommendationEngine.generateContentRecommendations(
        mockUserId, mockContext, 5
      )

      // Verify recommendations structure
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)

      // Verify each recommendation has required properties
      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('recommendationId')
        expect(rec).toHaveProperty('type')
        expect(rec).toHaveProperty('title')
        expect(rec).toHaveProperty('description')
        expect(rec).toHaveProperty('confidence')
        expect(rec).toHaveProperty('expectedImpact')
        expect(rec).toHaveProperty('priority')
        
        // Verify confidence and impact are in valid ranges
        expect(rec.confidence).toBeGreaterThan(0)
        expect(rec.confidence).toBeLessThanOrEqual(1)
        expect(rec.expectedImpact).toBeGreaterThan(0)
        expect(rec.expectedImpact).toBeLessThanOrEqual(1)
      })
    })

    it('should return empty array for user without AI personality', async () => {
      const { AIPersonalityModel } = require('@/lib/ai-brain/models')
      AIPersonalityModel.getByUserId.mockResolvedValue(null)

      const recommendations = await recommendationEngine.generateContentRecommendations(
        'nonexistent-user', mockContext
      )

      expect(recommendations).toEqual([])
    })
  })

  describe('Real-time adaptation capability', () => {
    it('should support real-time adaptation through feedback', async () => {
      const mockFeedback: UserFeedback = {
        feedbackId: 'feedback-123',
        userId: mockUserId,
        contentId: 'content-123',
        feedbackType: 'rating',
        rating: 8,
        feedback: 'Great recommendations!',
        category: 'recommendation_quality',
        timestamp: new Date(),
        processed: false
      }

      const { adaptationSystem } = require('@/lib/ai-brain/adaptation-system')
      adaptationSystem.adaptToUserFeedback.mockResolvedValue({
        resultId: 'adaptation-123',
        adaptationType: 'rating',
        success: true,
        changes: [],
        impact: { 
          expectedImprovement: 0.1, 
          affectedMetrics: ['user_satisfaction'], 
          riskLevel: 'low', 
          rollbackPossible: true 
        },
        nextSteps: ['Monitor user satisfaction'],
        monitoringPlan: { 
          metrics: [], 
          checkpoints: [], 
          thresholds: {}, 
          rollbackTriggers: [] 
        }
      })

      // Mock brain for adaptation
      const { AIPersonalityModel } = require('@/lib/ai-brain/models')
      const { MemoryManager } = require('@/lib/ai-brain/memory')
      
      AIPersonalityModel.getByUserId.mockResolvedValue({
        userId: mockUserId,
        preferences: {
          brandVoice: {
            tone: 'professional',
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
          businessGoals: [],
          platformPriorities: [],
          writingStyle: {
            sentenceLength: 'varied',
            paragraphLength: 'medium',
            complexity: 'moderate',
            activeVoice: true,
            firstPerson: false,
            contractions: false,
            rhetoricalQuestions: true
          },
          tonePreferences: [],
          keywordPreferences: [],
          avoidancePatterns: []
        },
        successPatterns: [],
        learningModel: {
          modelType: 'neural_network' as const,
          version: 'v1.0',
          trainingData: {
            totalSamples: 50,
            successfulSamples: 40,
            failedSamples: 10,
            contentTypes: {},
            platforms: {},
            dateRange: { start: new Date(), end: new Date() }
          },
          accuracy: 0.8,
          lastTrained: new Date(),
          parameters: {},
          performance: {
            accuracy: 0.8,
            precision: 0.8,
            recall: 0.8,
            f1Score: 0.8,
            auc: 0.8
          }
        },
        adaptationHistory: [],
        lastUpdated: new Date(),
        adaptationLevel: 3,
        confidenceScore: 0.8
      })
      MemoryManager.retrieveRelevantPatterns.mockResolvedValue([])

      const adaptedRecommendations = await recommendationEngine.adaptRecommendationsToFeedback(
        mockUserId, mockFeedback, mockContext
      )

      // Verify adaptation was called
      expect(adaptationSystem.adaptToUserFeedback).toHaveBeenCalledWith(mockUserId, mockFeedback)

      // Verify new recommendations were generated
      expect(Array.isArray(adaptedRecommendations)).toBe(true)
    })
  })
})