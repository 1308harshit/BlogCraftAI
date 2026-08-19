import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { automationId } = await req.json()
  if (!automationId) return NextResponse.json({ error: 'automationId required' }, { status: 400 })

  return NextResponse.json(
    { error: 'Automation execution is not available yet. No workflow was run.' },
    { status: 501 }
  )
}

