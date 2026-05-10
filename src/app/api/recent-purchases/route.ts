import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 300 // re-fetch every 5 minutes

function getTimeAgo(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / 3_600_000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export async function GET() {
  const recent = await prisma.inquiry
    .findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 10,
      select: {
        city: true,
        category: true,
        offerAmount: true,
        completedAt: true,
      },
    })
    .catch(() => [])

  // Anonymise: only show city, category, and rounded amount — never PII
  const anonymised = recent.map((r) => ({
    city: r.city || 'India',
    category: r.category || 'Heritage Piece',
    amount: r.offerAmount
      ? '₹' + (Math.round(Number(r.offerAmount) / 1000) * 1000).toLocaleString('en-IN') + '+'
      : null,
    timeAgo: r.completedAt ? getTimeAgo(r.completedAt) : 'Recently',
  }))

  return NextResponse.json(anonymised)
}
