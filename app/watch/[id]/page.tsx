'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { Play, Crown } from 'lucide-react'

interface VideoData {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  trailerClipUrl: string | null
  fullVideoUrl: string | null
  creatorName: string
  isPremium: boolean
  thumbnail: string
}

// Helper to extract YouTube ID
function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

export default function WatchPage() {
  const { id } = useParams() as { id: string }
  const { data: session } = useSession()
  const router = useRouter()
  
  const [video, setVideo] = useState<VideoData | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdPhase, setIsAdPhase] = useState(false)
  const [adCountdown, setAdCountdown] = useState(10)
  const [loading, setLoading] = useState(true)
  const [unlockError, setUnlockError] = useState('')

  useEffect(() => {
    fetch(`/api/video/${id}`)
      .then(res => res.json())
      .then(data => {
        setVideo(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!isAdPhase) return
    if (adCountdown <= 0) {
      unlockVideo()
      return
    }
    const timer = setTimeout(() => setAdCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [isAdPhase, adCountdown])

  const unlockVideo = async () => {
    setUnlockError('')
    try {
      const res = await fetch('/api/ad-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: id })
      })
      const data = await res.json()
      if (data.unlocked) {
        setIsUnlocked(true)
        setIsAdPhase(false)
        setAdCountdown(10)
        if (data.streamUrl) {
          console.log('Stream URL:', data.streamUrl)
        }
      } else {
        setUnlockError(data.message || 'Ad watch failed')
        setIsAdPhase(false)
        alert('Please watch the ad to unlock.')
      }
    } catch (error) {
      setUnlockError('Something went wrong')
      setIsAdPhase(false)
      alert('Error unlocking video. Please try again.')
    }
  }

  const handleWatch = () => {
    if (!session) {
      alert('Please sign in to watch videos.')
      router.push('/login')
      return
    }

    if (video?.isPremium) {
      alert('This is a premium video. Please subscribe to watch.')
      router.push('/subscribe')
      return
    }

    setIsAdPhase(true)
    setAdCountdown(10)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Loading video...</div>
        </div>
      </>
    )
  }

  if (!video) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Video not found</div>
        </div>
      </>
    )
  }

  const isYouTube = video.fullVideoUrl?.includes('youtube.com') || video.fullVideoUrl?.includes('youtu.be')
  const youtubeId = isYouTube ? getYouTubeId(video.fullVideoUrl || '') : null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
            {!isUnlocked && !isAdPhase && (
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${video.trailerClipUrl || video.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                  <p className="text-gray-300 mb-6 max-w-lg text-center">{video.description}</p>
                  <button
                    onClick={handleWatch}
                    className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition text-lg"
                  >
                    <Play size={20} fill="white" /> Watch Now
                  </button>
                  <p className="text-sm text-gray-400 mt-4">
                    {session ? 'Free users watch a short ad to unlock' : 'Please sign in to watch'}
                  </p>
                  {video.isPremium && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm bg-yellow-500/10 px-3 py-1 rounded-full">
                      <Crown size={14} /> Premium content
                    </div>
                  )}
                </div>
              </div>
            )}

            {isAdPhase && (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-purple-900/50 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-400 mb-4">{adCountdown}</div>
                  <p className="text-xl mb-2">Watch this short ad to unlock the video</p>
                  <p className="text-sm text-gray-400">Ad will end in {adCountdown}s</p>
                  {unlockError && (
                    <p className="text-red-400 text-sm mt-2">{unlockError}</p>
                  )}
                </div>
              </div>
            )}

            {isUnlocked && (
              <div className="w-full h-full bg-black flex items-center justify-center">
                {video.fullVideoUrl ? (
                  isYouTube && youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  ) : (
                    <video
                      src={video.fullVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                    />
                  )
                ) : (
                  <div className="text-center">
                    <div className="text-green-400 text-6xl mb-4">▶</div>
                    <p className="text-2xl font-bold text-green-400">🎬 Video Unlocked!</p>
                    <p className="text-gray-400 text-sm mt-2">Full video would play here in production</p>
                    <button
                      onClick={() => {
                        setIsUnlocked(false)
                        setAdCountdown(10)
                      }}
                      className="mt-4 text-sm text-purple-400 underline hover:text-purple-300 transition"
                    >
                      Go back to trailer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded">{video.genre}</span>
              <span>{video.region}</span>
              <span className="capitalize">{video.type}</span>
            </div>
            <p className="text-gray-300 mt-4">{video.description}</p>
          </div>
        </div>
      </div>
    </>
  )
}