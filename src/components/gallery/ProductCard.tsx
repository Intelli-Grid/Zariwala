'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import { useWishlist } from '@/store/wishlistStore'
import { formatINR, CONDITION_STYLES, CATEGORY_LABELS } from '@/lib/utils'
import { cloudinaryUrl } from '@/lib/cloudinary'
import { generateProductWhatsAppUrl } from '@/lib/contact-links'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    sku: string
    title: string
    category: string
    era?: string | null
    origin?: string | null
    condition: string
    price: number
    comparePrice?: number | null
    isAvailable: boolean
    images: { url: string; altText?: string | null }[]
    tags?: string[]
  }
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggle, has } = useWishlist()
  const wishlisted = has(product.id)
  const heroImage = product.images[0]
  const hoverImage = product.images[1]
  const condition = CONDITION_STYLES[product.condition as keyof typeof CONDITION_STYLES]
  const isOnSale = product.comparePrice && product.comparePrice > product.price

  const waUrl = generateProductWhatsAppUrl({
    sku: product.sku,
    title: product.title,
    price: product.price,
  })

  return (
    <div className="card-heritage group relative flex flex-col overflow-hidden">
      {/* ── Image ─────────────────────────────────────────────── */}
      <Link href={`/gallery/${product.slug}`} className="relative aspect-[3/4] overflow-hidden block">
        {heroImage ? (
          <>
            <Image
              src={cloudinaryUrl(heroImage.url, { width: 480, height: 640, crop: 'fill' })}
              alt={heroImage.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
              priority={priority}
            />
            {/* Hover second image */}
            {hoverImage && (
              <Image
                src={cloudinaryUrl(hoverImage.url, { width: 480, height: 640, crop: 'fill' })}
                alt={`${product.title} alt view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl skeleton">
            🥻
          </div>
        )}

        {/* SOLD overlay */}
        {!product.isAvailable && (
          <div className="sold-overlay">
            <div className="sold-ribbon">Sold</div>
          </div>
        )}

        {/* Sale badge */}
        {isOnSale && product.isAvailable && (
          <div className="absolute top-2 left-2 bg-red-600 text-white font-inter text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </div>
        )}

        {/* New arrival */}
        {product.tags?.includes('new-arrival') && product.isAvailable && (
          <div className="absolute top-2 left-2 font-inter text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: 'var(--color-gold-warm)', color: 'white' }}>
            New
          </div>
        )}
      </Link>

      {/* ── Wishlist Button ────────────────────────────────────── */}
      <button
        onClick={(e) => { e.preventDefault(); toggle(product.id) }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110"
        style={{
          background: wishlisted ? 'var(--color-crimson)' : 'rgba(255,255,255,0.9)',
          color: wishlisted ? 'white' : 'var(--color-gray-dark)',
        }}
      >
        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* ── Info ──────────────────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {/* Category + Era */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-inter text-[10px] tracking-wide uppercase"
            style={{ color: 'var(--color-gray-mid)' }}>
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          {product.era && (
            <>
              <span style={{ color: 'var(--color-gray-light)' }}>·</span>
              <span className="font-inter text-[10px]" style={{ color: 'var(--color-gray-mid)' }}>
                {product.era}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/gallery/${product.slug}`}
          className="font-playfair text-sm font-semibold leading-snug hover:text-[var(--color-gold-deep)] transition-colors line-clamp-2"
          style={{ color: 'var(--color-charcoal)' }}>
          {product.title}
        </Link>

        {/* Origin */}
        {product.origin && (
          <p className="font-hind text-xs" style={{ color: 'var(--color-gray-mid)' }}>
            📍 {product.origin}
          </p>
        )}

        {/* Condition badge */}
        {condition && (
          <span className={`badge-base ${`badge-${condition.label.toLowerCase()}`} self-start`}>
            <span className={`w-1.5 h-1.5 rounded-full ${condition.dot}`} />
            {condition.label}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-inter text-base font-bold" style={{ color: 'var(--color-gold-deep)' }}>
              {formatINR(product.price)}
            </span>
            {isOnSale && (
              <span className="font-inter text-xs line-through" style={{ color: 'var(--color-gray-mid)' }}>
                {formatINR(product.comparePrice!)}
              </span>
            )}
          </div>

          {/* Quick WhatsApp buy */}
          {product.isAvailable && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy via WhatsApp"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--color-wa-green)', color: 'white' }}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
