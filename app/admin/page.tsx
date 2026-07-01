'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Users, Film, Video, DollarSign, 
  CheckCircle, XCircle, Trash2, UserCog 
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalProjects: number
  totalEpisodes: number
  totalRevenue: number
}

interface Project {
  id: string
  title: string
  genre: string
  region: string
  isPublished: boolean
  createdAt: string
  creator: { name: string | null; email: string }
  episodes: any[]
  views: number
  revenue: number
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  _count: { videos: number; projects: number }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'users'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    // We'll check role via API
  }, [session, status, router])

  useEffect(() => {
    if (activeTab === 'overview') fetchStats()
    if (activeTab === 'projects') fetchProjects()
    if (activeTab === 'users') fetchUsers()
  }, [activeTab])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !current }),
      })
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, isPublished: !current } : p))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateUserRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <LoadingSpinner />
        </div>
      </>
    )
  }

  if (!session) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 font-heading">🛠️ Admin Dashboard</h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'projects' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📁 Projects
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              👥 Users
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <Users className="text-purple-400 mb-2" size={24} />
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-400">Total Users</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <Film className="text-blue-400 mb-2" size={24} />
                    <div className="text-2xl font-bold">{stats.totalProjects}</div>
                    <div className="text-sm text-gray-400">Total Projects</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <Video className="text-green-400 mb-2" size={24} />
                    <div className="text-2xl font-bold">{stats.totalEpisodes}</div>
                    <div className="text-sm text-gray-400">Total Episodes</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <DollarSign className="text-yellow-400 mb-2" size={24} />
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">No projects found.</div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-semibold">{p.title}</h3>
                          <div className="text-sm text-gray-400">
                            {p.genre} · {p.region} · by {p.creator.name || p.creator.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.episodes.length} episodes · {p.views} views · ${p.revenue.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublish(p.id, p.isPublished)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              p.isPublished ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            {p.isPublished ? '✅ Published' : '📝 Draft'}
                          </button>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="text-red-400 hover:text-red-300 transition p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">No users found.</div>
                  ) : (
                    users.map(u => (
                      <div key={u.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <div className="font-semibold">{u.name || u.email}</div>
                          <div className="text-sm text-gray-400">{u.email}</div>
                          <div className="text-xs text-gray-500">
                            Role: <span className="font-medium">{u.role}</span> · 
                            {u._count.projects} projects · {u._count.videos} videos
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="creator">Creator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-400 hover:text-red-300 transition p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}