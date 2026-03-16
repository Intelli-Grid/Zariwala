import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })
  
  if (!post) return { title: 'Post Not Found' }
  
  return {
    title: `${post.title} | Zariwala`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.excerpt || '',
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post) {
    notFound()
  }

  // BlogPosting JSON-LD for Google rich results
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || '',
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'Zariwala', url: 'https://zariwala.com' },
    publisher: { '@type': 'Organization', name: 'Zariwala', logo: { '@type': 'ImageObject', url: 'https://zariwala.com/logo.png' } },
    image: post.coverImage ? [post.coverImage] : [],
    url: `https://zariwala.com/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://zariwala.com/blog/${post.slug}` },
  }

  // Raw HTML rendering since we use TipTap in backend
  const content = post.content

  return (
    <article className="bg-[#FAF9F6] min-h-screen py-20 lg:py-32">
      {/* BlogPosting JSON-LD for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        {post.category && (
          <span className="inline-block px-4 py-1.5 bg-[var(--color-gold-light)] text-[var(--color-espresso)] text-sm font-bold uppercase tracking-widest rounded-full mb-8 shadow-sm">
            {post.category}
          </span>
        )}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-espresso)] mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="font-body text-[var(--color-gray-500)] flex items-center justify-center space-x-4 border-b border-[var(--color-ivory-dark)] pb-12 w-3/4 mx-auto">
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>&middot;</span>
          <span>By {post.category ? post.category + ' Team' : 'Editorial Team'}</span>
        </div>
      </header>
      
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
          <div className="aspect-[21/9] lg:aspect-[2.35/1] bg-[var(--color-ivory-dark)] rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 relative">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="object-cover w-full h-full"
            />
            {/* Vintage grading overlay effect */}
            <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply pointer-events-none"></div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-lg prose-headings:font-display prose-headings:text-[var(--color-espresso)] prose-a:text-[var(--color-gold-dark)] prose-p:font-body prose-p:text-[var(--color-espresso-mid)] prose-p:leading-relaxed prose-li:font-body marker:text-[var(--color-gold)] font-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <div className="mt-20 pt-10 border-t border-[var(--color-ivory-dark)] flex items-center justify-between">
          <Link href="/blog" className="flex items-center text-[var(--color-gold-dark)] font-body font-semibold hover:text-[var(--color-espresso)] transition-colors">
            <span className="mr-2">&larr;</span> Back to All Articles
          </Link>
          <div className="flex space-x-4">
            <span className="text-[var(--color-gray-500)] font-body italic text-sm">Share this guide:</span>
            <button className="text-[var(--color-espresso)] hover:text-[var(--color-gold-dark)] transition-colors font-semibold font-body text-sm underline decoration-[var(--color-gold)]/30 underline-offset-4">Copy Link</button>
          </div>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="mt-32 border-t-8 border-[var(--color-espresso)] bg-white py-24">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl text-[var(--color-espresso)] mb-6">Have a piece you'd like us to look at?</h2>
          <p className="font-body text-lg text-[var(--color-gray-500)] mb-10 max-w-xl mx-auto leading-relaxed">
            Our experts provide entirely free, no-obligation valuations for high-quality vintage clothing.
          </p>
          <Link href="/sell" className="btn-primary px-10 py-4 text-lg">
            Get a Free Valuation
          </Link>
        </div>
      </div>
    </article>
  )
}
