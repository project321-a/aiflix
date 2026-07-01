'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ChevronLeft, ChevronRight, Crown, Film, X } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  coverImage: string
  segment: string | null
  episodes: any[]
  firstEpisode: { id: string } | null
  views: number
  createdAt: string
}

const SEGMENTS = [
  { name: 'Power Struggle', icon: '⚔️' },
  { name: 'War God', icon: '🗡️' },
  { name: 'Tycoon Life', icon: '💰' },
  { name: 'Workplace', icon: '🏢' },
  { name: 'Time Travel', icon: '⏳' },
  { name: 'Apocalypse', icon: '🌋' },
]

const GENRES = ['All', 'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary']

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const featured = projects.filter(p => p.coverImage)
  const hero = featured[currentIndex] || projects[0] || null

  // Filter by segment
  const filteredBySegment = selectedSegment
    ? projects.filter(p => p.segment === selectedSegment)
    : projects

  const trending = [...filteredBySegment].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6)
  const popular = [...filteredBySegment].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4)
  const recommended = [...filteredBySegment].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)
  const african = projects.filter(p => p.region === 'Africa').slice(0, 4)
  const kdrama = projects.filter(p => p.region === 'KDrama').slice(0, 4)
  const cdrama = projects.filter(p => p.region === 'CDrama').slice(0, 4)

  useEffect(() => {
    if (featured.length === 0) return
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featured.length)
      }, 6000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
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

  const handleWatch = (project: Project) => {
    const episodeId = project.firstEpisode?.id || project.episodes?.[0]?.id
    if (episodeId) router.push(`/watch/${episodeId}`)
  }

  const handleSegmentClick = (segment: string) => {
    setSelectedSegment(selectedSegment === segment ? null : segment)
  }

  // ✅ Loading state with spinner
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <LoadingSpinner />
        </div>
      </>
    )
  }

  if (projects.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-center">
            <Film size={48} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">No projects available yet.</p>
            <p className="text-sm text-gray-500">Check back soon!</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">

        {/* ===== HERO BANNER ===== */}
        {hero && (
          <div
            className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(${hero.coverImage || ''})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="relative h-full flex items-center">
              <div className="max-w-4xl px-4 md:px-8 py-16 md:py-24 lg:py-32">
                <div className="flex gap-2 mb-4">
                  <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                    {hero.genre}
                  </span>
                  <span className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {hero.region}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-heading">{hero.title}</h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-xl mb-6">{hero.description}</p>
                <button
                  onClick={() => handleWatch(hero)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition text-sm md:text-base"
                >
                  ▶ Watch Now
                </button>
              </div>
            </div>
            {featured.length > 1 && (
              <>
                <button onClick={goToPrevious} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 md:p-2 transition z-10">
                  <ChevronLeft size={24} className="md:size-6" />
                </button>
                <button onClick={goToNext} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 md:p-2 transition z-10">
                  <ChevronRight size={24} className="md:size-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {featured.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? 'w-6 md:w-8 bg-purple-600' : 'w-2 bg-gray-400 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== CONTINUE WATCHING ===== */}
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold font-heading">▶ Continue Watching</h2>
            <button className="text-xs md:text-sm text-purple-400 hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {projects.slice(0, 5).map(p => (
              <div
                key={p.id}
                onClick={() => handleWatch(p)}
                className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:border-purple-600 border border-gray-800 transition"
              >
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title} className="w-full h-20 md:h-24 object-cover" />
                ) : (
                  <div className="w-full h-20 md:h-24 bg-gray-700 flex items-center justify-center">
                    <Film size={20} className="text-gray-500" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold truncate">{p.title}</p>
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
        <div className="px-4 md:px-8 py-4 md:py-6">
          <h2 className="text-lg md:text-xl font-bold font-heading">🎭 Browse By Genre</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => router.push(`/browse?genre=${encodeURIComponent(g)}`)}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 hover:bg-purple-600 rounded-full text-xs md:text-sm transition"
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SEGMENT FILTER ===== */}
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <span className="text-xs md:text-sm text-gray-400 font-medium">Filter by Segment:</span>
            {SEGMENTS.map(s => (
              <button
                key={s.name}
                onClick={() => handleSegmentClick(s.name)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition flex items-center gap-1 md:gap-2 ${
                  selectedSegment === s.name ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{s.icon}</span>
                {s.name}
              </button>
            ))}
            {selectedSegment && (
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-xs md:text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
              >
                <X size={16} /> Clear
              </button>
            )}
          </div>
          {selectedSegment && (
            <p className="text-xs md:text-sm text-gray-400 mt-2">
              Showing {filteredBySegment.length} projects in <span className="text-purple-400 font-semibold">{selectedSegment}</span>
            </p>
          )}
        </div>

        {/* ===== TRENDING NOW ===== */}
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold font-heading">🔥 Trending Now</h2>
            <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse')}>View All →</button>
          </div>
          {trending.length === 0 ? (
            <div className="text-gray-400 text-sm">No trending projects.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {trending.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Film size={28} className="text-gray-600" />
                    )}
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="text-xs md:text-sm font-semibold truncate">{p.title}</h3>
                    <div className="text-[10px] md:text-xs text-gray-400 mt-1">{p.genre} · {p.region}</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                      {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes?.length || 0} episodes`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== RECOMMENDED ===== */}
        <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold font-heading">⭐ Recommended For You</h2>
            <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse')}>View All →</button>
          </div>
          {recommended.length === 0 ? (
            <div className="text-gray-400 text-sm">No recommendations.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {recommended.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={28} className="text-gray-600" />}
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="text-xs md:text-sm font-semibold truncate">{p.title}</h3>
                    <div className="text-[10px] md:text-xs text-gray-400 mt-1">{p.genre} · {p.region}</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                      {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes?.length || 0} episodes`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== MOST POPULAR ===== */}
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold font-heading">🏆 Most Popular</h2>
            <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse')}>View All →</button>
          </div>
          {popular.length === 0 ? (
            <div className="text-gray-400 text-sm">No popular projects.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {popular.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={28} className="text-gray-600" />}
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="text-xs md:text-sm font-semibold truncate">{p.title}</h3>
                    <div className="text-[10px] md:text-xs text-gray-400 mt-1">{p.genre} · {p.region}</div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                      {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes?.length || 0} episodes`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== SEGMENTS SECTION ===== */}
        <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-900/30">
          <h2 className="text-lg md:text-xl font-bold mb-4 font-heading">🎯 Segments</h2>
          <div className="space-y-6">
            {SEGMENTS.map(s => {
              const segmentProjects = projects.filter(p => p.segment === s.name).slice(0, 4)
              if (segmentProjects.length === 0) return null
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                      <span>{s.icon}</span> {s.name}
                    </h3>
                    <button
                      onClick={() => { setSelectedSegment(s.name); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className="text-xs md:text-sm text-purple-400 hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {segmentProjects.map((p, index) => (
                      <div
                        key={p.id}
                        onClick={() => handleWatch(p)}
                        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                      >
                        <div className="aspect-video bg-gray-700 flex items-center justify-center">
                          {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={24} className="text-gray-500" />}
                        </div>
                        <div className="p-2 md:p-3">
                          <h4 className="text-xs md:text-sm font-semibold truncate">{p.title}</h4>
                          <div className="text-[10px] md:text-xs text-gray-400">{p.genre} · {p.region}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== AFRICAN ORIGINALS ===== */}
        {african.length > 0 && (
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold font-heading">🌍 African Originals</h2>
              <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse?region=Africa')}>View All →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {african.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={24} className="text-gray-600" />}
                  </div>
                  <div className="p-2 md:p-3">
                    <h4 className="text-xs md:text-sm font-semibold truncate">{p.title}</h4>
                    <div className="text-[10px] md:text-xs text-gray-400">{p.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== KDRAMA ===== */}
        {kdrama.length > 0 && (
          <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-900/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold font-heading">🇰🇷 KDrama</h2>
              <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse?region=KDrama')}>View All →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {kdrama.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={24} className="text-gray-600" />}
                  </div>
                  <div className="p-2 md:p-3">
                    <h4 className="text-xs md:text-sm font-semibold truncate">{p.title}</h4>
                    <div className="text-[10px] md:text-xs text-gray-400">{p.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CDRAMA ===== */}
        {cdrama.length > 0 && (
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold font-heading">🇨🇳 CDrama</h2>
              <button className="text-xs md:text-sm text-purple-400 hover:underline" onClick={() => router.push('/browse?region=CDrama')}>View All →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {cdrama.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => handleWatch(p)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" /> : <Film size={24} className="text-gray-600" />}
                  </div>
                  <div className="p-2 md:p-3">
                    <h4 className="text-xs md:text-sm font-semibold truncate">{p.title}</h4>
                    <div className="text-[10px] md:text-xs text-gray-400">{p.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PREMIUM UPGRADE ===== */}
        <div className="px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/50 to-purple-600/20 rounded-2xl p-6 md:p-8 border border-purple-500/30 text-center">
            <Crown size={40} className="md:size-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-heading">Upgrade to Premium</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6">No ads • HD quality • Unlimited access • Support creators</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                Monthly — $2.99
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                Quarterly — $6.99
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                Yearly — $19.99
              </button>
            </div>
            <p className="text-xs md:text-sm text-gray-400 mt-4">🎯 Best value: Yearly plan saves 44%</p>
          </div>
        </div>

        {/* ===== TESTIMONIALS ===== */}
        <div className="px-4 md:px-8 py-8 md:py-12 bg-gray-900/50">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 font-heading">💬 What Creators Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Amara Okafor', role: 'Filmmaker, Lagos', text: 'StreamAIV gave my AI films a global audience. The revenue share model is fair and transparent.' },
              { name: 'Ji-hoon Park', role: 'Creator, Seoul', text: 'I\'ve uploaded 12 series and the platform handles everything. Ad revenue is consistent.' },
              { name: 'Sarah Chen', role: 'Animator, Beijing', text: 'The best platform for AI content creators. Easy upload, great community, fair payouts.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-5 md:p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-xs md:text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-300 italic">"{t.text}"</p>
                <div className="flex text-yellow-400 mt-2 text-xs md:text-sm">★★★★★</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white font-heading">Stream<span className="text-purple-400">AIV</span></h3>
                <p className="text-gray-400 text-xs md:text-sm mt-2">AI-Powered Entertainment</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm md:text-base">Product</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  <li><a href="/browse" className="hover:text-white transition">Browse</a></li>
                  <li><a href="/creator" className="hover:text-white transition">Creator Studio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm md:text-base">Support</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                  <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
                  <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm md:text-base">Connect</h4>
                <div className="flex gap-3 md:gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition text-base md:text-lg">🐦</a>
                  <a href="#" className="text-gray-400 hover:text-white transition text-base md:text-lg">📸</a>
                  <a href="#" className="text-gray-400 hover:text-white transition text-base md:text-lg">▶️</a>
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