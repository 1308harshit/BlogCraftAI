import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

const unavailable = { error: 'Revenue analytics are not available during the public beta.' }

export async function GET() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  return NextResponse.json(unavailable, { status: 501 })
}

export async function POST() {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  return NextResponse.json(unavailable, { status: 501 })
}
