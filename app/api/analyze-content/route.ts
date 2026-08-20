import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/content-analyzer'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const ANALYSIS_RATE_LIMIT = { limit: 10, windowMs: 60_000 }

function clientKey(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const result = rateLimit(`content-analysis:${clientKey(request)}`, ANALYSIS_RATE_LIMIT.limit, ANALYSIS_RATE_LIMIT.windowMs)
  if (!result.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
    )
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'A JSON request body is required.' }, { status: 400 })
  }

  const { title, content, keyword } = body as Record<string, unknown>
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
    return NextResponse.json({ error: 'Title must be between 1 and 120 characters.' }, { status: 400 })
  }
  if (typeof content !== 'string' || content.trim().length < 50 || content.trim().length > 20_000) {
    return NextResponse.json({ error: 'Content must be between 50 and 20,000 characters.' }, { status: 400 })
  }
  if (keyword !== undefined && (typeof keyword !== 'string' || keyword.trim().length > 80)) {
    return NextResponse.json({ error: 'Target keyword must be 80 characters or fewer.' }, { status: 400 })
  }

  return NextResponse.json(analyzeContent({
    title: title.trim(),
    content: content.trim(),
    keyword: typeof keyword === 'string' ? keyword.trim() || undefined : undefined,
  }))
}
