import { analyzeSEO, type SEOAnalysis } from '@/lib/seo/analyzer'

export type RecommendationPriority = 'high' | 'medium' | 'low'

export interface ContentRecommendation {
  category: 'SEO' | 'Readability' | 'Engagement' | 'Structure'
  priority: RecommendationPriority
  title: string
  description: string
}

export interface ContentAnalysis {
  overallScore: number
  summary: string
  breakdown: {
    seo: { score: number; maxScore: 35 }
    readability: { score: number; maxScore: 25 }
    engagement: { score: number; maxScore: 25 }
    structure: { score: number; maxScore: 15 }
  }
  recommendations: ContentRecommendation[]
  seo: SEOAnalysis
}

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)))
}

function words(content: string) {
  return content.replace(/<[^>]*>/g, ' ').match(/\b[\p{L}\p{N}'-]+\b/gu) ?? []
}

/**
 * Gives transparent, rule-based writing feedback. It does not predict search
 * rankings, traffic, conversion, or publication performance.
 */
export function analyzeContent(input: {
  title: string
  content: string
  keyword?: string
}): ContentAnalysis {
  const title = input.title.trim()
  const content = input.content.trim()
  const keyword = input.keyword?.trim()
  const seo = analyzeSEO(content, keyword ? [keyword] : [])
  const allWords = words(content)
  const wordCount = allWords.length
  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()
  const recommendations: ContentRecommendation[] = []

  const h2Count = (content.match(/^##\s+.+$/gm) ?? []).length
  const headingCount = (content.match(/^#{1,3}\s+.+$/gm) ?? []).length
  const sentences = content.split(/[.!?]+/).filter((sentence) => sentence.trim())
  const averageSentenceLength = sentences.length ? wordCount / sentences.length : wordCount
  const paragraphs = content.split(/\n\s*\n/).filter((paragraph) => paragraph.trim())
  const hasList = /^\s*(?:[-*+] |\d+[.)] )/m.test(content)
  const hasLink = /https?:\/\//i.test(content)

  let seoScore = 8
  if (title.length >= 30 && title.length <= 65) seoScore += 6
  else recommendations.push({
    category: 'SEO', priority: 'medium', title: 'Refine the title length',
    description: 'Aim for a clear title between 30 and 65 characters.',
  })
  if (wordCount >= 600) seoScore += 8
  else recommendations.push({
    category: 'SEO', priority: 'high', title: 'Add more useful detail',
    description: 'The draft is short. Add examples, explanations, or supporting sections where helpful.',
  })
  if (headingCount >= 3) seoScore += 6
  if (hasLink) seoScore += 3
  if (keyword) {
    const density = seo.keywordDensity[keyword] ?? 0
    if (lowerTitle.includes(keyword.toLowerCase())) seoScore += 2
    if (density >= 0.3 && density <= 2.5) seoScore += 2
    else recommendations.push({
      category: 'SEO', priority: 'low', title: 'Use the target phrase naturally',
      description: 'Mention the target phrase where it genuinely helps readers; avoid keyword stuffing.',
    })
  }
  seoScore = clamp(seoScore, 35)

  let readabilityScore = 10
  if (seo.readability >= 60) readabilityScore += 8
  else recommendations.push({
    category: 'Readability', priority: 'medium', title: 'Shorten complex sentences',
    description: 'Break long sentences into clearer, direct statements.',
  })
  if (averageSentenceLength >= 8 && averageSentenceLength <= 24) readabilityScore += 4
  if (paragraphs.length >= 3) readabilityScore += 3
  readabilityScore = clamp(readabilityScore, 25)

  let engagementScore = 8
  if (/\d|\?|how|why|guide|best|proven|tips/i.test(title)) engagementScore += 5
  if (hasList) engagementScore += 5
  if (content.length > 900) engagementScore += 4
  if (/(you|your|we|our)\b/i.test(content)) engagementScore += 3
  else recommendations.push({
    category: 'Engagement', priority: 'low', title: 'Write for a specific reader',
    description: 'Use concrete reader-focused language and examples where appropriate.',
  })
  engagementScore = clamp(engagementScore, 25)

  let structureScore = 2
  if (headingCount >= 3) structureScore += 5
  else recommendations.push({
    category: 'Structure', priority: 'high', title: 'Add descriptive sections',
    description: 'Use headings to make the article easier to scan and navigate.',
  })
  if (h2Count >= 2) structureScore += 3
  if (paragraphs.length >= 3) structureScore += 3
  if (hasList) structureScore += 2
  structureScore = clamp(structureScore, 15)

  const overallScore = seoScore + readabilityScore + engagementScore + structureScore
  const summary = overallScore >= 80
    ? 'Strong heuristic baseline. Review the suggestions against your audience and goals.'
    : overallScore >= 60
      ? 'A solid heuristic result with several practical ways to improve clarity and structure.'
      : 'A useful heuristic starting point. Address the highest-priority suggestions before publishing.'

  return {
    overallScore,
    summary,
    breakdown: {
      seo: { score: seoScore, maxScore: 35 },
      readability: { score: readabilityScore, maxScore: 25 },
      engagement: { score: engagementScore, maxScore: 25 },
      structure: { score: structureScore, maxScore: 15 },
    },
    recommendations,
    seo,
  }
}
