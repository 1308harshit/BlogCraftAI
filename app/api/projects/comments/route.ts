import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function GET(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

  const { data } = await authed.supabase
    .from('project_comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ comments: data ?? [] })
}

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { projectId, body } = await req.json()
  if (!projectId || !body) return NextResponse.json({ error: 'projectId and body required' }, { status: 400 })

  const { data, error } = await authed.supabase
    .from('project_comments')
    .insert({ project_id: projectId, user_id: authed.user.id, body })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  return NextResponse.json({ comment: data })
}

