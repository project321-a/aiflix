'use client'
import Link from 'next/link'
import { Film } from 'lucide-react'

export default function ContinueWatching() {
  // Replace with real watch history later
  const hasHistory = false

  if (!hasHistory) {
    return null // or show a "no history" message
  }

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">▶ Continue Watching</h2>
        <button className="text-sm text-purple-400 hover:underline">View All →</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Map watch history here */}
        <div className="text-gray-400">No watch history</div>
      </div>
    </div>
  )
}