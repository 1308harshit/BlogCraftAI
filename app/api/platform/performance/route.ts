// API endpoint for cross-platform performance tracking
import { NextRequest, NextResponse } from 'next/server'
import { performanceTracker } from '@/lib/platform/performance-tracker'
import { PlatformContent } from '@/lib/platform/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contentId, platformContents, timeRange, platform, platformContentId } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'collect_metrics': {
        if (!contentId || !platformContents) {
          return NextResponse.json(
            { error: 'contentId and platformContents are required' },
            { status: 400 }
          )
        }

        const metrics = await performanceTracker.collectCrossPlatformMetrics(
          contentId,
          platformContents as PlatformContent[]
        )

        return NextResponse.json({ success: true, metrics })
      }

      case 'generate_report': {
        if (!contentId || !platformContents) {
          return NextResponse.json(
            { error: 'contentId and platformContents are required' },
            { status: 400 }
          )
        }

        const range = timeRange || {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date()
        }

        const report = await performanceTracker.generateConsolidatedReport(
          contentId,
          platformContents as PlatformContent[],
          range
        )

        return NextResponse.json({ success: true, report })
      }

      case 'get_insights': {
        if (!contentId || !platformContents) {
          return NextResponse.json(
            { error: 'contentId and platformContents are required' },
            { status: 400 }
          )
        }

        const metrics = await performanceTracker.collectCrossPlatformMetrics(
          contentId,
          platformContents as PlatformContent[]
        )

        const insights = await performanceTracker.generateInsights(contentId, metrics)

        return NextResponse.json({ success: true, insights })
      }

      case 'collect_platform_metrics': {
        if (!contentId || !platform || !platformContentId) {
          return NextResponse.json(
            { error: 'contentId, platform, and platformContentId are required' },
            { status: 400 }
          )
        }

        const platformMetrics = await performanceTracker.collectPlatformMetrics(
          contentId,
          platform,
          platformContentId
        )

        return NextResponse.json({ success: true, metrics: platformMetrics })
      }

      case 'get_rate_limits': {
        if (!platform) {
          return NextResponse.json(
            { error: 'platform is required' },
            { status: 400 }
          )
        }

        const rateLimits = performanceTracker.getRateLimitInfo(platform)

        return NextResponse.json({ success: true, rateLimits })
      }

      case 'get_cached_metrics': {
        if (!contentId) {
          return NextResponse.json(
            { error: 'contentId is required' },
            { status: 400 }
          )
        }

        const cachedMetrics = await performanceTracker.getCachedMetrics(contentId)

        return NextResponse.json({ 
          success: true, 
          metrics: cachedMetrics,
          cached: !!cachedMetrics
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Performance tracking API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process performance tracking request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId is required' },
        { status: 400 }
      )
    }

    // Get cached metrics
    const cachedMetrics = await performanceTracker.getCachedMetrics(contentId)

    if (!cachedMetrics) {
      return NextResponse.json(
        { error: 'No cached metrics found for this content' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      metrics: cachedMetrics,
      cached: true
    })
  } catch (error) {
    console.error('Performance tracking GET error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve performance metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
