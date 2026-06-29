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
}

interface Props {
  title: string
  emoji: string
  region: string
  bgColor?: string
}

export default function RegionSection({ title, emoji, region, bgColor = '' }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const filtered = data.projects.filter((p: Project) => p.region === region).slice(0, 4)
        setProjects(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [region])

  const handleWatch = (project: Project) => {
    const episodeId = project.firstEpisode?.id || project.episodes[0]?.id
    if (episodeId) {
      router.push(`/watch/${episodeId}`)
    }
  }

  if (loading) return null
  if (projects.length === 0) return null

  return (
    <div className={`px-8 py-6 ${bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{emoji} {title}</h2>
        <button 
          onClick={() => router.push(`/browse?region=${encodeURIComponent(region)}`)}
          className="text-sm text-purple-400 hover:underline"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {projects.map((p) => (
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
}