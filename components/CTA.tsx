import Link from 'next/link'

export default function CTA() {
  return (
    <div className="bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to 10x Your Content Production?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join 500+ businesses already using AI to create SEO-optimized content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Try Free Demo
            </Link>
            <Link href="/signup" className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Get Founder Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}