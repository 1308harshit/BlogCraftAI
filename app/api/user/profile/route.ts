import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  return NextResponse.json({
    id: authed.user.id,
    email: authed.user.email,
    name: authed.user.user_metadata?.name || authed.user.email?.split('@')[0],
  })
}
