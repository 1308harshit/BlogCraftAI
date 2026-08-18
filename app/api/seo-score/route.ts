import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

interface SEOAnalysis {
  score: number
  issues: string[]
  suggestions: string[]
  strengths: string[]
  readability: number
  keywordDensity: number
}

function analyzeSEO(content: string, keywords: string): SEOAnalysis {
  const issues: string[] = []
  const suggestions: string[] = []
  const strengths: string[] = []
  let score = 100

  // Word count analysis
  const wordCount = content.split(/\s+/).length
  if (wordCount < 300) {
    issues.push('Content too short (< 300 words)')
    suggestions.push('Aim for at least 800-1200 words for better SEO')
    score -= 20
  } else if (wordCount >= 800) {
    strengths.push(`Good word count: ${wordCount} words`)
  }

  // Heading analysis
  const h1Count = (content.match(/^#\s/gm) || []).length
  const h2Count = (content.match(/^##\s/gm) || []).length
  const h3Count = (content.match(/^###\s/gm) || []).length
  
  if (h1Count === 0) {
    issues.push('Missing H1 heading')
    score -= 15
  } else if (h1Count > 1) {
    issues.push('Multiple H1 headings (should be only one)')
    score -= 10
  } else {
    strengths.push('Proper H1 structure')
  }

  if (h2Count < 2) {
    issues.push('Not enough H2 headings for structure')
    suggestions.push('Add more H2 headings to break up content')
    score -= 10
  } else {
    strengths.push(`Good heading structure: ${h2Count} H2 headings`)
  }

  // Keyword analysis
  if (keywords) {
    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim())
    const contentLower = content.toLowerCase()
    let keywordCount = 0
    
    keywordList.forEach(keyword => {
      const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length
      keywordCount += matches
    })

    const keywordDensity = (keywordCount / wordCount) * 100
    
    if (keywordDensity < 0.5) {
      issues.push('Keyword density too low')
      suggestions.push('Include target keywords more naturally')
      score -= 15
    } else if (keywordDensity > 3) {
      issues.push('Keyword density too high (keyword stuffing)')
      suggestions.push('Reduce keyword usage to avoid penalties')
      score -= 10
    } else {
      strengths.push(`Good keyword density: ${keywordDensity.toFixed(2)}%`)
    }
  }

  // Readability analysis
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgWordsPerSentence = wordCount / sentences.length
  
  let readability = 100
  if (avgWordsPerSentence > 25) {
    issues.push('Sentences too long (hard to read)')
    suggestions.push('Break long sentences into shorter ones')
    readability -= 20
    score -= 10
  } else if (avgWordsPerSentence < 10) {
    suggestions.push('Consider varying sentence length')
    readability -= 5
  } else {
    strengths.push('Good sentence length for readability')
  }

  // Link analysis
  const internalLinks = (content.match(/\[.*?\]\(\/.*?\)/g) || []).length
  const externalLinks = (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length
  
  if (internalLinks === 0 && externalLinks === 0) {
    issues.push('No links found')
    suggestions.push('Add internal and external links for better SEO')
    score -= 10
  } else {
    strengths.push(`Links found: ${internalLinks} internal, ${externalLinks} external`)
  }

  // List analysis
  const lists = (content.match(/^[\*\-\+]\s/gm) || []).length
  if (lists > 0) {
    strengths.push('Good use of bullet points/lists')
  } else {
    suggestions.push('Consider adding bullet points for better readability')
  }

  // Meta description check (first paragraph)
  const firstParagraph = content.split('\n\n')[1] || ''
  if (firstParagraph.length < 120) {
    suggestions.push('First paragraph should be 120-160 chars for meta description')
  } else if (firstParagraph.length > 160) {
    suggestions.push('First paragraph too long for meta description')
  } else {
    strengths.push('Good first paragraph length for meta description')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
    strengths,
    readability,
    keywordDensity: keywords ? (content.toLowerCase().split(keywords.toLowerCase()).length - 1) / wordCount * 100 : 0
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const { content, keywords } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const analysis = analyzeSEO(content, keywords)

    return NextResponse.json({
      analysis,
      wordCount: content.split(/\s+/).length,
      readingTime: Math.ceil(content.split(/\s+/).length / 200) // 200 words per minute
    })
  } catch (error) {
    console.error('SEO analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}
