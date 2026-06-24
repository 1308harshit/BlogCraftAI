// API Management System
// REST API access, authentication, rate limiting

import { getRateLimitingConfig } from '../config'

// Get configuration
const config = getRateLimitingConfig()

export interface APIKey {
  id: string
  key: string
  userId: string
  name: string
  permissions: string[]
  rateLimit: number
  usageCount: number
  lastUsedAt?: Date
  expiresAt?: Date
  createdAt: Date
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export class APIManager {
  private static instance: APIManager
  private apiKeys: Map<string, APIKey> = new Map()
  private rateLimits: Map<string, number[]> = new Map()

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager()
    }
    return APIManager.instance
  }

  async createAPIKey(userId: string, name: string, permissions: string[]): Promise<APIKey> {
    const key = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`
    
    const apiKey: APIKey = {
      id: `key_${Date.now()}`,
      key,
      userId,
      name,
      permissions,
      rateLimit: config.api.requestsPerMinute,
      usageCount: 0,
      createdAt: new Date()
    }

    this.apiKeys.set(key, apiKey)
    return apiKey
  }

  async validateAPIKey(key: string): Promise<boolean> {
    const apiKey = this.apiKeys.get(key)
    if (!apiKey) return false
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return false
    return true
  }

  async checkRateLimit(key: string): Promise<boolean> {
    const apiKey = this.apiKeys.get(key)
    if (!apiKey) return false

    const now = Date.now()
    const windowMs = 60000 // 1 minute
    const requests = this.rateLimits.get(key) || []
    
    const recentRequests = requests.filter(t => now - t < windowMs)
    
    if (recentRequests.length >= apiKey.rateLimit) {
      return false
    }

    recentRequests.push(now)
    this.rateLimits.set(key, recentRequests)
    
    apiKey.usageCount++
    apiKey.lastUsedAt = new Date()
    
    return true
  }
}

export const apiManager = APIManager.getInstance()
