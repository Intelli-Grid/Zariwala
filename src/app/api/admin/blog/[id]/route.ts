import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { indexBlogPost, removeBlogPostFromIndex } from '@/lib/algolia'

// GET single post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PATCH — update post
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, excerpt, content, coverImage, published, category, tags, seoTitle, seoDescription } = body

    const current = await prisma.blogPost.findUnique({ where: { id } })
    if (!current) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const wasPublished = current.published
    const willBePublished = published !== undefined ? !!published : wasPublished

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
        ...(category !== undefined && { category: category || null }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle || null }),
        ...(seoDescription !== undefined && { seoDescription: seoDescription || null }),
        published: willBePublished,
        publishedAt: (willBePublished && !wasPublished) ? new Date() : current.publishedAt,
      },
    })

    // Sync Algolia
    if (updated.published) {
      indexBlogPost(updated).catch(err => console.warn('[Blog] Algolia index failed:', err))
    } else if (wasPublished && !willBePublished) {
      removeBlogPostFromIndex(id).catch(err => console.warn('[Blog] Algolia remove failed:', err))
    }

    return NextResponse.json({ success: true, post: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.blogPost.delete({ where: { id } })
    removeBlogPostFromIndex(id).catch(err => console.warn('[Blog] Algolia remove failed:', err))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 500 })
  }
}
