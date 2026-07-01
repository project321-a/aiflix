import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [totalUsers, totalProjects, totalEpisodes, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.episode.count(),
      prisma.project.aggregate({ _sum: { revenue: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalEpisodes,
      totalRevenue: totalRevenue._sum.revenue || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}