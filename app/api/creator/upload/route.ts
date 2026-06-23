import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { title, description, genre, region, type, videoUrl, thumbnailUrl } = await request.json()

    if (!title || !videoUrl) {
      return NextResponse.json({ error: 'Title and video URL are required' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || '',
        genre: genre || 'Action',
        region: region || 'Africa',
        type: type || 'movie',
        fullVideoUrl: videoUrl,
        trailerClipUrl: thumbnailUrl || videoUrl,
        creatorId: user.id,
        isPublished: true,
        status: 'ready',
      }
    })

    return NextResponse.json({
      success: true,
      video: { id: video.id, title: video.title, status: video.status }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const videos = await prisma.video.findMany({
      where: { creatorId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ videos })

  } catch (error) {
    console.error('Fetch videos error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}