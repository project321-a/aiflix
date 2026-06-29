'use client'
import { useState, useEffect } from 'react'
import { X, Plus, Play, Trash2, Edit, Film } from 'lucide-react'

interface Episode {
  id: string
  title: string
  description?: string
  episodeNumber: number
  videoUrl?: string
  thumbnail?: string
  duration?: string
  views: number
  status: string
}

interface Project {
  id: string
  title: string
  description?: string
  genre: string
  region: string
  type: string
  isPublished: boolean
  episodes: Episode[]
}

interface Props {
  project: Project
  onClose: () => void
  onUpdate: () => void
}

export default function ProjectDetail({ project, onClose, onUpdate }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>(project.episodes || [])
  const [showEpisodeForm, setShowEpisodeForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(project.isPublished || false)

  const isMovie = project.type === 'movie'

  const togglePublish = async () => {
    const newState = !isPublished
    try {
      const res = await fetch(`/api/creator/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newState })
      })
      if (res.ok) {
        setIsPublished(newState)
        onUpdate() // Refresh project list
      } else {
        alert('Failed to update publish status')
      }
    } catch (error) {
      console.error(error)
      alert('Error updating')
    }
  }

  const addEpisode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      episodeNumber: parseInt(formData.get('episodeNumber') as string) || 1,
      videoUrl: formData.get('videoUrl'),
      thumbnail: formData.get('thumbnail') || undefined,
      duration: formData.get('duration') || undefined,
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/creator/projects/${project.id}/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const newEpisode = await res.json()
        setEpisodes([...episodes, newEpisode])
        setShowEpisodeForm(false)
        onUpdate()
      } else {
        alert('Failed to add episode')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const deleteEpisode = async (episodeId: string) => {
    if (!confirm('Delete this episode?')) return
    try {
      const res = await fetch(
        `/api/creator/projects/${project.id}/episodes?episodeId=${episodeId}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setEpisodes(episodes.filter(e => e.id !== episodeId))
        onUpdate()
      } else {
        alert('Failed to delete episode')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="text-sm text-gray-400">
              {project.genre} · {project.region} · {isMovie ? '🎬 Movie' : '📺 Series'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={togglePublish}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isPublished ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isPublished ? '✅ Published' : '📢 Publish'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Project description */}
          {project.description && (
            <p className="text-gray-300 mb-6">{project.description}</p>
          )}

          {/* Episodes / Movie section */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isMovie ? '🎬 Movie' : '📺 Episodes'} ({episodes.length})
            </h3>
            <button
              onClick={() => setShowEpisodeForm(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Plus size={16} />
              {isMovie ? 'Upload Movie' : 'Add Episode'}
            </button>
          </div>

          {/* Episode list */}
          {episodes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-800/50 rounded-lg">
              <Film size={32} className="mx-auto mb-2 opacity-50" />
              <p>No {isMovie ? 'movie uploaded' : 'episodes added yet'}</p>
              <button
                onClick={() => setShowEpisodeForm(true)}
                className="mt-2 text-purple-400 hover:underline text-sm"
              >
                {isMovie ? 'Upload your movie' : 'Add your first episode'} →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {episodes.map((ep) => (
                <div key={ep.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      {!isMovie && (
                        <span className="text-sm text-gray-400">S1E{ep.episodeNumber}</span>
                      )}
                      <span className="font-medium">{ep.title}</span>
                      {ep.duration && (
                        <span className="text-xs text-gray-500">{ep.duration}</span>
                      )}
                    </div>
                    {ep.description && (
                      <div className="text-sm text-gray-400">{ep.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {ep.views || 0} views · Status: {ep.status || 'ready'}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEpisode(ep.id)}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Episode form (modal inside modal) */}
          {showEpisodeForm && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">
                  {isMovie ? 'Upload Movie' : 'Add Episode'}
                </h3>
                <form onSubmit={addEpisode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Episode title"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Brief description"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-[60px]"
                    />
                  </div>
                  {!isMovie && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Episode Number *</label>
                      <input
                        name="episodeNumber"
                        type="number"
                        defaultValue={episodes.length + 1}
                        min="1"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Video URL *</label>
                    <input
                      name="videoUrl"
                      type="url"
                      placeholder="YouTube or MP4 link"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail URL (optional)</label>
                    <input
                      name="thumbnail"
                      type="url"
                      placeholder="Image URL"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (optional)</label>
                    <input
                      name="duration"
                      type="text"
                      placeholder="e.g. 45 min"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : isMovie ? 'Upload Movie' : 'Add Episode'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEpisodeForm(false)}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}