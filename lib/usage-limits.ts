import { getSupabaseAdmin } from '@/lib/supabase/admin'

export class UsageLimitService {
  static async canGenerate(userId: string): Promise<{
    allowed: boolean
    remaining: number
    limit: number
    message?: string
  }> {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return { allowed: true, remaining: 999999, limit: 999999 }
    }

    const { data: ent, error: entErr } = await admin
      .from('entitlements')
      .select('generations_limit, plan_id')
      .eq('user_id', userId)
      .maybeSingle()

    const limit = ent?.generations_limit ?? 10

    const startOfMonth = new Date()
    startOfMonth.setUTCDate(1)
    startOfMonth.setUTCHours(0, 0, 0, 0)

    const { count, error: countErr } = await admin
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if (entErr || countErr) {
      return { allowed: true, remaining: Math.max(0, limit - 0), limit }
    }

    const used = count ?? 0
    const remaining = Math.max(0, limit - used)

    if (used >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        message: `Monthly limit reached (${limit} generations). Upgrade to continue.`,
      }
    }

    return { allowed: true, remaining, limit }
  }

  static async incrementUsage(userId: string) {
    const admin = getSupabaseAdmin()
    if (!admin) return
    await admin.from('ai_usage').insert({ user_id: userId })
  }

  /** @deprecated Use canGenerate */
  static async canGenerateArticle(userId: string) {
    const r = await this.canGenerate(userId)
    return {
      allowed: r.allowed,
      remaining: r.remaining,
      limit: r.limit,
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    }
  }
}
