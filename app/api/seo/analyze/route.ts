import { NextRequest, NextResponse } from 'next/server'
import { analyzeSEO } from '@/lib/seo/analyzer'

export async function POST(req: NextRequest) {
  try {
    const { content, keywords = [] } = await req.json()
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    const analysis = analyzeSEO(content, keywords)
    return NextResponse.json(analysis)
  } catch (error) {
    return NextResponse.json({ error: 'SEO analysis failed' }, { status: 500 })
  }
}
