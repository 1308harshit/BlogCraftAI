/**
 * Content Analyzer - Honest, transparent content scoring
 * Used for the public free analyzer tool
 */

import { analyzeSEO, type SEOAnalysis } from './seo/analyzer'

export interface ContentAnalysis {
  overallScore: number
  breakdown: {
    seo: ScoreBreakdown
    readability: ScoreBreakdown
    engagement: ScoreBreakdown
    structure: ScoreBreakdown
  }
  summary: string
  recommendations: Recommendation[]
  seoAnalysis: SEOAnalysis
}

export interface ScoreBreakdown {
  score: number
  maxScore: number
  factors: Factor[]
}

export interface Factor {
  name: string
  passed: boolean
  impact: 'high' | 'medium' | 'low'
  description: string
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  category: 'seo' | 'readability' | 'engagement' | 'structure'
  title: string
  description: string
  impact: string
}

export async function analyzeContent(params: {
  title: string
  content: string
  keyword?: string
}): Promise<ContentAnalysis> {
  const { title, content, keyword } = params
  
  // Get SEO analysis
  const keywords = keyword ? [keyword] : []
  const seoAnalysis = analyzeSEO(content, keywords)
  
  // Analyze various aspects
  const seoBreakdown = analyzeSEOFactors(content, title, keyword, seoAnalysis)
  const readabilityBreakdown = analyzeReadability(content, seoAnalysis)
  const engagementBreakdown = analyzeEngagement(title, content)
  const structureBreakdown = analyzeStructure(content)
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (seoBreakdown.score * 0.35) +
    (readabilityBreakdown.score * 0.25) +
    (engagementBreakdown.score * 0.25) +
    (structureBreakdown.score * 0.15)
  )
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    seo: seoBreakdown,
    readability: readabilityBreakdown,
    engagement: engagementBreakdown,
    structure: structureBreakdown,
  }, seoAnalysis)
  
  // Generate summary
  const summary = generateSummary(overallScore, {
    seo: seoBreakdown,
    readability: readabilityBreakdown,
    engagement: engagementBreakdown,
    structure: structureBreakdown,
  })
  
  return {
    overallScore,
    breakdown: {
      seo: seoBreakdown,
      readability: readabilityBreakdown,
      engagement: engagementBreakdown,
      structure: structureBreakdown,
    },
    summary,
    recommendations,
    seoAnalysis,
  }
}

