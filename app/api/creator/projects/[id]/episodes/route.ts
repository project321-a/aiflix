import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/creator/projects/[id]/episodes
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project || project.creatorId !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, episodeNumber, videoUrl, thumbnail, duration } = body

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      )
    }

    const episode = await prisma.episode.create({
      data: {
        title,
        description,
        episodeNumber: episodeNumber || 1,
        videoUrl,
        thumbnail,
        duration,
        projectId: project.id,
        status: 'ready',
      },
    })

    return NextResponse.json(episode)
  } catch (error) {
    console.error('Error adding episode:', error)
    return NextResponse.json(
      { error: 'Failed to add episode' },
      { status: 500 }
    )
  }
}

// DELETE /api/creator/projects/[id]/episodes?episodeId=xxx
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const url = new URL(request.url)
  const episodeId = url.searchParams.get('episodeId')

  if (!episodeId) {
    return NextResponse.json(
      { error: 'Episode ID is required' },
      { status: 400 }
    )
  }

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

    const { id } = await params

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: { project: true }
    })

    if (!episode || episode.projectId !== id || episode.project.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'Episode not found or access denied' },
        { status: 404 }
      )
    }

    await prisma.episode.delete({
      where: { id: episodeId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting episode:', error)
    return NextResponse.json(
      { error: 'Failed to delete episode' },
      { status: 500 }
    )
  }
}