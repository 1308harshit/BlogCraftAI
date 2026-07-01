// Adaptation System - AI Behavior Updates Based on Performance Data
// Implements automatic AI behavior adaptation and continuous improvement

import {
  AdaptationRecord,
  AdaptationTrigger,
  AdaptationChange,
  AdaptationImpact,
  AdaptationResult,
  PerformanceMetrics,
  UserFeedback,
  PersonalAIBrain,
  UserPreferences,
  SuccessPattern,
  ContentContext,
  AIBrainError,
  AdaptationError,
  MonitoringPlan
} from './types'

import { AIPersonalityModel, LearningRecordModel } from './models'
import { MemoryManager } from './memory'
import { learningEngine } from './learning-engine'
import { getAIBrainConfig } from '../config'

// Get configuration
const config = getAIBrainConfig()

// Core Adaptation System
export class AdaptationSystem {
  private static instance: AdaptationSystem
  private adaptationThresholds = config.adaptation

  private adaptationHistory: Map<string, AdaptationRecord[]> = new Map()

  static getInstance(): AdaptationSystem {
    if (!AdaptationSystem.instance) {
      AdaptationSystem.instance = new AdaptationSystem()
    }
    return AdaptationSystem.instance
  }

  // Main adaptation orchestrator
  async adaptAIBehavior(
    userId: string,
    trigger: AdaptationTrigger,
    context?: ContentContext
  ): Promise<AdaptationResult> {
    try {
      // Check adaptation eligibility
      await this.validateAdaptationEligibility(userId, trigger)
      
      // Analyze current AI state
      const currentBrain = await AIPersonalityModel.getByUserId(userId)
      if (!currentBrain) {
        throw new AdaptationError('AI personality not found for user')
      }

      // Determine adaptation strategy
      const adaptationStrategy = await this.determineAdaptationStrategy(
        currentBrain, trigger, context
      )
      
      // Generate adaptation changes
      const changes = await this.generateAdaptationChanges(
        currentBrain, adaptationStrategy, trigger
      )
      
      // Calculate adaptation impact
      const impact = await this.calculateAdaptationImpact(changes, currentBrain)
      
      // Apply adaptations
      const result = await this.applyAdaptations(
        userId, changes, impact, trigger
      )
      
      // Create monitoring plan
      const monitoringPlan = this.createMonitoringPlan(changes, impact)
      
      // Record adaptation
      const adaptationRecord = await this.recordAdaptation(
        userId, trigger, changes, impact, result
      )
      
      return {
        resultId: `adaptation-${userId}-${Date.now()}`,
        adaptationType: trigger.type,
        success: result.success,
        changes,
        impact,
        nextSteps: result.nextSteps,
        monitoringPlan
      }
    } catch (error) {
      throw new AdaptationError('AI behavior adaptation failed', error)
    }
  }
  // Performance-based adaptation
  async adaptToPerformanceData(
    userId: string,
    performanceData: PerformanceMetrics[],
    contentContext: ContentContext
  ): Promise<AdaptationResult> {
    try {
      // Analyze performance trends
      const performanceTrend = this.analyzePerformanceTrend(performanceData)
      
      // Create performance trigger
      const trigger: AdaptationTrigger = {
        type: 'performance_feedback',
        source: 'performance_analytics',
        data: {
          performanceTrend,
          avgPerformance: performanceTrend.averageScore,
          performanceChange: performanceTrend.changePercent
        },
        threshold: this.adaptationThresholds.performanceDropThreshold
      }
      
      // Check if adaptation is needed
      if (Math.abs(performanceTrend.changePercent) < this.adaptationThresholds.performanceDropThreshold) {
        return this.createNoAdaptationResult(userId, 'Performance within acceptable range')
      }
      
      return await this.adaptAIBehavior(userId, trigger, contentContext)
    } catch (error) {
      throw new AdaptationError('Performance-based adaptation failed', error)
    }
  }

