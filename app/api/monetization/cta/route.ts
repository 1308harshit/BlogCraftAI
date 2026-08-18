// CTA Generation API Endpoint
// Provides REST API access to CTA generation, optimization, and A/B testing

import { NextRequest, NextResponse } from 'next/server'
import { ctaGenerator } from '@/lib/monetization'
import { requireUser } from '@/lib/auth/require-user'

// POST /api/monetization/cta - Generate new CTA
export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'generate':
        return await handleGenerate(data)
      case 'optimize':
        return await handleOptimize(data)
      case 'createTest':
        return await handleCreateTest(data)
      case 'analyzeTest':
        return await handleAnalyzeTest(data)
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: generate, optimize, createTest, or analyzeTest' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('CTA API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleGenerate(data: any) {
  const { content, context, goal, targetAudience, brandVoice } = data

  // Validate required fields
  if (!content || !context || !goal) {
    return NextResponse.json(
      { error: 'Missing required fields: content, context, goal' },
      { status: 400 }
    )
  }

  // Generate CTA
  const cta = await ctaGenerator.generateCTA({
    content,
    context,
    goal,
    targetAudience,
    brandVoice: brandVoice || 'professional'
  })

  return NextResponse.json({
    success: true,
    cta
  })
}

async function handleOptimize(data: any) {
  const { cta, performanceData } = data

  // Validate required fields
  if (!cta || !performanceData) {
    return NextResponse.json(
      { error: 'Missing required fields: cta, performanceData' },
      { status: 400 }
    )
  }

  // Optimize CTA
  const optimized = await ctaGenerator.optimizeCTA(cta, performanceData)

  return NextResponse.json({
    success: true,
    optimized
  })
}

async function handleCreateTest(data: any) {
  const { cta, variationCount } = data

  // Validate required fields
  if (!cta) {
    return NextResponse.json(
      { error: 'Missing required field: cta' },
      { status: 400 }
    )
  }

  // Create A/B test
  const testConfig = await ctaGenerator.createABTest(
    cta,
    variationCount || 2
  )

  return NextResponse.json({
    success: true,
    testConfig
  })
}

async function handleAnalyzeTest(data: any) {
  const { testConfig, results } = data

  // Validate required fields
  if (!testConfig || !results) {
    return NextResponse.json(
      { error: 'Missing required fields: testConfig, results' },
      { status: 400 }
    )
  }

  // Analyze test results
  const analysis = await ctaGenerator.analyzeABTest(testConfig, results)

  return NextResponse.json({
    success: true,
    analysis
  })
}

// GET /api/monetization/cta?contentId=xxx - Get CTA performance
export async function GET(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: contentId' },
        { status: 400 }
      )
    }

    // In production, fetch from database
    // For now, return mock data
    return NextResponse.json({
      success: true,
      performance: {
        contentId,
        impressions: 1000,
        clicks: 80,
        conversions: 20,
        clickThroughRate: 8.0,
        conversionRate: 2.0,
        revenue: 1000,
        lastUpdated: new Date()
      }
    })
  } catch (error: any) {
    console.error('CTA API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
