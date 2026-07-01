'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Film } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  region: string
  type: string
  coverImage: string
  firstEpisode: { id: string } | null
  episodes: any[]
}

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('All')
  const [region, setRegion] = useState('All')

  const genres = ['All', 'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary']
  const regions = ['All', 'Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA', 'India', 'Latin America']

  useEffect(() => {
    let url = '/api/projects'
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => {
        setProjects([])
        setLoading(false)
      })
  }, [searchQuery])

  const filtered = projects.filter(p => {
    if (genre !== 'All' && p.genre !== genre) return false
    if (region !== 'All' && p.region !== region) return false
    return true
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="text-gray-400">Loading content...</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ... rest of your browse page (filters and grid)
  // (I'll provide the full file in the next message if needed)
}