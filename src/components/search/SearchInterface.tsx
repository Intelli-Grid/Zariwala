'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { formatINR, CATEGORY_LABELS } from '@/lib/utils'
import { cloudinaryUrl } from '@/lib/cloudinary'
import Image from 'next/image'

interface SearchHit {
  objectID: string
  slug: string
  sku: string
  title: string
  category: string
  era?: string
  origin?: string
  price: number
  isAvailable: boolean
  condition: string
  heroImage?: string
}

interface Props {
  initialQuery: string
  initialCategory?: string
}

export function SearchInterface({ initialQuery, initialCategory }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); setTotal(0); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}${initialCategory ? `&category=${initialCategory}` : ''}`)
      const data = await res.json()
      setResults(data.hits ?? [])
      setTotal(data.nbHits ?? 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div>
      {/* Search Input */}
      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-gray-mid)' }} />
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search sarees, zari, kanjivaram…"
          autoFocus
          className="w-full pl-12 pr-12 py-4 rounded-full text-base font-hind bg-white border-2 focus:outline-none transition-colors"
          style={{ borderColor: query ? 'var(--color-gold-warm)' : 'var(--color-gray-light)' }}
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: 'var(--color-gray-mid)' }} />}
        {!loading && query && (
          <button onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
            style={{ color: 'var(--color-gray-mid)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results count */}
      {query && !loading && (
        <p className="font-hind text-sm mb-5" style={{ color: 'var(--color-gray-mid)' }}>
          {total === 0 ? 'No results found' : `${total} result${total !== 1 ? 's' : ''} for "${query}"`}
        </p>
      )}

      {/* Empty state */}
      {!query && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gray-light)' }} />
          <p className="font-playfair text-xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
            Search our gallery
          </p>
          <p className="font-hind text-sm" style={{ color: 'var(--color-gray-mid)' }}>
            Try: "Kanjivaram", "pure silver zari", "1980s silk", "Banarasi"
          </p>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((hit) => (
            <Link key={hit.objectID} href={`/gallery/${hit.slug}`}
              className="card-heritage group flex flex-col overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {hit.heroImage ? (
                  <Image
                    src={cloudinaryUrl(hit.heroImage, { width: 320, height: 427, crop: 'fill' })}
                    alt={hit.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full skeleton flex items-center justify-center text-3xl">🥻</div>
                )}
                {!hit.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-inter text-xs font-bold">SOLD</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="font-inter text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-gray-mid)' }}>
                  {CATEGORY_LABELS[hit.category] ?? hit.category}
                </p>
                <p className="font-playfair text-sm font-semibold line-clamp-2 mb-1" style={{ color: 'var(--color-charcoal)' }}>
                  {hit.title}
                </p>
                <p className="font-inter text-sm font-bold" style={{ color: 'var(--color-gold-deep)' }}>
                  {formatINR(hit.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {query && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="font-playfair text-xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
            No pieces found
          </h3>
          <p className="font-hind text-sm mb-5" style={{ color: 'var(--color-gray-mid)' }}>
            Try different terms or browse the full gallery.
          </p>
          <Link href="/gallery" className="btn-gold text-sm">Browse All Gallery</Link>
        </div>
      )}
    </div>
  )
}
