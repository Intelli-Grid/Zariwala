'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'

interface BlogHit {
  objectID: string
  title: string
  slug: string
  excerpt: string
  category?: string
  coverImage?: string
  publishedAt?: number
  url: string
}

export default function BlogSearchClient() {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<BlogHit[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setHits([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/blog/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setHits(data.hits || [])
    } catch {
      setHits([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(val), 400)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (timerRef.current) clearTimeout(timerRef.current)
    search(query)
  }

  return (
    <div className="bg-[var(--color-ivory)] min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-espresso)] mb-4">Search Articles</h1>
          <p className="font-body text-[var(--color-espresso-mid)]">Explore our library of vintage guides, valuation insights, and brand histories.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-gray-500)]" />
          <input
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search by keyword, brand, or topic…"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[var(--color-ivory-dark)] bg-white shadow-sm text-lg font-body text-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[var(--color-gold)]" />
          )}
        </form>

        {!searched && (
          <div className="text-center py-12">
            <p className="font-body text-[var(--color-gray-500)]">Start typing to search our articles.</p>
            <Link href="/blog" className="mt-6 inline-block px-6 py-3 border border-[var(--color-gold)]/30 rounded-xl text-sm font-body text-[var(--color-espresso)] hover:bg-[var(--color-ivory-dark)] transition-colors">
              Browse All Articles →
            </Link>
          </div>
        )}

        {searched && !loading && hits.length === 0 && (
          <div className="text-center py-12">
            <p className="font-display text-xl text-[var(--color-espresso)] mb-2">No results for &ldquo;{query}&rdquo;</p>
            <p className="font-body text-[var(--color-gray-500)] mb-6">Try a different search term or browse all articles.</p>
            <Link href="/blog" className="btn-primary px-6">Browse All Articles</Link>
          </div>
        )}

        {hits.length > 0 && (
          <div className="space-y-4">
            <p className="font-body text-sm text-[var(--color-gray-500)] mb-6">
              {hits.length} result{hits.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            {hits.map(hit => (
              <Link
                key={hit.objectID}
                href={`/blog/${hit.slug}`}
                className="group flex gap-5 bg-white rounded-2xl p-5 border border-[var(--color-gold)]/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {hit.coverImage && (
                  <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-ivory-dark)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hit.coverImage} alt={hit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {hit.category && (
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-gold-dark)] mb-1 font-body">
                      {hit.category}
                    </span>
                  )}
                  <h2 className="font-display text-lg text-[var(--color-espresso)] group-hover:text-[var(--color-gold-dark)] transition-colors line-clamp-1">
                    {hit.title}
                  </h2>
                  <p className="font-body text-sm text-[var(--color-espresso-mid)] line-clamp-2 mt-1 leading-relaxed">
                    {hit.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
