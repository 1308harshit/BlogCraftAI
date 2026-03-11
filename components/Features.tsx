import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  MicrophoneIcon,
  PhotoIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: DocumentTextIcon,
    title: 'AI Content Studio',
    description: 'Professional content creation with 11 languages, 8 tones, and advanced workflow management.'
  },
  {
    icon: ChartBarIcon,
    title: 'Real-time SEO Analysis',
    description: 'Instant SEO scoring with actionable insights to optimize your content for search engines.'
  },
  {
    icon: ShareIcon,
    title: 'Content Remix Engine',
    description: 'Transform one article into 8 formats: Twitter threads, LinkedIn posts, emails, and more.'
  },
  {
    icon: MicrophoneIcon,
    title: 'Voice-to-Blog',
    description: 'Revolutionary voice input - record ideas and transform them into professional articles.'
  },
  {
    icon: PhotoIcon,
    title: 'AI Image Generation',
    description: 'Automatically generate featured images and graphics that perfectly match your content.'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Competitor Analysis',
    description: 'AI-powered insights to analyze competitors and create better, ranking content.'
  },
  {
    icon: ClockIcon,
    title: 'Auto-Publisher',
    description: 'One-click publishing to WordPress, Medium, LinkedIn and more platforms simultaneously.'
  },
  {
    icon: CurrencyRupeeIcon,
    title: '99% Cost Savings',
    description: 'At $0.001 per article, we\'re 30x cheaper than competitors while offering more features.'
  }
]

export default function Features() {
  return (
    <div id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🚀 The Most Advanced AI Content Studio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            7 killer features that no other platform offers. From voice notes to viral content in 5 minutes.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
              🔥 Revolutionary Features Added
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:bg-gray-50 p-6 rounded-xl transition-colors">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Complete Content Workflow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">🎙️</div>
                <div className="font-semibold">Voice Input</div>
                <div className="text-gray-600">Record ideas</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">AI Generation</div>
                <div className="text-gray-600">Professional content</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-semibold">Multi-Format</div>
                <div className="text-gray-600">8 content types</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold">Auto-Publish</div>
                <div className="text-gray-600">3+ platforms</div>
              </div>
            </div>
            <div className="mt-6">
              <a 
                href="/studio" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                🚀 Try AI Studio Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}