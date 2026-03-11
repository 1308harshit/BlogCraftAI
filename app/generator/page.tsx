'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Generator() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState('')

  const generateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate article')
      }

      const data = await response.json()
      setArticle(data.article)
      
      // Save article to database if user is logged in
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        try {
          const userResponse = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            
            await fetch('/api/articles', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: userData.user.id,
                title: topic,
                content: data.article,
                keywords: keywords,
              }),
            })
          }
        } catch (error) {
          console.error('Error saving article:', error)
        }
      }
      
      toast.success('Article generated successfully!')
    } catch (error) {
      toast.error('Failed to generate article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article)
    toast.success('Article copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            BlogCraft AI Generator
          </h1>
          <p className="text-gray-600">
            Generate SEO-optimized blog posts in seconds
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={generateArticle} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Topic *
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to improve website SEO in 2024"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Target Keywords (optional)
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., SEO, website optimization, search rankings"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Article...' : 'Generate SEO Article'}
            </button>
          </form>
        </div>

        {article && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Generated Article
              </h2>
              <button
                onClick={copyToClipboard}
                className="btn-secondary"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {article}
              </pre>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Want unlimited access? Get founder pricing now!
          </p>
          <a href="/signup" className="btn-primary">
            Get Full Access - ₹999/month
          </a>
        </div>
      </div>
    </div>
  )
}