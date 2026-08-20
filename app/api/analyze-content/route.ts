import { NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/content-analyzer'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, keyword } = body

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      )
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content must be 50,000 characters or less' },
        { status: 400 }
      )
    }

    // Analyze content
    const analysis = await analyzeContent({
      title: title.trim(),
      content: content.trim(),
      keyword: keyword?.trim() || undefined,
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Content analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}
