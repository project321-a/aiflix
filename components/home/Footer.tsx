'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white">Stream<span className="text-purple-400">AIV</span></h3>
            <p className="text-gray-400 text-sm mt-2">AI-Powered Entertainment</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/browse" className="hover:text-white transition">Browse</Link></li>
              <li><Link href="/creator" className="hover:text-white transition">Creator Studio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">🐦</a>
              <a href="#" className="text-gray-400 hover:text-white transition">📸</a>
              <a href="#" className="text-gray-400 hover:text-white transition">▶️</a>
            </div>
            <p className="text-xs text-gray-500 mt-4">© 2026 StreamAIV</p>
          </div>
        </div>
      </div>
    </footer>
  )
}