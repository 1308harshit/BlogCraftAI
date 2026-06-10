export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly:</p>
              <ul className="list-disc pl-6">
                <li>Account information (name, email, password)</li>
                <li>Payment information (processed by Razorpay)</li>
                <li>Content you generate using our Service</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6">
                <li>Provide and improve the Service</li>
                <li>Process payments and subscriptions</li>
                <li>Send transactional emails</li>
                <li>Analyze usage patterns</li>
                <li>Prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
              <p>Your data is stored securely using:</p>
              <ul className="list-disc pl-6">
                <li>Encrypted databases (Supabase)</li>
                <li>Secure payment processing (Razorpay)</li>
                <li>Industry-standard security practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Your Rights (GDPR)</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
              <p>We use cookies for:</p>
              <ul className="list-disc pl-6">
                <li>Authentication and session management</li>
                <li>Analytics and performance monitoring</li>
                <li>User preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
              <p>We use third-party services:</p>
              <ul className="list-disc pl-6">
                <li>Groq AI for content generation</li>
                <li>Razorpay for payment processing</li>
                <li>Vercel for hosting</li>
                <li>Supabase for data storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p>For privacy concerns, contact: privacy@blogcraft-ai.com</p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-primary-600 hover:text-primary-700">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}