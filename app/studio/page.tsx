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
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [language, setLanguage] = useState('english')
  const [tone, setTone] = useState('professional')
  const [article, setArticle] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [seoScore, setSeoScore] = useState<any>(null)
  const [remixedContent, setRemixedContent] = useState<any>({})
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiImages, setAiImages] = useState<any[]>([])
  const [publishResults, setPublishResults] = useState<any>(null)

  const languages = [
    'english', 'spanish', 'french', 'german', 'italian', 
    'portuguese', 'dutch', 'russian', 'chinese', 'japanese', 'hindi'
  ]

  const tones = [
    'professional', 'casual', 'friendly', 'authoritative', 
    'conversational', 'technical', 'humorous', 'inspirational'
  ]

  const remixFormats = [
    { id: 'twitter', name: 'Twitter Thread', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn Post', icon: '💼' },
    { id: 'email', name: 'Email Newsletter', icon: '📧' },
    { id: 'summary', name: 'Executive Summary', icon: '📝' },
    { id: 'bullets', name: 'Bullet Points', icon: '•' },
    { id: 'infographic', name: 'Infographic Script', icon: '📊' },
    { id: 'video', name: 'Video Script', icon: '🎥' },
    { id: 'podcast', name: 'Podcast Script', icon: '🎙️' }
  ]

  const generateArticle = async () => {
    if (!topic) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          keywords,
          language,
          tone
        })
      })

      const data = await response.json()
      setArticle(data.article)
      
      // Auto-analyze SEO
      analyzeSEO(data.article)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeSEO = async (content: string = article) => {
    try {
      const response = await fetch('/api/seo-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keywords })
      })

      const data = await response.json()
      setSeoScore(data)
    } catch (error) {
      console.error('SEO analysis error:', error)
    }
  }

  const remixContent = async (format: string) => {
    if (!article) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/content-remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: article, format })
      })

      const data = await response.json()
      setRemixedContent({ ...remixedContent, [format]: data.remixed })
      setActiveTab('remix')
    } catch (error) {
      console.error('Remix error:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeCompetitor = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: article })
      })

      const data = await response.json()
      setCompetitorAnalysis(data)
      setActiveTab('competitor')
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              BlogCraft AI Studio
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/generator" className="text-gray-600 hover:text-gray-900">
                Simple Mode
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">🚀 Content Studio</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., AI in Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (optional)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="AI, healthcare, technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {tones.map(t => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateArticle}
                  disabled={loading || !topic}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⚡ Generating...' : '✨ Generate Article'}
                </button>

                {article && (
                  <div className="pt-4 border-t space-y-2">
                    <button
                      onClick={() => analyzeSEO()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      📊 Analyze SEO
                    </button>
                    <button
                      onClick={analyzeCompetitor}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      🔍 Competitor Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-4 px-6">
                  <button
                    onClick={() => setActiveTab('generate')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === 'generate'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📝 Article
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === 'seo'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📊 SEO Score
                  </button>
                  <button
                    onClick={() => setActiveTab('remix')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === 'remix'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🎨 Remix
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'generate' && (
                  <div>
                    {article ? (
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800">
                          {article}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(article)}
                          className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                        >
                          📋 Copy to Clipboard
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Enter a topic and click "Generate Article" to get started</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div>
                    {seoScore ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold">SEO Score</h3>
                          <div className={`text-4xl font-bold ${
                            seoScore.analysis.score >= 80 ? 'text-green-600' :
                            seoScore.analysis.score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {seoScore.analysis.score}/100
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Word Count</div>
                            <div className="text-2xl font-bold">{seoScore.wordCount}</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Reading Time</div>
                            <div className="text-2xl font-bold">{seoScore.readingTime} min</div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Readability</div>
                            <div className="text-2xl font-bold">{seoScore.analysis.readability}/100</div>
                          </div>
                        </div>

                        {seoScore.analysis.strengths.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-600 mb-2">✅ Strengths</h4>
                            <ul className="space-y-1">
                              {seoScore.analysis.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700">• {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {seoScore.analysis.issues.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-red-600 mb-2">❌ Issues</h4>
                            <ul className="space-y-1">
                              {seoScore.analysis.issues.map((issue: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700">• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {seoScore.analysis.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-600 mb-2">💡 Suggestions</h4>
                            <ul className="space-y-1">
                              {seoScore.analysis.suggestions.map((sug: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700">• {sug}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>Generate an article first, then click "Analyze SEO"</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'remix' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">🎨 Content Remix</h3>
                    <p className="text-gray-600">Transform your article into different formats</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {remixFormats.map(format => (
                        <button
                          key={format.id}
                          onClick={() => remixContent(format.id)}
                          disabled={!article || loading}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="text-3xl mb-2">{format.icon}</div>
                          <div className="text-sm font-medium">{format.name}</div>
                        </button>
                      ))}
                    </div>

                    {Object.keys(remixedContent).length > 0 && (
                      <div className="space-y-4">
                        {Object.entries(remixedContent).map(([format, content]) => (
                          <div key={format} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2 capitalize">{format}</h4>
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
                              {content as string}
                            </pre>
                            <button
                              onClick={() => navigator.clipboard.writeText(content as string)}
                              className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                            >
                              📋 Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}