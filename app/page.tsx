'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HeroBanner from '../components/home/HeroBanner'
import ContinueWatching from '../components/home/ContinueWatching'
import GenreFilter from '../components/home/GenreFilter'
import SegmentFilter from '../components/home/SegmentFilter'
import VideoRow from '../components/home/VideoRow'
import SegmentsSection from '../components/home/SegmentSection'
import RegionSection from '../components/home/RegionSection'
import PremiumUpgrade from '../components/home/PremiumUpgrade'
import Testimonials from '../components/home/Testimonials'
import Footer from '../components/home/Footer'

export default function HomePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

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
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
          <div className="text-gray-400">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <HeroBanner projects={projects} />
      
      <ContinueWatching />
      
      <GenreFilter 
        selectedGenre={selectedGenre} 
        setSelectedGenre={setSelectedGenre} 
      />
      
      <SegmentFilter 
        selectedSegment={selectedSegment} 
        setSelectedSegment={setSelectedSegment} 
      />

      <VideoRow title="🔥 Trending Now" type="trending" segment={selectedSegment} />
      
      <VideoRow title="⭐ Recommended For You" type="recommended" segment={selectedSegment} />
      
      <VideoRow title="🏆 Most Popular" type="popular" segment={selectedSegment} />
      
      <SegmentsSection />
      
      <RegionSection title="African Originals" emoji="🌍" region="Africa" />
      
      <RegionSection title="KDrama" emoji="🇰🇷" region="KDrama" bgColor="bg-gray-900/30" />
      
      <RegionSection title="CDrama" emoji="🇨🇳" region="CDrama" />
      
      <PremiumUpgrade />
      
      <Testimonials />
      
      <Footer />
    </div>
  )
}