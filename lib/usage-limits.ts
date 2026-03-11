// Usage limits and quota management
import { mockDb } from './mock-db'

export interface UsageQuota {
  userId: string
  articlesGenerated: number
  monthlyLimit: number
  resetDate: Date
  plan: 'free' | 'founder' | 'pro'
}

export const PLAN_LIMITS = {
  free: 3,
  founder: 999999, // Unlimited
  pro: 999999, // Unlimited
}

export class UsageLimitService {
  // Check if user can generate article
  static async canGenerateArticle(userId: string): Promise<{
    allowed: boolean
    remaining: number
    limit: number
    resetDate: Date
  }> {
    const quota = await this.getUserQuota(userId)
    
    const allowed = quota.articlesGenerated < quota.monthlyLimit
    const remaining = Math.max(0, quota.monthlyLimit - quota.articlesGenerated)
    
    return {
      allowed,
      remaining,
      limit: quota.monthlyLimit,
      resetDate: quota.resetDate
    }
  }

  // Get user's current quota
  static async getUserQuota(userId: string): Promise<UsageQuota> {
    // In demo mode, use mock data
    if (mockDb.isDemoMode()) {
      const user = await mockDb.getUser('demo@blogcraft-ai.com')
      const plan = (user?.plan as 'free' | 'founder' | 'pro') || 'free'
      
      return {
        userId,
        articlesGenerated: user?.articleCount || 0,
        monthlyLimit: PLAN_LIMITS[plan],
        resetDate: this.getNextResetDate(),
        plan
      }
    }

    // TODO: Implement real database query
    // For now, return default
    return {
      userId,
      articlesGenerated: 0,
      monthlyLimit: PLAN_LIMITS.free,
      resetDate: this.getNextResetDate(),
      plan: 'free'
    }
  }

  // Increment usage count
  static async incrementUsage(userId: string): Promise<void> {
    // In demo mode, update mock database
    if (mockDb.isDemoMode()) {
      const user = await mockDb.getUser('demo@blogcraft-ai.com')
      if (user) {
        await mockDb.updateUser(user.id, {
          articleCount: (user.articleCount || 0) + 1
        })
      }
      return
    }

    // TODO: Implement real database update
  }

  // Reset monthly quota (run via cron job)
  static async resetMonthlyQuotas(): Promise<void> {
    // TODO: Implement database reset for all users
    console.log('Resetting monthly quotas...')
  }

  // Get next reset date (first day of next month)
  static getNextResetDate(): Date {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth
  }

  // Check subscription status
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    // In demo mode, always return true
    if (mockDb.isDemoMode()) {
      return true
    }

    // TODO: Check Stripe subscription status
    return false
  }

  // Get plan from subscription
  static async getUserPlan(userId: string): Promise<'free' | 'founder' | 'pro'> {
    const hasSubscription = await this.hasActiveSubscription(userId)
    
    if (!hasSubscription) {
      return 'free'
    }

    // TODO: Get actual plan from database
    return 'founder'
  }
}

// Middleware function to check usage limits
export async function checkUsageLimit(userId: string): Promise<{
  success: boolean
  message?: string
  remaining?: number
}> {
  const quota = await UsageLimitService.canGenerateArticle(userId)
  
  if (!quota.allowed) {
    return {
      success: false,
      message: `Monthly limit reached (${quota.limit} articles). Upgrade to continue generating content.`,
      remaining: 0
    }
  }
  
  return {
    success: true,
    remaining: quota.remaining
  }
}