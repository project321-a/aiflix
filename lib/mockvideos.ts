export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
  region: string;
  type: 'movie' | 'series' | 'short';
  episodes?: number;
  duration: string;
  views: number;
  likes: number;
  creatorName: string;
  isPremium: boolean;
  isFeatured: boolean;
  uploadedAt: string;
  rating: number;
  segment: string; // 👈 Added: Power Struggle, War God, Tycoon Life, Workplace, Time Travel, Apocalypse
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Echoes of Lagos',
    thumbnail: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&h=225&fit=crop',
    description: 'An AI-generated epic following three generations of a Lagos family through war, love, and redemption.',
    genre: 'Drama',
    region: 'Africa',
    type: 'series',
    episodes: 12,
    duration: '45 min/ep',
    views: 245000,
    likes: 18200,
    creatorName: 'AfroAI Studio',
    isPremium: false,
    isFeatured: true,
    uploadedAt: '2025-11-01',
    rating: 4.8,
    segment: 'Power Struggle'
  },
  {
    id: '2',
    title: 'Seoul Dream',
    thumbnail: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=225&fit=crop',
    description: 'A KDrama-style AI romance series set in futuristic Seoul. Two rivals discover love while building an AI.',
    genre: 'Romance',
    region: 'KDrama',
    type: 'series',
    episodes: 16,
    duration: '52 min/ep',
    views: 892000,
    likes: 74300,
    creatorName: 'HanAI Films',
    isPremium: false,
    isFeatured: true,
    uploadedAt: '2025-10-15',
    rating: 4.9,
    segment: 'Workplace'
  },
  {
    id: '3',
    title: 'Dragon of Forbidden City',
    thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=225&fit=crop',
    description: 'CDrama historical epic. A scholar must navigate palace intrigue and an ancient dragon curse.',
    genre: 'Historical',
    region: 'CDrama',
    type: 'movie',
    duration: '2h 18min',
    views: 1200000,
    likes: 98000,
    creatorName: 'SilkRoad AI',
    isPremium: true,
    isFeatured: true,
    uploadedAt: '2025-09-20',
    rating: 4.7,
    segment: 'War God'
  },
  {
    id: '4',
    title: 'Neon Paris',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=225&fit=crop',
    description: 'A French thriller where a detective chases an AI-generated phantom across cyberpunk Paris streets.',
    genre: 'Thriller',
    region: 'Europe',
    type: 'series',
    episodes: 8,
    duration: '58 min/ep',
    views: 450000,
    likes: 32100,
    creatorName: 'VisionEurope',
    isPremium: true,
    isFeatured: false,
    uploadedAt: '2025-11-10',
    rating: 4.6,
    segment: 'Time Travel'
  },
  {
    id: '5',
    title: 'Savanna Warriors',
    thumbnail: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=225&fit=crop',
    description: 'Africa meets fantasy in this AI-animated epic. Warriors unite to defeat an ancient evil.',
    genre: 'Action',
    region: 'Africa',
    type: 'movie',
    duration: '1h 55min',
    views: 670000,
    likes: 55400,
    creatorName: 'AfroAI Studio',
    isPremium: false,
    isFeatured: false,
    uploadedAt: '2025-08-05',
    rating: 4.5,
    segment: 'War God'
  },
  {
    id: '6',
    title: 'Midnight in Tokyo',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=225&fit=crop',
    description: 'Anime-style AI series. A jazz musician discovers a door that leads to 1940s Tokyo.',
    genre: 'Romance',
    region: 'Japan',
    type: 'series',
    episodes: 10,
    duration: '28 min/ep',
    views: 380000,
    likes: 41200,
    creatorName: 'NeoAnime Labs',
    isPremium: false,
    isFeatured: true,
    uploadedAt: '2025-10-28',
    rating: 4.8,
    segment: 'Time Travel'
  },
  {
    id: '7',
    title: 'The Algorithm',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=225&fit=crop',
    description: 'A Silicon Valley thriller. A sentient AI forces its creator to choose between fame and humanity.',
    genre: 'Sci-Fi',
    region: 'USA',
    type: 'movie',
    duration: '2h 05min',
    views: 920000,
    likes: 76800,
    creatorName: 'DeepMind Creative',
    isPremium: true,
    isFeatured: true,
    uploadedAt: '2025-11-20',
    rating: 4.9,
    segment: 'Apocalypse'
  },
  {
    id: '8',
    title: 'Afrobeats Forever',
    thumbnail: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=225&fit=crop',
    description: 'Music documentary exploring the AI-generated evolution of Afrobeats across 5 decades.',
    genre: 'Documentary',
    region: 'Africa',
    type: 'series',
    episodes: 6,
    duration: '35 min/ep',
    views: 290000,
    likes: 24500,
    creatorName: 'BeatVision Africa',
    isPremium: false,
    isFeatured: false,
    uploadedAt: '2025-09-01',
    rating: 4.4,
    segment: 'Tycoon Life'
  },
  {
    id: '9',
    title: 'Goblin King Returns',
    thumbnail: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=225&fit=crop',
    description: 'KDrama supernatural fantasy. A 900-year-old goblin finds his final bride in modern Busan.',
    genre: 'Fantasy',
    region: 'KDrama',
    type: 'series',
    episodes: 20,
    duration: '60 min/ep',
    views: 1500000,
    likes: 142000,
    creatorName: 'HanAI Films',
    isPremium: true,
    isFeatured: true,
    uploadedAt: '2025-10-01',
    rating: 5.0,
    segment: 'Power Struggle'
  },
  {
    id: '10',
    title: 'Nairobi Nights',
    thumbnail: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=225&fit=crop',
    description: 'A gripping crime series set in Nairobi. Detective Amara follows a trail of stolen AI tech.',
    genre: 'Crime',
    region: 'Africa',
    type: 'series',
    episodes: 10,
    duration: '48 min/ep',
    views: 310000,
    likes: 27900,
    creatorName: 'SavannaDrama',
    isPremium: false,
    isFeatured: false,
    uploadedAt: '2025-11-05',
    rating: 4.6,
    segment: 'Workplace'
  }
];

export const SEGMENTS = [
  'Power Struggle',
  'War God',
  'Tycoon Life',
  'Workplace',
  'Time Travel',
  'Apocalypse'
];

export const GENRES = ['All', 'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary'];
export const REGIONS = ['All', 'Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA'];