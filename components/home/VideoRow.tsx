'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  views: number          // 👈 Added
  createdAt: string      // 👈 Added
}

interface Props {
  title: string
  type?: 'trending' | 'recommended' | 'popular'
  genre?: string
  region?: string
  segment?: string | null
}

export default function VideoRow({ title, type = 'trending', segment = null }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let url = '/api/projects'
    if (segment) {
      url += `?segment=${encodeURIComponent(segment)}`
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let filtered = data.projects || []
        // Apply sorting based on type
        if (type === 'trending') {
          filtered = filtered.sort((a: Project, b: Project) => (b.views || 0) - (a.views || 0))
        } else if (type === 'popular') {
          filtered = filtered.sort((a: Project, b: Project) => (b.views || 0) - (a.views || 0))
        } else if (type === 'recommended') {
          // For now, just show random or latest
          filtered = filtered.sort((a: Project, b: Project) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }
        setProjects(filtered.slice(0, 6))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [type, segment])

  const handleWatch = (project: Project) => {
    const episodeId = project.firstEpisode?.id || project.episodes[0]?.id
    if (episodeId) {
      router.push(`/watch/${episodeId}`)
    }
  }

  if (loading) {
    return (
      <div className="px-8 py-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (projects.length === 0) {
    return null // Hide row if no projects
  }

  return (
    <div className={`px-8 py-6 ${type === 'recommended' ? 'bg-gray-900/50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href="/browse" className="text-sm text-purple-400 hover:underline">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {projects.map(p => (
          <div
            key={p.id}
            onClick={() => handleWatch(p)}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer"
          >
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              {p.coverImage ? (
                <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <Film size={32} className="text-gray-600" />
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold truncate">{p.title}</h3>
              <div className="text-xs text-gray-400 mt-1">
                {p.genre} · {p.region}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes.length} episodes`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}