/**
 * Growth Score System - Core growth discovery engine
 * Calculates overall growth score and identifies opportunities
 */

export interface GrowthScore {
  overall: number // 0-100
  categories: {
    content: CategoryScore
    seo: CategoryScore
    distribution: CategoryScore
    monetization: CategoryScore
  }
  opportunities: Opportunity[]
  summary: string
  trend: 'improving' | 'stable' | 'declining'
}

export interface CategoryScore {
  score: number // 0-100
  weight: number // percentage
  factors: Factor[]
  status: 'excellent' | 'good' | 'needs-work' | 'poor'
}

export interface Factor {
  name: string
  status: 'pass' | 'warning' | 'fail'
  value: string
  impact: 'high' | 'medium' | 'low'
}

export interface Opportunity {
  id: string
  title: string
  description: string
  category: 'content' | 'seo' | 'distribution' | 'monetization'
  priority: 'high' | 'medium' | 'low'
  estimatedImpact: string
  actionable: boolean
  action?: string
}

export interface GrowthScoreInput {
  userId: string
  projectCount: number
  avgSeoScore: number
  publishedCount: number
  connectedPlatforms: number
  hasMonetization: boolean
  avgWordCount: number
  recentActivity: number // days since last activity
  hasAnalytics: boolean
}

export function calculateGrowthScore(input: GrowthScoreInput): GrowthScore {
  // Calculate category scores
  const content = calculateContentScore(input)
  const seo = calculateSEOScore(input)
  const distribution = calculateDistributionScore(input)
  const monetization = calculateMonetizationScore(input)

  // Calculate weighted overall score
  const overall = Math.round(
    content.score * content.weight +
    seo.score * seo.weight +
    distribution.score * distribution.weight +
    monetization.score * monetization.weight
  )

  // Identify opportunities
  const opportunities = identifyOpportunities({
    content,
    seo,
    distribution,
    monetization,
    input,
  })

  // Generate summary
  const summary = generateSummary(overall, {
    content,
    seo,
    distribution,
    monetization,
  })

  // Determine trend (simplified - would use historical data in production)
  const trend = determineTrend(input)

  return {
    overall,
    categories: {
      content,
      seo,
      distribution,
      monetization,
    },
    opportunities,
    summary,
    trend,
  }
}

function calculateContentScore(input: GrowthScoreInput): CategoryScore {
  const factors: Factor[] = []
  let score = 0
  const maxScore = 100

  // Project count (30 points)
  if (input.projectCount >= 10) {
    factors.push({
      name: 'Content Volume',
      status: 'pass',
      value: `${input.projectCount} articles`,
      impact: 'high',
    })
    score += 30
  } else if (input.projectCount >= 5) {
    factors.push({
      name: 'Content Volume',
      status: 'warning',
      value: `${input.projectCount} articles`,
      impact: 'high',
    })
    score += 20
  } else {
    factors.push({
      name: 'Content Volume',
      status: 'fail',
      value: `${input.projectCount} articles`,
      impact: 'high',
    })
    score += 10
  }

  // Published count (25 points)
  const publishedRatio = input.projectCount > 0 ? input.publishedCount / input.projectCount : 0
  if (publishedRatio >= 0.7) {
    factors.push({
      name: 'Publishing Consistency',
      status: 'pass',
      value: `${Math.round(publishedRatio * 100)}% published`,
      impact: 'high',
    })
    score += 25
  } else if (publishedRatio >= 0.3) {
    factors.push({
      name: 'Publishing Consistency',
      status: 'warning',
      value: `${Math.round(publishedRatio * 100)}% published`,
      impact: 'high',
    })
    score += 15
  } else {
    factors.push({
      name: 'Publishing Consistency',
      status: 'fail',
      value: `${Math.round(publishedRatio * 100)}% published`,
      impact: 'high',
    })
    score += 5
  }

  // Average word count (20 points)
  if (input.avgWordCount >= 1000) {
    factors.push({
      name: 'Content Depth',
      status: 'pass',
      value: `${input.avgWordCount} avg words`,
      impact: 'medium',
    })
    score += 20
  } else if (input.avgWordCount >= 500) {
    factors.push({
      name: 'Content Depth',
      status: 'warning',
      value: `${input.avgWordCount} avg words`,
      impact: 'medium',
    })
    score += 12
  } else {
    factors.push({
      name: 'Content Depth',
      status: 'fail',
      value: `${input.avgWordCount} avg words`,
      impact: 'medium',
    })
    score += 5
  }

  // Recent activity (25 points)
  if (input.recentActivity <= 7) {
    factors.push({
      name: 'Activity Level',
      status: 'pass',
      value: 'Active this week',
      impact: 'medium',
    })
    score += 25
  } else if (input.recentActivity <= 30) {
    factors.push({
      name: 'Activity Level',
      status: 'warning',
      value: 'Active this month',
      impact: 'medium',
    })
    score += 15
  } else {
    factors.push({
      name: 'Activity Level',
      status: 'fail',
      value: `Inactive ${input.recentActivity} days`,
      impact: 'medium',
    })
    score += 5
  }

  const status = getStatus(score)

  return {
    score,
    weight: 0.35, // 35% of overall score
    factors,
    status,
  }
}

