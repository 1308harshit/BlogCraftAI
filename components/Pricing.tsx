import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/solid'

const plans = [
  {
    name: 'Founder Special',
    price: '₹999',
    period: '/month',
    description: 'Limited time early access pricing',
    features: [
      'Unlimited blog posts',
      'SEO optimization',
      'Keyword suggestions',
      'WordPress export',
      'Priority support',
      'No setup fees',
      'Cancel anytime'
    ],
    cta: 'Get Founder Access',
    popular: true
  },
  {
    name: 'Regular Price',
    price: '₹2,999',
    period: '/month',
    description: 'Standard pricing after launch',
    features: [
      'Unlimited blog posts',
      'SEO optimization',
      'Keyword suggestions',
      'WordPress export',
      'Standard support'
    ],
    cta: 'Coming Soon',
    popular: false
  }
]

export default function Pricing() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Save ₹50,000+ per month compared to hiring freelancers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.popular ? "/signup" : "#"} 
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}