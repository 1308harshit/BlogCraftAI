// Centralized Configuration - Default Values
// All hard-coded values moved to configuration

export const DEFAULT_CONFIG = {
  // AI Brain & Learning System
  aiBrain: {
    adaptation: {
      performanceDropThreshold: 0.2,      // 20% performance drop triggers adaptation
      feedbackScoreThreshold: 6,          // Feedback score below 6/10 triggers adaptation
      patternConfidenceThreshold: 0.8,    // Pattern confidence above 80% triggers replication
      adaptationCooldownMs: 24 * 60 * 60 * 1000, // 24 hours
      maxAdaptationsPerDay: 5
    },
    learning: {
      minSamplesForInsight: 5,
      confidenceThreshold: 0.7,           // 70%
      performanceImprovementThreshold: 0.1, // 10%
      patternRecognitionThreshold: 0.8    // 80%
    }
  },

  // Content Quality & Validation
  contentQuality: {
    defaultThreshold: 0.7,                // 70%
    minReadabilityScore: 60,
    minSeoScore: 50,
    minEngagementPotential: 65,
    minWordCount: 500,
    maxWordCount: 5000,
    optimalWordCount: 2000,
    minImages: 1,
    optimalImages: 3
  },

  // Viral Prediction
  viralPrediction: {
    targetAccuracy: 0.85,                 // 85%
    minConfidence: 0.75,
    viralScoreThreshold: 0.7,
    highViralityThreshold: 0.85
  },

  // Monetization
  monetization: {
    affiliateRelevanceThreshold: 0.90,    // 90%
    minCtaPerContent: 2,
    maxCtaPerContent: 4,
    revenuePerClick: 0.50,                // $0.50
    conversionRateTarget: 0.02,           // 2%
    minProductRelevance: 0.80
  },

  // A/B Testing
  abTesting: {
    minSampleSize: 100,
    maxDurationDays: 14,
    confidenceLevel: 0.95,                // 95%
    minImprovementThreshold: 0.05,        // 5%
    trafficSplit: {
      even: 0.5,
      control: 0.5,
      variant: 0.5
    }
  },

  // Performance & SLA
  performance: {
    maxResponseTimeMs: 2000,              // 2 seconds
    minUptimePercent: 99.9,
    errorRateThreshold: 0.01,             // 1%
    circuitBreaker: {
      failureThreshold: 5,
      timeoutMs: 60000,                   // 60 seconds
      resetTimeoutMs: 30000               // 30 seconds
    }
  },

  // Rate Limiting
  rateLimiting: {
    api: {
      requestsPerMinute: 1000,
      windowSeconds: 60,
      burstLimit: 1200
    },
    contentGeneration: {
      requestsPerHour: 100,
      windowSeconds: 3600
    }
  },

  // Platform-Specific Constraints
  platforms: {
    twitter: {
      maxLength: 280,
      minHashtags: 1,
      maxHashtags: 2,
      optimalLength: 240
    },
    linkedin: {
      maxLength: 3000,
      minHashtags: 3,
      maxHashtags: 5,
      optimalLength: 1300
    },
    instagram: {
      maxLength: 2200,
      minHashtags: 15,
      maxHashtags: 30,
      optimalLength: 1500
    },
    tiktok: {
      maxLength: 300,
      minHashtags: 3,
      maxHashtags: 5,
      optimalLength: 150
    },
    youtube: {
      maxLength: 5000,
      minHashtags: 5,
      maxHashtags: 15,
      optimalLength: 500
    },
    medium: {
      minLength: 1000,
      maxLength: 10000,
      optimalLength: 2500,
      minHashtags: 3,
      maxHashtags: 5
    },
    facebook: {
      maxLength: 63206,
      minHashtags: 1,
      maxHashtags: 3,
      optimalLength: 500
    },
    blog: {
      minLength: 1500,
      maxLength: 5000,
      optimalLength: 2500,
      minHashtags: 5,
      maxHashtags: 10
    }
  },

  // Content Generation
  contentGeneration: {
    defaultWordCount: 2000,
    batchSize: 30,                        // days
    targetGenerationTimeMs: 600000,       // 10 minutes
    retryAttempts: 3,
    retryDelayMs: 1000
  },

  // Revenue Attribution
  revenueAttribution: {
    attributionWindowDays: 30,
    touchpointWeights: {
      firstTouch: 0.4,
      lastTouch: 0.4,
      middleTouch: 0.2
    },
    minAttributionConfidence: 0.7
  },

  // Automation Pipeline
  automation: {
    maxConcurrentJobs: 5,
    jobTimeoutMs: 300000,                 // 5 minutes
    pollingIntervalMs: 5000,              // 5 seconds
    maxRetries: 3
  },

  // Business Intelligence
  businessIntelligence: {
    forecastingHorizonDays: 90,
    confidenceInterval: 0.95,
    minDataPointsForForecast: 30,
    trendDetectionWindow: 7,              // days
    growthThreshold: 0.15                 // 15%
  },

  // Database & Caching
  database: {
    connectionPoolSize: 20,
    queryTimeoutMs: 30000,                // 30 seconds
    idleTimeoutMs: 10000,
    redis: {
      defaultTtlSeconds: 3600,            // 1 hour
      sessionTtlSeconds: 86400,           // 24 hours
      cacheTtlSeconds: 300                // 5 minutes
    },
    vectorDb: {
      embeddingDimensions: 1536,
      topK: 10,
      minScore: 0.7
    }
  },

  // Security & Enterprise
  security: {
    sessionTimeoutMs: 3600000,            // 1 hour
    tokenExpirationMs: 86400000,          // 24 hours
    maxLoginAttempts: 5,
    lockoutDurationMs: 900000,            // 15 minutes
    auditLogRetentionDays: 90
  },

  // Monitoring & Alerts
  monitoring: {
    metricsCollectionIntervalMs: 60000,   // 1 minute
    logRetentionCount: 10000,
    performanceWindowMs: 300000,          // 5 minutes
    alertCooldownMs: 600000,              // 10 minutes
    healthCheckIntervalMs: 30000          // 30 seconds
  }
}

// Deep clone type that removes readonly
type DeepWritable<T> = T extends object ? {
  -readonly [P in keyof T]: DeepWritable<T[P]>
} : T

export type AppConfig = DeepWritable<typeof DEFAULT_CONFIG>
