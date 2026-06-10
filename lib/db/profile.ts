import { createServerSupabase } from '@/lib/supabase/client'
import type { BrandMemory } from '@/stores/workspace-store'

export interface DbProfile {
  id: string
  clerk_user_id: string
  email: string | null
  name: string | null
  plan: 'free' | 'pro' | 'business' | 'enterprise'
  onboarding_completed: boolean
  articles_generated: number
}

export async function getOrCreateProfile(
  clerkUserId: string,
  email?: string | null,
  name?: string | null
): Promise<DbProfile | null> {
  const supabase = createServerSupabase()
  if (!supabase) return null

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle()

  if (existing) return existing as DbProfile

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: clerkUserId,
      email: email ?? null,
      name: name ?? null,
      plan: 'free',
      onboarding_completed: false,
      articles_generated: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('getOrCreateProfile:', error)
    return null
  }
  return created as DbProfile
}

export async function saveBrandMemory(profileId: string, memory: BrandMemory) {
  const supabase = createServerSupabase()
  if (!supabase) return false

  await supabase.from('brand_memory').delete().eq('user_id', profileId)

  const { error } = await supabase.from('brand_memory').insert({
    user_id: profileId,
    niche: memory.niche,
    writing_style: memory.writingStyle,
    target_audience: memory.targetAudience,
    brand_tone: memory.brandTone,
    seo_goals: memory.seoGoals,
  })

  if (error) {
    console.error('saveBrandMemory:', error)
    return false
  }

  await supabase
    .from('profiles')
    .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
    .eq('id', profileId)

  return true
}

export async function getBrandMemory(profileId: string): Promise<BrandMemory | null> {
  const supabase = createServerSupabase()
  if (!supabase) return null

  const { data } = await supabase
    .from('brand_memory')
    .select('*')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null
  return {
    niche: data.niche ?? '',
    writingStyle: data.writing_style ?? '',
    targetAudience: data.target_audience ?? '',
    brandTone: data.brand_tone ?? '',
    seoGoals: data.seo_goals ?? '',
  }
}

export async function incrementArticleCount(profileId: string) {
  const supabase = createServerSupabase()
  if (!supabase) return

  const { data } = await supabase.from('profiles').select('articles_generated').eq('id', profileId).single()
  if (!data) return

  await supabase
    .from('profiles')
    .update({
      articles_generated: (data.articles_generated ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
}

export async function updateProfilePlan(clerkUserId: string, plan: DbProfile['plan']) {
  const supabase = createServerSupabase()
  if (!supabase) return

  await supabase.from('profiles').update({ plan, updated_at: new Date().toISOString() }).eq('clerk_user_id', clerkUserId)
}
