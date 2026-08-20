import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { calculateGrowthScore, getDemoGrowthScore, type GrowthScoreInput } from '@/lib/growth-score'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For demo purposes, if no real data, return demo score
    // In production, fetch real data from database
    
    // Try to get real data
    const { data: projects } = await supabase
      .from('projects')
      .select('id, seo_score, status, content')
      .eq('user_id', user.id)

    if (!projects || projects.length === 0) {
      // Return demo score for new users
      const demoScore = getDemoGrowthScore()
      return NextResponse.json({
        ...demoScore,
        isDemo: true,
      })
    }

    // Calculate real growth score
    const publishedCount = projects.filter(p => p.status === 'published').length
    const avgSeoScore = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.seo_score || 0), 0) / projects.length)
      : 0
    
    const avgWordCount = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => {
          const words = (p.content || '').split(/\s+/).filter(Boolean).length
          return sum + words
        }, 0) / projects.length)
      : 0

    const input: GrowthScoreInput = {
      userId: user.id,
      projectCount: projects.length,
      avgSeoScore,
      publishedCount,
      connectedPlatforms: 1, // Would check integrations table
      hasMonetization: false, // Would check monetization settings
      avgWordCount,
      recentActivity: 3, // Would calculate from last activity
      hasAnalytics: false, // Would check integrations
    }

    const growthScore = calculateGrowthScore(input)

    return NextResponse.json({
      ...growthScore,
      isDemo: false,
    })
  } catch (error) {
    console.error('Growth score error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate growth score' },
      { status: 500 }
    )
  }
}
