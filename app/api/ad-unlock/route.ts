import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

// helper to safely get session (NO getServerSession)
async function getSession(req: Request) {
  const res = await handler.auth?.(req as any)
  return res?.user ? res : null
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to watch' },
        { status: 401 }
      )
    }

    const { videoId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId }
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    if (user.subscriptionTier !== 'free') {
      return NextResponse.json({
        unlocked: true,
        streamUrl: video.fullVideoUrl || null,
        message: 'Premium user — no ads!'
      })
    }

    const existingAdWatch = await prisma.adWatch.findFirst({
      where: {
        userId: user.id,
        videoId,
        completed: true
      }
    })

    if (existingAdWatch) {
      return NextResponse.json({
        unlocked: true,
        streamUrl: video.fullVideoUrl || null,
        message: 'Video unlocked!'
      })
    }

    await prisma.adWatch.create({
      data: {
        userId: user.id,
        videoId,
        completed: true
      }
    })

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