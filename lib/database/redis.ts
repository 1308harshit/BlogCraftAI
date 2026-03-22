// Redis caching layer for real-time metrics and session management
import Redis from 'ioredis'

// Redis client instance
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    })

    redis.on('error', (error) => {
      console.error('Redis connection error:', error)
    })

    redis.on('connect', () => {
      console.log('Redis connected successfully')
    })
  }
  
  return redis
}

// Cache key prefixes
export const CACHE_KEYS = {
  USER_SESSION: 'session:',
  REAL_TIME_METRICS: 'metrics:',
  AI_PREDICTIONS: 'prediction:',
  AUTOMATION_QUEUE: 'queue:automation:',
  RATE_LIMIT: 'ratelimit:',
  CONTENT_CACHE: 'content:',
  VIRAL_SCORES: 'viral:',
  PERFORMANCE_DATA: 'performance:',
  USER_PREFERENCES: 'preferences:',
  SUCCESS_PATTERNS: 'patterns:',
} as const

// Cache TTL values (in seconds)
export const CACHE_TTL = {
  SESSION: 24 * 60 * 60, // 24 hours
  METRICS: 5 * 60, // 5 minutes
  PREDICTIONS: 60 * 60, // 1 hour
  RATE_LIMIT: 60 * 60, // 1 hour
  CONTENT: 30 * 60, // 30 minutes
  PREFERENCES: 24 * 60 * 60, // 24 hours
  PATTERNS: 12 * 60 * 60, // 12 hours
} as const

// User session management
export interface UserSession {
  userId: string
  email: string
  plan: string
  preferences: Record<string, any>
  lastActivity: string
  aiPersonality?: Record<string, any>
}

export async function setUserSession(userId: string, session: UserSession): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.USER_SESSION}${userId}`
    await redis.setex(key, CACHE_TTL.SESSION, JSON.stringify(session))
  } catch (error) {
    console.error('Failed to set user session:', error)
    throw new Error('Session storage failed')
  }
}

export async function getUserSession(userId: string): Promise<UserSession | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.USER_SESSION}${userId}`
    const session = await redis.get(key)
    return session ? JSON.parse(session) : null
  } catch (error) {
    console.error('Failed to get user session:', error)
    return null
  }
}

export async function deleteUserSession(userId: string): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.USER_SESSION}${userId}`
    await redis.del(key)
  } catch (error) {
    console.error('Failed to delete user session:', error)
  }
}

// Real-time metrics caching
export interface RealTimeMetrics {
  contentId: string
  views: number
  engagement: number
  shares: number
  comments: number
  clicks: number
  conversions: number
  revenue: number
  lastUpdated: string
}

export async function setRealTimeMetrics(contentId: string, metrics: RealTimeMetrics): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.REAL_TIME_METRICS}${contentId}`
    await redis.setex(key, CACHE_TTL.METRICS, JSON.stringify(metrics))
  } catch (error) {
    console.error('Failed to set real-time metrics:', error)
    throw new Error('Metrics caching failed')
  }
}

export async function getRealTimeMetrics(contentId: string): Promise<RealTimeMetrics | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.REAL_TIME_METRICS}${contentId}`
    const metrics = await redis.get(key)
    return metrics ? JSON.parse(metrics) : null
  } catch (error) {
    console.error('Failed to get real-time metrics:', error)
    return null
  }
}

// AI prediction caching
export interface PredictionResult {
  contentHash: string
  viralScore: number
  seoScore: number
  engagementPrediction: number
  revenuePrediction: number
  confidence: number
  optimizationSuggestions: string[]
  createdAt: string
}

export async function setPredictionCache(contentHash: string, prediction: PredictionResult): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.AI_PREDICTIONS}${contentHash}`
    await redis.setex(key, CACHE_TTL.PREDICTIONS, JSON.stringify(prediction))
  } catch (error) {
    console.error('Failed to cache prediction:', error)
    throw new Error('Prediction caching failed')
  }
}

export async function getPredictionCache(contentHash: string): Promise<PredictionResult | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.AI_PREDICTIONS}${contentHash}`
    const prediction = await redis.get(key)
    return prediction ? JSON.parse(prediction) : null
  } catch (error) {
    console.error('Failed to get cached prediction:', error)
    return null
  }
}

// Rate limiting
export interface RateLimitData {
  count: number
  resetTime: number
}

export async function checkRateLimit(
  userId: string, 
  endpoint: string, 
  limit: number, 
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.RATE_LIMIT}${userId}:${endpoint}`
    
    const current = await redis.get(key)
    const now = Date.now()
    
    if (!current) {
      // First request in window
      await redis.setex(key, windowSeconds, '1')
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + (windowSeconds * 1000)
      }
    }
    
    const count = parseInt(current)
    if (count >= limit) {
      const ttl = await redis.ttl(key)
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + (ttl * 1000)
      }
    }
    
    // Increment counter
    await redis.incr(key)
    const ttl = await redis.ttl(key)
    
    return {
      allowed: true,
      remaining: limit - count - 1,
      resetTime: now + (ttl * 1000)
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Allow request on error to avoid blocking users
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + (windowSeconds * 1000)
    }
  }
}

