import { NextRequest, NextResponse } from 'next/server'
import type { BrandMemory } from '@/stores/workspace-store'
import { bootstrapUser } from '@/lib/auth/bootstrap-user'
import { requireUser } from '@/lib/auth/require-user'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  await bootstrapUser(authed.user.id)

  const { data } = await authed.supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', authed.user.id)
    .maybeSingle()

  if (!data) return NextResponse.json({ brandMemory: null, onboardingCompleted: false })

  return NextResponse.json({
    onboardingCompleted: data.onboarding_completed ?? false,
    brandMemory: {
      niche: data.niche ?? '',
      writingStyle: data.writing_style ?? '',
      targetAudience: data.target_audience ?? '',
      brandTone: data.brand_tone ?? '',
      seoGoals: data.seo_goals ?? '',
    } satisfies BrandMemory,
  })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BrandMemory
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  await bootstrapUser(authed.user.id)

  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is missing on Netlify.' },
      { status: 503 }
    )
  }

  const { error } = await admin.from('brand_profiles').upsert(
    {
      user_id: authed.user.id,
      niche: body.niche ?? '',
      writing_style: body.writingStyle ?? '',
      target_audience: body.targetAudience ?? '',
      brand_tone: body.brandTone ?? '',
      seo_goals: body.seoGoals ?? '',
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('brand-memory upsert:', error)
    const hint =
      error.code === '42P01'
        ? 'Table brand_profiles is missing. Run db/migrations/0001–0005 in Supabase SQL editor (not supabase/migrations/).'
        : error.message
    return NextResponse.json({ error: 'Failed to save brand profile', details: hint }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
