import { NextRequest, NextResponse } from 'next/server'

import { requireUser } from '@/lib/auth/require-user'

import { randomUUID } from 'crypto'

import { envPublic } from '@/lib/env'



async function getOrCreateWorkspace(supabase: { from: (table: string) => any }, userId: string) {

  const { data: existing } = await supabase

    .from('workspaces')

    .select('*')

    .eq('owner_id', userId)

    .limit(1)

    .maybeSingle()



  if (existing) return existing



  const { data: created, error } = await supabase

    .from('workspaces')

    .insert({ name: 'Personal', owner_id: userId })

    .select()

    .single()



  if (error || !created) return null



  await supabase.from('workspace_members').upsert({

    workspace_id: created.id,

    user_id: userId,

    role: 'owner',

  })



  return created

}



export async function GET() {

  const authed = await requireUser()

  if (!authed.ok) return authed.response



  const workspace = await getOrCreateWorkspace(authed.supabase, authed.user.id)

  if (!workspace) {

    return NextResponse.json({ members: [{ user_id: authed.user.id, role: 'owner' }] })

  }



  const { data } = await authed.supabase

    .from('workspace_members')

    .select('*')

    .eq('workspace_id', workspace.id)

    .order('created_at', { ascending: true })



  return NextResponse.json({ members: data ?? [] })

}



export async function POST(req: NextRequest) {

  const authed = await requireUser()

  if (!authed.ok) return authed.response



  const { email, role = 'member' } = await req.json()

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
  if (!['member', 'editor'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })



  const workspace = await getOrCreateWorkspace(authed.supabase, authed.user.id)

  if (!workspace) return NextResponse.json({ error: 'Workspace unavailable' }, { status: 503 })



  const token = randomUUID()

  const { data: invite, error } = await authed.supabase

    .from('workspace_invites')

    .insert({ workspace_id: workspace.id, email, role, token })

    .select()

    .single()



  if (error) return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })



  const inviteUrl = `${envPublic.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/team?invite=${invite.token}`

  return NextResponse.json({ success: true, inviteUrl })

}


