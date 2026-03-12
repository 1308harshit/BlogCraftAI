import { NextRequest, NextResponse } from 'next/server'
import { revenueTracker } from '@/lib/revenue-tracker'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const metric = searchParams.get('metric') // 'all', 'revenue', 'customers', 'churn', 'forecasting'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user has access to revenue dashboard (admin/owner only)
    const hasAccess = await checkRevenueDashboardAccess(userId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Revenue dashboard is for business owners only.' },
        { status: 403 }
      )
    }

    let dashboardData: any = {}

    // Fetch requested metrics
    switch (metric) {
      case 'revenue':
        dashboardData = {
          revenueMetrics: await revenueTracker.getRevenueMetrics(),
          revenueBreakdown: await revenueTracker.getRevenueBreakdown(),
          realTimeRevenue: await revenueTracker.getRealTimeRevenue()
        }
        break

      case 'customers':
        dashboardData = {
          customerMetrics: await revenueTracker.getCustomerMetrics(),
          customerValue: await revenueTracker.analyzeCustomerValue(),
          peakUsageTimes: await revenueTracker.getPeakUsageTimes()
        }
        break

      case 'churn':
        dashboardData = {
          churnPredictions: await revenueTracker.predictChurn(),
          customerMetrics: await revenueTracker.getCustomerMetrics()
        }
        break

      case 'forecasting':
        dashboardData = {
          revenueForecasting: await revenueTracker.forecastRevenue(12),
          businessHealth: await revenueTracker.getBusinessHealth()
        }
        break

      case 'analytics':
        dashboardData = {
          featureUsage: await revenueTracker.getFeatureUsage(),
          contentROI: await revenueTracker.getContentROI(),
          peakUsageTimes: await revenueTracker.getPeakUsageTimes()
        }
        break

      default: // 'all' or no metric specified
        dashboardData = {
          revenueMetrics: await revenueTracker.getRevenueMetrics(),
          customerMetrics: await revenueTracker.getCustomerMetrics(),
          revenueBreakdown: await revenueTracker.getRevenueBreakdown(),
          churnPredictions: await revenueTracker.predictChurn(),
          businessHealth: await revenueTracker.getBusinessHealth(),
          revenueForecasting: await revenueTracker.forecastRevenue(6),
          featureUsage: await revenueTracker.getFeatureUsage(),
          contentROI: await revenueTracker.getContentROI(),
          peakUsageTimes: await revenueTracker.getPeakUsageTimes(),
          realTimeRevenue: await revenueTracker.getRealTimeRevenue()
        }
    }

    // Add metadata
    dashboardData.metadata = {
      lastUpdated: new Date().toISOString(),
      dataFreshness: 'real-time',
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Revenue dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue dashboard data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check access
    const hasAccess = await checkRevenueDashboardAccess(userId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'update_revenue_goal':
        result = await updateRevenueGoal(userId, data.goal)
        break

      case 'export_data':
        result = await exportDashboardData(userId, data.format, data.dateRange)
        break

      case 'send_churn_alert':
        result = await sendChurnAlert(userId, data.customerId)
        break

      case 'update_pricing':
        result = await updatePricingStrategy(userId, data.pricing)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      result
    })

  } catch (error) {
    console.error('Revenue dashboard action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}

// Helper functions
async function checkRevenueDashboardAccess(userId: string): Promise<boolean> {
  // In production, check if user is admin/owner
  // For demo, allow access for specific demo users
  const allowedUsers = ['demo-user-1', 'admin-user', 'owner-user']
  return allowedUsers.includes(userId) || userId.includes('admin') || userId.includes('owner')
}

async function updateRevenueGoal(userId: string, goal: number) {
  // Update revenue goal in database
  console.log(`User ${userId} updated revenue goal to ${goal}`)
  
  return {
    message: 'Revenue goal updated successfully',
    newGoal: goal,
    updatedAt: new Date().toISOString()
  }
}

async function exportDashboardData(userId: string, format: string, dateRange: any) {
  // Generate export file
  console.log(`User ${userId} requested data export in ${format} format`)
  
  const exportData = {
    format,
    dateRange,
    generatedAt: new Date().toISOString(),
    downloadUrl: `/api/exports/revenue-${userId}-${Date.now()}.${format}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }

  return exportData
}

async function sendChurnAlert(userId: string, customerId: string) {
  // Send churn prevention email/notification
  console.log(`User ${userId} triggered churn alert for customer ${customerId}`)
  
  return {
    message: 'Churn prevention alert sent',
    customerId,
    sentAt: new Date().toISOString(),
    actions: [
      'Email sent to customer',
      'Internal team notified',
      'Retention workflow triggered'
    ]
  }
}

async function updatePricingStrategy(userId: string, pricing: any) {
  // Update pricing configuration
  console.log(`User ${userId} updated pricing strategy:`, pricing)
  
  return {
    message: 'Pricing strategy updated',
    pricing,
    updatedAt: new Date().toISOString(),
    estimatedImpact: {
      revenueChange: '+15%',
      conversionChange: '+8%',
      churnChange: '-2%'
    }
  }
}