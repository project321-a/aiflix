'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Film } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  region: string;
  type: string;
  coverImage: string;
  episodes: Episode[];
  firstEpisode: Episode | null;
  views: number;
  createdAt: string;
  creator: { name: string };
}

const GENRES = ['All', 'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary'];
const REGIONS = ['All', 'Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA', 'India', 'Latin America'];

export default function BrowseClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('All');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');

  // Fetch projects when searchQuery changes
  useEffect(() => {
    let url = '/api/projects';
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, [searchQuery]);

  // Apply filters
  let filtered = projects;
  if (genre !== 'All') {
    filtered = filtered.filter(p => p.genre === genre);
  }
  if (region !== 'All') {
    filtered = filtered.filter(p => p.region === region);
  }
  if (type === 'Movies') {
    filtered = filtered.filter(p => p.type === 'movie');
  }
  if (type === 'Series') {
    filtered = filtered.filter(p => p.type === 'series');
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-gray-400">Loading content...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Browse AI Content</h1>
          {searchQuery && (
            <p className="text-gray-400 mb-4">
              Search results for: <span className="text-purple-400 font-semibold">"{searchQuery}"</span>
            </p>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>

            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>

            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              <option value="All">All Types</option>
              <option value="Movies">Movies</option>
              <option value="Series">Series</option>
            </select>

            <span className="text-gray-400 text-sm self-center">
              Found {filtered.length} titles
            </span>
          </div>

          {/* Projects Grid */}
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No content available for these filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(p => {
                // If no first episode, skip
                if (!p.firstEpisode) return null;
                return (
                  <Link key={p.id} href={`/watch/${p.firstEpisode.id}`}>
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition cursor-pointer h-full">
                      <div className="aspect-video bg-gray-800 flex items-center justify-center">
                        {p.coverImage ? (
                          <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <Film size={32} className="text-gray-600" />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold truncate">{p.title}</h3>
                        <div className="text-xs text-gray-400 mt-1">
                          {p.genre} · {p.region}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {p.type === 'movie' ? '🎬 Movie' : `📺 ${p.episodes.length} episodes`}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}