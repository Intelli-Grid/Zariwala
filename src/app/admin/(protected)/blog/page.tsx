import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PlusCircle, Pencil, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Blog | Admin' }

export default async function AdminBlogList() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[var(--color-ivory-dark)]">
        <div>
          <h1 className="text-3xl font-display text-[var(--color-espresso)]">Blog Posts</h1>
          <p className="text-sm text-[var(--color-gray-500)] mt-1 font-body">
            {posts.length} total · {posts.filter((p: any) => p.published).length} published
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-[var(--color-gold)]/10">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-[var(--color-gray-500)] mb-4">No blog posts yet.</p>
            <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-ivory-dark)]">
            {posts.map((post: any) => (
              <li key={post.id} className="p-5 hover:bg-[var(--color-ivory)]/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {post.coverImage ? (
                      <div className="h-14 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.coverImage} className="h-full w-full object-cover" alt="" />
                      </div>
                    ) : (
                      <div className="h-14 w-20 bg-[var(--color-ivory-dark)] rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-[var(--color-gray-500)] font-body">No image</span>
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-display text-lg text-[var(--color-espresso)] truncate">
                          {post.title}
                        </h2>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-body flex-shrink-0 ${
                          post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-gray-500)] font-body">
                        {post.category && <span>{post.category}</span>}
                        {post.category && <span>·</span>}
                        <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {post.views > 0 && <><span>·</span><span>{post.views} views</span></>}
                      </div>
                      {post.excerpt && (
                        <p className="text-xs text-[var(--color-gray-500)] font-body mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View public post"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-2 text-[var(--color-espresso-mid)] hover:bg-[var(--color-ivory)] rounded-lg transition-colors"
                      title="Edit post"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
