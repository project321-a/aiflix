'use client'
import { useState, useEffect } from 'react'
import { Film, Play, Eye, DollarSign, Edit, Trash2, MoreVertical } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

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
  segment?: string
}

export default function Videos() {
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      // Add delete API call
      console.log('Delete video:', id)
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading videos...</div>
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={<Film size={40} />}
        title="No videos uploaded yet"
        description="Upload your first AI video to get started."
        actionText="Upload Video"
        actionLink="/creator/upload"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Videos ({videos.length})</h2>
        <button
          onClick={() => window.location.href = '/creator/upload'}
          className="text-sm text-purple-400 hover:underline"
        >
          + Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map(v => (
          <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Thumbnail */}
            <div className="relative w-full h-36 bg-gray-800 flex items-center justify-center">
              <Play size={32} className="text-gray-600" />
              <div className="absolute top-2 right-2">
                <StatusBadge status={v.status} />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold truncate">{v.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs text-gray-400">{v.genre}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{v.region}</span>
                    {v.segment && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-purple-400">{v.segment}</span>
                      </>
                    )}
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white transition">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {v.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <DollarSign size={12} /> ${v.revenue.toFixed(2)}
                </span>
                <span className="text-gray-600">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                <button className="text-xs text-purple-400 hover:underline">Edit</button>
                <button className="text-xs text-gray-400 hover:underline">Analytics</button>
                <button 
                  onClick={() => handleDelete(v.id)}
                  className="text-xs text-red-400 hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}