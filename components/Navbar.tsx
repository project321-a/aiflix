'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Play, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [subscriptionTier, setSubscriptionTier] = useState('free')
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // Show a simple loading state while session is loading
  if (status === 'loading') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Play size={16} fill="white" color="white" />
          </div>
          <span className="text-xl font-bold text-white">Stream<span className="text-purple-400">AIV</span></span>
        </div>
        <div className="text-gray-400 text-sm">Loading...</div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 px-6 h-16 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <Play size={16} fill="white" color="white" />
        </div>
        <span className="text-xl font-bold text-white">Stream<span className="text-purple-400">AIV</span></span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className={`text-sm ${pathname === '/' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Home
        </Link>
        <Link href="/browse" className={`text-sm ${pathname === '/browse' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Browse
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            <Search size={16} />
          </button>
        </form>

        <Link href="/subscribe" className={`text-sm ${pathname === '/subscribe' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
          Subscribe
        </Link>

        {session && (
          <Link href="/creator" className={`text-sm ${pathname === '/creator' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
            Creator
          </Link>
        )}

        {/* 👇 Admin Link — only visible to admin users */}
        {session && (session.user as any)?.role === 'admin' && (
          <Link href="/admin" className={`text-sm ${pathname === '/admin' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}>
            Admin
          </Link>
        )}

        {/* Auth */}
        {session ? (
          <>
            <span className="text-sm text-gray-300 flex items-center gap-2">
              {session.user?.name || session.user?.email}
              {subscriptionTier !== 'free' && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">PRO</span>
              )}
            </span>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-red-400 hover:text-red-300 transition">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Sign In</Link>
            <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}