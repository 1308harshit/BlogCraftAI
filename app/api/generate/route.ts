import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

/**
 * Retired legacy endpoint. The supported writer uses /api/ai/generate,
 * which is backed by the configured provider and never returns fabricated text.
 */
export async function POST() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  return NextResponse.json({ error: 'Use /api/ai/generate for content generation.' }, { status: 410 })
}
