import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { publishToWordpress } from '@/lib/integrations/wordpress'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { title, html, status } = await req.json()
  if (!title || !html) return NextResponse.json({ error: 'title and html are required' }, { status: 400 })

  const result = await publishToWordpress({ title, html, status })
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 503 })

  return NextResponse.json({ success: true, postId: result.postId, link: result.link })
}

