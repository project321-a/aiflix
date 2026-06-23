'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { 
  Upload, Film, BarChart2, DollarSign, Users, TrendingUp, 
  Plus, Info, Play, Eye, Clock, Check, X
} from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  views: number
  status: string
  revenue: number
  createdAt: string
  fullVideoUrl: string
}

export default function CreatorStudio() {
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState<'dashboard' | 'upload' | 'videos' | 'earnings'>('dashboard')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  // Upload form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('Action')
  const [region, setRegion] = useState('Africa')
  const [type, setType] = useState('movie')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }
    fetchVideos()
  }, [session, router])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/creator/upload')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !videoUrl) {
      setUploadError('Title and Video URL are required')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadMessage('')

    try {
      const res = await fetch('/api/creator/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          genre,
          region,
          type,
          videoUrl,
          thumbnailUrl,
        })
      })

      const data = await res.json()
      if (res.ok) {
        setUploadMessage('✅ Video uploaded successfully!')
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setThumbnailUrl('')
        fetchVideos()
        setTimeout(() => setUploadMessage(''), 5000)
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'draft': return 'text-gray-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">Ready</span>
      case 'processing': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs">Processing</span>
      case 'draft': return <span className="bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded text-xs">Draft</span>
      case 'failed': return <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">Failed</span>
      default: return <span className="bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded text-xs">{status}</span>
    }
  }

  // Stats
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0)
  const totalVideos = videos.length

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-center">
            <Film size={48} className="mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Creator Studio</h2>
            <p className="text-gray-400">Please sign in to access creator tools</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">🎬 Creator Studio</h1>
              <p className="text-gray-400 text-sm mt-1">
                Upload and manage your AI-generated content
              </p>
            </div>
            <button
              onClick={() => setTab('upload')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={18} /> Upload New
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-900 rounded-xl p-1 w-fit">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={16} /> },
              { id: 'upload', label: 'Upload', icon: <Upload size={16} /> },
              { id: 'videos', label: 'My Videos', icon: <Film size={16} /> },
              { id: 'earnings', label: 'Earnings', icon: <DollarSign size={16} /> },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  tab === t.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Videos', value: totalVideos, icon: <Film size={20} />, color: 'text-purple-400' },
                  { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={20} />, color: 'text-blue-400' },
                  { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={20} />, color: 'text-green-400' },
                  { label: 'Active Videos', value: videos.filter(v => v.status === 'ready').length, icon: <Check size={20} />, color: 'text-green-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
                {loading ? (
                  <div className="text-gray-400 text-sm">Loading...</div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Film size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No videos uploaded yet</p>
                    <button
                      onClick={() => setTab('upload')}
                      className="mt-2 text-purple-400 hover:underline"
                    >
                      Upload your first video →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {videos.slice(0, 5).map(v => (
                      <div key={v.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center">
                            <Play size={16} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{v.title}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                              <span>{v.genre}</span>
                              <span>•</span>
                              <span>{v.region}</span>
                              <span>•</span>
                              {getStatusBadge(v.status)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {v.views.toLocaleString()} views
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && (
            <div className="max-w-2xl">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-2">Upload New Video</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Add your AI-generated video to the platform
                </p>

                {uploadMessage && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg mb-4 text-sm">
                    {uploadMessage}
                  </div>
                )}
                {uploadError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
                    {uploadError}
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter video title..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your content..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Genre</label>
                      <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        {['Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary', 'Horror', 'Comedy'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Region</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        {['Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA', 'India', 'Latin America'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      >
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                        <option value="short">Short</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Video URL *</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://your-video-url.mp4"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For production, use Cloudflare Stream or YouTube embed URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://your-thumbnail-image.jpg"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 flex items-start gap-2">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <p>Video will be reviewed for quality before being published live.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Video'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {tab === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">All Videos ({videos.length})</h2>
                <button
                  onClick={() => setTab('upload')}
                  className="text-sm text-purple-400 hover:underline"
                >
                  + Upload New
                </button>
              </div>

              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                  <Film size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No videos uploaded yet</p>
                  <button
                    onClick={() => setTab('upload')}
                    className="mt-2 text-purple-400 hover:underline"
                  >
                    Upload your first video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map(v => (
                    <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-16 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <Play size={20} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{v.title}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-xs text-gray-400">{v.genre}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{v.region}</span>
                            <span className="text-xs text-gray-400">•</span>
                            {getStatusBadge(v.status)}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Eye size={12} /> {v.views.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><DollarSign size={12} /> ${v.revenue.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {tab === 'earnings' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Earnings', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-400' },
                  { label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-blue-400' },
                  { label: 'Videos', value: totalVideos, color: 'text-purple-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                <div className="space-y-2">
                  {videos.map(v => (
                    <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-800">
                      <span className="text-sm">{v.title}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">{v.views.toLocaleString()} views</span>
                        <span className="text-sm font-medium text-green-400">${v.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  {videos.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No revenue data yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}