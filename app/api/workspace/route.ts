import { NextResponse } from 'next/server'
import { bootstrapUser } from '@/lib/auth/bootstrap-user'
import { requireUser } from '@/lib/auth/require-user'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  await bootstrapUser(authed.user.id)

  // Personal workspace (create if missing)
  const { data: existing } = await authed.supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', authed.user.id)
    .limit(1)
    .maybeSingle()

  if (existing) return NextResponse.json({ workspace: existing })

  const { data: created, error } = await authed.supabase
    .from('workspaces')
    .insert({ name: 'Personal', owner_id: authed.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })

  // Ensure owner is also a member.
  await authed.supabase.from('workspace_members').upsert({
    workspace_id: created.id,
    user_id: authed.user.id,
    role: 'owner',
  })

  return NextResponse.json({ workspace: created })
}

