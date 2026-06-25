'use client'
import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address and account details</li>
                <li>Content you upload</li>
                <li>Watch history and preferences</li>
                <li>Payment information (processed securely through our partners)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our service</li>
                <li>To personalize your experience</li>
                <li>To process payments and revenue share</li>
                <li>To communicate with you about updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Data Storage</h2>
              <p>Your data is stored securely using industry-standard encryption. We use Supabase for database hosting.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Third-Party Services</h2>
              <p>We use:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Supabase – database hosting</li>
                <li>Vercel – application hosting</li>
                <li>Stripe – payment processing (future)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Cookies</h2>
              <p>We use cookies to remember your preferences and improve your experience. You can disable cookies in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Contact</h2>
              <p>Email us at: privacy@aiflix.com</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Last updated: June 2026</p>
          </div>
        </div>
      </div>
    </>
  )
}