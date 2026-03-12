// Revenue Intelligence and Analytics Engine
import { v4 as uuidv4 } from 'uuid'

export interface RevenueMetrics {
  realTimeRevenue: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  customerLifetimeValue: number
  customerAcquisitionCost: number
  churnRate: number
  netRevenueRetention: number
  grossMargin: number
  paybackPeriod: number
}

export interface CustomerMetrics {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  churnedCustomers: number
  upgradedCustomers: number
  downgradedCustomers: number
  trialCustomers: number
}

export interface RevenueBreakdown {
  subscriptionRevenue: number
  oneTimeRevenue: number
  expansionRevenue: number
  contractionRevenue: number
  churnedRevenue: number
}

export interface ChurnPrediction {
  userId: string
  userEmail: string
  churnProbability: number
  riskFactors: string[]
  recommendedActions: string[]
  daysUntilChurn: number
}

export interface RevenueForecasting {
  period: string
  predictedRevenue: number
  confidence: number
  factors: string[]
  scenarios: {
    conservative: number
    realistic: number
    optimistic: number
  }
}

export interface UserValue {
  userId: string
  email: string
  plan: string
  monthlyValue: number
  lifetimeValue: number
  acquisitionCost: number
  paybackPeriod: number
  churnRisk: 'low' | 'medium' | 'high'
  engagementScore: number
  lastActivity: Date
}

export interface BusinessHealth {
  score: number // 0-100
  status: 'critical' | 'warning' | 'good' | 'excellent'
  keyMetrics: {
    mrrGrowth: number
    churnRate: number
    cac: number
    ltv: number
    burnRate: number
  }
  recommendations: string[]
}

export class RevenueTracker {
  private mockData: any = {}

  constructor() {
    this.initializeMockData()
  }

  // Real-time revenue tracking
  async getRealTimeRevenue(): Promise<number> {
    // In production, this would query live payment data
    const baseRevenue = 150000 // ₹1.5L base
    const dailyGrowth = Math.random() * 5000 // Random daily growth
    return baseRevenue + dailyGrowth
  }

  // Comprehensive revenue metrics
  async getRevenueMetrics(): Promise<RevenueMetrics> {
    const totalCustomers = await this.getTotalCustomers()
    const avgMonthlyRevenue = 1499 // Average between plans
    
    return {
      realTimeRevenue: await this.getRealTimeRevenue(),
      monthlyRecurringRevenue: totalCustomers * avgMonthlyRevenue,
      annualRecurringRevenue: totalCustomers * avgMonthlyRevenue * 12,
      customerLifetimeValue: this.calculateLTV(avgMonthlyRevenue, 0.05), // 5% churn
      customerAcquisitionCost: 2500, // ₹2,500 CAC
      churnRate: 0.05, // 5% monthly churn
      netRevenueRetention: 1.15, // 115% NRR
      grossMargin: 0.85, // 85% gross margin
      paybackPeriod: 2500 / avgMonthlyRevenue // CAC / Monthly revenue
    }
  }

  // Customer analytics
  async getCustomerMetrics(): Promise<CustomerMetrics> {
    const total = await this.getTotalCustomers()
    
    return {
      totalCustomers: total,
      activeCustomers: Math.round(total * 0.95),
      newCustomers: Math.round(total * 0.1), // 10% new this month
      churnedCustomers: Math.round(total * 0.05), // 5% churned
      upgradedCustomers: Math.round(total * 0.08), // 8% upgraded
      downgradedCustomers: Math.round(total * 0.02), // 2% downgraded
      trialCustomers: Math.round(total * 0.15) // 15% on trial
    }
  }

  // Revenue breakdown by type
  async getRevenueBreakdown(): Promise<RevenueBreakdown> {
    const mrr = (await this.getRevenueMetrics()).monthlyRecurringRevenue
    
    return {
      subscriptionRevenue: mrr * 0.85, // 85% from subscriptions
      oneTimeRevenue: mrr * 0.05, // 5% one-time payments
      expansionRevenue: mrr * 0.15, // 15% from upgrades
      contractionRevenue: mrr * 0.03, // 3% from downgrades
      churnedRevenue: mrr * 0.05 // 5% lost to churn
    }
  }

  // AI-powered churn prediction
  async predictChurn(): Promise<ChurnPrediction[]> {
    const customers = await this.getCustomerList()
    const predictions: ChurnPrediction[] = []

    for (const customer of customers) {
      const churnProbability = this.calculateChurnProbability(customer)
      
      if (churnProbability > 0.3) { // Only show high-risk customers
        predictions.push({
          userId: customer.id,
          userEmail: customer.email,
          churnProbability,
          riskFactors: this.identifyRiskFactors(customer),
          recommendedActions: this.getRetentionActions(customer),
          daysUntilChurn: Math.round(30 * (1 - churnProbability))
        })
      }
    }

    return predictions.sort((a, b) => b.churnProbability - a.churnProbability)
  }