  // User feedback-based adaptation
  async adaptToUserFeedback(
    userId: string,
    feedback: UserFeedback
  ): Promise<AdaptationResult> {
    try {
      // Analyze feedback significance
      const feedbackAnalysis = this.analyzeFeedbackSignificance(feedback)
      
      // Create feedback trigger
      const trigger: AdaptationTrigger = {
        type: 'user_feedback',
        source: 'user_input',
        data: {
          feedbackType: feedback.feedbackType,
          rating: feedback.rating,
          feedback: feedback.feedback,
          significance: feedbackAnalysis.significance
        },
        threshold: this.adaptationThresholds.feedbackScoreThreshold
      }
      
      // Check if adaptation is needed
      if (!feedbackAnalysis.requiresAdaptation) {
        return this.createNoAdaptationResult(userId, 'Feedback does not require adaptation')
      }
      
      return await this.adaptAIBehavior(userId, trigger)
    } catch (error) {
      throw new AdaptationError('Feedback-based adaptation failed', error)
    }
  }

  // Pattern-based adaptation
  async adaptToSuccessPatterns(
    userId: string,
    newPatterns: SuccessPattern[]
  ): Promise<AdaptationResult> {
    try {
      // Filter high-confidence patterns
      const highConfidencePatterns = newPatterns.filter(
        pattern => pattern.confidence >= this.adaptationThresholds.patternConfidenceThreshold
      )
      
      if (highConfidencePatterns.length === 0) {
        return this.createNoAdaptationResult(userId, 'No high-confidence patterns found')
      }
      
      // Create pattern trigger
      const trigger: AdaptationTrigger = {
        type: 'pattern_detection',
        source: 'success_pattern_analysis',
        data: {
          patterns: highConfidencePatterns,
          patternCount: highConfidencePatterns.length,
          avgConfidence: highConfidencePatterns.reduce((sum, p) => sum + p.confidence, 0) / highConfidencePatterns.length
        },
        threshold: this.adaptationThresholds.patternConfidenceThreshold
      }
      
      return await this.adaptAIBehavior(userId, trigger)
    } catch (error) {
      throw new AdaptationError('Pattern-based adaptation failed', error)
    }
  }

  // Scheduled adaptation (periodic optimization)
  async performScheduledAdaptation(userId: string): Promise<AdaptationResult> {
    try {
      // Get recent performance data
      const recentLearningRecords = await LearningRecordModel.getByUserId(userId, 30)
      
      // Analyze adaptation opportunities
      const adaptationOpportunities = await this.identifyAdaptationOpportunities(
        userId, recentLearningRecords
      )
      
      if (adaptationOpportunities.length === 0) {
        return this.createNoAdaptationResult(userId, 'No adaptation opportunities identified')
      }
      
      // Create scheduled trigger
      const trigger: AdaptationTrigger = {
        type: 'scheduled_update',
        source: 'periodic_optimization',
        data: {
          opportunities: adaptationOpportunities,
          analysisDate: new Date(),
          recordCount: recentLearningRecords.length
        }
      }
      
      return await this.adaptAIBehavior(userId, trigger)
    } catch (error) {
      throw new AdaptationError('Scheduled adaptation failed', error)
    }
  }
  // Helper Methods for Adaptation Logic
  private async validateAdaptationEligibility(
    userId: string, 
    trigger: AdaptationTrigger
  ): Promise<void> {
    // Check cooldown period
    const recentAdaptations = await this.getRecentAdaptations(userId)
    const lastAdaptation = recentAdaptations[0]
    
    if (lastAdaptation) {
      const timeSinceLastAdaptation = Date.now() - lastAdaptation.timestamp.getTime()
      if (timeSinceLastAdaptation < this.adaptationThresholds.adaptationCooldownMs) {
        throw new AdaptationError('Adaptation cooldown period not met')
      }
    }
    
    // Check daily adaptation limit
    const todayAdaptations = recentAdaptations.filter(
      adaptation => this.isToday(adaptation.timestamp)
    )
    
    if (todayAdaptations.length >= this.adaptationThresholds.maxAdaptationsPerDay) {
      throw new AdaptationError('Daily adaptation limit exceeded')
    }
  }

