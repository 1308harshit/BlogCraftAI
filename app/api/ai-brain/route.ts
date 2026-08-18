import { NextRequest, NextResponse } from 'next/server'
import { routeAI } from '@/lib/ai/router'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const body = await request.json()
    const { action, prompt, context } = body

    if (!prompt && !context) {
      return NextResponse.json({ error: 'prompt or context required' }, { status: 400 })
    }

    const result = await routeAI({
      task: action === 'outline' ? 'outline' : 'research',
      prompt: prompt ?? `Analyze and recommend for: ${JSON.stringify(context)}`,
    })

    return NextResponse.json({
      success: true,
      action: action ?? 'recommend',
      result: result.content,
      provider: result.provider,
      model: result.model,
    })
  } catch (error) {
    console.error('AI Brain error:', error)
    return NextResponse.json({ error: 'AI Brain request failed' }, { status: 500 })
  }
}