function calculateSEOScore(input: GrowthScoreInput): CategoryScore {
  const factors: Factor[] = []
  let score = 0

  // Average SEO score (60 points)
  if (input.avgSeoScore >= 80) {
    factors.push({
      name: 'SEO Quality',
      status: 'pass',
      value: `${input.avgSeoScore}/100 avg`,
      impact: 'high',
    })
    score += 60
  } else if (input.avgSeoScore >= 60) {
    factors.push({
      name: 'SEO Quality',
      status: 'warning',
      value: `${input.avgSeoScore}/100 avg`,
      impact: 'high',
    })
    score += 40
  } else {
    factors.push({
      name: 'SEO Quality',
      status: 'fail',
      value: `${input.avgSeoScore}/100 avg`,
      impact: 'high',
    })
    score += 20
  }

  // Analytics connection (40 points)
  if (input.hasAnalytics) {
    factors.push({
      name: 'Analytics Tracking',
      status: 'pass',
      value: 'Connected',
      impact: 'high',
    })
    score += 40
  } else {
    factors.push({
      name: 'Analytics Tracking',
      status: 'fail',
      value: 'Not connected',
      impact: 'high',
    })
    score += 0
  }

  const status = getStatus(score)

  return {
    score,
    weight: 0.30, // 30% of overall score
    factors,
    status,
  }
}

function calculateDistributionScore(input: GrowthScoreInput): CategoryScore {
  const factors: Factor[] = []
  let score = 0

  // Connected platforms (70 points)
  if (input.connectedPlatforms >= 3) {
    factors.push({
      name: 'Platform Reach',
      status: 'pass',
      value: `${input.connectedPlatforms} platforms`,
      impact: 'high',
    })
    score += 70
  } else if (input.connectedPlatforms >= 1) {
    factors.push({
      name: 'Platform Reach',
      status: 'warning',
      value: `${input.connectedPlatforms} platform(s)`,
      impact: 'high',
    })
    score += 40
  } else {
    factors.push({
      name: 'Platform Reach',
      status: 'fail',
      value: 'No platforms connected',
      impact: 'high',
    })
    score += 0
  }

  // Publishing frequency (30 points)
  if (input.publishedCount >= 10) {
    factors.push({
      name: 'Publishing Volume',
      status: 'pass',
      value: `${input.publishedCount} published`,
      impact: 'medium',
    })
    score += 30
  } else if (input.publishedCount >= 3) {
    factors.push({
      name: 'Publishing Volume',
      status: 'warning',
      value: `${input.publishedCount} published`,
      impact: 'medium',
    })
    score += 18
  } else {
    factors.push({
      name: 'Publishing Volume',
      status: 'fail',
      value: `${input.publishedCount} published`,
      impact: 'medium',
    })
    score += 5
  }

  const status = getStatus(score)

  return {
    score,
    weight: 0.20, // 20% of overall score
    factors,
    status,
  }
}

function calculateMonetizationScore(input: GrowthScoreInput): CategoryScore {
  const factors: Factor[] = []
  let score = 0

  // Has monetization (50 points)
  if (input.hasMonetization) {
    factors.push({
      name: 'Monetization Setup',
      status: 'pass',
      value: 'Active',
      impact: 'high',
    })
    score += 50
  } else {
    factors.push({
      name: 'Monetization Setup',
      status: 'fail',
      value: 'Not configured',
      impact: 'high',
    })
    score += 0
  }

  // Content readiness (50 points)
  if (input.publishedCount >= 5 && input.avgSeoScore >= 60) {
    factors.push({
      name: 'Monetization Readiness',
      status: 'pass',
      value: 'Content ready for monetization',
      impact: 'medium',
    })
    score += 50
  } else if (input.publishedCount >= 3) {
    factors.push({
      name: 'Monetization Readiness',
      status: 'warning',
      value: 'Build more content first',
      impact: 'medium',
    })
    score += 25
  } else {
    factors.push({
      name: 'Monetization Readiness',
      status: 'fail',
      value: 'Not enough content',
      impact: 'medium',
    })
    score += 10
  }

  const status = getStatus(score)

  return {
    score,
    weight: 0.15, // 15% of overall score
    factors,
    status,
  }
}