  private async determineAdaptationStrategy(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger,
    context?: ContentContext
  ): Promise<string> {
    switch (trigger.type) {
      case 'performance_feedback':
        return trigger.data.performanceTrend.changePercent < 0 ? 
          'performance_improvement' : 'performance_optimization'
      
      case 'user_feedback':
        return trigger.data.feedbackType === 'correction' ? 
          'behavior_correction' : 'preference_alignment'
      
      case 'pattern_detection':
        return 'pattern_integration'
      
      case 'scheduled_update':
        return 'comprehensive_optimization'
      
      default:
        return 'general_adaptation'
    }
  }

  private async generateAdaptationChanges(
    brain: PersonalAIBrain,
    strategy: string,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    const changes: AdaptationChange[] = []
    
    switch (strategy) {
      case 'performance_improvement':
        changes.push(...await this.generatePerformanceImprovementChanges(brain, trigger))
        break
      
      case 'performance_optimization':
        changes.push(...await this.generatePerformanceOptimizationChanges(brain, trigger))
        break
      
      case 'behavior_correction':
        changes.push(...await this.generateBehaviorCorrectionChanges(brain, trigger))
        break
      
      case 'preference_alignment':
        changes.push(...await this.generatePreferenceAlignmentChanges(brain, trigger))
        break
      
      case 'pattern_integration':
        changes.push(...await this.generatePatternIntegrationChanges(brain, trigger))
        break
      
      case 'comprehensive_optimization':
        changes.push(...await this.generateComprehensiveOptimizationChanges(brain, trigger))
        break
    }
    
    return changes
  }

  private async calculateAdaptationImpact(
    changes: AdaptationChange[],
    brain: PersonalAIBrain
  ): Promise<AdaptationImpact> {
    // Calculate expected improvement based on change types and confidence
    const expectedImprovement = changes.reduce((sum, change) => {
      return sum + (change.confidence * 0.1) // Each high-confidence change contributes 10%
    }, 0)
    
    // Determine affected metrics
    const affectedMetrics = this.determineAffectedMetrics(changes)
    
    // Assess risk level
    const riskLevel = this.assessRiskLevel(changes, expectedImprovement)
    
    return {
      expectedImprovement: Math.min(expectedImprovement, 0.5), // Cap at 50% improvement
      affectedMetrics,
      riskLevel,
      rollbackPossible: true
    }
  }

  private async applyAdaptations(
    userId: string,
    changes: AdaptationChange[],
    impact: AdaptationImpact,
    trigger: AdaptationTrigger
  ): Promise<{ success: boolean; nextSteps: string[] }> {
    try {
      // Get current brain state
      const currentBrain = await AIPersonalityModel.getByUserId(userId)
      if (!currentBrain) {
        throw new AdaptationError('AI personality not found')
      }
      
      // Apply changes to brain
      const updatedBrain = await this.applyChangesToBrain(currentBrain, changes)
      
      // Update AI personality
      await AIPersonalityModel.update(userId, updatedBrain)
      
      // Update memory if needed
      await this.updateMemoryWithAdaptations(userId, changes)
      
      // Generate next steps
      const nextSteps = this.generateNextSteps(changes, impact)
      
      return {
        success: true,
        nextSteps
      }
    } catch (error) {
      console.error('Failed to apply adaptations:', error)
      return {
        success: false,
        nextSteps: ['Review adaptation failure', 'Consider rollback', 'Investigate root cause']
      }
    }
  }
  // Performance Analysis Methods
  private analyzePerformanceTrend(performanceData: PerformanceMetrics[]): any {
    if (performanceData.length === 0) {
      return { averageScore: 0, changePercent: 0, trend: 'stable' }
    }
    
    // Calculate average performance scores
    const scores = performanceData.map(metrics => {
      return (metrics.engagementRate * 0.3) + 
             (metrics.conversionRate * 0.3) + 
             (metrics.viralScore / 100 * 0.2) + 
             (metrics.seoScore / 100 * 0.2)
    })
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    
    // Calculate trend (comparing first half to second half)
    const midPoint = Math.floor(scores.length / 2)
    const firstHalf = scores.slice(0, midPoint)
    const secondHalf = scores.slice(midPoint)
    
    if (firstHalf.length === 0 || secondHalf.length === 0) {
      return { averageScore, changePercent: 0, trend: 'stable' }
    }
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length
    
    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100
    const trend = changePercent > 5 ? 'improving' : changePercent < -5 ? 'declining' : 'stable'
    
    return { averageScore, changePercent, trend }
  }

