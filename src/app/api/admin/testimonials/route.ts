import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ isVisible: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, country, flag, quote, itemSold, rating } = body

    if (!name || !quote || !country) {
      return NextResponse.json({ error: 'Name, country, and quote are required' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        country,
        flag: flag || '🌍',
        quote,
        itemSold: itemSold || null,
        rating: rating || 5,
        isVisible: false, // Needs admin approval
      },
    })

    return NextResponse.json({ success: true, testimonial }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 })
  }
}
