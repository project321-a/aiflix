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

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const genre = formData.get('genre') as string
    const region = formData.get('region') as string
    const type = formData.get('type') as string
    const segmentName = formData.get('segment') as string
    const videoUrl = formData.get('videoUrl') as string
    const thumbnailUrl = formData.get('thumbnailUrl') as string
    const videoFile = formData.get('videoFile') as File | null

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    let finalVideoUrl = videoUrl || ''

    if (videoFile) {
      const bytes = await videoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      finalVideoUrl = `data:${videoFile.type};base64,${buffer.toString('base64')}`
    }

    if (!finalVideoUrl) {
      return NextResponse.json({ error: 'Video URL or file is required' }, { status: 400 })
    }

    // Handle segment (find or create)
    let segmentId: string | undefined
    if (segmentName) {
      const existing = await prisma.segment.findUnique({
        where: { name: segmentName },
      })
      if (existing) {
        segmentId = existing.id
      } else {
        const newSegment = await prisma.segment.create({
          data: { name: segmentName },
        })
        segmentId = newSegment.id
      }
    }

    // ✅ Create video
    const video = await prisma.video.create({
      data: {
        title,
        description: description || '',
        genre: genre || 'Action',
        region: region || 'Africa',
        type: type || 'movie',
        fullVideoUrl: finalVideoUrl,
        trailerClipUrl: thumbnailUrl || '',
        creatorId: user.id,
        isPublished: true,
        status: 'ready',
        segmentId,
      },
    })

    return NextResponse.json({ success: true, video })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
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
      orderBy: { createdAt: 'desc' },
      include: { segment: true },
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}