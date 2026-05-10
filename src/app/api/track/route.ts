import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')?.toUpperCase().trim()

  if (!ref || !ref.startsWith('ZRW-')) {
    return NextResponse.json(
      { error: 'Invalid reference number. Format must be ZRW-YYYY-XXXXX.' },
      { status: 400 }
    )
  }

  const inquiry = await prisma.inquiry
    .findUnique({
      where: { reference: ref },
      select: {
        reference: true,
        sellerName: true,
        status: true,
        category: true,
        createdAt: true,
        itemReceivedAt: true,
        offerSentAt: true,
        acceptedAt: true,
        paidAt: true,
        completedAt: true,
      },
    })
    .catch(() => null)

  if (!inquiry) {
    return NextResponse.json(
      { error: 'Reference number not found. Please check and try again.' },
      { status: 404 }
    )
  }

  return NextResponse.json(inquiry)
}
