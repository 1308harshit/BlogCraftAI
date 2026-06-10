import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { data } = await authed.supabase
    .from('automations')
    .select('*')
    .eq('user_id', authed.user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ automations: data ?? [] })
}

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { name, trigger_type, config } = await req.json()
  if (!name || !trigger_type) {
    return NextResponse.json({ error: 'name and trigger_type required' }, { status: 400 })
  }

  const { data, error } = await authed.supabase
    .from('automations')
    .insert({ user_id: authed.user.id, name, trigger_type, config: config ?? {}, enabled: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json({ automation: data })
}

export async function PATCH(req: NextRequest) {
  const { id, enabled } = await req.json()
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  await authed.supabase.from('automations').update({ enabled }).eq('id', id).eq('user_id', authed.user.id)
  return NextResponse.json({ success: true })
}
