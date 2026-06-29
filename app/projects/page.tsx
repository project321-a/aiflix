'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Film, Eye, Calendar } from 'lucide-react'

interface Episode {
  id: string
  title: string
  episodeNumber: number
}

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  coverImage: string
  episodes: Episode[]
  views: number
  createdAt: string
  creator: {
    name: string
  }
}

export default function ProjectsPage() {
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-gray-400">Loading projects...</div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">🎬 All Projects</h1>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Film size={48} className="mx-auto mb-3 opacity-50" />
              <p>No projects available yet.</p>
              <p className="text-sm">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer h-full">
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      {p.coverImage ? (
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film size={48} className="text-gray-600" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        {p.genre} · {p.region}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes.length} episodes`}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {p.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}