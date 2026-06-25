'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_VIDEOS, SEGMENTS } from '../lib/mockvideos'
import VideoCard from '../components/videocard'
import Navbar from '../components/Navbar'
import type { Video } from '../lib/mockvideos'
import { ChevronLeft, ChevronRight, Crown, X } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const featured = MOCK_VIDEOS.filter(v => v.isFeatured)
  const hero = featured[currentIndex] || MOCK_VIDEOS[0]
  
  // Filter videos by selected segment
  const getFilteredVideos = (segment: string | null) => {
    if (!segment) return MOCK_VIDEOS
    return MOCK_VIDEOS.filter(v => v.segment === segment)
  }

  const filteredVideos = getFilteredVideos(selectedSegment)
  
  const trending = [...filteredVideos].sort((a, b) => b.views - a.views).slice(0, 6)
  const popular = [...filteredVideos].sort((a, b) => b.views - a.views).slice(0, 4)
  const african = filteredVideos.filter(v => v.region === 'Africa').slice(0, 4)
  const kdrama = filteredVideos.filter(v => v.region === 'KDrama').slice(0, 4)
  const cdrama = filteredVideos.filter(v => v.region === 'CDrama').slice(0, 4)

  const genres = [
    'All', 'Action', 'Romance', 'Drama', 'Thriller', 
    'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary'
  ]

  const segments = SEGMENTS.map(name => ({
    name,
    icon: name === 'Power Struggle' ? '⚔️' :
          name === 'War God' ? '🗡️' :
          name === 'Tycoon Life' ? '💰' :
          name === 'Workplace' ? '🏢' :
          name === 'Time Travel' ? '⏳' : '🌋'
  }))

  // Auto-rotate
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

  const handleSegmentClick = (segment: string) => {
    if (selectedSegment === segment) {
      setSelectedSegment(null)
    } else {
      setSelectedSegment(segment)
    }
  }

  const clearFilter = () => {
    setSelectedSegment(null)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">

        {/* ===== HERO BANNER ===== */}
        <div
          className="relative h-[500px] bg-cover bg-center overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${hero?.thumbnail || ''})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
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
              <h1 className="text-5xl font-bold mb-3 font-heading">{hero?.title || 'StreamAIV'}</h1>
              <p className="text-gray-300 text-lg max-w-xl mb-6">{hero?.description || 'AI-Powered Entertainment'}</p>
              <button
                onClick={() => handleOpenVideo(hero)}
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

        {/* ===== CONTINUE WATCHING ===== */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">▶ Continue Watching</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {MOCK_VIDEOS.slice(0, 5).map(v => (
              <div key={v.id} className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:border-purple-600 border border-gray-800 transition">
                <img src={v.thumbnail} alt={v.title} className="w-full h-24 object-cover" />
                <div className="p-2">
                  <p className="text-xs font-semibold truncate">{v.title}</p>
                  <div className="w-full h-1 bg-gray-700 mt-1 rounded-full">
                    <div className="w-1/3 h-1 bg-purple-600 rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">35% watched</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== BROWSE BY GENRE ===== */}
        <div className="px-8 py-6">
          <h2 className="text-xl font-bold mb-4">🎭 Browse By Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <button
                key={g}
                className="px-4 py-2 bg-gray-800 hover:bg-purple-600 rounded-full text-sm transition"
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SEGMENTS FILTER ROW ===== */}
        <div className="px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-400 font-medium">Filter by Segment:</span>
            {segments.map(s => (
              <button
                key={s.name}
                onClick={() => handleSegmentClick(s.name)}
                className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
                  selectedSegment === s.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{s.icon}</span>
                {s.name}
              </button>
            ))}
            {selectedSegment && (
              <button
                onClick={clearFilter}
                className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
              >
                <X size={16} /> Clear
              </button>
            )}
          </div>
          {selectedSegment && (
            <p className="text-sm text-gray-400 mt-2">
              Showing {filteredVideos.length} videos in <span className="text-purple-400 font-semibold">{selectedSegment}</span>
            </p>
          )}
        </div>

        {/* ===== TRENDING NOW ===== */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🔥 Trending Now</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {trending.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== RECOMMENDED FOR YOU ===== */}
        <div className="px-8 py-6 bg-gray-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">⭐ Recommended For You</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredVideos.slice(0, 6).map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== MOST POPULAR ===== */}
        <div className="px-8 py-6">
          <h2 className="text-xl font-bold mb-4">🏆 Most Popular</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popular.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== SEGMENTS SECTION ===== */}
        <div className="px-8 py-6 bg-gray-900/30">
          <h2 className="text-xl font-bold mb-4">📂 Segments</h2>
          {selectedSegment ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {segments.find(s => s.name === selectedSegment)?.icon} {selectedSegment}
                  </h3>
                  <button className="text-sm text-purple-400 hover:underline">View All →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredVideos.slice(0, 4).map(v => (
                    <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {segments.map((s) => {
                const segmentVideos = MOCK_VIDEOS.filter(v => v.segment === s.name).slice(0, 4)
                if (segmentVideos.length === 0) return null
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span>{s.icon}</span> {s.name}
                      </h3>
                      <button 
                        onClick={() => handleSegmentClick(s.name)}
                        className="text-sm text-purple-400 hover:underline"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {segmentVideos.map(v => (
                        <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ===== AFRICAN ORIGINALS ===== */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🌍 African Originals</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {african.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== KDRAMA ===== */}
        <div className="px-8 py-6 bg-gray-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🇰🇷 KDrama</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kdrama.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== CDRAMA ===== */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🇨🇳 CDrama</h2>
            <button className="text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cdrama.map(v => (
              <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
            ))}
          </div>
        </div>

        {/* ===== PREMIUM UPGRADE ===== */}
        <div className="px-8 py-12">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/50 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30 text-center">
            <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-gray-300 mb-6">No ads • HD quality • Unlimited access • Support creators</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition">
                Monthly — $2.99
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition">
                Quarterly — $6.99
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition">
                Yearly — $19.99
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">🎯 Best value: Yearly plan saves 44%</p>
          </div>
        </div>

        {/* ===== TESTIMONIALS ===== */}
        <div className="px-8 py-12 bg-gray-900/50">
          <h2 className="text-2xl font-bold text-center mb-8">💬 What Creators Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Amara Okafor', role: 'Filmmaker, Lagos', text: 'StreamAIV gave my AI films a global audience. The revenue share model is fair and transparent.' },
              { name: 'Ji-hoon Park', role: 'Creator, Seoul', text: 'I\'ve uploaded 12 series and the platform handles everything. Ad revenue is consistent.' },
              { name: 'Sarah Chen', role: 'Animator, Beijing', text: 'The best platform for AI content creators. Easy upload, great community, fair payouts.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">"{t.text}"</p>
                <div className="flex text-yellow-400 mt-2">★★★★★</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
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
                  <li><a href="/browse" className="hover:text-white transition">Browse</a></li>
                  <li><a href="/creator" className="hover:text-white transition">Creator Studio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
                  <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
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
      </div>
    </>
  )
}