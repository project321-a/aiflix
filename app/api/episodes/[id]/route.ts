import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            episodes: {
              orderBy: { episodeNumber: 'asc' },
            },
            creator: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    return NextResponse.json({ episode })
  } catch (error) {
    console.error('Error fetching episode:', error)
    return NextResponse.json({ error: 'Failed to fetch episode' }, { status: 500 })
  }
}