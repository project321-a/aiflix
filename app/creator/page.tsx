'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { 
  LayoutDashboard, Upload as UploadIcon, Film, DollarSign, 
  BarChart3, MessageSquare, Settings as SettingsIcon
} from 'lucide-react'

// Import components
import Dashboard from '@/components/creator/Dashboard'
import Upload from '@/components/creator/upload'  // ✅ Your upload form component
import Videos from '@/components/creator/Videos'
import Earnings from '@/components/creator/Earnings'
import Analytics from '@/components/creator/Analytics'
import Comments from '@/components/creator/Comments'
import Settings from '@/components/creator/Settings'
import Projects from '@/components/creator/Project'

export default function CreatorStudio() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-center">
            <Film size={48} className="mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Creator Studio</h2>
            <p className="text-gray-400">Please sign in to access creator tools</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Film size={16} /> },
    { id: 'upload', label: 'Upload', icon: <UploadIcon size={16} /> },  // ✅ Fixed
    { id: 'videos', label: 'Videos', icon: <Film size={16} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare size={16} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">🎬 Creator Studio</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage your AI-generated content
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-8 bg-gray-900 rounded-xl p-1 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'projects' && <Projects />}
            {activeTab === 'upload' && <Upload />}
            {activeTab === 'videos' && <Videos />}
            {activeTab === 'earnings' && <Earnings />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'comments' && <Comments />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </>
  )
}