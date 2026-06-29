'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  coverImage: string
  firstEpisode: { id: string } | null
  episodes: any[]
}

interface Props {
  projects: Project[]
}

export default function HeroBanner({ projects }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const featured = projects.filter(p => p.coverImage)
  const hero = featured[currentIndex] || projects[0] || null

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

  const goToPrevious = () => {
    if (featured.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)
  }
  const goToNext = () => {
    if (featured.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % featured.length)
  }
  const goToIndex = (index: number) => setCurrentIndex(index)

  const handleWatch = () => {
    if (!hero) return
    const episodeId = hero.firstEpisode?.id || hero.episodes[0]?.id
    if (episodeId) {
      router.push(`/watch/${episodeId}`)
    }
  }

  if (!hero) return null

  return (
    <div
      className="relative h-[500px] bg-cover bg-center overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${hero.coverImage || '/default-banner.jpg'})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      
      <div className="relative h-full flex items-center">
        <div className="max-w-4xl px-8 py-32">
          <div className="flex gap-2 mb-4">
            <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
              {hero.genre || 'AI'}
            </span>
            <span className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full">
              {hero.region || 'Global'}
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-3 font-heading">{hero.title}</h1>
          <p className="text-gray-300 text-lg max-w-xl mb-6">{hero.description || 'AI-Powered Entertainment'}</p>
          <button
            onClick={handleWatch}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            ▶ Watch Now
          </button>
        </div>
      </div>

      {featured.length > 1 && (
        <>
          <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition z-10">
            <ChevronLeft size={28} />
          </button>
          <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition z-10">
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-gray-400 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}