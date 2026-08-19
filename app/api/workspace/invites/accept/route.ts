import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 503 })

  const { data: invite, error: inviteError } = await admin
    .from('workspace_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (inviteError || !invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  if (!authed.user.email || invite.email.trim().toLowerCase() !== authed.user.email.trim().toLowerCase()) {
    return NextResponse.json({ error: 'This invite belongs to a different email address' }, { status: 403 })
  }
  if (invite.accepted_at) return NextResponse.json({ success: true })

  const { error: memberError } = await admin.from('workspace_members').upsert({
    workspace_id: invite.workspace_id,
    user_id: authed.user.id,
    role: invite.role ?? 'member',
  })

  if (memberError) return NextResponse.json({ error: 'Failed to join workspace' }, { status: 500 })

  const { error: updateError } = await admin
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  if (updateError) return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 })
  return NextResponse.json({ success: true })
}

