'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { Play, Crown, List, ChevronRight, Clock } from 'lucide-react'

interface Episode {
  id: string
  title: string
  description: string
  episodeNumber: number
  videoUrl: string
  thumbnail: string
  duration: string
  views: number
}

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  episodes: Episode[]
}

interface EpisodeData {
  id: string
  title: string
  description: string
  episodeNumber: number
  videoUrl: string
  thumbnail: string
  duration: string
  views: number
  project: Project
}

export default function WatchPage() {
  const { id } = useParams() as { id: string }
  const { data: session } = useSession()
  const router = useRouter()
  const [episode, setEpisode] = useState<EpisodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdPhase, setIsAdPhase] = useState(false)
  const [adCountdown, setAdCountdown] = useState(10)

  useEffect(() => {
    fetch(`/api/episodes/${id}`)
      .then(res => res.json())
      .then(data => {
        setEpisode(data.episode)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  // Ad timer
  useEffect(() => {
    if (!isAdPhase) return
    if (adCountdown <= 0) {
      setIsUnlocked(true)
      setIsAdPhase(false)
      return
    }
    const timer = setTimeout(() => setAdCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [isAdPhase, adCountdown])

  const handleWatch = () => {
    if (!session) {
      router.push('/login')
      return
    }
    setIsAdPhase(true)
    setAdCountdown(10)
  }

  const handleEpisodeClick = (episodeId: string) => {
    router.push(`/watch/${episodeId}`)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Loading...</div>
        </div>
      </>
    )
  }

  if (!episode) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Episode not found</div>
        </div>
      </>
    )
  }

  const { project } = episode
  const isMovie = project.type === 'movie'
  const videoUrl = episode.videoUrl

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/browse')}>
              Browse
            </span>
            <ChevronRight size={14} />
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/projects')}>
              Projects
            </span>
            <ChevronRight size={14} />
            <span className="text-white truncate">{project.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Player */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                {!isUnlocked && !isAdPhase && (
                  <div className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black/80">
                    <Play size={48} className="text-gray-600 mb-4" />
                    <button
                      onClick={handleWatch}
                      className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-lg"
                    >
                      <Play size={20} fill="white" /> Watch Now
                    </button>
                    <p className="text-sm text-gray-400 mt-4">
                      {session ? 'Watch a short ad to unlock' : 'Please sign in to watch'}
                    </p>
                  </div>
                )}

                {isAdPhase && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-900/50 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-purple-400 mb-4">{adCountdown}</div>
                    <p className="text-xl mb-2">Watch this short ad to unlock</p>
                    <p className="text-sm text-gray-400">Ad will end in {adCountdown}s</p>
                  </div>
                )}

                {isUnlocked && (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    {videoUrl ? (
                      videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="autoplay; encrypted-media"
                        />
                      ) : (
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full"
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <div className="text-green-400 text-6xl mb-4">▶</div>
                        <p className="text-2xl font-bold text-green-400">🎬 Video Unlocked!</p>
                        <p className="text-gray-400 text-sm mt-2">Full video would play here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Episode Info */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold">
                  {isMovie ? project.title : `${project.title} - Episode ${episode.episodeNumber}`}
                </h1>
                <h2 className="text-lg text-gray-300">{episode.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span>{project.genre}</span>
                  <span>·</span>
                  <span>{project.region}</span>
                  <span>·</span>
                  <span>{isMovie ? '🎬 Movie' : '📺 Series'}</span>
                </div>
                {episode.description && (
                  <p className="text-gray-300 mt-3">{episode.description}</p>
                )}
                {episode.duration && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <Clock size={14} /> {episode.duration}
                  </div>
                )}
              </div>
            </div>

            {/* Episode List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <List size={18} /> {isMovie ? 'Movie' : 'Episodes'}
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {project.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => handleEpisodeClick(ep.id)}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        ep.id === episode.id
                          ? 'bg-purple-600/30 border border-purple-500'
                          : 'bg-gray-800/50 hover:bg-gray-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          {!isMovie && (
                            <span className="text-xs text-gray-400">Episode {ep.episodeNumber}</span>
                          )}
                          <div className="font-medium text-sm">{ep.title}</div>
                          {ep.duration && (
                            <span className="text-xs text-gray-500">{ep.duration}</span>
                          )}
                        </div>
                        {ep.id === episode.id && (
                          <span className="text-xs text-purple-400">▶ Playing</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Helper: Extract YouTube ID
function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}