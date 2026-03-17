import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    
    // We fetch notes and join with the admin user to get their name
    const notes = await prisma.inquiryNote.findMany({
      where: { inquiryId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { note } = body

    if (!note || !note.trim()) {
      return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 })
    }

    const newNote = await prisma.inquiryNote.create({
      data: {
        inquiryId: id,
        authorName: session.user.name || 'Admin',
        note: note.trim()
      }
    })

    return NextResponse.json({ success: true, note: newNote })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add note' }, { status: 500 })
  }
}
