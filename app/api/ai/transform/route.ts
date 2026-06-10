import { NextRequest, NextResponse } from 'next/server'
import { routeAI, type AITask } from '@/lib/ai/router'

const VALID_TASKS: AITask[] = ['rewrite', 'summarize', 'expand', 'seo']

export async function POST(req: NextRequest) {
  try {
    const { content, task, tone, instruction } = await req.json()

    if (!content || !task) {
      return NextResponse.json({ error: 'Content and task are required' }, { status: 400 })
    }

    if (!VALID_TASKS.includes(task)) {
      return NextResponse.json({ error: 'Invalid task' }, { status: 400 })
    }

    const toneLine = tone ? `Use a ${tone} tone.` : ''
    const extra = instruction ? `\n${instruction}` : ''
    const prompt = `${task.toUpperCase()} the following content. ${toneLine}${extra}\n\n---\n${content}\n---`

    const result = await routeAI({ task, prompt, maxTokens: 4096 })

    return NextResponse.json({
      content: result.content,
      provider: result.provider,
      model: result.model,
    })
  } catch (error) {
    console.error('AI transform error:', error)
    return NextResponse.json({ error: 'Transform failed' }, { status: 500 })
  }
}
