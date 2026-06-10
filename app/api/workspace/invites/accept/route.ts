import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const { data: invite } = await authed.supabase
    .from('workspace_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  if (invite.accepted_at) return NextResponse.json({ success: true })

  await authed.supabase.from('workspace_members').upsert({
    workspace_id: invite.workspace_id,
    user_id: authed.user.id,
    role: invite.role ?? 'member',
  })

  await authed.supabase
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return NextResponse.json({ success: true })
}

