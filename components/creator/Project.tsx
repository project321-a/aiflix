'use client'
import { useState, useEffect } from 'react'
import { Film, Plus, Edit, Trash2, Eye } from 'lucide-react'
import ProjectDetail from './ProjectDetail'
import EditProjectModal from './EditProjectModal'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  status: string
  isPublished: boolean
  episodes: any[]
  views: number
  revenue: number
  createdAt: string
  coverImage?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/creator/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      genre: formData.get('genre'),
      region: formData.get('region'),
      type: formData.get('type') || 'series',
      segmentId: formData.get('segmentId') || undefined,
    }

    try {
      const res = await fetch('/api/creator/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchProjects()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong')
    }
  }

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.title)
    setSelectedProject(project)
    setShowDetail(true)
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading projects...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                name="title"
                type="text"
                placeholder="Project title"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Brief description"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Genre *</label>
                <select
                  name="genre"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                >
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Historical">Historical</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Region *</label>
                <select
                  name="region"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                >
                  <option value="Africa">Africa</option>
                  <option value="KDrama">KDrama</option>
                  <option value="CDrama">CDrama</option>
                  <option value="Europe">Europe</option>
                  <option value="Japan">Japan</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="Latin America">Latin America</option>
                </select>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Project Type *</label>
              <select
                name="type"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              >
                <option value="series">Series (multiple episodes)</option>
                <option value="movie">Movie (single video)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose "Series" for multiple episodes, or "Movie" for a single video.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Segment</label>
              <select
                name="segmentId"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                <option value="">None</option>
                <option value="Power Struggle">Power Struggle</option>
                <option value="War God">War God</option>
                <option value="Tycoon Life">Tycoon Life</option>
                <option value="Workplace">Workplace</option>
                <option value="Time Travel">Time Travel</option>
                <option value="Apocalypse">Apocalypse</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
          <Film size={40} className="mx-auto mb-3 opacity-50" />
          <p>No projects yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-purple-400 hover:underline"
          >
            Create your first project →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-600 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{p.title}</h4>
                  <div className="text-xs text-gray-400 mt-1">
                    {p.genre} · {p.region}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.type === 'movie' ? '🎬 Movie' : '📺 Series'} · {p.episodes?.length || 0} episodes · {p.views || 0} views
                  </div>
                  <div className="text-xs mt-2">
                    {p.isPublished ? (
                      <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">✅ Published</span>
                    ) : (
                      <span className="text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">📝 Draft</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setEditingProject(p); 
                      setShowEditModal(true); 
                    }}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-red-400 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetail && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setShowDetail(false)}
          onUpdate={fetchProjects}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => { setShowEditModal(false); setEditingProject(null); }}
          onUpdate={fetchProjects}
        />
      )}
    </div>
  )
}