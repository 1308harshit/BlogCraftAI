import { NextRequest, NextResponse } from 'next/server'
import { routeAI } from '@/lib/ai/router'
import { analyzeSEO } from '@/lib/seo/analyzer'
import { rateLimit, AI_RATE_LIMIT } from '@/lib/rate-limit'
import { UsageLimitService } from '@/lib/usage-limits'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(req: NextRequest) {
  try {
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const userId = authed.user.id
    const rl = rateLimit(
      `ai:${userId ?? req.headers.get('x-forwarded-for') ?? 'anon'}`,
      AI_RATE_LIMIT.limit,
      AI_RATE_LIMIT.windowMs
    )
    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })
    }

    const { topic, keywords = [], brandContext = '', contentType = 'blog' } = await req.json()
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const check = await UsageLimitService.canGenerate(userId)
    if (!check.allowed) {
      return NextResponse.json({ error: check.message, remaining: check.remaining, limit: check.limit }, { status: 429 })
    }

    const keywordLine = keywords.length ? `Keywords: ${keywords.join(', ')}` : ''

    const research = await routeAI({
      task: 'research',
      prompt: `Research "${topic}" for a ${contentType}. ${keywordLine}\n${brandContext}\nReturn: trends, competitor angles, PAA questions, keyword clusters.`,
      maxTokens: 2000,
    })

    const outline = await routeAI({
      task: 'outline',
      prompt: `Create a detailed outline for "${topic}" using this research:\n${research.content}\n${keywordLine}`,
      maxTokens: 1500,
    })

    const article = await routeAI({
      task: 'write',
      prompt: `Write a full SEO-optimized ${contentType} about "${topic}".\nOutline:\n${outline.content}\n${keywordLine}\n${brandContext}\n1000-1500 words, markdown headings.`,
      maxTokens: 4096,
    })

    const seo = analyzeSEO(article.content, keywords)

    const meta = await routeAI({
      task: 'seo',
      prompt: `Generate meta title (max 60 chars) and meta description (max 155 chars) for:\n${article.content.slice(0, 500)}`,
      maxTokens: 200,
    })

    const social = await routeAI({
      task: 'write',
      prompt: `From this article, create: 1) Twitter thread (5 tweets), 2) LinkedIn post, 3) email newsletter intro.\n\n${article.content.slice(0, 2000)}`,
      maxTokens: 1500,
    })

    await UsageLimitService.incrementUsage(userId)

    return NextResponse.json({
      steps: {
        research: research.content,
        outline: outline.content,
        article: article.content,
        seo,
        meta: meta.content,
        social: social.content,
      },
      provider: article.provider,
      model: article.model,
    })
  } catch (error) {
    console.error('Blog pipeline error:', error)
    return NextResponse.json({ error: 'Pipeline failed' }, { status: 500 })
  }
}