function analyzeSEOFactors(
  content: string,
  title: string,
  keyword: string | undefined,
  seoAnalysis: SEOAnalysis
): ScoreBreakdown {
  const factors: Factor[] = []
  let score = 0
  const maxScore = 100
  
  // Word count (20 points)
  const wordCount = seoAnalysis.wordCount
  if (wordCount >= 800) {
    factors.push({
      name: 'Word Count',
      passed: true,
      impact: 'high',
      description: `${wordCount} words (optimal range: 800-2500)`,
    })
    score += 20
  } else if (wordCount >= 500) {
    factors.push({
      name: 'Word Count',
      passed: false,
      impact: 'high',
      description: `${wordCount} words (aim for 800+ for better rankings)`,
    })
    score += 12
  } else {
    factors.push({
      name: 'Word Count',
      passed: false,
      impact: 'high',
      description: `${wordCount} words (too short for SEO)`,
    })
    score += 5
  }
  
  // Keyword optimization (25 points)
  if (keyword) {
    const density = seoAnalysis.keywordDensity[keyword] || 0
    const inTitle = title.toLowerCase().includes(keyword.toLowerCase())
    const inContent = content.toLowerCase().includes(keyword.toLowerCase())
    
    if (inTitle && density >= 0.5 && density <= 2.5) {
      factors.push({
        name: 'Keyword Optimization',
        passed: true,
        impact: 'high',
        description: `"${keyword}" appears in title and content with optimal density (${density.toFixed(1)}%)`,
      })
      score += 25
    } else if (inContent) {
      factors.push({
        name: 'Keyword Optimization',
        passed: false,
        impact: 'high',
        description: `"${keyword}" found but needs optimization (density: ${density.toFixed(1)}%, in title: ${inTitle})`,
      })
      score += 12
    } else {
      factors.push({
        name: 'Keyword Optimization',
        passed: false,
        impact: 'high',
        description: `Target keyword "${keyword}" not found in content`,
      })
      score += 0
    }
  } else {
    factors.push({
      name: 'Keyword Optimization',
      passed: false,
      impact: 'medium',
      description: 'No target keyword specified',
    })
    score += 10 // neutral score when no keyword provided
  }
  
  // Headings structure (20 points)
  const h1Count = (content.match(/^#\s/gm) || []).length
  const h2Count = (content.match(/^##\s/gm) || []).length
  const h3Count = (content.match(/^###\s/gm) || []).length
  const totalHeadings = h1Count + h2Count + h3Count
  
  if (h1Count === 1 && h2Count >= 2) {
    factors.push({
      name: 'Heading Structure',
      passed: true,
      impact: 'high',
      description: `Good structure: 1 H1, ${h2Count} H2s, ${h3Count} H3s`,
    })
    score += 20
  } else if (totalHeadings >= 2) {
    factors.push({
      name: 'Heading Structure',
      passed: false,
      impact: 'medium',
      description: `Needs improvement: ${h1Count} H1, ${h2Count} H2s, ${h3Count} H3s`,
    })
    score += 10
  } else {
    factors.push({
      name: 'Heading Structure',
      passed: false,
      impact: 'high',
      description: 'Missing proper heading structure',
    })
    score += 0
  }
  
  // Meta data (15 points)
  const titleLength = title.length
  const hasGoodTitle = titleLength >= 30 && titleLength <= 60
  
  if (hasGoodTitle) {
    factors.push({
      name: 'Title Length',
      passed: true,
      impact: 'medium',
      description: `${titleLength} characters (optimal: 30-60)`,
    })
    score += 15
  } else {
    factors.push({
      name: 'Title Length',
      passed: false,
      impact: 'medium',
      description: `${titleLength} characters (aim for 30-60)`,
    })
    score += titleLength >= 20 ? 8 : 3
  }
  
  // Links (10 points)
  const hasLinks = content.includes('http') || content.includes('[')
  if (hasLinks) {
    factors.push({
      name: 'Links Present',
      passed: true,
      impact: 'low',
      description: 'Content includes links to external resources',
    })
    score += 10
  } else {
    factors.push({
      name: 'Links Present',
      passed: false,
      impact: 'low',
      description: 'Add 2-3 authoritative external links',
    })
    score += 0
  }
  
  // Images/Media (10 points)
  const hasImages = content.includes('![') || content.includes('<img')
  if (hasImages) {
    factors.push({
      name: 'Visual Content',
      passed: true,
      impact: 'medium',
      description: 'Content includes images or media',
    })
    score += 10
  } else {
    factors.push({
      name: 'Visual Content',
      passed: false,
      impact: 'medium',
      description: 'Add relevant images to enhance content',
    })
    score += 0
  }
  
  return { score, maxScore, factors }
}

function analyzeReadability(content: string, seoAnalysis: SEOAnalysis): ScoreBreakdown {
  const factors: Factor[] = []
  let score = 0
  const maxScore = 100
  
  const readabilityScore = seoAnalysis.readability
  
  // Overall readability (50 points)
  if (readabilityScore >= 70) {
    factors.push({
      name: 'Readability Score',
      passed: true,
      impact: 'high',
      description: `Excellent readability (${readabilityScore}/100)`,
    })
    score += 50
  } else if (readabilityScore >= 50) {
    factors.push({
      name: 'Readability Score',
      passed: false,
      impact: 'high',
      description: `Good readability (${readabilityScore}/100) - can be improved`,
    })
    score += 35
  } else {
    factors.push({
      name: 'Readability Score',
      passed: false,
      impact: 'high',
      description: `Poor readability (${readabilityScore}/100) - needs simplification`,
    })
    score += 15
  }
  
  // Sentence length (25 points)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(Boolean)
  const avgSentenceLength = sentences.length ? words.length / sentences.length : 0
  
  if (avgSentenceLength >= 10 && avgSentenceLength <= 20) {
    factors.push({
      name: 'Sentence Length',
      passed: true,
      impact: 'medium',
      description: `Average ${avgSentenceLength.toFixed(1)} words per sentence (ideal: 10-20)`,
    })
    score += 25
  } else {
    factors.push({
      name: 'Sentence Length',
      passed: false,
      impact: 'medium',
      description: `Average ${avgSentenceLength.toFixed(1)} words per sentence (aim for 10-20)`,
    })
    score += 10
  }
  
  // Paragraph structure (25 points)
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0)
  const avgParagraphLength = paragraphs.length ? words.length / paragraphs.length : 0
  
  if (paragraphs.length >= 3 && avgParagraphLength <= 100) {
    factors.push({
      name: 'Paragraph Structure',
      passed: true,
      impact: 'medium',
      description: `${paragraphs.length} paragraphs with good length`,
    })
    score += 25
  } else {
    factors.push({
      name: 'Paragraph Structure',
      passed: false,
      impact: 'medium',
      description: `Consider breaking into more paragraphs (currently ${paragraphs.length})`,
    })
    score += 12
  }
  
  return { score, maxScore, factors }
}

function analyzeEngagement(title: string, content: string): ScoreBreakdown {
  const factors: Factor[] = []
  let score = 0
  const maxScore = 100
  
  // Title engagement (40 points)
  const titleWords = title.split(/\s+/)
  const hasNumbers = /\d+/.test(title)
  const hasQuestionOrHow = /(how|what|why|when|where|who|\?)/.test(title.toLowerCase())
  const hasPowerWords = /(ultimate|complete|proven|secret|best|top|essential|guide)/.test(title.toLowerCase())
  
  let titleScore = 0
  const titleFactors: string[] = []
  
  if (hasNumbers) {
    titleScore += 15
    titleFactors.push('includes numbers')
  }
  if (hasQuestionOrHow) {
    titleScore += 15
    titleFactors.push('addresses a question')
  }
  if (hasPowerWords) {
    titleScore += 10
    titleFactors.push('uses power words')
  }
  
  if (titleScore >= 25) {
    factors.push({
      name: 'Title Engagement',
      passed: true,
      impact: 'high',
      description: `Strong title: ${titleFactors.join(', ')}`,
    })
    score += 40
  } else if (titleScore >= 15) {
    factors.push({
      name: 'Title Engagement',
      passed: false,
      impact: 'high',
      description: `Good title but could be stronger: ${titleFactors.join(', ') || 'consider adding numbers or questions'}`,
    })
    score += 25
  } else {
    factors.push({
      name: 'Title Engagement',
      passed: false,
      impact: 'high',
      description: 'Title could be more engaging (try adding numbers, questions, or power words)',
    })
    score += 10
  }
  
  // Introduction hook (30 points)
  const firstParagraph = content.split(/\n\n+/)[0] || ''
  const firstSentence = content.split(/[.!?]+/)[0] || ''
  const hasStrongOpen = firstSentence.length < 100 && firstSentence.length > 20
  
  if (hasStrongOpen) {
    factors.push({
      name: 'Introduction Hook',
      passed: true,
      impact: 'high',
      description: 'Strong opening sentence',
    })
    score += 30
  } else {
    factors.push({
      name: 'Introduction Hook',
      passed: false,
      impact: 'medium',
      description: 'Opening could be more engaging',
    })
    score += 10
  }
  
  // Formatting variety (30 points)
  const hasBullets = content.includes('- ') || content.includes('* ')
  const hasNumberedList = /^\d+\.\s/.test(content)
  const hasBold = content.includes('**') || content.includes('<strong')
  const hasItalics = content.includes('*') || content.includes('<em')
  
  const formattingCount = [hasBullets, hasNumberedList, hasBold, hasItalics].filter(Boolean).length
  
  if (formattingCount >= 3) {
    factors.push({
      name: 'Content Formatting',
      passed: true,
      impact: 'medium',
      description: 'Good variety: bullets, lists, emphasis',
    })
    score += 30
  } else if (formattingCount >= 1) {
    factors.push({
      name: 'Content Formatting',
      passed: false,
      impact: 'medium',
      description: `Add more formatting variety (currently using ${formattingCount} types)`,
    })
    score += 15
  } else {
    factors.push({
      name: 'Content Formatting',
      passed: false,
      impact: 'medium',
      description: 'Add bullets, lists, and text emphasis for better scannability',
    })
    score += 0
  }
  
  return { score, maxScore, factors }
}

function analyzeStructure(content: string): ScoreBreakdown {
  const factors: Factor[] = []
  let score = 0
  const maxScore = 100
  
  // Clear sections (50 points)
  const h2Count = (content.match(/^##\s/gm) || []).length
  if (h2Count >= 3) {
    factors.push({
      name: 'Content Sections',
      passed: true,
      impact: 'high',
      description: `${h2Count} clear sections with H2 headings`,
    })
    score += 50
  } else if (h2Count >= 1) {
    factors.push({
      name: 'Content Sections',
      passed: false,
      impact: 'high',
      description: `Only ${h2Count} section(s) - add more H2 headings`,
    })
    score += 25
  } else {
    factors.push({
      name: 'Content Sections',
      passed: false,
      impact: 'high',
      description: 'No clear sections - add H2 headings',
    })
    score += 0
  }
  
  // Logical flow (30 points)
  const hasIntro = content.split(/^##\s/m)[0].length > 100
  const hasConclusion = /conclusion|summary|takeaway|wrap.*up/i.test(content)
  
  if (hasIntro && hasConclusion) {
    factors.push({
      name: 'Content Flow',
      passed: true,
      impact: 'medium',
      description: 'Good structure: introduction and conclusion present',
    })
    score += 30
  } else {
    factors.push({
      name: 'Content Flow',
      passed: false,
      impact: 'medium',
      description: `${!hasIntro ? 'Add introduction. ' : ''}${!hasConclusion ? 'Add conclusion section.' : ''}`,
    })
    score += hasIntro || hasConclusion ? 15 : 5
  }
  
  // Content depth (20 points)
  const words = content.split(/\s+/).filter(Boolean)
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0)
  const avgWordsPerSection = h2Count > 0 ? words.length / h2Count : words.length
  
  if (avgWordsPerSection >= 150 && avgWordsPerSection <= 400) {
    factors.push({
      name: 'Section Depth',
      passed: true,
      impact: 'medium',
      description: `Good depth: average ${Math.round(avgWordsPerSection)} words per section`,
    })
    score += 20
  } else {
    factors.push({
      name: 'Section Depth',
      passed: false,
      impact: 'low',
      description: `Sections could be ${avgWordsPerSection < 150 ? 'more detailed' : 'more concise'}`,
    })
    score += 10
  }
  
  return { score, maxScore, factors }
}

function generateRecommendations(
  breakdown: {
    seo: ScoreBreakdown
    readability: ScoreBreakdown
    engagement: ScoreBreakdown
    structure: ScoreBreakdown
  },
  seoAnalysis: SEOAnalysis
): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Collect failed factors from all categories
  const allFactors = [
    ...breakdown.seo.factors.map(f => ({ ...f, category: 'seo' as const })),
    ...breakdown.readability.factors.map(f => ({ ...f, category: 'readability' as const })),
    ...breakdown.engagement.factors.map(f => ({ ...f, category: 'engagement' as const })),
    ...breakdown.structure.factors.map(f => ({ ...f, category: 'structure' as const })),
  ]
  
  const failedFactors = allFactors.filter(f => !f.passed)
  
  // Convert failed factors to recommendations
  for (const factor of failedFactors) {
    recommendations.push({
      priority: factor.impact as 'high' | 'medium' | 'low',
      category: factor.category,
      title: factor.name,
      description: factor.description,
      impact: getImpactDescription(factor.impact, factor.category),
    })
  }
  
  // Add specific SEO suggestions
  for (const suggestion of seoAnalysis.suggestions.slice(0, 3)) {
    if (!recommendations.find(r => r.description.includes(suggestion))) {
      recommendations.push({
        priority: 'medium',
        category: 'seo',
        title: 'SEO Improvement',
        description: suggestion,
        impact: 'Helps search engines better understand your content',
      })
    }
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  
  return recommendations.slice(0, 8) // Return top 8 recommendations
}

function getImpactDescription(impact: string, category: string): string {
  const impacts = {
    seo: {
      high: 'Significant impact on search rankings',
      medium: 'Moderate impact on search visibility',
      low: 'Minor SEO improvement',
    },
    readability: {
      high: 'Major impact on user engagement',
      medium: 'Improves reading experience',
      low: 'Small readability enhancement',
    },
    engagement: {
      high: 'Significantly increases click-through and sharing',
      medium: 'Improves user interest and time on page',
      low: 'Minor engagement boost',
    },
    structure: {
      high: 'Critical for content organization',
      medium: 'Improves content navigation',
      low: 'Minor structural improvement',
    },
  }
  
  return impacts[category as keyof typeof impacts]?.[impact as keyof typeof impacts.seo] || 'Improves content quality'
}

function generateSummary(
  overallScore: number,
  breakdown: {
    seo: ScoreBreakdown
    readability: ScoreBreakdown
    engagement: ScoreBreakdown
    structure: ScoreBreakdown
  }
): string {
  const strengths: string[] = []
  const weaknesses: string[] = []
  
  if (breakdown.seo.score >= 70) strengths.push('strong SEO optimization')
  else if (breakdown.seo.score < 50) weaknesses.push('SEO needs improvement')
  
  if (breakdown.readability.score >= 70) strengths.push('excellent readability')
  else if (breakdown.readability.score < 50) weaknesses.push('readability could be better')
  
  if (breakdown.engagement.score >= 70) strengths.push('high engagement potential')
  else if (breakdown.engagement.score < 50) weaknesses.push('low engagement signals')
  
  if (breakdown.structure.score >= 70) strengths.push('well-structured content')
  else if (breakdown.structure.score < 50) weaknesses.push('weak content structure')
  
  let summary = ''
  
  if (overallScore >= 80) {
    summary = `Excellent content! Your article scores ${overallScore}/100`
  } else if (overallScore >= 60) {
    summary = `Good content with room for improvement. Score: ${overallScore}/100`
  } else {
    summary = `This content needs optimization. Current score: ${overallScore}/100`
  }
  
  if (strengths.length > 0) {
    summary += `. Strengths: ${strengths.join(', ')}`
  }
  
  if (weaknesses.length > 0) {
    summary += `. Areas to improve: ${weaknesses.join(', ')}`
  }
  
  return summary + '.'
}
