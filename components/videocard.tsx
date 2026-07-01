'use client'
import { Play, Star, Eye, Crown } from 'lucide-react'
import type { Video } from '../lib/mockvideos'

interface Props {
  video: Video
  onOpen: (v: Video) => void
  index?: number // 👈 Added for staggered animation
}

export default function VideoCard({ video, onOpen, index = 0 }: Props) {
  // Staggered delay (50ms per card, max 300ms)
  const delay = Math.min(index * 50, 300)

  return (
    <div
      onClick={() => onOpen(video)}
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-purple-600 transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-900/20 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-video">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Play size={20} fill="white" color="white" />
          </div>
        </div>
        {video.isPremium && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Crown size={10} /> PREMIUM
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-black/70 text-gray-300 text-xs px-2 py-1 rounded">
          {video.type === 'series' ? `${video.episodes} eps` : video.duration}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{video.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">{video.genre}</span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" /> {video.rating}</span>
            <span className="flex items-center gap-1"><Eye size={10} /> {(video.views / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>
    </div>
  )
}