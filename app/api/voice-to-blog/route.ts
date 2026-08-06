import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

async function transcribeAndExpand(transcript: string): Promise<string> {
  const prompt = `Convert this voice transcript into a well-structured, SEO-optimized blog post. 
  
  Expand on the ideas, add proper headings, improve grammar, and make it engaging:
  
  "${transcript}"
  
  Requirements:
  - Add compelling title
  - Create proper heading structure (H1, H2, H3)
  - Expand ideas with examples and details
  - Make it 800-1200 words
  - Optimize for SEO
  - Keep the original tone and personality`

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
          content: "You are an expert content writer who transforms voice notes and rough transcripts into polished, SEO-optimized blog posts while preserving the original voice and personality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    throw new Error('Voice processing failed')
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const { transcript, audioUrl } = await request.json()

    if (!transcript && !audioUrl) {
      return NextResponse.json(
        { error: 'Transcript or audio URL is required' },
        { status: 400 }
      )
    }

    // Demo mode
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('demo')) {
      const demoArticle = `# From Voice to Blog: The Power of AI Content Creation

## Introduction

Voice notes are becoming increasingly popular for capturing ideas on the go. With AI technology, we can now transform these casual voice recordings into professional, SEO-optimized blog posts in minutes.

## The Voice-to-Blog Revolution

### Why Voice Notes Work

Speaking is often more natural than writing. When you record your thoughts:

• Ideas flow more freely
• You capture authentic tone
• It's faster than typing
• You can record anywhere

### AI Enhancement Process

Our AI system takes your voice transcript and:

1. **Improves Grammar**: Fixes speech patterns and filler words
2. **Adds Structure**: Creates proper headings and sections
3. **Expands Ideas**: Develops concepts with examples
4. **Optimizes SEO**: Ensures search engine visibility

## Best Practices for Voice Blogging

### Recording Tips
- Find a quiet environment
- Speak clearly and at moderate pace
- Outline key points beforehand
- Don't worry about perfect grammar

### Content Enhancement
- Let AI expand on your core ideas
- Review and add personal touches
- Include relevant keywords naturally
- Add calls-to-action

## The Future of Content Creation

Voice-to-blog technology represents the future of content creation. It combines the authenticity of human voice with the power of AI enhancement, creating content that's both personal and professional.

## Conclusion

Transform your voice notes into compelling blog posts with AI. It's faster, more natural, and produces high-quality content that engages readers and ranks well in search engines.

---

*This article was generated from a voice note using BlogCraft AI's Voice-to-Blog feature.*`

      return NextResponse.json({
        article: demoArticle,
        originalTranscript: transcript || "Demo voice transcript would appear here",
        wordCount: demoArticle.split(' ').length,
        processingTime: "2.3 seconds",
        note: 'Demo mode - add Groq API key for real voice-to-blog conversion'
      })
    }

    const article = await transcribeAndExpand(transcript)

    return NextResponse.json({
      article,
      originalTranscript: transcript,
      wordCount: article.split(' ').length,
      processingTime: "Real processing time would be shown here"
    })
  } catch (error) {
    console.error('Voice-to-blog error:', error)
    return NextResponse.json(
      { error: 'Failed to process voice content' },
      { status: 500 }
    )
  }
}