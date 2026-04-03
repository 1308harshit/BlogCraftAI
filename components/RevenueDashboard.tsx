'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  UsersIcon, 
  TrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface RevenueMetrics {
  realTimeRevenue: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  customerLifetimeValue: number
  customerAcquisitionCost: number
  churnRate: number
  netRevenueRetention: number
  grossMargin: number
  contentRevenue?: number
  affiliateRevenue?: number
  conversionRate?: number
  revenuePerContent?: number
}

interface CustomerMetrics {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  churnedCustomers: number
  upgradedCustomers: number
  trialCustomers: number
}

interface ChurnPrediction {
  userId: string
  userEmail: string
  churnProbability: number
  riskFactors: string[]
  daysUntilChurn: number
}

interface BusinessHealth {
  score: number
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

export default function RevenueDashboard() {
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null)
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null)
  const [churnPredictions, setChurnPredictions] = useState<ChurnPrediction[]>([])
  const [businessHealth, setBusinessHealth] = useState<BusinessHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadDashboardData()
    
    // Update real-time revenue every 30 seconds
    const interval = setInterval(() => {
      updateRealTimeRevenue()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulate API calls - in production, these would be real API endpoints
      const [revenue, customers, churn, health] = await Promise.all([
        simulateRevenueMetrics(),
        simulateCustomerMetrics(),
        simulateChurnPredictions(),
        simulateBusinessHealth()
      ])

      setRevenueMetrics(revenue)
      setCustomerMetrics(customers)
      setChurnPredictions(churn)
      setBusinessHealth(health)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRealTimeRevenue = async () => {
    if (revenueMetrics) {
      const newRevenue = revenueMetrics.realTimeRevenue + (Math.random() * 1000)
      setRevenueMetrics({
        ...revenueMetrics,
        realTimeRevenue: newRevenue
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getChurnRiskColor = (probability: number) => {
    if (probability > 0.7) return 'text-red-600 bg-red-100'
    if (probability > 0.4) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time business metrics and insights</p>
        </div>

        {/* Business Health Alert */}
        {businessHealth && (
          <div className={`mb-6 p-4 rounded-lg border ${
            businessHealth.status === 'critical' ? 'border-red-200 bg-red-50' :
            businessHealth.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center">
              {businessHealth.status === 'critical' ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              )}
              <span className="font-semibold">
                Business Health Score: {businessHealth.score}/100 ({businessHealth.status})
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'revenue', name: 'Revenue' },
              { id: 'customers', name: 'Customers' },
              { id: 'churn', name: 'Churn Risk' },
              { id: 'forecasting', name: 'Forecasting' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && revenueMetrics && customerMetrics && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CurrencyRupeeIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Real-Time Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(revenueMetrics.realTimeRevenue)}
                    </p>
                    <p className="text-xs text-green-600">Live updating</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrendingUpIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(revenueMetrics.monthlyRecurringRevenue)}
                    </p>
                    <p className="text-xs text-blue-600">+15% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customerMetrics.totalCustomers}</p>
                    <p className="text-xs text-purple-600">{customerMetrics.newCustomers} new this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Customer LTV</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(revenueMetrics.customerLifetimeValue)}
                    </p>
                    <p className="text-xs text-orange-600">
                      LTV/CAC: {(revenueMetrics.customerLifetimeValue / revenueMetrics.customerAcquisitionCost).toFixed(1)}x
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Recurring Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueMetrics.annualRecurringRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Margin</span>
                    <span className="font-semibold">{formatPercentage(revenueMetrics.grossMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Revenue Retention</span>
                    <span className="font-semibold">{formatPercentage(revenueMetrics.netRevenueRetention)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Churn Rate</span>
                    <span className="font-semibold text-red-600">{formatPercentage(revenueMetrics.churnRate)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Customers</span>
                    <span className="font-semibold">{customerMetrics.activeCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trial Customers</span>
                    <span className="font-semibold">{customerMetrics.trialCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upgraded This Month</span>
                    <span className="font-semibold text-green-600">{customerMetrics.upgradedCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Churned This Month</span>
                    <span className="font-semibold text-red-600">{customerMetrics.churnedCustomers}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Churn Risk Tab */}
        {activeTab === 'churn' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">High Churn Risk Customers</h3>
              <p className="text-sm text-gray-600">Customers predicted to churn in the next 30 days</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Churn Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Until Churn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Factors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {churnPredictions.map((prediction) => (
                    <tr key={prediction.userId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prediction.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getChurnRiskColor(prediction.churnProbability)
                        }`}>
                          {formatPercentage(prediction.churnProbability)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prediction.daysUntilChurn} days
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          {prediction.riskFactors.slice(0, 2).map((factor, index) => (
                            <div key={index} className="text-xs text-gray-600">{factor}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-primary-600 hover:text-primary-900 text-xs">
                          Send Retention Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Business Health Recommendations */}
        {businessHealth && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Health Recommendations</h3>
            <div className="space-y-2">
              {businessHealth.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simulation functions (replace with real API calls in production)
async function simulateRevenueMetrics(): Promise<RevenueMetrics> {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
  
  return {
    realTimeRevenue: 187500 + Math.random() * 10000,
    monthlyRecurringRevenue: 187500,
    annualRecurringRevenue: 2250000,
    customerLifetimeValue: 29980,
    customerAcquisitionCost: 2500,
    churnRate: 0.05,
    netRevenueRetention: 1.15,
    grossMargin: 0.85
  }
}

async function simulateCustomerMetrics(): Promise<CustomerMetrics> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    totalCustomers: 125,
    activeCustomers: 119,
    newCustomers: 18,
    churnedCustomers: 6,
    upgradedCustomers: 12,
    trialCustomers: 23
  }
}

async function simulateChurnPredictions(): Promise<ChurnPrediction[]> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return [
    {
      userId: 'user-1',
      userEmail: 'john.doe@example.com',
      churnProbability: 0.85,
      riskFactors: ['Inactive for 2+ weeks', 'Low content generation', 'Free plan user'],
      daysUntilChurn: 5
    },
    {
      userId: 'user-2',
      userEmail: 'jane.smith@company.com',
      churnProbability: 0.72,
      riskFactors: ['Low engagement', 'No recent logins'],
      daysUntilChurn: 8
    },
    {
      userId: 'user-3',
      userEmail: 'mike.wilson@startup.io',
      churnProbability: 0.68,
      riskFactors: ['Free plan user', 'Low feature usage'],
      daysUntilChurn: 12
    }
  ]
}

async function simulateBusinessHealth(): Promise<BusinessHealth> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return {
    score: 78,
    status: 'good',
    keyMetrics: {
      mrrGrowth: 0.15,
      churnRate: 0.05,
      cac: 2500,
      ltv: 29980,
      burnRate: 50000
    },
    recommendations: [
      'Focus on reducing churn rate through better onboarding',
      'Implement automated email sequences for trial users',
      'A/B test pricing strategies for better conversion',
      'Expand content marketing to reduce CAC',
      'Add more premium features to increase LTV'
    ]
  }
}