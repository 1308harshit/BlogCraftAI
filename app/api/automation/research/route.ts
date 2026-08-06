// Research Engine API Endpoint
// Provides access to automated research and trend analysis

import { NextRequest, NextResponse } from 'next/server'
import { researchEngine } from '@/lib/automation/research-engine'
import { requireUser } from '@/lib/auth/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/automation/research - Generate automated research plan
export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response
    // SECURITY FIX: Use authenticated user ID from session, not from request
    const userId = authed.user.id

    const body = await request.json()
    const {
      action,
      count = 10,
      contentTypes = ['blog'],
      platforms = ['blog'],
      businessGoals = ['traffic']
    } = body

    switch (action) {
      case 'analyze-trends': {
        const trends = await researchEngine.analyzeTrends(businessGoals)
        return NextResponse.json({
          success: true,
          data: trends
        })
      }

      case 'analyze-competitors': {
        const competitors = await researchEngine.analyzeCompetitors(userId)
        return NextResponse.json({
          success: true,
          data: competitors
        })
      }

      case 'generate-topics': {
        const topics = await researchEngine.generateTopicSuggestions({
          userId,
          count,
          contentTypes,
          platforms,
          businessGoals
        })
        return NextResponse.json({
          success: true,
          data: topics
        })
      }

      case 'generate-plan': {
        const plan = await researchEngine.generateAutomatedResearchPlan({
          userId,
          count,
          contentTypes,
          platforms,
          businessGoals
        })
        return NextResponse.json({
          success: true,
          data: plan
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: analyze-trends, analyze-competitors, generate-topics, generate-plan' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      {
        error: 'Research operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/automation/research - Get cached research data
export async function GET(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response
    // SECURITY FIX: Use authenticated user ID from session
    const userId = authed.user.id

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    switch (action) {
      case 'trends': {
        const businessGoals = searchParams.get('businessGoals')?.split(',') || ['traffic']
        const trends = await researchEngine.analyzeTrends(businessGoals)
        return NextResponse.json({
          success: true,
          data: trends
        })
      }

      case 'competitors': {
        const competitors = await researchEngine.analyzeCompetitors(userId)
        return NextResponse.json({
          success: true,
          data: competitors
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: trends, competitors' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      {
        error: 'Research operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
