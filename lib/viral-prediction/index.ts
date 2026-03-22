// Viral Prediction Engine - Main Export
// Centralized exports for viral prediction system

export * from './types'
export * from './models'
export { ViralEngine, viralEngine } from './viral-engine'
export { ViralOptimizer, viralOptimizer } from './viral-optimizer'

// Main API class
export class ViralPredictionAPI {
  private static instance: ViralPredictionAPI

  static getInstance(): ViralPredictionAPI {
    if (!ViralPredictionAPI.instance) {
      ViralPredictionAPI.instance = new ViralPredictionAPI()
    }
    return ViralPredictionAPI.instance
  }

  async predictViralScore(content: string, platform: string = 'blog') {
    const context = {
      platform,
      targetAudience: 'general',
      publishTime: new Date(),
      currentTrends: [],
      competitorActivity: 0.5
    }
    
    return await viralEngine.predictViralScore(content, context)
  }

  async analyzeContent(content: string) {
    return await viralEngine.analyzeViralPotential(content)
  }

  async optimizeContent(content: string, targetScore: number = 80) {
    return await viralEngine.optimizeForVirality(content, targetScore)
  }

  async extractViralElements(content: string) {
    return await viralEngine.extractViralElements(content)
  }
}

export const viralPrediction = ViralPredictionAPI.getInstance()
