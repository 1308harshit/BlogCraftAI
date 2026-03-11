import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  ClockIcon,
  CurrencyRupeeIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Groq AI-Powered',
    description: 'Generate high-quality, engaging blog posts using Groq AI with Llama 3.1 - blazing fast at 560 tokens/sec.'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'SEO Optimized',
    description: 'Every article is optimized for search engines with proper keywords and structure.'
  },
  {
    icon: ClockIcon,
    title: 'Lightning Fast',
    description: 'Create complete blog posts in under 60 seconds instead of hours.'
  },
  {
    icon: CurrencyRupeeIcon,
    title: 'Cost Effective',
    description: 'Save thousands on freelance writers. Generate unlimited content for ₹999/month.'
  }
]

export default function Features() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose BlogCraft AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Replace expensive freelancers with AI that works 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}