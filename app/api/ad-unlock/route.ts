import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      )
    }

    const { videoId } = await request.json()
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Premium users skip ads
    if (user.subscriptionTier !== 'free') {
      const video = await prisma.video.findUnique({ where: { id: videoId } })
      return NextResponse.json({ unlocked: true, streamUrl: video?.fullVideoUrl || null })
    }

    // Check existing ad watch
    const existingAdWatch = await prisma.adWatch.findFirst({
      where: { userId: user.id, videoId, completed: true }
    })

    if (existingAdWatch) {
      const video = await prisma.video.findUnique({ where: { id: videoId } })
      return NextResponse.json({ unlocked: true, streamUrl: video?.fullVideoUrl || null })
    }

    // Record ad watch
    await prisma.adWatch.create({
      data: { userId: user.id, videoId, completed: true }
    })

    const video = await prisma.video.findUnique({ where: { id: videoId } })
    return NextResponse.json({ unlocked: true, streamUrl: video?.fullVideoUrl || null })

  } catch (error) {
    console.error('Ad unlock error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}