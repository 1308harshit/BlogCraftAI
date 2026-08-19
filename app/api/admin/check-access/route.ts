import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'

export async function GET() {
  const authed = await requireAdmin()
  if (!authed.ok) return authed.response

  return NextResponse.json({ access: true })
}