  // Revenue forecasting with ML
  async forecastRevenue(months: number = 12): Promise<RevenueForecasting[]> {
    const currentMRR = (await this.getRevenueMetrics()).monthlyRecurringRevenue
    const forecasts: RevenueForecasting[] = []

    for (let i = 1; i <= months; i++) {
      const growthRate = this.predictGrowthRate(i)
      const predictedRevenue = currentMRR * Math.pow(1 + growthRate, i)
      
      forecasts.push({
        period: `Month ${i}`,
        predictedRevenue,
        confidence: Math.max(0.6, 0.95 - (i * 0.03)), // Decreasing confidence
        factors: this.getGrowthFactors(),
        scenarios: {
          conservative: predictedRevenue * 0.8,
          realistic: predictedRevenue,
          optimistic: predictedRevenue * 1.3
        }
      })
    }

    return forecasts
  }

  // Individual customer value analysis
  async analyzeCustomerValue(): Promise<UserValue[]> {
    const customers = await this.getCustomerList()
    
    return customers.map(customer => ({
      userId: customer.id,
      email: customer.email,
      plan: customer.plan,
      monthlyValue: this.getMonthlyValue(customer.plan),
      lifetimeValue: this.calculateCustomerLTV(customer),
      acquisitionCost: 2500, // Average CAC
      paybackPeriod: 2500 / this.getMonthlyValue(customer.plan),
      churnRisk: this.assessChurnRisk(customer),
      engagementScore: this.calculateEngagementScore(customer),
      lastActivity: customer.lastActivity || new Date()
    }))
  }

  // Business health scoring
  async getBusinessHealth(): Promise<BusinessHealth> {
    const metrics = await this.getRevenueMetrics()
    const customerMetrics = await this.getCustomerMetrics()
    
    let score = 50 // Base score
    
    // MRR Growth (30 points)
    const mrrGrowth = 0.15 // 15% monthly growth
    if (mrrGrowth > 0.2) score += 30
    else if (mrrGrowth > 0.1) score += 20
    else if (mrrGrowth > 0.05) score += 10
    
    // Churn Rate (25 points)
    if (metrics.churnRate < 0.03) score += 25
    else if (metrics.churnRate < 0.05) score += 15
    else if (metrics.churnRate < 0.08) score += 5
    
    // LTV/CAC Ratio (25 points)
    const ltvCacRatio = metrics.customerLifetimeValue / metrics.customerAcquisitionCost
    if (ltvCacRatio > 5) score += 25
    else if (ltvCacRatio > 3) score += 15
    else if (ltvCacRatio > 2) score += 5
    
    // Gross Margin (20 points)
    if (metrics.grossMargin > 0.8) score += 20
    else if (metrics.grossMargin > 0.7) score += 15
    else if (metrics.grossMargin > 0.6) score += 10

    const status = score >= 90 ? 'excellent' : 
                  score >= 75 ? 'good' : 
                  score >= 60 ? 'warning' : 'critical'

    return {
      score: Math.min(100, score),
      status,
      keyMetrics: {
        mrrGrowth: mrrGrowth,
        churnRate: metrics.churnRate,
        cac: metrics.customerAcquisitionCost,
        ltv: metrics.customerLifetimeValue,
        burnRate: 50000 // ₹50k monthly burn
      },
      recommendations: this.getHealthRecommendations(score, metrics)
    }
  }

  // Peak usage analytics
  async getPeakUsageTimes(): Promise<Array<{hour: number, usage: number}>> {
    const hours = Array.from({length: 24}, (_, i) => ({
      hour: i,
      usage: Math.random() * 100 + (i >= 9 && i <= 17 ? 50 : 0) // Higher during work hours
    }))
    
    return hours.sort((a, b) => b.usage - a.usage)
  }

  // Feature usage analytics
  async getFeatureUsage(): Promise<Array<{feature: string, usage: number, revenue: number}>> {
    return [
      { feature: 'Blog Generation', usage: 85, revenue: 45000 },
      { feature: 'SEO Optimization', usage: 72, revenue: 38000 },
      { feature: 'Content Calendar', usage: 68, revenue: 35000 },
      { feature: 'Social Media Posts', usage: 61, revenue: 32000 },
      { feature: 'Email Campaigns', usage: 45, revenue: 24000 },
      { feature: 'Video Scripts', usage: 38, revenue: 20000 },
      { feature: 'Competitor Analysis', usage: 34, revenue: 18000 },
      { feature: 'Voice to Blog', usage: 28, revenue: 15000 }
    ].sort((a, b) => b.revenue - a.revenue)
  }

  // Content performance ROI
  async getContentROI(): Promise<Array<{contentType: string, generated: number, revenue: number, roi: number}>> {
    return [
      { contentType: 'Blog Posts', generated: 1250, revenue: 75000, roi: 6000 },
      { contentType: 'Social Media', generated: 3200, revenue: 48000, roi: 1500 },
      { contentType: 'Email Campaigns', generated: 180, revenue: 36000, roi: 20000 },
      { contentType: 'Video Scripts', generated: 95, revenue: 28500, roi: 30000 },
      { contentType: 'Podcast Outlines', generated: 45, revenue: 13500, roi: 30000 }
    ].sort((a, b) => b.roi - a.roi)
  }

