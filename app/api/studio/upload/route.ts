import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      )
    }

    const { title, description, genre, region, type, trailerClipUrl, fullVideoUrl, isPremium } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description || '',
        genre,
        region,
        type,
        trailerClipUrl: trailerClipUrl || null,
        fullVideoUrl: fullVideoUrl || null,
        isPremium: isPremium || false,
        creatorId: user.id,
        isPublished: true,
        views: 0,
        likes: 0,
        earnings: 0,
      }
    })

    return NextResponse.json({
      success: true,
      video: video,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}