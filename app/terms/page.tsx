'use client'
import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By using AIFlix, you agree to these terms. If you don't agree, please don't use our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. User Accounts</h2>
              <p>You must create an account to upload content. You are responsible for your account security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Content Ownership</h2>
              <p>You retain ownership of the content you upload. By uploading, you grant us a license to host and stream your content.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Revenue Share</h2>
              <p>Creators earn 70% of ad revenue from their content. Payments are processed monthly when earnings exceed $50.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Prohibited Content</h2>
              <p>We do not allow copyright-infringing, harmful, or illegal content. Violations will result in account termination.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Termination</h2>
              <p>We reserve the right to terminate accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Changes to Terms</h2>
              <p>We may update these terms. Continued use means you accept the changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Contact</h2>
              <p>Email us at: support@aiflix.com</p>
            </section>

            <p className="text-sm text-gray-500 mt-8">Last updated: June 2026</p>
          </div>
        </div>
      </div>
    </>
  )
}