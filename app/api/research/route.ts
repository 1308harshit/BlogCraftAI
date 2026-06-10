import { NextRequest, NextResponse } from 'next/server'
import { routeAI } from '@/lib/ai/router'
import { fetchSourceText } from '@/lib/research/fetch-source'

export async function POST(req: NextRequest) {
  try {
    const { topic, sources = [], competitorUrls = [] } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const normalizedSources = Array.isArray(sources) ? sources.filter(Boolean).slice(0, 5) : []
    const normalizedCompetitors = Array.isArray(competitorUrls) ? competitorUrls.filter(Boolean).slice(0, 5) : []

    const fetched = await Promise.allSettled(normalizedSources.map((u: string) => fetchSourceText(u)))
    const sourceSummaries = fetched
      .map((r, i) => {
        const url = normalizedSources[i]
        if (r.status === 'fulfilled') return `Source: ${url}\nContent:\n${r.value}`
        return `Source: ${url}\nError: ${r.reason instanceof Error ? r.reason.message : 'failed'}`
      })
      .join('\n\n')

    const competitorBlock = normalizedCompetitors.length
      ? `\nCompetitor URLs (analyze positioning):\n- ${normalizedCompetitors.join('\n- ')}\n`
      : ''

    const research = await routeAI({
      task: 'research',
      prompt: `You are BlogCraft AI Research Agent.\n\nTopic: "${topic}"\n${competitorBlock}\nCurated sources (raw text excerpts):\n${sourceSummaries}\n\nReturn structured markdown with:\n1) Executive summary\n2) Key trends (5 bullets)\n3) Audience pain points\n4) Competitor angles + differentiation hooks\n5) People Also Ask questions (8)\n6) Keyword clusters (primary + secondary)\n7) Content gaps to exploit\n8) Recommended blog outline (H2/H3)\n\nBe concrete and cite which source influenced which insight when possible.`,
      maxTokens: 3200,
    })

    const outline = await routeAI({
      task: 'outline',
      prompt: `Create a detailed outline (H2/H3) for "${topic}" grounded in this research:\n\n${research.content}\n\nReturn ONLY the outline in markdown.`,
      maxTokens: 1200,
    })

    return NextResponse.json({
      topic,
      research: research.content,
      outline: outline.content,
      provider: research.provider,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Research failed' }, { status: 500 })
  }
}
