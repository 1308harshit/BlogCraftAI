import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { data } = await authed.supabase
    .from('automation_runs')
    .select('*')
    .eq('user_id', authed.user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ runs: data ?? [] })
}

