import { NextRequest, NextResponse } from 'next/server'

interface PublishConfig {
  platform: string
  apiKey?: string
  siteUrl?: string
  username?: string
  scheduleTime?: string
}

async function publishToWordPress(content: string, config: PublishConfig) {
  // WordPress REST API integration
  const wpPost = {
    title: content.split('\n')[0].replace('#', '').trim(),
    content: content,
    status: config.scheduleTime ? 'future' : 'publish',
    date: config.scheduleTime || new Date().toISOString()
  }

  // In production, you'd make actual API calls
  return {
    success: true,
    url: `${config.siteUrl}/blog/new-post`,
    platform: 'WordPress',
    scheduledFor: config.scheduleTime
  }
}

async function publishToMedium(content: string, config: PublishConfig) {
  // Medium API integration
  return {
    success: true,
    url: 'https://medium.com/@user/new-post',
    platform: 'Medium',
    scheduledFor: config.scheduleTime
  }
}

async function publishToLinkedIn(content: string, config: PublishConfig) {
  // LinkedIn API integration
  return {
    success: true,
    url: 'https://linkedin.com/pulse/new-post',
    platform: 'LinkedIn',
    scheduledFor: config.scheduleTime
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, configs } = await request.json()

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    const results = []

    for (const platform of platforms) {
      const config = configs[platform] || {}
      
      try {
        let result
        switch (platform) {
          case 'wordpress':
            result = await publishToWordPress(content, config)
            break
          case 'medium':
            result = await publishToMedium(content, config)
            break
          case 'linkedin':
            result = await publishToLinkedIn(content, config)
            break
          default:
            result = {
              success: false,
              error: `Unsupported platform: ${platform}`
            }
        }
        
        results.push({ platform, ...result })
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: `Failed to publish to ${platform}`
        })
      }
    }

    // Demo mode response
    const demoResults = platforms.map((platform: string) => ({
      platform,
      success: true,
      url: `https://${platform}.com/your-published-post`,
      scheduledFor: configs[platform]?.scheduleTime,
      note: 'Demo mode - configure API keys for real publishing'
    }))

    return NextResponse.json({
      results: demoResults,
      totalPublished: demoResults.filter(r => r.success).length,
      totalFailed: demoResults.filter(r => !r.success).length
    })
  } catch (error) {
    console.error('Auto-publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    )
  }
}