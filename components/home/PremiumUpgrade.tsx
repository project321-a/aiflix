'use client'
import { Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PremiumUpgrade() {
  const router = useRouter()

  return (
    <div className="px-8 py-12">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/50 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30 text-center">
        <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
        <p className="text-gray-300 mb-6">No ads • HD quality • Unlimited access • Support creators</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => router.push('/subscribe')}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Monthly — $2.99
          </button>
          <button 
            onClick={() => router.push('/subscribe')}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Quarterly — $6.99
          </button>
          <button 
            onClick={() => router.push('/subscribe')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition"
          >
            Yearly — $19.99
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-4">🎯 Best value: Yearly plan saves 44%</p>
      </div>
    </div>
  )
}