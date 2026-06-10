// In-memory Redis stub for builds without REDIS_URL / ioredis
// Replace with ioredis in production when Redis is configured

export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  METRICS: (id: string) => `metrics:${id}`,
  PREDICTION: (hash: string) => `prediction:${hash}`,
  CONTENT: (id: string) => `content:${id}`,
  VIRAL: (id: string) => `viral:${id}`,
  PREFERENCES: (userId: string) => `prefs:${userId}`,
  PATTERNS: (userId: string) => `patterns:${userId}`,
  QUEUE: (workflowId: string) => `queue:${workflowId}`,
  PERFORMANCE: (key: string) => `perf:${key}`,
} as const

export const CACHE_TTL = {
  SESSION: 86400,
  METRICS: 300,
  PREDICTION: 3600,
  CONTENT: 1800,
  RATE_LIMIT: 60,
} as const

const memory = new Map<string, { value: string; expires?: number }>()

function get(key: string): string | null {
  const entry = memory.get(key)
  if (!entry) return null
  if (entry.expires && Date.now() > entry.expires) {
    memory.delete(key)
    return null
  }
  return entry.value
}

function set(key: string, value: string, ttlSeconds?: number) {
  memory.set(key, {
    value,
    expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  })
}

export function getRedisClient() {
  return {
    get: async (key: string) => get(key),
    set: async (key: string, value: string, _mode?: string, ttl?: number) => {
      set(key, value, ttl)
      return 'OK'
    },
    del: async (...keys: string[]) => {
      keys.forEach((k) => memory.delete(k))
      return keys.length
    },
    keys: async (pattern: string) =>
      [...memory.keys()].filter((k) => k.includes(pattern.replace('*', ''))),
    lpush: async () => 1,
    rpop: async () => null,
    llen: async () => 0,
    ping: async () => 'PONG',
    zadd: async (..._args: unknown[]) => 1,
    zremrangebyscore: async (..._args: unknown[]) => 0,
    expire: async (..._args: unknown[]) => 1,
    quit: async () => undefined,
  }
}

export interface UserSession {
  userId: string
  lastActive: string
  preferences?: Record<string, unknown>
}

export async function setUserSession(userId: string, session: UserSession) {
  set(CACHE_KEYS.USER_SESSION(userId), JSON.stringify(session), CACHE_TTL.SESSION)
}

export async function getUserSession(userId: string): Promise<UserSession | null> {
  const raw = get(CACHE_KEYS.USER_SESSION(userId))
  return raw ? JSON.parse(raw) : null
}

export async function deleteUserSession(userId: string) {
  memory.delete(CACHE_KEYS.USER_SESSION(userId))
}

export interface RealTimeMetrics {
  views: number
  engagement: number
  shares: number
  updatedAt: string
}

export async function setRealTimeMetrics(contentId: string, metrics: RealTimeMetrics) {
  set(CACHE_KEYS.METRICS(contentId), JSON.stringify(metrics), CACHE_TTL.METRICS)
}

export async function getRealTimeMetrics(contentId: string): Promise<RealTimeMetrics | null> {
  const raw = get(CACHE_KEYS.METRICS(contentId))
  return raw ? JSON.parse(raw) : null
}

export interface PredictionResult {
  score: number
  confidence: number
  factors: string[]
}

export async function setPredictionCache(contentHash: string, prediction: PredictionResult) {
  set(CACHE_KEYS.PREDICTION(contentHash), JSON.stringify(prediction), CACHE_TTL.PREDICTION)
}

export async function getPredictionCache(contentHash: string): Promise<PredictionResult | null> {
  const raw = get(CACHE_KEYS.PREDICTION(contentHash))
  return raw ? JSON.parse(raw) : null
}

export interface RateLimitData {
  count: number
  resetAt: number
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const raw = get(`ratelimit:${key}`)
  const data: RateLimitData = raw
    ? JSON.parse(raw)
    : { count: 0, resetAt: Date.now() + windowSeconds * 1000 }
  if (Date.now() > data.resetAt) {
    data.count = 0
    data.resetAt = Date.now() + windowSeconds * 1000
  }
  data.count += 1
  set(`ratelimit:${key}`, JSON.stringify(data), windowSeconds)
  return { allowed: data.count <= limit, remaining: Math.max(0, limit - data.count) }
}

export async function setCachedContent(contentId: string, content: unknown) {
  set(CACHE_KEYS.CONTENT(contentId), JSON.stringify(content), CACHE_TTL.CONTENT)
}

export async function getCachedContent(contentId: string) {
  const raw = get(CACHE_KEYS.CONTENT(contentId))
  return raw ? JSON.parse(raw) : null
}

export async function setCachedViralScore(contentId: string, score: number, breakdown: unknown) {
  set(CACHE_KEYS.VIRAL(contentId), JSON.stringify({ score, breakdown, cachedAt: new Date().toISOString() }))
}

export async function getCachedViralScore(contentId: string) {
  const raw = get(CACHE_KEYS.VIRAL(contentId))
  return raw ? JSON.parse(raw) : null
}

export async function setCachedUserPreferences(userId: string, preferences: unknown) {
  set(CACHE_KEYS.PREFERENCES(userId), JSON.stringify(preferences), CACHE_TTL.SESSION)
}

export async function getCachedUserPreferences(userId: string) {
  const raw = get(CACHE_KEYS.PREFERENCES(userId))
  return raw ? JSON.parse(raw) : null
}

export async function setCachedSuccessPatterns(userId: string, patterns: unknown[]) {
  set(CACHE_KEYS.PATTERNS(userId), JSON.stringify(patterns), CACHE_TTL.SESSION)
}

export async function getCachedSuccessPatterns(userId: string) {
  const raw = get(CACHE_KEYS.PATTERNS(userId))
  return raw ? JSON.parse(raw) : null
}

export async function addToAutomationQueue(workflowId: string, job: unknown) {
  const key = CACHE_KEYS.QUEUE(workflowId)
  const queue = JSON.parse(get(key) ?? '[]') as unknown[]
  queue.push(job)
  set(key, JSON.stringify(queue))
}

export async function getFromAutomationQueue(workflowId: string) {
  const key = CACHE_KEYS.QUEUE(workflowId)
  const queue = JSON.parse(get(key) ?? '[]') as unknown[]
  return queue.shift() ?? null
}

export async function getQueueLength(workflowId: string) {
  const key = CACHE_KEYS.QUEUE(workflowId)
  const queue = JSON.parse(get(key) ?? '[]') as unknown[]
  return queue.length
}

export async function setCachedPerformanceData(key: string, data: unknown, ttl = CACHE_TTL.METRICS) {
  set(CACHE_KEYS.PERFORMANCE(key), JSON.stringify(data), ttl)
}

export async function getCachedPerformanceData(key: string) {
  const raw = get(CACHE_KEYS.PERFORMANCE(key))
  return raw ? JSON.parse(raw) : null
}

export async function deleteCachePattern(pattern: string) {
  const keys = [...memory.keys()].filter((k) => k.includes(pattern.replace('*', '')))
  keys.forEach((k) => memory.delete(k))
  return keys.length
}

export async function redisHealthCheck() {
  return true
}

export async function closeRedisConnection() {
  memory.clear()
}
