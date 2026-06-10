import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

async function generateWithDalle(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  const openai = new OpenAI({ apiKey: key })
  try {
    const res = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional blog illustration, modern, clean: ${prompt}`,
      size: '1024x1024',
      n: 1,
    })
    return res.data?.[0]?.url ?? null
  } catch (e) {
    console.error('DALL-E error:', e)
    return null
  }
}

const demoImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=800&h=600&fit=crop',
]

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
    const { content, prompt, imageCount = 3 } = await request.json()
    const text = content ?? (prompt ? `# ${prompt}` : '')
    if (!text) {
      return NextResponse.json({ error: 'Content or prompt required' }, { status: 400 })
    }

    const prompts = extractImagePrompts(text)
    const limited = prompts.slice(0, imageCount)
    const images = []

    for (let i = 0; i < limited.length; i++) {
      const p = limited[i]
      let url = await generateWithDalle(p)
      if (!url) url = demoImages[i % demoImages.length]
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
      note: process.env.OPENAI_API_KEY
        ? 'Generated with DALL-E 3'
        : 'Demo mode — add OPENAI_API_KEY for real AI images',
    })
  } catch (error) {
    console.error('AI image generation error:', error)
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 })
  }
}