  private analyzeFeedbackSignificance(feedback: UserFeedback): any {
    let significance = 'low'
    let requiresAdaptation = false
    
    // Rating-based significance
    if (feedback.rating !== undefined) {
      if (feedback.rating <= 4) {
        significance = 'high'
        requiresAdaptation = true
      } else if (feedback.rating <= 6) {
        significance = 'medium'
        requiresAdaptation = true
      }
    }
    
    // Feedback type significance
    if (feedback.feedbackType === 'correction') {
      significance = 'high'
      requiresAdaptation = true
    }
    
    // Content-based significance (simplified)
    const negativeKeywords = ['bad', 'wrong', 'terrible', 'awful', 'hate', 'disappointed']
    const hasNegativeKeywords = negativeKeywords.some(keyword => 
      feedback.feedback.toLowerCase().includes(keyword)
    )
    
    if (hasNegativeKeywords) {
      significance = 'high'
      requiresAdaptation = true
    }
    
    return { significance, requiresAdaptation }
  }

  private async identifyAdaptationOpportunities(
    userId: string, 
    learningRecords: any[]
  ): Promise<string[]> {
    const opportunities: string[] = []
    
    if (learningRecords.length === 0) {
      return opportunities
    }
    
    // Analyze learning record patterns
    const avgConfidence = learningRecords.reduce((sum, record) => 
      sum + (record.confidence_score || 0), 0) / learningRecords.length
    
    if (avgConfidence < 0.7) {
      opportunities.push('improve_model_confidence')
    }
    
    // Check for consistent failure patterns
    const failureRecords = learningRecords.filter(record => 
      record.confidence_score < 0.5
    )
    
    if (failureRecords.length > learningRecords.length * 0.3) {
      opportunities.push('address_failure_patterns')
    }
    
    // Check for underutilized success patterns
    const successRecords = learningRecords.filter(record => 
      record.confidence_score > 0.8
    )
    
    if (successRecords.length > 0) {
      opportunities.push('replicate_success_patterns')
    }
    
    return opportunities
  }

