'use client'

import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  PauseIcon, 
  CogIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ShareIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface AutomationPrompt {
  topic: string
  targetAudience: string
  contentGoals: string[]
  brandVoice: 'professional' | 'casual' | 'technical' | 'creative'
  publishingSchedule: 'daily' | 'weekly' | 'bi-weekly'
  platforms: string[]
  duration: number
}

interface ContentPiece {
  id: string
  type: 'blog' | 'social' | 'email' | 'video_script' | 'podcast_outline'
  title: string
  content: string
  platform?: string
  scheduledDate: Date
  status: 'draft' | 'scheduled' | 'published'
  metadata: {
    wordCount: number
    readingTime: number
    seoScore: number
    viralityScore: number
    estimatedEngagement: number
  }
}

interface ContentCalendar {
  id: string
  userId: string
  prompt: AutomationPrompt
  contentPieces: ContentPiece[]
  totalPieces: number
  generatedAt: Date
  status: 'generating' | 'completed' | 'failed'
  progress: number
}

export default function AutomationStudio() {
  const [activeWorkflow, setActiveWorkflow] = useState('content-empire')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [contentCalendar, setContentCalendar] = useState<ContentCalendar | null>(null)
  const [formData, setFormData] = useState<AutomationPrompt>({
    topic: '',
    targetAudience: '',
    contentGoals: [],
    brandVoice: 'professional',
    publishingSchedule: 'weekly',
    platforms: [],
    duration: 30
  })

  const workflows = [
    {
      id: 'content-empire',
      name: 'Complete Content Empire',
      description: 'Generate 30 days of content across all platforms',
      icon: DocumentTextIcon,
      outputs: ['30 Blog Posts', '120 Social Posts', '4 Email Campaigns', '8 Video Scripts', '12 Podcast Episodes']
    },
    {
      id: 'competitor-domination',
      name: 'Competitor Domination',
      description: 'Analyze competitors and create better content',
      icon: ChartBarIcon,
      outputs: ['Content Gap Analysis', 'Better Content Creation', 'SEO Improvements', 'Social Strategy']
    },
    {
      id: 'trend-surfing',
      name: 'Trend Surfing',
      description: 'Create content from trending topics in real-time',
      icon: ShareIcon,
      outputs: ['Real-time Content', 'Multi-platform Adaptation', 'Viral Optimization', 'Performance Tracking']
    },
    {
      id: 'content-remix',
      name: 'Content Remix Engine',
      description: 'Transform one piece into 20+ formats',
      icon: CogIcon,
      outputs: ['Twitter Threads', 'Instagram Carousels', 'LinkedIn Posts', 'Email Campaigns', 'Video Scripts']
    }
  ]

  const platforms = [
    'Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'YouTube', 'TikTok', 'Medium', 'WordPress'
  ]

  const contentGoalOptions = [
    'Increase brand awareness',
    'Generate leads',
    'Drive website traffic',
    'Build thought leadership',
    'Educate audience',
    'Promote products/services',
    'Build community',
    'Improve SEO rankings'
  ]

  const handleInputChange = (field: keyof AutomationPrompt, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field: 'contentGoals' | 'platforms', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const startAutomation = async () => {
    if (!formData.topic || !formData.targetAudience) {
      alert('Please fill in topic and target audience')
      return
    }

    setIsGenerating(true)
    setProgress(0)

    try {
      // Simulate content generation progress
      const totalSteps = 100
      for (let i = 0; i <= totalSteps; i += 5) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Simulate generated content calendar
      const calendar = await simulateContentGeneration(formData)
      setContentCalendar(calendar)
    } catch (error) {
      console.error('Automation failed:', error)
      alert('Automation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return DocumentTextIcon
      case 'social': return ShareIcon
      case 'email': return EnvelopeIcon
      case 'video_script': return VideoCameraIcon
      case 'podcast_outline': return MicrophoneIcon
      default: return DocumentTextIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automation Studio</h1>
          <p className="text-gray-600">Create complete content strategies with a single prompt</p>
        </div>

        {/* Workflow Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflows.map((workflow) => {
              const IconComponent = workflow.icon
              return (
                <div
                  key={workflow.id}
                  onClick={() => setActiveWorkflow(workflow.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    activeWorkflow === workflow.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  <div className="space-y-1">
                    {workflow.outputs.slice(0, 3).map((output, index) => (
                      <div key={index} className="text-xs text-gray-500">• {output}</div>
                    ))}
                    {workflow.outputs.length > 3 && (
                      <div className="text-xs text-gray-400">+{workflow.outputs.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g., AI tools for small businesses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="e.g., Small business owners, entrepreneurs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Voice
                </label>
                <select
                  value={formData.brandVoice}
                  onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publishing Schedule
                </label>
                <select
                  value={formData.publishingSchedule}
                  onChange={(e) => handleInputChange('publishingSchedule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min="7"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Content Goals */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Goals</h3>
              <div className="grid grid-cols-2 gap-2">
                {contentGoalOptions.map((goal) => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.contentGoals.includes(goal)}
                      onChange={() => handleArrayToggle('contentGoals', goal)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Platforms</h3>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform)}
                      onChange={() => handleArrayToggle('platforms', platform)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={startAutomation}
            disabled={isGenerating}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <PauseIcon className="h-5 w-5 mr-2" />
                Generating... {progress}%
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Automation
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Generating Content</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {progress < 30 && 'Analyzing topic and audience...'}
              {progress >= 30 && progress < 60 && 'Generating blog posts...'}
              {progress >= 60 && progress < 80 && 'Creating social media content...'}
              {progress >= 80 && progress < 95 && 'Generating email campaigns...'}
              {progress >= 95 && 'Finalizing content calendar...'}
            </div>
          </div>
        )}

        {/* Generated Content Calendar */}
        {contentCalendar && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generated Content Calendar</h3>
                <p className="text-sm text-gray-600">
                  {contentCalendar.totalPieces} pieces of content ready for {formData.duration} days
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Export Calendar
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Schedule All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contentCalendar.contentPieces.slice(0, 10).map((piece) => {
                    const IconComponent = getContentTypeIcon(piece.type)
                    return (
                      <tr key={piece.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{piece.title}</div>
                              <div className="text-sm text-gray-500">
                                {piece.metadata.wordCount} words • {piece.metadata.readingTime} min read
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {piece.type.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {piece.platform || 'All'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(piece.scheduledDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              SEO: {piece.metadata.seoScore}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Viral: {piece.metadata.viralityScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(piece.status)}`}>
                            {piece.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {contentCalendar.contentPieces.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All {contentCalendar.contentPieces.length} Content Pieces
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Simulation function (replace with real API call)
async function simulateContentGeneration(prompt: AutomationPrompt): Promise<ContentCalendar> {
  const contentPieces: ContentPiece[] = []
  
  // Generate sample content pieces
  const contentTypes = ['blog', 'social', 'email', 'video_script', 'podcast_outline'] as const
  
  for (let i = 0; i < 25; i++) {
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)]
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + i)
    
    contentPieces.push({
      id: `content-${i}`,
      type,
      title: `${prompt.topic} - Content Piece ${i + 1}`,
      content: `Generated content about ${prompt.topic} for ${prompt.targetAudience}...`,
      platform: type === 'social' ? prompt.platforms[0] : undefined,
      scheduledDate,
      status: Math.random() > 0.7 ? 'scheduled' : 'draft',
      metadata: {
        wordCount: Math.floor(Math.random() * 1000) + 500,
        readingTime: Math.floor(Math.random() * 5) + 2,
        seoScore: Math.floor(Math.random() * 40) + 60,
        viralityScore: Math.floor(Math.random() * 40) + 50,
        estimatedEngagement: Math.floor(Math.random() * 500) + 100
      }
    })
  }

  return {
    id: 'calendar-1',
    userId: 'user-1',
    prompt,
    contentPieces,
    totalPieces: contentPieces.length,
    generatedAt: new Date(),
    status: 'completed',
    progress: 100
  }
}