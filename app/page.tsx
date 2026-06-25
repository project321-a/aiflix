'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_VIDEOS } from '../lib/mockvideos'
import VideoCard from '../components/videocard'
import Navbar from '../components/Navbar'
import type { Video } from '../lib/mockvideos'

export default function HomePage() {
  const router = useRouter()
  const featured = MOCK_VIDEOS.filter(v => v.isFeatured)
  const hero = featured[0] || MOCK_VIDEOS[0]
  const trending = [...MOCK_VIDEOS].sort((a, b) => b.views - a.views).slice(0, 6)

  const handleOpenVideo = (video: Video) => {
    router.push(`/watch/${video.id}`)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Hero Section */}
        <div
          className="relative h-[500px] bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="relative max-w-4xl px-8 py-32">
            <div className="flex gap-2 mb-4">
              <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                {hero.genre}
              </span>
              <span className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                {hero.region}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-3">{hero.title}</h1>
            <p className="text-gray-300 text-lg max-w-xl mb-6">{hero.description}</p>
            {/* ✅ Brand tagline added */}
            <p className="text-purple-400 text-sm font-semibold tracking-wider mb-6">
              🎬 AI-Powered Entertainment — Watch Now
            </p>
            <button
              onClick={() => handleOpenVideo(hero)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              ▶ Watch Now
            </button>
          </div>
        </div>

        {/* Trending Section */}
        <div className="px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {trending.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}