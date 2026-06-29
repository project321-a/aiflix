'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Film } from 'lucide-react'

interface Project {
  id: string
  title: string
  genre: string
  region: string
  type: string
  coverImage: string
  episodes: any[]
  firstEpisode: { id: string } | null
  segment?: { name: string } | null // 👈 Added segment relation
  // OR if it's a direct string:
  // segment?: string | null
}

const SEGMENTS = [
  { name: 'Power Struggle', icon: '⚔️' },
  { name: 'War God', icon: '🗡️' },
  { name: 'Tycoon Life', icon: '💰' },
  { name: 'Workplace', icon: '🏢' },
  { name: 'Time Travel', icon: '⏳' },
  { name: 'Apocalypse', icon: '🌋' },
]

export default function SegmentsSection() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleWatch = (project: Project) => {
    const episodeId = project.firstEpisode?.id || project.episodes[0]?.id
    if (episodeId) {
      router.push(`/watch/${episodeId}`)
    }
  }

  if (loading) return <div className="px-8 py-6 text-gray-400 text-sm">Loading segments...</div>

  return (
    <div className="px-8 py-6 bg-gray-900/30">
      <h2 className="text-xl font-bold mb-4">🔥 Segments</h2>
      <div className="space-y-6">
        {SEGMENTS.map((s) => {
          // 👇 Fix: use segment.name if it's an object, or segment directly if it's a string
          const segmentProjects = projects
            .filter(p => p.segment?.name === s.name) // 👈 Access nested name
            .slice(0, 4)
          
          if (segmentProjects.length === 0) return null
          return (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>{s.icon}</span> {s.name}
                </h3>
                <button 
                  onClick={() => router.push(`/browse?segment=${encodeURIComponent(s.name)}`)}
                  className="text-sm text-purple-400 hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {segmentProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleWatch(p)}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      {p.coverImage ? (
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film size={24} className="text-gray-500" />
                      )}
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-semibold truncate">{p.title}</h4>
                      <div className="text-xs text-gray-400">{p.genre} · {p.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}