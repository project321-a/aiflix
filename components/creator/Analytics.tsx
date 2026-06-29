'use client'
import { useState, useEffect } from 'react'
import { BarChart3, Eye, Clock, Users, Globe, Monitor } from 'lucide-react'

export default function Analytics() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading analytics...</div>
  }

  return (
    <div>
      {/* Coming soon */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          View detailed analytics including watch time, audience geography, device breakdown, and revenue sources.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Eye size={14} className="inline mr-1" /> Views
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Clock size={14} className="inline mr-1" /> Watch Time
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Users size={14} className="inline mr-1" /> Audience
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Globe size={14} className="inline mr-1" /> Top Regions
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Monitor size={14} /> Devices
          </div>
        </div>
      </div>
    </div>
  )
}