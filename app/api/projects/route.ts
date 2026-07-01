import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Fetching projects...')
    
    // First, test if Prisma can connect
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
          take: 1,
        },
      },
    })

    console.log(`✅ Found ${projects.length} projects`)

    const formatted = projects.map(p => ({
      ...p,
      firstEpisode: p.episodes[0] || null,
    }))

    return NextResponse.json({ projects: formatted })
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
    return NextResponse.json(
      { error: String(error) }, // 👈 Send the error message as string
      { status: 500 }
    )
  }
}