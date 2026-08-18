// Funnel Creator API Endpoint
// API for creating sales funnels, lead magnets, and email sequences

import { NextRequest, NextResponse } from 'next/server'
import { funnelCreator } from '@/lib/monetization/funnel-creator'
import type { FunnelCreationRequest } from '@/lib/monetization/funnel-creator'
import { requireUser } from '@/lib/auth/require-user'

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const body = await request.json()
    const { action, ...params } = body

    switch (action) {
      case 'create_funnel': {
        const funnelRequest: FunnelCreationRequest = {
          content: params.content,
          context: params.context,
          businessGoal: params.businessGoal,
          targetAudience: params.targetAudience,
          brandVoice: params.brandVoice
        }

        const funnel = await funnelCreator.createFunnel(funnelRequest)

        return NextResponse.json({
          success: true,
          funnel
        })
      }

      case 'generate_lead_magnet': {
        const leadMagnet = await funnelCreator.generateLeadMagnet(
          params.content,
          params.topic,
          params.targetAudience
        )

        return NextResponse.json({
          success: true,
          leadMagnet
        })
      }

      case 'create_email_sequence': {
        const sequence = await funnelCreator.createEmailSequence(
          params.topic,
          params.leadMagnet,
          params.businessGoal,
          params.brandVoice
        )

        return NextResponse.json({
          success: true,
          sequence
        })
      }

      case 'optimize_funnel': {
        const optimizedFunnel = await funnelCreator.optimizeFunnel(
          params.funnelId,
          params.performanceData
        )

        return NextResponse.json({
          success: true,
          optimizedFunnel
        })
      }

      case 'track_metrics': {
        const metrics = await funnelCreator.trackFunnelMetrics(params.funnelId)

        return NextResponse.json({
          success: true,
          metrics
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Supported actions: create_funnel, generate_lead_magnet, create_email_sequence, optimize_funnel, track_metrics'
          },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Funnel API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process funnel request'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // SECURITY FIX: Require authentication
    const authed = await requireUser()
    if (!authed.ok) return authed.response

    const { searchParams } = new URL(request.url)
    const funnelId = searchParams.get('funnelId')

    if (!funnelId) {
      return NextResponse.json(
        {
          success: false,
          error: 'funnelId parameter is required'
        },
        { status: 400 }
      )
    }

    const metrics = await funnelCreator.trackFunnelMetrics(funnelId)

    return NextResponse.json({
      success: true,
      metrics
    })
  } catch (error: any) {
    console.error('Funnel metrics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch funnel metrics'
      },
      { status: 500 }
    )
  }
}
