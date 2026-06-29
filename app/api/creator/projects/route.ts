import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const projects = await prisma.project.findMany({
      where: { creatorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { episodes: true },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { title, description, genre, region, type, segmentId } = body

    if (!title || !genre || !region) {
      return NextResponse.json(
        { error: 'Title, genre, and region are required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        genre,
        region,
        type: type || 'series',
        segmentId,
        creatorId: user.id,
        status: 'draft',
      },
    })

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('POST projects error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}