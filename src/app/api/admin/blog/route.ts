import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { indexBlogPost } from '@/lib/algolia'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// GET — list all posts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST — create new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, excerpt, content, coverImage, published, category, tags, seoTitle, seoDescription } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Ensure unique slug
    let slug = generateSlug(title)
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || null,
        published: !!published,
        publishedAt: published ? new Date() : null,
        category: category || null,
        tags: Array.isArray(tags) ? tags : [],
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      } as any,
    })

    // Index in Algolia if published
    if ((post as any).published) {
      indexBlogPost(post as any).catch(err => console.warn('[Blog] Algolia index failed:', err))
    }

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error: any) {
    console.error('[Admin Blog POST]', error)
    return NextResponse.json({ error: error.message || 'Failed to create post' }, { status: 500 })
  }
}
