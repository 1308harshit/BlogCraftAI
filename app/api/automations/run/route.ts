import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { automationId } = await req.json()
  if (!automationId) return NextResponse.json({ error: 'automationId required' }, { status: 400 })

  // Create a run record
  const { data: run, error: runErr } = await authed.supabase
    .from('automation_runs')
    .insert({
      automation_id: automationId,
      user_id: authed.user.id,
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (runErr) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 })

  // Minimal runner (Phase 4): mark success. Phase 7 moves execution to workers.
  await authed.supabase
    .from('automation_runs')
    .update({
      status: 'success',
      finished_at: new Date().toISOString(),
      message: 'Run recorded (execution engine upgraded in Phase 7).',
    })
    .eq('id', run.id)
    .eq('user_id', authed.user.id)

  return NextResponse.json({ success: true, runId: run.id })
}

