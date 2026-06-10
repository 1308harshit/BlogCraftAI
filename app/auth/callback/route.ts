import { NextResponse, type NextRequest } from 'next/server'
import { bootstrapUser } from '@/lib/auth/bootstrap-user'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createSupabaseServerClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await bootstrapUser(user.id)

    const { data: profile } = await supabase
      .from('brand_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .maybeSingle()

    const destination = profile?.onboarding_completed ? next : '/onboarding'
    return NextResponse.redirect(`${origin}${destination}`)
  }

  return NextResponse.redirect(`${origin}/login`)
}