// Content caching
export async function setCachedContent(contentId: string, content: any): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.CONTENT_CACHE}${contentId}`
    await redis.setex(key, CACHE_TTL.CONTENT, JSON.stringify(content))
  } catch (error) {
    console.error('Failed to cache content:', error)
  }
}

export async function getCachedContent(contentId: string): Promise<any | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.CONTENT_CACHE}${contentId}`
    const content = await redis.get(key)
    return content ? JSON.parse(content) : null
  } catch (error) {
    console.error('Failed to get cached content:', error)
    return null
  }
}

// Viral score caching
export async function setCachedViralScore(contentId: string, score: number, breakdown: any): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.VIRAL_SCORES}${contentId}`
    const data = { score, breakdown, cachedAt: new Date().toISOString() }
    await redis.setex(key, CACHE_TTL.PREDICTIONS, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to cache viral score:', error)
  }
}

export async function getCachedViralScore(contentId: string): Promise<{ score: number; breakdown: any; cachedAt: string } | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.VIRAL_SCORES}${contentId}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to get cached viral score:', error)
    return null
  }
}

// User preferences caching
export async function setCachedUserPreferences(userId: string, preferences: any): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.USER_PREFERENCES}${userId}`
    await redis.setex(key, CACHE_TTL.PREFERENCES, JSON.stringify(preferences))
  } catch (error) {
    console.error('Failed to cache user preferences:', error)
  }
}

export async function getCachedUserPreferences(userId: string): Promise<any | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.USER_PREFERENCES}${userId}`
    const preferences = await redis.get(key)
    return preferences ? JSON.parse(preferences) : null
  } catch (error) {
    console.error('Failed to get cached user preferences:', error)
    return null
  }
}

// Success patterns caching
export async function setCachedSuccessPatterns(userId: string, patterns: any[]): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.SUCCESS_PATTERNS}${userId}`
    await redis.setex(key, CACHE_TTL.PATTERNS, JSON.stringify(patterns))
  } catch (error) {
    console.error('Failed to cache success patterns:', error)
  }
}

export async function getCachedSuccessPatterns(userId: string): Promise<any[] | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.SUCCESS_PATTERNS}${userId}`
    const patterns = await redis.get(key)
    return patterns ? JSON.parse(patterns) : null
  } catch (error) {
    console.error('Failed to get cached success patterns:', error)
    return null
  }
}

// Automation queue management
export async function addToAutomationQueue(workflowId: string, job: any): Promise<void> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.AUTOMATION_QUEUE}${workflowId}`
    await redis.lpush(key, JSON.stringify(job))
  } catch (error) {
    console.error('Failed to add job to automation queue:', error)
    throw new Error('Queue operation failed')
  }
}

export async function getFromAutomationQueue(workflowId: string): Promise<any | null> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.AUTOMATION_QUEUE}${workflowId}`
    const job = await redis.rpop(key)
    return job ? JSON.parse(job) : null
  } catch (error) {
    console.error('Failed to get job from automation queue:', error)
    return null
  }
}

export async function getQueueLength(workflowId: string): Promise<number> {
  try {
    const redis = getRedisClient()
    const key = `${CACHE_KEYS.AUTOMATION_QUEUE}${workflowId}`
    return await redis.llen(key)
  } catch (error) {
    console.error('Failed to get queue length:', error)
    return 0
  }
}

// Performance data caching
export async function setCachedPerformanceData(key: string, data: any, ttl: number = CACHE_TTL.METRICS): Promise<void> {
  try {
    const redis = getRedisClient()
    const cacheKey = `${CACHE_KEYS.PERFORMANCE_DATA}${key}`
    await redis.setex(cacheKey, ttl, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to cache performance data:', error)
  }
}

export async function getCachedPerformanceData(key: string): Promise<any | null> {
  try {
    const redis = getRedisClient()
    const cacheKey = `${CACHE_KEYS.PERFORMANCE_DATA}${key}`
    const data = await redis.get(cacheKey)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to get cached performance data:', error)
    return null
  }
}

// Bulk operations
export async function deleteCachePattern(pattern: string): Promise<number> {
  try {
    const redis = getRedisClient()
    const keys = await redis.keys(pattern)
    if (keys.length === 0) return 0
    return await redis.del(...keys)
  } catch (error) {
    console.error('Failed to delete cache pattern:', error)
    return 0
  }
}

// Health check
export async function redisHealthCheck(): Promise<boolean> {
  try {
    const redis = getRedisClient()
    const result = await redis.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

// Close Redis connection
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}