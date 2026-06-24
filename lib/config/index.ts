// Configuration Manager
// Centralized configuration with environment variable overrides

import { DEFAULT_CONFIG, AppConfig } from './defaults'

class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  private loadConfig(): AppConfig {
    // Deep clone defaults to make them mutable
    const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as AppConfig

    // Override with environment variables if present
    if (process.env.AI_BRAIN_PERFORMANCE_THRESHOLD) {
      config.aiBrain.adaptation.performanceDropThreshold = parseFloat(process.env.AI_BRAIN_PERFORMANCE_THRESHOLD)
    }

    if (process.env.CONTENT_QUALITY_THRESHOLD) {
      config.contentQuality.defaultThreshold = parseFloat(process.env.CONTENT_QUALITY_THRESHOLD)
    }

    if (process.env.VIRAL_TARGET_ACCURACY) {
      config.viralPrediction.targetAccuracy = parseFloat(process.env.VIRAL_TARGET_ACCURACY)
    }

    if (process.env.AFFILIATE_RELEVANCE_THRESHOLD) {
      config.monetization.affiliateRelevanceThreshold = parseFloat(process.env.AFFILIATE_RELEVANCE_THRESHOLD)
    }

    if (process.env.AB_TEST_MIN_SAMPLE_SIZE) {
      config.abTesting.minSampleSize = parseInt(process.env.AB_TEST_MIN_SAMPLE_SIZE)
    }

    if (process.env.MAX_RESPONSE_TIME_MS) {
      config.performance.maxResponseTimeMs = parseInt(process.env.MAX_RESPONSE_TIME_MS)
    }

    if (process.env.API_RATE_LIMIT) {
      config.rateLimiting.api.requestsPerMinute = parseInt(process.env.API_RATE_LIMIT)
    }

    if (process.env.CIRCUIT_BREAKER_THRESHOLD) {
      config.performance.circuitBreaker.failureThreshold = parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD)
    }

    if (process.env.REDIS_DEFAULT_TTL) {
      config.database.redis.defaultTtlSeconds = parseInt(process.env.REDIS_DEFAULT_TTL)
    }

    if (process.env.SESSION_TIMEOUT_MS) {
      config.security.sessionTimeoutMs = parseInt(process.env.SESSION_TIMEOUT_MS)
    }

    return config
  }

  // Get full config
  getConfig(): AppConfig {
    return this.config
  }

  // Get specific config sections
  getAIBrainConfig() {
    return this.config.aiBrain
  }

  getContentQualityConfig() {
    return this.config.contentQuality
  }

  getViralPredictionConfig() {
    return this.config.viralPrediction
  }

  getMonetizationConfig() {
    return this.config.monetization
  }

  getABTestingConfig() {
    return this.config.abTesting
  }

  getPerformanceConfig() {
    return this.config.performance
  }

  getRateLimitingConfig() {
    return this.config.rateLimiting
  }

  getPlatformConfig(platform: keyof AppConfig['platforms']) {
    return this.config.platforms[platform]
  }

  getContentGenerationConfig() {
    return this.config.contentGeneration
  }

  getRevenueAttributionConfig() {
    return this.config.revenueAttribution
  }

  getAutomationConfig() {
    return this.config.automation
  }

  getBusinessIntelligenceConfig() {
    return this.config.businessIntelligence
  }

  getDatabaseConfig() {
    return this.config.database
  }

  getSecurityConfig() {
    return this.config.security
  }

  getMonitoringConfig() {
    return this.config.monitoring
  }

  // Update config at runtime (for admin dashboard)
  updateConfig(path: string, value: any): void {
    const keys = path.split('.')
    let current: any = this.config

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        throw new Error(`Invalid config path: ${path}`)
      }
      current = current[keys[i]]
    }

    const lastKey = keys[keys.length - 1]
    if (!(lastKey in current)) {
      throw new Error(`Invalid config path: ${path}`)
    }

    current[lastKey] = value
    console.log(`Config updated: ${path} = ${value}`)
  }

  // Reset to defaults
  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG }
    console.log('Config reset to defaults')
  }
}

export const configManager = ConfigManager.getInstance()

// Export convenient getters
export const getConfig = () => configManager.getConfig()
export const getAIBrainConfig = () => configManager.getAIBrainConfig()
export const getContentQualityConfig = () => configManager.getContentQualityConfig()
export const getViralPredictionConfig = () => configManager.getViralPredictionConfig()
export const getMonetizationConfig = () => configManager.getMonetizationConfig()
export const getABTestingConfig = () => configManager.getABTestingConfig()
export const getPerformanceConfig = () => configManager.getPerformanceConfig()
export const getRateLimitingConfig = () => configManager.getRateLimitingConfig()
export const getPlatformConfig = (platform: keyof AppConfig['platforms']) => 
  configManager.getPlatformConfig(platform)
export const getContentGenerationConfig = () => configManager.getContentGenerationConfig()
export const getRevenueAttributionConfig = () => configManager.getRevenueAttributionConfig()
export const getAutomationConfig = () => configManager.getAutomationConfig()
export const getBusinessIntelligenceConfig = () => configManager.getBusinessIntelligenceConfig()
export const getDatabaseConfig = () => configManager.getDatabaseConfig()
export const getSecurityConfig = () => configManager.getSecurityConfig()
export const getMonitoringConfig = () => configManager.getMonitoringConfig()
