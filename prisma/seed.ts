import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create a test user (if it doesn't exist)
  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  })

  let testUser
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hashedPassword,
        subscriptionTier: 'free',
      }
    })
    console.log('✅ Test user created: test@example.com / password123')
  } else {
    testUser = existingUser
    console.log('✅ Test user already exists')
  }

  // 2. Clear existing videos (avoid duplicates)
  await prisma.video.deleteMany()

  // 3. Insert mock videos
  const videos = [
    {
      id: '1',
      title: 'Echoes of Lagos',
      description: 'An AI-generated epic following three generations of a Lagos family through war, love, and redemption.',
      genre: 'Drama',
      region: 'Africa',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&h=225&fit=crop',
      fullVideoUrl: null, // Will be added later with Cloudflare
      creatorId: testUser.id,
      views: 245000,
      isPublished: true,
    },
    {
      id: '2',
      title: 'Seoul Dream',
      description: 'A KDrama-style AI romance series set in futuristic Seoul. Two rivals discover love while building an AI.',
      genre: 'Romance',
      region: 'KDrama',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 892000,
      isPublished: true,
    },
    {
      id: '3',
      title: 'Dragon of Forbidden City',
      description: 'CDrama historical epic. A scholar must navigate palace intrigue and an ancient dragon curse.',
      genre: 'Historical',
      region: 'CDrama',
      type: 'movie',
      trailerClipUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 1200000,
      isPublished: true,
    },
    {
      id: '4',
      title: 'Neon Paris',
      description: 'A French thriller where a detective chases an AI-generated phantom across cyberpunk Paris streets.',
      genre: 'Thriller',
      region: 'Europe',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 450000,
      isPublished: true,
    },
    {
      id: '5',
      title: 'Savanna Warriors',
      description: 'Africa meets fantasy in this AI-animated epic. Warriors unite to defeat an ancient evil.',
      genre: 'Action',
      region: 'Africa',
      type: 'movie',
      trailerClipUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 670000,
      isPublished: true,
    },
    {
      id: '6',
      title: 'Midnight in Tokyo',
      description: 'Anime-style AI series. A jazz musician discovers a door that leads to 1940s Tokyo.',
      genre: 'Romance',
      region: 'Japan',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 380000,
      isPublished: true,
    },
    {
      id: '7',
      title: 'The Algorithm',
      description: 'A Silicon Valley thriller. A sentient AI forces its creator to choose between fame and humanity.',
      genre: 'Sci-Fi',
      region: 'USA',
      type: 'movie',
      trailerClipUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 920000,
      isPublished: true,
    },
    {
      id: '8',
      title: 'Afrobeats Forever',
      description: 'Music documentary exploring the AI-generated evolution of Afrobeats across 5 decades.',
      genre: 'Documentary',
      region: 'Africa',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 290000,
      isPublished: true,
    },
    {
      id: '9',
      title: 'Goblin King Returns',
      description: 'KDrama supernatural fantasy. A 900-year-old goblin finds his final bride in modern Busan.',
      genre: 'Fantasy',
      region: 'KDrama',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 1500000,
      isPublished: true,
    },
    {
      id: '10',
      title: 'Nairobi Nights',
      description: 'A gripping crime series set in Nairobi. Detective Amara follows a trail of stolen AI tech.',
      genre: 'Crime',
      region: 'Africa',
      type: 'series',
      trailerClipUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=225&fit=crop',
      fullVideoUrl: null,
      creatorId: testUser.id,
      views: 310000,
      isPublished: true,
    },
  ]

  for (const video of videos) {
    await prisma.video.create({
      data: video
    })
  }

  console.log(`✅ ${videos.length} videos seeded`)
  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })