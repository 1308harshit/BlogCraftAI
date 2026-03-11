import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

async function remixContent(content: string, format: string): Promise<string> {
  const prompts: Record<string, string> = {
    'twitter': `Convert this blog post into a Twitter thread (10-15 tweets). Make it engaging and viral-worthy. Use emojis and hashtags:\n\n${content}`,
    'linkedin': `Convert this blog post into a professional LinkedIn post. Make it thought-provoking and include a call-to-action:\n\n${content}`,
    'email': `Convert this blog post into an engaging email newsletter. Include a catchy subject line and clear CTAs:\n\n${content}`,
    'summary': `Create a concise 3-paragraph executive summary of this blog post:\n\n${content}`,
    'bullets': `Extract the key points from this blog post and present them as 10 actionable bullet points:\n\n${content}`,
    'infographic': `Create an infographic script with 5-7 key statistics and facts from this blog post. Format: [Stat] - [Description]:\n\n${content}`,
    'video': `Create a YouTube video script (5-7 minutes) based on this blog post. Include intro, main points, and outro:\n\n${content}`,
    'podcast': `Create a podcast script (10-15 minutes) based on this blog post. Make it conversational and engaging:\n\n${content}`
  }

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
          content: "You are an expert content repurposing specialist who transforms content into different formats while maintaining the core message."
        },
        {
          role: "user",
          content: prompts[format] || prompts['summary']
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    throw new Error('Content remix failed')
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function POST(request: NextRequest) {
  try {
    const { content, format } = await request.json()

    if (!content || !format) {
      return NextResponse.json(
        { error: 'Content and format are required' },
        { status: 400 }
      )
    }

    const validFormats = ['twitter', 'linkedin', 'email', 'summary', 'bullets', 'infographic', 'video', 'podcast']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Choose from: ${validFormats.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if using demo mode
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('demo')) {
      return NextResponse.json({
        remixed: `[DEMO MODE] This would convert your content to ${format} format. Add Groq API key for real conversion.`,
        format,
        note: 'Demo mode - add Groq API key for real content remixing'
      })
    }

    const remixed = await remixContent(content, format)

    return NextResponse.json({
      remixed,
      format,
      originalLength: content.length,
      remixedLength: remixed.length
    })
  } catch (error) {
    console.error('Content remix error:', error)
    return NextResponse.json(
      { error: 'Failed to remix content' },
      { status: 500 }
    )
  }
}
