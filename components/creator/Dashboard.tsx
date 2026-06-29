'use client'
import { useState, useEffect } from 'react'
import { Film, Eye, DollarSign, Check, Clock } from 'lucide-react'
import StatCard from './StatCard'
import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

interface Video {
  id: string
  title: string
  genre: string
  region: string
  views: number
  status: string
  revenue: number
  createdAt: string
  segment?: string
}

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/creator/upload')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0)
  const totalVideos = videos.length
  const activeVideos = videos.filter(v => v.status === 'ready').length

  const stats = [
    { 
      icon: <Film size={20} />, 
      label: 'Total Videos', 
      value: totalVideos,
      change: '+3 this week',
      changeType: 'up' as const,
      subText: `Last upload ${videos.length > 0 ? new Date(videos[0].createdAt).toLocaleDateString() : 'never'}`,
      color: 'text-purple-400'
    },
    { 
      icon: <Eye size={20} />, 
      label: 'Total Views', 
      value: totalViews.toLocaleString(),
      change: '+1.2K this month',
      changeType: 'up' as const,
      color: 'text-blue-400'
    },
    { 
      icon: <DollarSign size={20} />, 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toFixed(2)}`,
      change: '$12.40 pending',
      changeType: 'neutral' as const,
      color: 'text-green-400'
    },
    { 
      icon: <Check size={20} />, 
      label: 'Active Videos', 
      value: activeVideos,
      subText: `${videos.length - activeVideos} in review`,
      color: 'text-green-400'
    },
  ]

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading dashboard...</div>
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Uploads */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Uploads</h3>
          <button className="text-sm text-purple-400 hover:underline">View All →</button>
        </div>

        {videos.length === 0 ? (
          <EmptyState 
            icon={<Film size={32} />}
            title="No videos uploaded yet"
            description="Upload your first AI video to get started."
            actionText="Upload Video"
            actionLink="/creator/upload"
          />
        ) : (
          <div className="space-y-3">
            {videos.slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">🎬</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{v.title}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{v.genre}</span>
                      <span>•</span>
                      <span>{v.region}</span>
                      {v.segment && (
                        <>
                          <span>•</span>
                          <span className="text-purple-400">{v.segment}</span>
                        </>
                      )}
                      <span>•</span>
                      <StatusBadge status={v.status} />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-4">
                  <span>{v.views.toLocaleString()} views</span>
                  <span className="text-green-400">${v.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}