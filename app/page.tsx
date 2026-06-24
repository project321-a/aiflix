'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MOCK_VIDEOS } from '../lib/mockvideos';
import VideoCard from '../components/videocard';
import Navbar from '../components/Navbar';
import type { Video } from '../lib/mockvideos';
import { Play, Crown } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [continueWatching, setContinueWatching] = useState<Video[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  // Fetch subscription status
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.plan) setSubscriptionTier(data.plan);
        })
        .catch(() => {});
    }
  }, [session]);

  // Get featured videos (isFeatured = true)
  const featured = MOCK_VIDEOS.filter(v => v.isFeatured);
  const hero = featured[0] || MOCK_VIDEOS[0];

  // Trending: sort by views
  const trending = [...MOCK_VIDEOS].sort((a, b) => b.views - a.views).slice(0, 8);

  // New Releases: sort by upload date
  const newReleases = [...MOCK_VIDEOS].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 8);

  // Region-based sections
  const africaContent = MOCK_VIDEOS.filter(v => v.region === 'Africa').slice(0, 6);
  const kdramaContent = MOCK_VIDEOS.filter(v => v.region === 'KDrama').slice(0, 6);
  const cdramaContent = MOCK_VIDEOS.filter(v => v.region === 'CDrama').slice(0, 6);
  const europeContent = MOCK_VIDEOS.filter(v => v.region === 'Europe').slice(0, 6);

  // Premium content
  const premiumContent = MOCK_VIDEOS.filter(v => v.isPremium).slice(0, 6);

  // Simulate continue watching (for logged-in users)
  useEffect(() => {
    if (session) {
      const shuffled = [...MOCK_VIDEOS].sort(() => 0.5 - Math.random());
      setContinueWatching(shuffled.slice(0, 4));
    }
  }, [session]);

  const handleOpenVideo = (video: Video) => {
    router.push(`/watch/${video.id}`);
  };

  // Navigation to browse with filter
  const handleBrowse = (genre?: string, region?: string) => {
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (region) params.set('region', region);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        
        {/* Hero Section */}
        <div
          className="relative h-[500px] bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="relative max-w-4xl px-8 py-32">
            <div className="flex gap-2 mb-4">
              <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                {hero.genre}
              </span>
              <span className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                {hero.region}
              </span>
              {hero.isPremium && (
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                  <Crown size={12} /> PREMIUM
                </span>
              )}
            </div>
            <h1 className="text-5xl font-bold mb-3">{hero.title}</h1>
            <p className="text-gray-300 text-lg max-w-xl mb-6">{hero.description}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleOpenVideo(hero)}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Play size={20} fill="white" /> Watch Now
              </button>
              <button
                onClick={() => handleBrowse(hero.genre, hero.region)}
                className="bg-gray-800/70 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition border border-gray-600"
              >
                More {hero.genre}
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-8 py-6 space-y-10">

          {/* Continue Watching (logged-in users only) */}
          {session && continueWatching.length > 0 && (
            <SectionRow 
              title="⏳ Continue Watching" 
              videos={continueWatching} 
              onOpen={handleOpenVideo} 
              viewAll={() => router.push('/browse')}
            />
          )}

          {/* Trending Now */}
          <SectionRow 
            title="🔥 Trending Now" 
            videos={trending} 
            onOpen={handleOpenVideo} 
            viewAll={() => handleBrowse()}
          />

          {/* New Releases */}
          <SectionRow 
            title="🆕 New Releases" 
            videos={newReleases} 
            onOpen={handleOpenVideo} 
            viewAll={() => handleBrowse()}
          />

          {/* Premium Content */}
          <SectionRow 
            title="👑 Premium Exclusives" 
            videos={premiumContent} 
            onOpen={handleOpenVideo} 
            viewAll={() => handleBrowse()}
            premiumBadge
          />

          {/* African Stories */}
          {africaContent.length > 0 && (
            <SectionRow 
              title="🌍 African Stories" 
              videos={africaContent} 
              onOpen={handleOpenVideo} 
              viewAll={() => handleBrowse(undefined, 'Africa')}
            />
          )}

          {/* KDrama Series */}
          {kdramaContent.length > 0 && (
            <SectionRow 
              title="🇰🇷 KDrama AI Series" 
              videos={kdramaContent} 
              onOpen={handleOpenVideo} 
              viewAll={() => handleBrowse(undefined, 'KDrama')}
            />
          )}

          {/* CDrama Epics */}
          {cdramaContent.length > 0 && (
            <SectionRow 
              title="🇨🇳 CDrama Epics" 
              videos={cdramaContent} 
              onOpen={handleOpenVideo} 
              viewAll={() => handleBrowse(undefined, 'CDrama')}
            />
          )}

          {/* European Thrillers */}
          {europeContent.length > 0 && (
            <SectionRow 
              title="🇪🇺 European Thrillers" 
              videos={europeContent} 
              onOpen={handleOpenVideo} 
              viewAll={() => handleBrowse(undefined, 'Europe')}
            />
          )}

          {/* Genre Quick Access */}
          <div>
            <h2 className="text-xl font-bold mb-4">🎯 Browse by Genre</h2>
            <div className="flex flex-wrap gap-3">
              {['Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Fantasy', 'Comedy', 'Horror', 'Documentary'].map(genre => (
                <button
                  key={genre}
                  onClick={() => handleBrowse(genre)}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-purple-500 px-4 py-2 rounded-full text-sm transition"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Call to Action - For non-subscribers */}
          {(!session || subscriptionTier === 'free') && (
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">🚀 Unlock All Content</h2>
              <p className="text-gray-300 mb-4">Subscribe to AIFlix Premium and watch unlimited AI movies, series, and shorts — no ads!</p>
              <button
                onClick={() => router.push('/subscribe')}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ✅ Reusable Section Row Component
interface SectionRowProps {
  title: string;
  videos: Video[];
  onOpen: (video: Video) => void;
  viewAll: () => void;
  premiumBadge?: boolean;
}

function SectionRow({ title, videos, onOpen, viewAll, premiumBadge }: SectionRowProps) {
  if (videos.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={viewAll}
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {videos.map(video => (
          <div key={video.id} className="relative">
            {premiumBadge && video.isPremium && (
              <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <Crown size={10} /> PREMIUM
              </div>
            )}
            <VideoCard video={video} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}/ /   r e d e p l o y  
 