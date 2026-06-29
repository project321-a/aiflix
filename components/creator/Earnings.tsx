'use client'
import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react'
import StatsCard from './StatCard'

interface Video {
  id: string
  title: string
  views: number
  revenue: number
  createdAt: string
}

export default function Earnings() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'lifetime'>('lifetime')

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

  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0)
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)

  // Simulated time-based stats
  const stats = [
    { 
      icon: <DollarSign size={20} />, 
      label: 'Total Earnings', 
      value: `$${totalRevenue.toFixed(2)}`,
      change: '$12.40 this week',
      changeType: 'up' as const,
      color: 'text-green-400'
    },
    { 
      icon: <TrendingUp size={20} />, 
      label: 'Total Views', 
      value: totalViews.toLocaleString(),
      change: '+1.2K this month',
      changeType: 'up' as const,
      color: 'text-blue-400'
    },
    { 
      icon: <Calendar size={20} />, 
      label: 'Payout Status', 
      value: 'Ready',
      subText: 'Next payout: July 1, 2026',
      color: 'text-yellow-400'
    },
    { 
      icon: <Clock size={20} />, 
      label: 'Pending Payout', 
      value: `$${(totalRevenue * 0.7).toFixed(2)}`,
      subText: '70% creator share',
      color: 'text-purple-400'
    },
  ]

  // Timeframe filter
  const timeframes = ['today', 'week', 'month', 'lifetime']

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading earnings...</div>
  }

  return (
    <div>
      {/* Timeframe Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeframes.map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t as typeof timeframe)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              timeframe === t
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No revenue data yet
          </div>
        ) : (
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
          </div>
        )}
      </div>
    </div>
  )
}