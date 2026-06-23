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

    const { plan } = await request.json()
    const planDurations: Record<string, number> = {
      monthly: 30,
      quarterly: 90,
      annual: 365,
    }

    if (!planDurations[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (plan === 'free') {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { subscriptionTier: 'free', subscriptionExpiresAt: null }
      })
      return NextResponse.json({ success: true, plan: 'free' })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + planDurations[plan])

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { subscriptionTier: plan, subscriptionExpiresAt: expiresAt }
    })

    return NextResponse.json({ success: true, plan: user.subscriptionTier, expiresAt: user.subscriptionExpiresAt })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionTier: true, subscriptionExpiresAt: true }
    })

    if (user?.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { subscriptionTier: 'free', subscriptionExpiresAt: null }
      })
      return NextResponse.json({ plan: 'free', expiresAt: null })
    }

    return NextResponse.json({
      plan: user?.subscriptionTier || 'free',
      expiresAt: user?.subscriptionExpiresAt || null
    })

  } catch (error) {
    console.error('GET subscription error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}