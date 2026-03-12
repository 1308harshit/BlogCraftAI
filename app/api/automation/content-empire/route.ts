import { NextRequest, NextResponse } from 'next/server'
import { automationWorkflows } from '@/lib/automation-workflows'
import { revenueTracker } from '@/lib/revenue-tracker'

export async function POST(request: NextRequest) {
  try {
    const { userId, prompt, userPlan = 'free' } = await request.json()

    if (!userId || !prompt) {
      return NextResponse.json(
        { error: 'User ID and automation prompt are required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!prompt.topic || !prompt.targetAudience) {
      return NextResponse.json(
        { error: 'Topic and target audience are required' },
        { status: 400 }
      )
    }

    // Check user plan limits
    const planLimits = {
      free: { maxDuration: 7, maxPlatforms: 2 },
      founder: { maxDuration: 90, maxPlatforms: 8 },
      pro: { maxDuration: 90, maxPlatforms: 8 },
      enterprise: { maxDuration: 365, maxPlatforms: 20 }
    }

    const limits = planLimits[userPlan as keyof typeof planLimits] || planLimits.free

    if (prompt.duration > limits.maxDuration) {
      return NextResponse.json(
        { 
          error: `Duration limited to ${limits.maxDuration} days for ${userPlan} plan`,
          upgrade: userPlan === 'free' ? 'Upgrade to Pro for longer campaigns' : null
        },
        { status: 403 }
      )
    }

    if (prompt.platforms.length > limits.maxPlatforms) {
      return NextResponse.json(
        { 
          error: `Platform limit is ${limits.maxPlatforms} for ${userPlan} plan`,
          upgrade: userPlan === 'free' ? 'Upgrade to Pro for more platforms' : null
        },
        { status: 403 }
      )
    }

    // Generate content empire
    console.log(`Generating content empire for user ${userId}...`)
    const contentCalendar = await automationWorkflows.generateContentEmpire(
      prompt,
      userId,
      userPlan
    )

    // Track usage for analytics
    await trackAutomationUsage(userId, 'content-empire', contentCalendar.totalPieces)

    return NextResponse.json({
      success: true,
      calendar: contentCalendar,
      message: `Generated ${contentCalendar.totalPieces} pieces of content for ${prompt.duration} days`
    })

  } catch (error) {
    console.error('Content empire generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content empire' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const calendarId = searchParams.get('calendarId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // In production, fetch from database
    // For now, return mock data
    const calendars = await getMockContentCalendars(userId, calendarId)

    return NextResponse.json({ calendars })

  } catch (error) {
    console.error('Error fetching content calendars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content calendars' },
      { status: 500 }
    )
  }
}

// Helper functions
async function trackAutomationUsage(userId: string, workflowType: string, contentCount: number) {
  // Track automation usage for analytics
  console.log(`User ${userId} used ${workflowType} workflow, generated ${contentCount} pieces`)
  
  // In production, save to analytics database
  // await analytics.track({
  //   userId,
  //   event: 'automation_used',
  //   properties: {
  //     workflowType,
  //     contentCount,
  //     timestamp: new Date()
  //   }
  // })
}

async function getMockContentCalendars(userId: string, calendarId?: string | null) {
  // Mock data - in production, query from database
  const mockCalendars = [
    {
      id: 'calendar-1',
      userId,
      name: 'AI Tools Content Campaign',
      status: 'completed',
      totalPieces: 45,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      prompt: {
        topic: 'AI tools for small businesses',
        targetAudience: 'Small business owners',
        duration: 30
      }
    },
    {
      id: 'calendar-2',
      userId,
      name: 'Marketing Automation Series',
      status: 'generating',
      totalPieces: 32,
      progress: 75,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      prompt: {
        topic: 'Marketing automation strategies',
        targetAudience: 'Marketing professionals',
        duration: 21
      }
    }
  ]

  if (calendarId) {
    return mockCalendars.filter(cal => cal.id === calendarId)
  }

  return mockCalendars
}