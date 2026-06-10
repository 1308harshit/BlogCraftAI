export interface SEOAnalysis {
  score: number
  wordCount: number
  readability: number
  keywordDensity: Record<string, number>
  issues: string[]
  suggestions: string[]
  metaTitle: string
  metaDescription: string
  snippetPreview: {
    title: string
    url: string
    description: string
  }
  schemaMarkup: string
}

export function analyzeSEO(content: string, keywords: string[] = []): SEOAnalysis {
  const text = content.replace(/<[^>]*>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : 0
  const readability = Math.min(
    100,
    Math.max(0, Math.round(100 - Math.abs(avgWordsPerSentence - 18) * 3))
  )

  const keywordDensity: Record<string, number> = {}
  for (const kw of keywords) {
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = text.match(regex) || []
    keywordDensity[kw] = wordCount ? (matches.length / wordCount) * 100 : 0
  }

  const issues: string[] = []
  const suggestions: string[] = []

  if (wordCount < 300) issues.push('Content is too short for SEO (aim for 800+ words)')
  if (wordCount < 800) suggestions.push('Expand content to 800-1500 words for better rankings')
  if (!content.match(/^#\s/m) && !content.match(/<h1/i))
    suggestions.push('Add a clear H1 heading')
  if (!content.match(/^##\s/m) && !content.match(/<h2/i))
    suggestions.push('Add H2 subheadings for structure')
  if (readability < 60) suggestions.push('Simplify sentences for better readability')
  if (!content.toLowerCase().includes('http')) suggestions.push('Add 1-2 authoritative external links')
  suggestions.push('Add internal links to related posts (2-4)')

  const headings = (content.match(/^#{1,3}\s.+$/gm) || []).length
  let score = 50
  if (wordCount >= 800) score += 15
  if (wordCount >= 1200) score += 5
  if (headings >= 3) score += 10
  if (readability >= 60) score += 10
  if (keywords.some((k) => (keywordDensity[k] ?? 0) >= 0.5 && (keywordDensity[k] ?? 0) <= 2.5))
    score += 10
  score = Math.min(100, score)

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const metaTitle = titleMatch?.[1]?.slice(0, 60) ?? 'Your Blog Post Title'
  const metaDescription = text.slice(0, 155).trim() + (text.length > 155 ? '...' : '')

  const snippetPreview = {
    title: metaTitle,
    url: 'https://yourdomain.com/blog/your-post',
    description: metaDescription,
  }

  const schemaMarkup = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'BlogCraft AI' },
      publisher: { '@type': 'Organization', name: 'BlogCraft AI' },
    },
    null,
    2
  )

  return {
    score,
    wordCount,
    readability,
    keywordDensity,
    issues,
    suggestions,
    metaTitle,
    metaDescription,
    snippetPreview,
    schemaMarkup,
  }
}
