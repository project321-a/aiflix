'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Play, Film, Eye, Calendar, User } from 'lucide-react'

interface Episode {
  id: string
  title: string
  description: string
  episodeNumber: number
  videoUrl: string
  thumbnail: string
  duration: string
  views: number
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
    email: string
  }
}

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleWatchEpisode = (episode: Episode) => {
    router.push(`/watch/${episode.id}`)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-gray-400">Loading project...</div>
          </div>
        </div>
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-12 text-gray-400">
              <Film size={48} className="mx-auto mb-3 opacity-50" />
              <p>Project not found.</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const isMovie = project.type === 'movie'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
            <ArrowLeft size={18} /> Back to Projects
          </Link>

          {/* Project Header */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-64 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Film size={48} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                  <span>{project.genre}</span>
                  <span>·</span>
                  <span>{project.region}</span>
                  <span>·</span>
                  <span>{isMovie ? '🎬 Movie' : '📺 Series'}</span>
                </div>
                {project.description && (
                  <p className="text-gray-300 mt-3">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {project.creator?.name || 'Creator'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {project.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <h2 className="text-xl font-bold mb-4">
            {isMovie ? '🎬 Movie' : `📺 Episodes (${project.episodes.length})`}
          </h2>

          {project.episodes.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center text-gray-400">
              <p>No episodes available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => handleWatchEpisode(ep)}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-purple-600 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play size={20} className="text-purple-400" />
                    </div>
                    <div>
                      {!isMovie && (
                        <span className="text-sm text-gray-400">Episode {ep.episodeNumber}</span>
                      )}
                      <h3 className="font-semibold">{ep.title}</h3>
                      {ep.duration && (
                        <span className="text-xs text-gray-500">{ep.duration}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {ep.views || 0} views
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}