'use client'

import { useState } from 'react'
import AutomationStudio from '@/components/AutomationStudio'
import RevenueDashboard from '@/components/RevenueDashboard'
import { 
  CogIcon, 
  ChartBarIcon, 
  RocketLaunchIcon,
  SparklesIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('automation')

  const tabs = [
    { 
      id: 'automation', 
      name: 'Automation Studio', 
      icon: CogIcon,
      description: 'AI-powered content automation workflows'
    },
    { 
      id: 'revenue', 
      name: 'Revenue Intelligence', 
      icon: ChartBarIcon,
      description: 'Real-time business metrics and insights'
    },
    { 
      id: 'viral-lab', 
      name: 'Viral Prediction Lab', 
      icon: RocketLaunchIcon,
      description: 'Test content virality before publishing'
    },
    { 
      id: 'ai-assistant', 
      name: 'AI Writing Assistant', 
      icon: SparklesIcon,
      description: 'Real-time writing companion with AI'
    },
    { 
      id: 'content-battles', 
      name: 'Content Battles', 
      icon: BoltIcon,
      description: 'Compete in content creation challenges'
    },
    { 
      id: 'analytics', 
      name: 'Performance Analytics', 
      icon: EyeIcon,
      description: 'Deep content performance insights'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                BlogCraft AI Studio
              </h1>
              <p className="text-xl text-gray-600">
                Next-generation AI content platform with full automation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'automation' && <AutomationStudio />}
        
        {activeTab === 'revenue' && <RevenueDashboard />}
        
        {activeTab === 'viral-lab' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <RocketLaunchIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Viral Prediction Lab</h2>
              <p className="text-gray-600 mb-6">
                Test your content's viral potential with AI-powered scoring before publishing.
              </p>
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Virality Score (1-100)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Engagement Predictions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Optimal Posting Times</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Hashtag Recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>Audience Targeting</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span>A/B Testing Integration</span>
                  </div>
                </div>
              </div>
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Join Beta Waitlist
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <SparklesIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Writing Assistant 2.0</h2>
              <p className="text-gray-600 mb-6">
                Real-time writing companion with advanced AI capabilities and personality.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Live Writing Suggestions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Tone Adjustment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Real-time Fact Checking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Plagiarism Detection</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>SEO Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Readability Scoring</span>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Try Beta Version
              </button>
            </div>
          </div>
        )}

        {activeTab === 'content-battles' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <BoltIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Battles Arena</h2>
              <p className="text-gray-600 mb-6">
                Compete with other creators in AI-powered content creation challenges.
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Battle Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Weekly Challenges</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Community Voting</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>AI-Powered Scoring</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Leaderboards</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Prizes & Recognition</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Viral Content Showcase</span>
                  </div>
                </div>
              </div>
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors">
                Join Battle Arena
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <EyeIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Analytics</h2>
              <p className="text-gray-600 mb-6">
                Deep insights into your content performance and audience engagement.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Content Performance Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Audience Behavior Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>ROI Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Conversion Attribution</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Engagement Heatmaps</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Predictive Insights</span>
                  </div>
                </div>
              </div>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlight Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">🚀 Transform Your Content Strategy</h3>
            <p className="text-lg opacity-90 mb-4">
              Generate 30 days of content in minutes • Predict viral success • Track revenue impact
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="font-semibold">10x</span> Faster Content Creation
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="font-semibold">5x</span> Better Engagement
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="font-semibold">3x</span> More Revenue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}