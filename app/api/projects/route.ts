import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''

    // Build where clause
    let where: any = { isPublished: true }

    // If search term exists, filter by title, description, genre, region
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ]
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        episodes: {
          orderBy: { episodeNumber: 'asc' },
          take: 1,
        },
      },
    })

    // Format response
    const formatted = projects.map(p => ({
      ...p,
      firstEpisode: p.episodes[0] || null,
    }))

    return NextResponse.json({ projects: formatted })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}