import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) 
{
  try {
    const { id } = await params
    const video = await prisma.video.findUnique({
      where: { id }
    })
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    return NextResponse.json(video)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}