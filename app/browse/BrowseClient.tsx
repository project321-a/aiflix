'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_VIDEOS, GENRES, REGIONS } from '@/lib/mockvideos';
import VideoCard from '@/components/videocard';
import type { Video } from '@/lib/mockvideos';

export default function BrowseClient() {
  const searchParams = useSearchParams();

  const initialGenre = searchParams.get('genre') || 'All';
  const initialRegion = searchParams.get('region') || 'All';

  const [genre, setGenre] = useState(initialGenre);
  const [region, setRegion] = useState(initialRegion);
  const [type, setType] = useState('All');

  let filtered = MOCK_VIDEOS;

  if (genre !== 'All') {
    filtered = filtered.filter(v => v.genre === genre);
  }

  if (region !== 'All') {
    filtered = filtered.filter(v => v.region === region);
  }

  if (type === 'Movies') {
    filtered = filtered.filter(v => v.type === 'movie');
  }

  if (type === 'Series') {
    filtered = filtered.filter(v => v.type === 'series');
  }

  const handleOpenVideo = (video: Video) => {
    alert(`Opening: ${video.title}\n(Player coming in Step 3!)`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Browse AI Content</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={genre} onChange={e => setGenre(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>

        <select value={region} onChange={e => setRegion(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>

        <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
          <option value="All">All Types</option>
          <option value="Movies">Movies</option>
          <option value="Series">Series</option>
        </select>

        <span className="text-gray-400 text-sm self-center">
          Found {filtered.length} titles
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No videos match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(v => (
            <VideoCard key={v.id} video={v} onOpen={handleOpenVideo} />
          ))}
        </div>
      )}
    </div>
  );
}