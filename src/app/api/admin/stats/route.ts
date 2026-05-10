import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Safe wrapper — a single DB failure won't blank the entire dashboard
    const safeCount = (p: Promise<number>) => p.catch(() => 0)

    const [
      totalInquiries,
      newInquiries,
      reviewingInquiries,
      offersent,
      acceptedInquiries,
      completedInquiries,
      inquiriesLast30Days,
      inquiriesLast7Days,
      totalBlogPosts,
      publishedBlogPosts,
      recentInquiries,
    ] = await Promise.all([
      safeCount(prisma.inquiry.count()),
      safeCount(prisma.inquiry.count({ where: { status: 'NEW' } })),
      safeCount(prisma.inquiry.count({ where: { status: 'REVIEWING' } })), // Fixed: was 'IN_REVIEW'
      safeCount(prisma.inquiry.count({ where: { status: 'OFFER_SENT' } })),
      safeCount(prisma.inquiry.count({ where: { status: 'ACCEPTED' } })),
      safeCount(prisma.inquiry.count({ where: { status: 'COMPLETED' } })),
      safeCount(prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } })),
      safeCount(prisma.inquiry.count({ where: { createdAt: { gte: sevenDaysAgo } } })),
      safeCount(prisma.blogPost.count()),
      safeCount(prisma.blogPost.count({ where: { published: true } })),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          reference: true,
          sellerName: true,
          country: true,
          categories: true,
          status: true,
          createdAt: true,
        },
      }).catch(() => []),
    ])

    return NextResponse.json({
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        reviewing: reviewingInquiries,
        offerSent: offersent,
        accepted: acceptedInquiries,
        completed: completedInquiries,
        last30Days: inquiriesLast30Days,
        last7Days: inquiriesLast7Days,
      },
      blog: {
        total: totalBlogPosts,
        published: publishedBlogPosts,
        drafts: totalBlogPosts - publishedBlogPosts,
      },
      recentInquiries,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
