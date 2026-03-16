import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

// GET single inquiry
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const inquiry = await prisma.inquiry.findUnique({ where: { id } })
    if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ inquiry })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 })
  }
}

// PATCH: update inquiry status, notes, offer amount
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { status, adminNotes, offerAmount } = body

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(offerAmount !== undefined && { offerAmount }),
      },
    })

    return NextResponse.json({ success: true, inquiry: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 })
  }
}
