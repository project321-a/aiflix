'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Upload, BarChart2, Film, DollarSign, Users, Eye, Trash2, Check, Plus } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  trailerClipUrl: string | null
  fullVideoUrl: string | null
  views: number
  likes: number
  earnings: number
  isPublished: boolean
  isPremium: boolean
  createdAt: string
}

const GENRES = ['Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary', 'Horror', 'Comedy']
const REGIONS = ['Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA', 'India', 'Latin America']
const TYPES = ['movie', 'series', 'short']

export default function CreatorStudio() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'videos'>('dashboard')

  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: 'Action',
    region: 'Africa',
    type: 'movie',
    trailerClipUrl: '',
    fullVideoUrl: '',
    isPremium: false,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')

  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalEarnings: 0,
    totalLikes: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetchVideos()
    }
  }, [session])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/studio/videos')
      const data = await res.json()
      if (data.videos) {
        setVideos(data.videos)
        const totalViews = data.videos.reduce((acc: number, v: Video) => acc + v.views, 0)
        const totalEarnings = data.videos.reduce((acc: number, v: Video) => acc + v.earnings, 0)
        const totalLikes = data.videos.reduce((acc: number, v: Video) => acc + v.likes, 0)
        setStats({
          totalVideos: data.videos.length,
          totalViews,
          totalEarnings,
          totalLikes,
        })
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setUploadMessage('')
    setUploadError('')

    if (!form.title.trim()) {
      setUploadError('Title is required')
      setUploading(false)
      return
    }

    try {
      const res = await fetch('/api/studio/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      setUploadMessage('✅ Video uploaded successfully!')
      setForm({
        title: '',
        description: '',
        genre: 'Action',
        region: 'Africa',
        type: 'movie',
        trailerClipUrl: '',
        fullVideoUrl: '',
        isPremium: false,
      })
      fetchVideos()
      setActiveTab('videos')
    } catch (error) {
      setUploadError('Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return
    try {
      await fetch(`/api/studio/videos/${id}`, { method: 'DELETE' })
      fetchVideos()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Loading...</div>
        </div>
      </>
    )
  }

  if (!session) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">🎬 Creator Studio</h1>
              <p className="text-gray-400 text-sm">Manage your AI content, track earnings, and grow your audience.</p>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <Plus size={18} /> New Upload
            </button>
          </div>

          <div className="flex gap-2 mb-8 bg-gray-900 rounded-lg p-1 w-fit">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={16} /> },
              { id: 'upload', label: 'Upload', icon: <Upload size={16} /> },
              { id: 'videos', label: 'My Videos', icon: <Film size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: <Film size={20} />, label: 'Total Videos', value: stats.totalVideos, color: 'text-purple-400' },
                  { icon: <Eye size={20} />, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'text-blue-400' },
                  { icon: <DollarSign size={20} />, label: 'Earnings', value: `$${stats.totalEarnings.toFixed(2)}`, color: 'text-green-400' },
                  { icon: <Users size={20} />, label: 'Total Likes', value: stats.totalLikes.toLocaleString(), color: 'text-pink-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">💰 Revenue Share Program</h3>
                <p className="text-gray-300 text-sm">
                  You earn <span className="text-green-400 font-bold">70%</span> of ad revenue from your content.
                  Payouts are processed monthly when you reach <span className="text-yellow-400">$50</span>.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="text-gray-400">Balance: <span className="text-green-400 font-bold">${stats.totalEarnings.toFixed(2)}</span></span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">Next payout: <span className="text-yellow-400">${Math.max(0, 50 - stats.totalEarnings).toFixed(2)}</span> to go</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-2xl">
              <form onSubmit={handleUpload} className="space-y-4">
                {uploadMessage && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm">
                    {uploadMessage}
                  </div>
                )}
                {uploadError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                    {uploadError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter video title..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your content..."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Genre</label>
                    <select
                      value={form.genre}
                      onChange={(e) => setForm({ ...form, genre: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    >
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Region</label>
                    <select
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    >
                      {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Premium</label>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, isPremium: !form.isPremium })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          form.isPremium
                            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {form.isPremium ? '✓ Premium' : 'Set as Premium'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Trailer Clip URL</label>
                  <input
                    type="url"
                    value={form.trailerClipUrl}
                    onChange={(e) => setForm({ ...form, trailerClipUrl: e.target.value })}
                    placeholder="https://example.com/trailer.mp4"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Full Video URL</label>
                  <input
                    type="url"
                    value={form.fullVideoUrl}
                    onChange={(e) => setForm({ ...form, fullVideoUrl: e.target.value })}
                    placeholder="https://example.com/full-video.mp4"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : '🚀 Publish Video'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'videos' && (
            <div>
              {videos.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Film size={48} className="mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                  <p className="text-sm">Upload your first AI video to start earning.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Upload Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map(video => (
                    <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-gray-600 transition">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{video.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span>{video.genre}</span>
                          <span>{video.region}</span>
                          <span className="capitalize">{video.type}</span>
                          {video.isPremium && (
                            <span className="text-yellow-400 text-xs bg-yellow-500/10 px-2 py-0.5 rounded">Premium</span>
                          )}
                          {video.isPublished ? (
                            <span className="text-green-400 text-xs flex items-center gap-1"><Check size={12} /> Published</span>
                          ) : (
                            <span className="text-yellow-400 text-xs">Draft</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Eye size={12} /> {video.views.toLocaleString()} views</span>
                          <span className="flex items-center gap-1"><DollarSign size={12} /> ${video.earnings.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.location.href = `/watch/${video.id}`}
                          className="text-sm text-purple-400 hover:text-purple-300 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="text-sm text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}