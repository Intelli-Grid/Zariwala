'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { CATEGORY_LABELS, ERA_OPTIONS, CONDITION_STYLES } from '@/lib/utils'

interface FilterProps {
  categories: { value: string; count: number }[]
  eras: { value: string; count: number }[]
  origins: { value: string; count: number }[]
  currentParams: Record<string, string | undefined>
}

export function GalleryFilters({ categories, eras, origins, currentParams }: FilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams()
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }, [currentParams, router, pathname])

  const clearAll = () => router.push(pathname)

  const hasFilters = !!(currentParams.category || currentParams.era || currentParams.condition || currentParams.origin || currentParams.minPrice || currentParams.maxPrice)

  return (
    <div className="space-y-6 sticky top-24" id="gallery-filters">
      <div className="flex items-center justify-between">
        <h2 className="font-inter text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-charcoal)' }}>
          Filters
        </h2>
        {hasFilters && (
          <button onClick={clearAll} className="font-inter text-xs underline" style={{ color: 'var(--color-gold-deep)' }}>
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-gray-mid)' }}>
          Category
        </p>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter('category', undefined)}
            className="w-full text-left flex items-center justify-between px-2 py-1 rounded font-hind text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
            style={{ color: !currentParams.category ? 'var(--color-gold-deep)' : 'var(--color-gray-dark)', fontWeight: !currentParams.category ? 600 : 400 }}
          >
            All
          </button>
          {categories.map(({ value, count }) => (
            <button
              key={value}
              onClick={() => updateFilter('category', value === currentParams.category ? undefined : value)}
              className="w-full text-left flex items-center justify-between px-2 py-1 rounded font-hind text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
              style={{ color: currentParams.category === value ? 'var(--color-gold-deep)' : 'var(--color-gray-dark)', fontWeight: currentParams.category === value ? 600 : 400 }}
            >
              <span>{CATEGORY_LABELS[value] ?? value}</span>
              <span className="font-inter text-xs" style={{ color: 'var(--color-gray-mid)' }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-gray-mid)' }}>
          Condition
        </p>
        <div className="space-y-1.5">
          {Object.entries(CONDITION_STYLES).map(([key, style]) => (
            <button
              key={key}
              onClick={() => updateFilter('condition', key === currentParams.condition ? undefined : key)}
              className="w-full text-left flex items-center gap-2 px-2 py-1 rounded font-hind text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
              style={{ fontWeight: currentParams.condition === key ? 600 : 400, color: currentParams.condition === key ? 'var(--color-gold-deep)' : 'var(--color-gray-dark)' }}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Era */}
      {eras.length > 0 && (
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-gray-mid)' }}>
            Era
          </p>
          <div className="space-y-1.5">
            {eras.map(({ value, count }) => (
              <button
                key={value}
                onClick={() => updateFilter('era', value === currentParams.era ? undefined : value)}
                className="w-full text-left flex items-center justify-between px-2 py-1 rounded font-hind text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
                style={{ color: currentParams.era === value ? 'var(--color-gold-deep)' : 'var(--color-gray-dark)', fontWeight: currentParams.era === value ? 600 : 400 }}
              >
                <span>{value}</span>
                <span className="font-inter text-xs" style={{ color: 'var(--color-gray-mid)' }}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-gray-mid)' }}>
          Price (₹)
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentParams.minPrice}
            onBlur={(e) => updateFilter('minPrice', e.target.value || undefined)}
            className="w-full px-2 py-1.5 rounded border text-xs font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentParams.maxPrice}
            onBlur={(e) => updateFilter('maxPrice', e.target.value || undefined)}
            className="w-full px-2 py-1.5 rounded border text-xs font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }}
          />
        </div>
      </div>

      {/* Origin */}
      {origins.length > 0 && (
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-gray-mid)' }}>
            Origin
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {origins.map(({ value, count }) => (
              <button
                key={value}
                onClick={() => updateFilter('origin', value === currentParams.origin ? undefined : value)}
                className="w-full text-left flex items-center justify-between px-2 py-1 rounded font-hind text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
                style={{ color: currentParams.origin === value ? 'var(--color-gold-deep)' : 'var(--color-gray-dark)', fontWeight: currentParams.origin === value ? 600 : 400 }}
              >
                <span>{value}</span>
                <span className="font-inter text-xs" style={{ color: 'var(--color-gray-mid)' }}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
