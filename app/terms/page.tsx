export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using BlogCraft AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
            <p>
              BlogCraft AI provides AI-powered blog content generation services. The Service allows users to generate SEO-optimized blog posts using artificial intelligence technology.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
            <p>
              To use the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">4. Subscription and Payment</h2>
            <p>
              BlogCraft AI offers subscription-based pricing:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscriptions are billed monthly in advance</li>
              <li>Payments are processed through Razorpay</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>No refunds for partial months</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">5. Usage Limits</h2>
            <p>
              Your subscription includes specific usage limits:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Free tier: 3 articles per month</li>
              <li>Paid tier: Unlimited articles</li>
              <li>Fair use policy applies to prevent abuse</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">6. Content Ownership</h2>
            <p>
              You retain all rights to content generated using BlogCraft AI. However:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You are responsible for reviewing and editing generated content</li>
              <li>We do not guarantee content accuracy or originality</li>
              <li>You must comply with copyright and intellectual property laws</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">7. Prohibited Uses</h2>
            <p>
              You may not use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Generate illegal, harmful, or offensive content</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Abuse or overload our systems</li>
              <li>Resell or redistribute the Service</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">8. Service Availability</h2>
            <p>
              We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Modify or discontinue the Service</li>
              <li>Perform maintenance</li>
              <li>Suspend accounts for violations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
            <p>
              BlogCraft AI is provided "as is" without warranties. We are not liable for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Content accuracy or quality</li>
              <li>Business losses or damages</li>
              <li>Third-party actions</li>
              <li>Data loss or security breaches</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">10. Termination</h2>
            <p>
              Either party may terminate this agreement:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You may cancel your subscription at any time</li>
              <li>We may terminate accounts for violations</li>
              <li>Termination does not entitle refunds</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">11. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the Service constitutes acceptance of updated terms.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">12. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
            </p>
            <p className="mt-2">
              Email: legal@blogcraft-ai.com<br />
              Address: [Your Business Address]
            </p>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a template. Consult with a lawyer to ensure compliance with your jurisdiction's laws.
              </p>
            </div>
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