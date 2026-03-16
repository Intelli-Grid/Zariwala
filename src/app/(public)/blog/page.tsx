import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'Blog | Zariwala',
  description: 'Read our latest insights, valuation guides, and stories from the vintage clothing world.',
}

export const dynamic = 'force-dynamic'

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="bg-[var(--color-ivory)] py-16 md:py-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-espresso)]">
            Vintage Insights
          </h1>
          <Link
            href="/blog/search"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-gold)]/20 rounded-xl text-sm font-body text-[var(--color-espresso-mid)] hover:border-[var(--color-gold)] transition-colors shadow-sm mt-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>
        <p className="font-body text-lg text-[var(--color-espresso-mid)] mb-16 max-w-2xl leading-relaxed">
          Expert guides, valuation insights, and historical deep-dives into the world of genuine vintage garments.
        </p>


        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-gold)]/10 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  {post.coverImage ? (
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-[var(--color-ivory-dark)] flex items-center justify-center border-b border-[var(--color-ivory)]/50">
                      <span className="font-display text-2xl text-[var(--color-gold)] opacity-50">VINTAGE</span>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-[var(--color-gold-light)] text-[var(--color-espresso)] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        {post.category}
                      </span>
                    )}
                    <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-3 group-hover:text-[var(--color-gold-dark)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-body text-sm font-semibold text-[var(--color-gold-dark)] uppercase tracking-wider">Read Article &rarr;</span>
                      <span className="font-body text-xs text-[var(--color-gray-500)]">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-[var(--color-ivory-dark)] rounded-2xl bg-white/50">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-2">No Articles Yet</h2>
            <p className="font-body text-[var(--color-espresso-mid)]">Our team is working on establishing our first series of guides. Check back shortly!</p>
          </div>
        )}
      </div>
    </div>
  )
}
