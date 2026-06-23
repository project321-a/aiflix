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

    const { plan } = await request.json()
    
    // Define plan durations (in days)
    const planDurations: Record<string, number> = {
      monthly: 30,
      quarterly: 90,
      annual: 365,
    }

    if (!planDurations[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + planDurations[plan])

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionTier: plan,
        subscriptionExpiresAt: expiresAt,
      }
    })

    return NextResponse.json({
      success: true,
      plan: user.subscriptionTier,
      expiresAt: user.subscriptionExpiresAt,
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        subscriptionTier: true,
        subscriptionExpiresAt: true,
      }
    })

    // Check if subscription is expired
    if (user?.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      // Downgrade to free if expired
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          subscriptionTier: 'free',
          subscriptionExpiresAt: null,
        }
      })
      return NextResponse.json({ plan: 'free', expiresAt: null })
    }

    return NextResponse.json({
      plan: user?.subscriptionTier || 'free',
      expiresAt: user?.subscriptionExpiresAt || null,
    })

  } catch (error) {
    console.error('GET subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}