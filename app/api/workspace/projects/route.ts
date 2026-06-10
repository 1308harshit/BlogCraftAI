import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { data: projects, error } = await authed.supabase
    .from('projects')
    .select('*')
    .eq('user_id', authed.user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('projects list:', error)
    return NextResponse.json({ projects: [] })
  }

  return NextResponse.json({
    projects: (projects ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      seoScore: p.seo_score,
      updatedAt: p.updated_at,
      status: p.status,
    })),
  })
}

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const body = await req.json()

  const payload = {
    user_id: authed.user.id,
    title: body.title,
    content: body.content ?? '',
    seo_score: body.seoScore ?? null,
    content_type: body.contentType ?? 'blog',
    updated_at: new Date().toISOString(),
  }

  if (body.id) {
    const { data, error } = await authed.supabase
      .from('projects')
      .update(payload)
      .eq('id', body.id)
      .eq('user_id', authed.user.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
    return NextResponse.json({ project: data })
  }

  const { data, error } = await authed.supabase.from('projects').insert(payload).select().single()
  if (error) return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  return NextResponse.json({ project: data })
}

export async function DELETE(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('id')
  if (!projectId) return NextResponse.json({ error: 'Project id required' }, { status: 400 })

  await authed.supabase.from('projects').delete().eq('id', projectId).eq('user_id', authed.user.id)
  return NextResponse.json({ success: true })
}
