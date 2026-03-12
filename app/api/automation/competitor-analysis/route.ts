import { NextRequest, NextResponse } from 'next/server'
import { automationWorkflows } from '@/lib/automation-workflows'

export async function POST(request: NextRequest) {
  try {
    const { userId, competitorUrls, topic, userPlan = 'free' } = await request.json()

    if (!userId || !competitorUrls || !topic) {
      return NextResponse.json(
        { error: 'User ID, competitor URLs, and topic are required' },
        { status: 400 }
      )
    }

    // Validate URLs
    if (!Array.isArray(competitorUrls) || competitorUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one competitor URL is required' },
        { status: 400 }
      )
    }

    // Check plan limits
    const maxCompetitors = userPlan === 'free' ? 2 : userPlan === 'pro' ? 5 : 10
    if (competitorUrls.length > maxCompetitors) {
      return NextResponse.json(
        { 
          error: `Competitor analysis limited to ${maxCompetitors} URLs for ${userPlan} plan`,
          upgrade: userPlan === 'free' ? 'Upgrade to Pro for more competitor analysis' : null
        },
        { status: 403 }
      )
    }

    // Validate URLs format
    const validUrls = competitorUrls.filter((url: string) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    })

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided' },
        { status: 400 }
      )
    }

    console.log(`Analyzing ${validUrls.length} competitors for topic: ${topic}`)
    
    // Perform competitor analysis
    const analyses = await automationWorkflows.analyzeCompetitors(validUrls, topic)

    // Generate competitive content based on analysis
    const competitiveContent = await generateCompetitiveContent(analyses, topic, userPlan)

    // Track usage
    await trackCompetitorAnalysis(userId, validUrls.length, topic)

    return NextResponse.json({
      success: true,
      analyses,
      competitiveContent,
      insights: generateInsights(analyses),
      recommendations: generateRecommendations(analyses, topic)
    })

  } catch (error) {
    console.error('Competitor analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze competitors' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const analysisId = searchParams.get('analysisId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch previous analyses
    const analyses = await getMockCompetitorAnalyses(userId, analysisId)

    return NextResponse.json({ analyses })

  } catch (error) {
    console.error('Error fetching competitor analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}

// Helper functions
async function generateCompetitiveContent(analyses: any[], topic: string, userPlan: string) {
  // Extract top opportunities from all competitors
  const allOpportunities = analyses.flatMap(analysis => analysis.opportunities)
  const allGaps = analyses.flatMap(analysis => analysis.contentGaps)
  
  // Generate content ideas based on gaps and opportunities
  const contentIdeas = [
    ...allGaps.slice(0, 5).map(gap => ({
      type: 'blog',
      title: gap,
      reason: 'Content gap identified',
      competitorCoverage: 'Low',
      difficulty: 'Medium',
      estimatedTraffic: Math.floor(Math.random() * 5000) + 1000
    })),
    ...allOpportunities.slice(0, 3).map(opportunity => ({
      type: 'guide',
      title: opportunity,
      reason: 'Market opportunity',
      competitorCoverage: 'None',
      difficulty: 'High',
      estimatedTraffic: Math.floor(Math.random() * 10000) + 2000
    }))
  ]

  return {
    contentIdeas,
    totalOpportunities: allOpportunities.length,
    totalGaps: allGaps.length,
    competitiveAdvantage: calculateCompetitiveAdvantage(analyses)
  }
}

function generateInsights(analyses: any[]) {
  const totalCompetitors = analyses.length
  const avgContentPieces = analyses.reduce((sum, analysis) => 
    sum + analysis.topContent.length, 0) / totalCompetitors

  return {
    marketSaturation: totalCompetitors > 5 ? 'High' : totalCompetitors > 2 ? 'Medium' : 'Low',
    contentVolume: avgContentPieces > 10 ? 'High' : avgContentPieces > 5 ? 'Medium' : 'Low',
    opportunityScore: Math.floor(Math.random() * 40) + 60, // 60-100
    competitionLevel: totalCompetitors > 5 ? 'Intense' : totalCompetitors > 2 ? 'Moderate' : 'Light',
    recommendedStrategy: totalCompetitors > 5 ? 'Niche focus' : 'Broad coverage'
  }
}

function generateRecommendations(analyses: any[], topic: string) {
  const recommendations = [
    'Focus on content gaps identified in competitor analysis',
    'Create more comprehensive guides than competitors',
    'Optimize for keywords competitors are missing',
    'Develop unique angles on popular topics'
  ]

  // Add specific recommendations based on analysis
  const hasLowEngagement = analyses.some(analysis => 
    analysis.topContent.some((content: any) => content.engagement < 500)
  )

  if (hasLowEngagement) {
    recommendations.push('Improve content engagement with interactive elements')
  }

  const hasContentGaps = analyses.some(analysis => analysis.contentGaps.length > 3)
  if (hasContentGaps) {
    recommendations.push('Prioritize content gaps for quick wins')
  }

  return recommendations
}

function calculateCompetitiveAdvantage(analyses: any[]) {
  // Calculate potential competitive advantage based on gaps and opportunities
  const totalGaps = analyses.reduce((sum, analysis) => sum + analysis.contentGaps.length, 0)
  const totalOpportunities = analyses.reduce((sum, analysis) => sum + analysis.opportunities.length, 0)
  
  return {
    gapOpportunities: totalGaps,
    marketOpportunities: totalOpportunities,
    advantageScore: Math.min(100, (totalGaps + totalOpportunities) * 5),
    timeToMarket: totalGaps > 10 ? '2-3 months' : totalGaps > 5 ? '1-2 months' : '2-4 weeks'
  }
}

async function trackCompetitorAnalysis(userId: string, competitorCount: number, topic: string) {
  console.log(`User ${userId} analyzed ${competitorCount} competitors for topic: ${topic}`)
  
  // In production, save to analytics
  // await analytics.track({
  //   userId,
  //   event: 'competitor_analysis',
  //   properties: {
  //     competitorCount,
  //     topic,
  //     timestamp: new Date()
  //   }
  // })
}

async function getMockCompetitorAnalyses(userId: string, analysisId?: string | null) {
  const mockAnalyses = [
    {
      id: 'analysis-1',
      userId,
      topic: 'AI tools for business',
      competitorCount: 3,
      createdAt: new Date(Date.now() - 86400000),
      status: 'completed',
      insights: {
        opportunityScore: 78,
        competitionLevel: 'Moderate',
        contentGaps: 12
      }
    },
    {
      id: 'analysis-2',
      userId,
      topic: 'Marketing automation',
      competitorCount: 5,
      createdAt: new Date(Date.now() - 172800000),
      status: 'completed',
      insights: {
        opportunityScore: 65,
        competitionLevel: 'High',
        contentGaps: 8
      }
    }
  ]

  if (analysisId) {
    return mockAnalyses.filter(analysis => analysis.id === analysisId)
  }

  return mockAnalyses
}