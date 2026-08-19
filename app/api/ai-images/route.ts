import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireUser } from '@/lib/auth/require-user'

async function generateWithDalle(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('AI image generation is not configured')
  const openai = new OpenAI({ apiKey: key })
  try {
    const res = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional blog illustration, modern, clean: ${prompt}`,
      size: '1024x1024',
      n: 1,
    })
    const url = res.data?.[0]?.url
    if (!url) throw new Error('AI image provider returned no image')
    return url
  } catch (e) {
    console.error('DALL-E error:', e)
    throw new Error('AI image generation is temporarily unavailable')
  }
}

function extractImagePrompts(content: string): string[] {
  const prompts: string[] = []
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (titleMatch) prompts.push(`Featured image: ${titleMatch[1]}`)
  const headings = content.match(/^##\s+(.+)$/gm)
  headings?.slice(0, 2).forEach((h) => prompts.push(h.replace('##', '').trim()))
  if (prompts.length === 0) prompts.push('AI blogging and content creation')
  return prompts.slice(0, 3)
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const { content, prompt, imageCount = 3 } = await request.json()
    const text = content ?? (prompt ? `# ${prompt}` : '')
    if (!text) {
      return NextResponse.json({ error: 'Content or prompt required' }, { status: 400 })
    }

    const prompts = extractImagePrompts(text)
    const requestedCount = Number.isInteger(imageCount) ? imageCount : 3
    const limited = prompts.slice(0, Math.max(1, Math.min(requestedCount, 3)))
    const images = []

    for (let i = 0; i < limited.length; i++) {
      const p = limited[i]
      const url = await generateWithDalle(p)
      images.push({
        id: `img_${i + 1}`,
        prompt: p,
        url,
        altText: p,
        suggested_placement: i === 0 ? 'featured' : `section_${i}`,
      })
    }

    return NextResponse.json({
      images,
      totalGenerated: images.length,
      note: 'Generated with DALL-E 3',
    })
  } catch (error) {
    console.error('AI image generation error:', error)
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 })
  }
}
