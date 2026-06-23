import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to watch' },
        { status: 401 }
      )
    }

    const { videoId } = await request.json()
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // ✅ PREMIUM USERS: Skip ads entirely
    if (user.subscriptionTier !== 'free') {
      return NextResponse.json({
        unlocked: true,
        streamUrl: video.fullVideoUrl || null,
        message: 'Premium user — no ads!'
      })
    }

    // ✅ FREE USERS: Check if they already watched an ad for this video
    const existingAdWatch = await prisma.adWatch.findFirst({
      where: {
        userId: user.id,
        videoId: videoId,
        completed: true
      }
    })

    // If they already watched an ad, unlock immediately
    if (existingAdWatch) {
      return NextResponse.json({
        unlocked: true,
        streamUrl: video.fullVideoUrl || null,
        message: 'Video unlocked!'
      })
    }

    // ✅ Record the ad watch (only if they haven't watched one yet)
    await prisma.adWatch.create({
      data: {
        userId: user.id,
        videoId: videoId,
        completed: true
      }
    })

    // Unlock the video
    return NextResponse.json({
      unlocked: true,
      streamUrl: video.fullVideoUrl || null,
      message: 'Video unlocked!'
    })

  } catch (error) {
    console.error('Ad unlock error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}