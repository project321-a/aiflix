import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // Check if user is signed in
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      )
    }

    const { videoId } = await request.json()
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID required' },
        { status: 400 }
      )
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is premium (skip ads)
    if (user.subscriptionTier !== 'free') {
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      })
      return NextResponse.json({
        unlocked: true,
        streamUrl: video?.fullVideoUrl || null,
        message: 'Premium user — no ads!'
      })
    }

    // Check if user already watched an ad for this video
    const existingAdWatch = await prisma.adWatch.findFirst({
      where: {
        userId: user.id,
        videoId: videoId,
        completed: true
      }
    })

    if (existingAdWatch) {
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      })
      return NextResponse.json({
        unlocked: true,
        streamUrl: video?.fullVideoUrl || null,
        message: 'Already unlocked!'
      })
    }

    // Record the ad watch
    await prisma.adWatch.create({
      data: {
        userId: user.id,
        videoId: videoId,
        completed: true
      }
    })

    // Unlock the video
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    })

    return NextResponse.json({
      unlocked: true,
      streamUrl: video?.fullVideoUrl || null,
      message: 'Video unlocked!'
    })

  } catch (error) {
    console.error('Ad unlock error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}