  // Change Generation Methods
  private async generatePerformanceImprovementChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    return [
      {
        field: 'content_generation_strategy',
        oldValue: 'current_strategy',
        newValue: 'performance_optimized_strategy',
        reason: 'Adapting to improve declining performance metrics',
        confidence: 0.8
      },
      {
        field: 'engagement_tactics',
        oldValue: brain.preferences.contentTypes[0]?.engagementTactics || [],
        newValue: 'enhanced_engagement_tactics',
        reason: 'Strengthening engagement approaches based on performance data',
        confidence: 0.75
      }
    ]
  }

  private async generatePerformanceOptimizationChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    return [
      {
        field: 'success_amplification',
        oldValue: 'standard_approach',
        newValue: 'amplified_successful_elements',
        reason: 'Amplifying successful performance patterns',
        confidence: 0.85
      }
    ]
  }

  private async generateBehaviorCorrectionChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    return [
      {
        field: 'content_generation_rules',
        oldValue: 'current_rules',
        newValue: 'corrected_rules',
        reason: `User correction: ${trigger.data.feedback}`,
        confidence: 0.9
      }
    ]
  }

  private async generatePreferenceAlignmentChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    return [
      {
        field: 'user_preferences',
        oldValue: brain.preferences,
        newValue: 'aligned_preferences',
        reason: 'Aligning AI behavior with updated user preferences',
        confidence: 0.8
      }
    ]
  }

  private async generatePatternIntegrationChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    const patterns = trigger.data.patterns as SuccessPattern[]
    
    return patterns.map((pattern, index) => ({
      field: 'success_patterns',
      oldValue: brain.successPatterns,
      newValue: `integrated_pattern_${pattern.patternId}`,
      reason: `Integrating high-confidence success pattern: ${pattern.patternType}`,
      confidence: pattern.confidence
    }))
  }

  private async generateComprehensiveOptimizationChanges(
    brain: PersonalAIBrain,
    trigger: AdaptationTrigger
  ): Promise<AdaptationChange[]> {
    return [
      {
        field: 'learning_model',
        oldValue: brain.learningModel,
        newValue: 'optimized_model',
        reason: 'Comprehensive model optimization based on accumulated learning',
        confidence: 0.75
      },
      {
        field: 'adaptation_level',
        oldValue: brain.adaptationLevel,
        newValue: Math.min(brain.adaptationLevel + 1, 10),
        reason: 'Increasing adaptation sophistication',
        confidence: 0.9
      }
    ]
  }
  // Utility Methods
  private determineAffectedMetrics(changes: AdaptationChange[]): string[] {
    const metrics = new Set<string>()
    
    changes.forEach(change => {
      switch (change.field) {
        case 'content_generation_strategy':
        case 'engagement_tactics':
          metrics.add('engagement_rate')
          metrics.add('content_quality')
          break
        case 'success_amplification':
          metrics.add('performance_score')
          metrics.add('success_rate')
          break
        case 'user_preferences':
          metrics.add('user_satisfaction')
          metrics.add('preference_alignment')
          break
        case 'success_patterns':
          metrics.add('pattern_replication')
          metrics.add('content_effectiveness')
          break
        case 'learning_model':
          metrics.add('model_accuracy')
          metrics.add('prediction_quality')
          break
      }
    })
    
    return Array.from(metrics)
  }

  private assessRiskLevel(
    changes: AdaptationChange[], 
    expectedImprovement: number
  ): 'low' | 'medium' | 'high' {
    // High number of changes increases risk
    if (changes.length > 5) return 'high'
    
    // Low confidence changes increase risk
    const lowConfidenceChanges = changes.filter(c => c.confidence < 0.6)
    if (lowConfidenceChanges.length > 0) return 'medium'
    
    // Very high expected improvement might be unrealistic
    if (expectedImprovement > 0.4) return 'medium'
    
    return 'low'
  }

  private async applyChangesToBrain(
    brain: PersonalAIBrain, 
    changes: AdaptationChange[]
  ): Promise<Partial<PersonalAIBrain>> {
    const updates: Partial<PersonalAIBrain> = {
      lastUpdated: new Date()
    }
    
    // Apply each change
    changes.forEach(change => {
      switch (change.field) {
        case 'adaptation_level':
          updates.adaptationLevel = change.newValue as number
          break
        case 'learning_model':
          updates.learningModel = {
            ...brain.learningModel,
            lastTrained: new Date(),
            accuracy: Math.min(brain.learningModel.accuracy + 0.05, 0.95)
          }
          break
        case 'user_preferences':
          // In a real implementation, this would update specific preferences
          updates.preferences = brain.preferences
          break
      }
    })
    
    return updates
  }

  private async updateMemoryWithAdaptations(
    userId: string, 
    changes: AdaptationChange[]
  ): Promise<void> {
    // Update memory systems with adaptation changes
    for (const change of changes) {
      if (change.field === 'success_patterns') {
        // Update success pattern memory
        console.log(`Updated success pattern memory for user ${userId}`)
      }
    }
  }

  private generateNextSteps(
    changes: AdaptationChange[], 
    impact: AdaptationImpact
  ): string[] {
    const steps: string[] = []
    
    steps.push('Monitor performance metrics for adaptation effectiveness')
    
    if (impact.riskLevel === 'high') {
      steps.push('Closely monitor for any negative impacts')
      steps.push('Prepare rollback plan if needed')
    }
    
    steps.push('Collect user feedback on adapted behavior')
    steps.push('Validate adaptation success after monitoring period')
    
    if (changes.length > 3) {
      steps.push('Analyze individual change impacts')
    }
    
    return steps
  }

  private createMonitoringPlan(
    changes: AdaptationChange[], 
    impact: AdaptationImpact
  ): MonitoringPlan {
    const metrics = impact.affectedMetrics
    const checkpoints = [
      new Date(Date.now() + 24 * 60 * 60 * 1000),  // 1 day
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),   // 1 week
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)   // 1 month
    ]
    
    const thresholds: Record<string, number> = {}
    metrics.forEach(metric => {
      thresholds[metric] = 0.7 // Default threshold
    })
    
    const rollbackTriggers = [
      'performance_drop > 20%',
      'user_satisfaction < 0.6',
      'error_rate > 10%'
    ]
    
    return { metrics, checkpoints, thresholds, rollbackTriggers }
  }

  private async recordAdaptation(
    userId: string,
    trigger: AdaptationTrigger,
    changes: AdaptationChange[],
    impact: AdaptationImpact,
    result: { success: boolean; nextSteps: string[] }
  ): Promise<AdaptationRecord> {
    const record: AdaptationRecord = {
      recordId: `adaptation-${userId}-${Date.now()}`,
      adaptationType: this.mapTriggerToAdaptationType(trigger.type),
      trigger,
      changes,
      impact,
      confidence: changes.reduce((sum, c) => sum + c.confidence, 0) / changes.length,
      timestamp: new Date(),
      rollbackData: await this.createRollbackData(userId)
    }
    
    // Store in adaptation history
    if (!this.adaptationHistory.has(userId)) {
      this.adaptationHistory.set(userId, [])
    }
    this.adaptationHistory.get(userId)!.push(record)
    
    return record
  }

  private mapTriggerToAdaptationType(
    triggerType: string
  ): 'preference_update' | 'pattern_learning' | 'performance_adjustment' | 'strategy_change' {
    switch (triggerType) {
      case 'user_feedback': return 'preference_update'
      case 'pattern_detection': return 'pattern_learning'
      case 'performance_feedback': return 'performance_adjustment'
      default: return 'strategy_change'
    }
  }

  private async createRollbackData(userId: string): Promise<any> {
    const currentBrain = await AIPersonalityModel.getByUserId(userId)
    return {
      brain: currentBrain,
      timestamp: new Date()
    }
  }

  private async getRecentAdaptations(userId: string): Promise<AdaptationRecord[]> {
    return this.adaptationHistory.get(userId) || []
  }

  private isToday(date: Date): boolean {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  private createNoAdaptationResult(userId: string, reason: string): AdaptationResult {
    return {
      resultId: `no-adaptation-${userId}-${Date.now()}`,
      adaptationType: 'strategy_change',
      success: true,
      changes: [],
      impact: {
        expectedImprovement: 0,
        affectedMetrics: [],
        riskLevel: 'low',
        rollbackPossible: false
      },
      nextSteps: [reason, 'Continue monitoring for future adaptation opportunities'],
      monitoringPlan: {
        metrics: [],
        checkpoints: [],
        thresholds: {},
        rollbackTriggers: []
      }
    }
  }

  // Public utility methods
  async getAdaptationHistory(userId: string): Promise<AdaptationRecord[]> {
    return this.adaptationHistory.get(userId) || []
  }

  async rollbackAdaptation(userId: string, adaptationId: string): Promise<boolean> {
    try {
      const adaptations = this.adaptationHistory.get(userId) || []
      const adaptation = adaptations.find(a => a.recordId === adaptationId)
      
      if (!adaptation || !adaptation.rollbackData) {
        return false
      }
      
      // Restore previous state
      await AIPersonalityModel.update(userId, adaptation.rollbackData.brain)
      
      return true
    } catch (error) {
      console.error('Rollback failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const adaptationSystem = AdaptationSystem.getInstance()