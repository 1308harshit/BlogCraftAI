// Monetization Performance API
// Endpoints for analyzing and optimizing monetization element performance

import { NextRequest, NextResponse } from 'next/server'
import { monetizationPerformanceOptimizer } from '@/lib/monetization/performance-optimizer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/monetization/performance
 * Analyze monetization element performance for content
 * 
 * Query params:
 * - contentId: Content ID to analyze
 * - action: 'analyze' | 'attribution' | 'top-performers'
 * - userId: User ID (for top-performers)
 * - limit: Number of results (for top-performers)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const action = searchParams.get('action') || 'analyze'
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (action === 'top-performers') {
      if (!userId) {
        return NextResponse.json(
          { error: 'userId is required for top-performers action' },
          { status: 400 }
        )
      }

      const topPerformers = await monetizationPerformanceOptimizer.getTopPerformingElements(userId, limit)
      
      return NextResponse.json({
        success: true,
        data: topPerformers
      })
    }

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId is required' },
        { status: 400 }
      )
    }

    if (action === 'attribution') {
      const attribution = await monetizationPerformanceOptimizer.attributeRevenue(contentId)
      
      return NextResponse.json({
        success: true,
        data: attribution
      })
    }

    // Default: analyze performance
    const performance = await monetizationPerformanceOptimizer.analyzeElementPerformance(contentId)
    
    return NextResponse.json({
      success: true,
      data: performance
    })
  } catch (error: any) {
    console.error('Monetization performance analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze monetization performance',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/monetization/performance
 * Optimize monetization strategy or create performance test
 * 
 * Body:
 * - action: 'optimize' | 'test'
 * - contentId: Content ID
 * - performanceData: Performance data (for optimize)
 * - testType: Test type (for test)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contentId, performanceData, testType, testId } = body

    if (!contentId && !testId) {
      return NextResponse.json(
        { error: 'contentId or testId is required' },
        { status: 400 }
      )
    }

    if (action === 'optimize') {
      if (!performanceData) {
        return NextResponse.json(
          { error: 'performanceData is required for optimization' },
          { status: 400 }
        )
      }

      const optimization = await monetizationPerformanceOptimizer.optimizeStrategy(
        contentId,
        performanceData
      )
      
      return NextResponse.json({
        success: true,
        data: optimization
      })
    }

    if (action === 'test') {
      if (!testType) {
        return NextResponse.json(
          { error: 'testType is required for creating test' },
          { status: 400 }
        )
      }

      const test = await monetizationPerformanceOptimizer.createPerformanceTest(
        contentId,
        testType
      )
      
      return NextResponse.json({
        success: true,
        data: test
      })
    }

    if (action === 'analyze-test') {
      if (!testId) {
        return NextResponse.json(
          { error: 'testId is required for analyzing test' },
          { status: 400 }
        )
      }

      const results = await monetizationPerformanceOptimizer.analyzeTestResults(testId)
      
      return NextResponse.json({
        success: true,
        data: results
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "optimize", "test", or "analyze-test"' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Monetization performance optimization error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to optimize monetization performance',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