function identifyOpportunities(data: {
  content: CategoryScore
  seo: CategoryScore
  distribution: CategoryScore
  monetization: CategoryScore
  input: GrowthScoreInput
}): Opportunity[] {
  const opportunities: Opportunity[] = []

  // Content opportunities
  if (data.input.projectCount < 10) {
    opportunities.push({
      id: 'content-volume',
      title: 'Increase Content Volume',
      description: `You have ${data.input.projectCount} articles. Creating 10+ articles builds authority and SEO momentum.`,
      category: 'content',
      priority: 'high',
      estimatedImpact: 'Significant traffic growth potential',
      actionable: true,
      action: 'Create new article',
    })
  }

  const publishedRatio = data.input.projectCount > 0 ? data.input.publishedCount / data.input.projectCount : 0
  if (publishedRatio < 0.7 && data.input.projectCount > 0) {
    opportunities.push({
      id: 'publish-drafts',
      title: 'Publish Draft Content',
      description: `${data.input.projectCount - data.input.publishedCount} drafts ready to publish. Published content drives traffic.`,
      category: 'content',
      priority: 'high',
      estimatedImpact: 'Immediate traffic increase',
      actionable: true,
      action: 'Review drafts',
    })
  }

  // SEO opportunities
  if (data.input.avgSeoScore < 80) {
    opportunities.push({
      id: 'improve-seo',
      title: 'Optimize Content for SEO',
      description: `Average SEO score: ${data.input.avgSeoScore}/100. Improving to 80+ significantly boosts rankings.`,
      category: 'seo',
      priority: 'high',
      estimatedImpact: 'Better search rankings',
      actionable: true,
      action: 'Run SEO analysis',
    })
  }

  if (!data.input.hasAnalytics) {
    opportunities.push({
      id: 'connect-analytics',
      title: 'Connect Analytics',
      description: 'Track your traffic and understand what content performs best.',
      category: 'seo',
      priority: 'medium',
      estimatedImpact: 'Data-driven decisions',
      actionable: true,
      action: 'Connect Google Analytics',
    })
  }

  // Distribution opportunities
  if (data.input.connectedPlatforms < 2) {
    opportunities.push({
      id: 'expand-distribution',
      title: 'Expand to More Platforms',
      description: `Currently on ${data.input.connectedPlatforms} platform(s). Multi-platform presence multiplies reach.`,
      category: 'distribution',
      priority: 'medium',
      estimatedImpact: '2-3x wider audience',
      actionable: true,
      action: 'Connect platform',
    })
  }

  // Monetization opportunities
  if (!data.input.hasMonetization && data.input.publishedCount >= 5) {
    opportunities.push({
      id: 'setup-monetization',
      title: 'Start Monetizing Content',
      description: 'You have enough content to start generating revenue through CTAs and affiliate links.',
      category: 'monetization',
      priority: 'high',
      estimatedImpact: 'Revenue generation',
      actionable: true,
      action: 'Setup monetization',
    })
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  opportunities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return opportunities.slice(0, 5) // Top 5 opportunities
}

function generateSummary(
  overall: number,
  categories: {
    content: CategoryScore
    seo: CategoryScore
    distribution: CategoryScore
    monetization: CategoryScore
  }
): string {
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (categories.content.status === 'excellent' || categories.content.status === 'good') {
    strengths.push('strong content production')
  } else {
    weaknesses.push('content volume needs growth')
  }

  if (categories.seo.status === 'excellent' || categories.seo.status === 'good') {
    strengths.push('good SEO optimization')
  } else {
    weaknesses.push('SEO needs improvement')
  }

  if (categories.distribution.status === 'excellent' || categories.distribution.status === 'good') {
    strengths.push('multi-platform presence')
  } else {
    weaknesses.push('limited distribution')
  }

  if (categories.monetization.status === 'excellent' || categories.monetization.status === 'good') {
    strengths.push('monetization active')
  }

  let summary = ''

  if (overall >= 80) {
    summary = `Excellent growth trajectory! Score: ${overall}/100.`
  } else if (overall >= 60) {
    summary = `Good progress with clear opportunities. Score: ${overall}/100.`
  } else if (overall >= 40) {
    summary = `Building foundation. Score: ${overall}/100.`
  } else {
    summary = `Early stage - lots of growth potential ahead. Score: ${overall}/100.`
  }

  if (strengths.length > 0) {
    summary += ` Strengths: ${strengths.join(', ')}.`
  }

  if (weaknesses.length > 0) {
    summary += ` Focus on: ${weaknesses.join(', ')}.`
  }

  return summary
}

function determineTrend(input: GrowthScoreInput): 'improving' | 'stable' | 'declining' {
  // Simplified trend detection
  if (input.recentActivity <= 7) {
    return 'improving'
  } else if (input.recentActivity <= 30) {
    return 'stable'
  } else {
    return 'declining'
  }
}

function getStatus(score: number): 'excellent' | 'good' | 'needs-work' | 'poor' {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'needs-work'
  return 'poor'
}

// Example usage for demo/testing
export function getDemoGrowthScore(): GrowthScore {
  return calculateGrowthScore({
    userId: 'demo',
    projectCount: 8,
    avgSeoScore: 72,
    publishedCount: 5,
    connectedPlatforms: 1,
    hasMonetization: false,
    avgWordCount: 850,
    recentActivity: 3,
    hasAnalytics: false,
  })
}
