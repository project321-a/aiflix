'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Play } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [subscriptionTier, setSubscriptionTier] = useState('free')

  // Fetch user's subscription status
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.plan) setSubscriptionTier(data.plan)
        })
        .catch(() => {})
    }
  }, [session])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 px-6 h-16 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
    <Play size={16} fill="white" color="white" />
  </div>
  <span className="text-xl font-bold text-white">Stream<span className="text-purple-500">AIV</span></span>
</Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className={`text-sm ${pathname === '/' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Home
        </Link>
        <Link href="/browse" className={`text-sm ${pathname === '/browse' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Browse
        </Link>
        <Link href="/subscribe" className={`text-sm ${pathname === '/subscribe' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Subscribe
        </Link>

        {/* 👇 Creator Studio Link — only shows when signed in */}
        {session && (
          <Link href="/creator" className={`text-sm ${pathname === '/creator' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
            Creator
          </Link>
        )}

        {/* Auth Section */}
        {session ? (
          <>
            <span className="text-sm text-gray-300 flex items-center gap-2">
              {session.user?.name || session.user?.email}
              {subscriptionTier !== 'free' && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-red-400 hover:text-red-300 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}