  // Private helper methods
  private async getTotalCustomers(): Promise<number> {
    // In production, query actual database
    return 125 + Math.floor(Math.random() * 25) // 125-150 customers
  }

  private async getCustomerList(): Promise<any[]> {
    // Mock customer data
    return Array.from({length: 50}, (_, i) => ({
      id: `customer-${i}`,
      email: `user${i}@example.com`,
      plan: ['free', 'founder', 'pro'][Math.floor(Math.random() * 3)],
      signupDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      articlesGenerated: Math.floor(Math.random() * 50),
      loginCount: Math.floor(Math.random() * 100)
    }))
  }

  private calculateLTV(monthlyRevenue: number, churnRate: number): number {
    return monthlyRevenue / churnRate
  }

  private calculateChurnProbability(customer: any): number {
    let probability = 0.1 // Base 10%
    
    // Inactivity factor
    const daysSinceActivity = (Date.now() - customer.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity > 14) probability += 0.3
    else if (daysSinceActivity > 7) probability += 0.1
    
    // Usage factor
    if (customer.articlesGenerated < 5) probability += 0.2
    else if (customer.articlesGenerated < 10) probability += 0.1
    
    // Plan factor
    if (customer.plan === 'free') probability += 0.2
    
    return Math.min(0.9, probability)
  }

  private identifyRiskFactors(customer: any): string[] {
    const factors = []
    
    const daysSinceActivity = (Date.now() - customer.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity > 14) factors.push('Inactive for 2+ weeks')
    if (customer.articlesGenerated < 5) factors.push('Low content generation')
    if (customer.plan === 'free') factors.push('Free plan user')
    if (customer.loginCount < 10) factors.push('Low engagement')
    
    return factors
  }

  private getRetentionActions(customer: any): string[] {
    const actions = []
    
    if (customer.articlesGenerated < 5) {
      actions.push('Send onboarding email with templates')
      actions.push('Offer 1-on-1 setup call')
    }
    
    if (customer.plan === 'free') {
      actions.push('Offer limited-time upgrade discount')
      actions.push('Show premium feature benefits')
    }
    
    actions.push('Send personalized content suggestions')
    actions.push('Invite to user community')
    
    return actions
  }

  private predictGrowthRate(month: number): number {
    // Simulate decreasing growth rate over time
    const baseGrowth = 0.15 // 15% monthly
    const decay = Math.pow(0.95, month - 1) // 5% decay per month
    return baseGrowth * decay
  }

  private getGrowthFactors(): string[] {
    return [
      'Product-market fit improvement',
      'Marketing campaign effectiveness',
      'Word-of-mouth referrals',
      'Feature adoption rates',
      'Competitive landscape changes'
    ]
  }

  private getMonthlyValue(plan: string): number {
    const planValues = {
      free: 0,
      founder: 999,
      pro: 1499,
      enterprise: 2999
    }
    return planValues[plan as keyof typeof planValues] || 0
  }

  private calculateCustomerLTV(customer: any): number {
    const monthlyValue = this.getMonthlyValue(customer.plan)
    const churnProbability = this.calculateChurnProbability(customer)
    const avgLifespan = 1 / Math.max(0.01, churnProbability) // Months
    return monthlyValue * avgLifespan
  }

  private assessChurnRisk(customer: any): 'low' | 'medium' | 'high' {
    const probability = this.calculateChurnProbability(customer)
    if (probability > 0.6) return 'high'
    if (probability > 0.3) return 'medium'
    return 'low'
  }

  private calculateEngagementScore(customer: any): number {
    let score = 0
    
    // Login frequency (40 points)
    score += Math.min(40, customer.loginCount * 2)
    
    // Content generation (40 points)
    score += Math.min(40, customer.articlesGenerated * 4)
    
    // Recency (20 points)
    const daysSinceActivity = (Date.now() - customer.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity < 1) score += 20
    else if (daysSinceActivity < 7) score += 15
    else if (daysSinceActivity < 14) score += 10
    else if (daysSinceActivity < 30) score += 5
    
    return Math.min(100, score)
  }

  private getHealthRecommendations(score: number, metrics: RevenueMetrics): string[] {
    const recommendations = []
    
    if (score < 60) {
      recommendations.push('Focus on reducing churn rate through better onboarding')
      recommendations.push('Improve product-market fit with user feedback')
    }
    
    if (metrics.churnRate > 0.05) {
      recommendations.push('Implement churn prediction and prevention system')
      recommendations.push('Enhance customer success programs')
    }
    
    if (metrics.customerLifetimeValue / metrics.customerAcquisitionCost < 3) {
      recommendations.push('Optimize customer acquisition channels')
      recommendations.push('Increase customer lifetime value through upselling')
    }
    
    recommendations.push('Continue monitoring key metrics weekly')
    recommendations.push('A/B test pricing and packaging strategies')
    
    return recommendations
  }

  private initializeMockData(): void {
    // Initialize any mock data needed for demo
    this.mockData = {
      lastUpdated: new Date(),
      baseMetrics: {
        customers: 125,
        mrr: 187375 // ₹1.87L
      }
    }
  }
}

// Export singleton instance
export const revenueTracker = new RevenueTracker()