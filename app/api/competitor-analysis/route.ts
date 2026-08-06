import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

async function analyzeCompetitor(url: string, yourContent: string): Promise<any> {
  // In production, you'd fetch the competitor's content
  // For now, we'll simulate analysis
  
  const prompt = `Analyze this content and provide:
1. Key topics covered
2. Content structure
3. Strengths
4. Weaknesses
5. How to create better content

Your content:
${yourContent.substring(0, 1000)}...

Provide actionable insights to outrank competitors.`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You are an SEO expert who analyzes competitor content and provides actionable insights to outrank them."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    throw new Error('Analysis failed')
  }

  const data = await response.json()
  return {
    analysis: data.choices[0]?.message?.content || '',
    recommendations: [
      'Add more detailed examples',
      'Include statistics and data',
      'Improve heading structure',
      'Add more internal links',
      'Include expert quotes'
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const { url, content } = await request.json()

    if (!url && !content) {
      return NextResponse.json(
        { error: 'URL or content is required' },
        { status: 400 }
      )
    }

    // Demo mode
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('demo')) {
      return NextResponse.json({
        analysis: {
          wordCount: 1200,
          headings: 8,
          images: 5,
          links: 15,
          readability: 75,
          seoScore: 82
        },
        recommendations: [
          'Add more detailed examples and case studies',
          'Include recent statistics and data (2024)',
          'Improve heading structure with more H2/H3',
          'Add more internal links to related content',
          'Include expert quotes and testimonials',
          'Add FAQ section for featured snippets',
          'Optimize images with alt text',
          'Include video or interactive content'
        ],
        strengths: [
          'Good keyword usage',
          'Clear structure',
          'Engaging introduction'
        ],
        weaknesses: [
          'Could be more comprehensive',
          'Missing multimedia content',
          'Limited external references'
        ],
        note: 'Demo mode - add Groq API key for real competitor analysis'
      })
    }

    const result = await analyzeCompetitor(url, content)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Competitor analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze competitor' },
      { status: 500 }
    )
  }
}
