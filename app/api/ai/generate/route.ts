import { NextRequest, NextResponse } from 'next/server'
import { routeAI } from '@/lib/ai/router'
import { rateLimit, AI_RATE_LIMIT } from '@/lib/rate-limit'
import { UsageLimitService } from '@/lib/usage-limits'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(req: NextRequest) {
  try {
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const userId = authed.user.id
    const rl = rateLimit(`ai:${userId}`, AI_RATE_LIMIT.limit, AI_RATE_LIMIT.windowMs)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const check = await UsageLimitService.canGenerate(userId)
    if (!check.allowed) {
      return NextResponse.json({ error: check.message, remaining: 0, limit: check.limit }, { status: 429 })
    }

    const body = await req.json()
    const { topic, keywords, contentType = 'blog', outline } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const brandContext = body.brandContext ? `\nBrand context: ${body.brandContext}` : ''
    const keywordLine = keywords?.length ? `Target keywords: ${keywords.join(', ')}` : ''

    const prompt = outline
      ? `Write a full ${contentType} based on this outline:\n${outline}\n\nTopic: ${topic}\n${keywordLine}${brandContext}`
      : `Write a comprehensive, SEO-optimized ${contentType} about "${topic}".\n${keywordLine}\n\nRequirements: 1000-1500 words, engaging intro, H2/H3 structure, actionable tips, strong conclusion.${brandContext}`

    const result = await routeAI({
      task: 'write',
      prompt,
      system:
        'You are BlogCraft AI. Write publication-ready markdown with proper headings (# ## ###). Be specific, valuable, and SEO-aware.',
      maxTokens: 4096,
    })

    await UsageLimitService.incrementUsage(userId)

    return NextResponse.json({
      content: result.content,
      provider: result.provider,
      model: result.model,
      userId,
    })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
