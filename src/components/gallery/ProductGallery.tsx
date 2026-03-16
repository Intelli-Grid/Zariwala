'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cloudinaryUrl } from '@/lib/cloudinary'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: { url: string; altText?: string | null }[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-xl flex items-center justify-center text-6xl skeleton">🥻</div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={cloudinaryUrl(images[activeIdx].url, { width: 720, height: 960, crop: 'fill' })}
            alt={images[activeIdx].altText ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Prev/Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i - 1 + images.length) % images.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i + 1) % images.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white font-inter text-xs px-2 py-0.5 rounded-full">
              {activeIdx + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="relative aspect-square rounded-lg overflow-hidden transition-all"
                style={{ border: i === activeIdx ? '2px solid var(--color-gold-warm)' : '2px solid transparent', opacity: i === activeIdx ? 1 : 0.65 }}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={cloudinaryUrl(img.url, { width: 120, height: 120, crop: 'fill' })}
                  alt={img.altText ?? `${title} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => (i + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </>
          )}
          <div className="relative w-full max-w-2xl aspect-[3/4]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={cloudinaryUrl(images[activeIdx].url, { width: 1200, height: 1600, crop: 'fill' })}
              alt={images[activeIdx].altText ?? title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
