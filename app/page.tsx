'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_VIDEOS } from '../lib/mockvideos'
import VideoCard from '../components/videocard'
import Navbar from '../components/Navbar'
import type { Video } from '../lib/mockvideos'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const featured = MOCK_VIDEOS.filter(v => v.isFeatured)
  const hero = featured[currentIndex] || MOCK_VIDEOS[0]
  const trending = [...MOCK_VIDEOS].sort((a, b) => b.views - a.views).slice(0, 6)

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (featured.length === 0) return

    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featured.length)
      }, 6000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isHovering, featured.length])

  const handleOpenVideo = (video: Video) => {
    router.push(`/watch/${video.id}`)
  }

  const goToPrevious = () => {
    if (featured.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)
  }

  const goToNext = () => {
    if (featured.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % featured.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  const trailerUrl = hero?.thumbnail || ''

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Hero Section */}
        <div
          className="relative h-[500px] bg-cover bg-center overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${trailerUrl})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-4xl px-8 py-32">
              <div className="flex gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  {hero?.genre || 'AI'}
                </span>
                <span className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                  {hero?.region || 'Global'}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-3">{hero?.title || 'StreamAIV'}</h1>
              <p className="text-gray-300 text-lg max-w-xl mb-6">{hero?.description || 'AI-Powered Entertainment'}</p>
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

          {/* Navigation Arrows */}
          {featured.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition z-10"
                aria-label="Previous"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition z-10"
                aria-label="Next"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {featured.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {featured.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-gray-400 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Go Back Button */}
          {featured.length > 1 && isHovering && (
            <button
              onClick={goToPrevious}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-purple-600/80 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition z-10"
            >
              ← Go Back
            </button>
          )}
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