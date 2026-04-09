'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, UploadCloud, Trash2, GripVertical, Star } from 'lucide-react'
import { CATEGORY_LABELS, CONDITION_STYLES } from '@/lib/utils'
import { z } from 'zod'

const ZARI_TYPES = {
  PURE_SILVER: 'Pure Silver',
  GOLD_WASH_SILVER: 'Gold-Wash Silver',
  PURE_GOLD: 'Pure Gold',
  IMITATION: 'Imitation / Metallic',
  NONE: 'None',
}

interface ProductImage {
  id?: string
  url: string
  altText?: string | null
  isHero: boolean
  position: number
}

interface ProductData {
  id: string
  sku: string
  title: string
  category: string
  era: string | null
  origin: string | null
  fabric: string | null
  condition: string
  price: number | string
  comparePrice: number | string | null
  isAvailable: boolean
  isDraft: boolean
  isFeatured: boolean
  description: string | null
  story: string | null
  conditionNote: string | null
  authNotes: string | null
  zariType: string | null
  zariContent: number | null
  isAuthenticated: boolean
  metaTitle: string | null
  metaDescription: string | null
  tags: string[]
  images: ProductImage[]
}

interface Props {
  product: ProductData | null
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    sku: product?.sku ?? '',
    title: product?.title ?? '',
    category: product?.category ?? 'SILK_SAREES',
    era: product?.era ?? '',
    origin: product?.origin ?? '',
    fabric: product?.fabric ?? '',
    condition: product?.condition ?? 'GOOD',
    price: String(product?.price ?? ''),
    comparePrice: String(product?.comparePrice ?? ''),
    isAvailable: product?.isAvailable ?? true,
    isDraft: product?.isDraft ?? false,
    isFeatured: product?.isFeatured ?? false,
    description: product?.description ?? '',
    story: product?.story ?? '',
    conditionNote: product?.conditionNote ?? '',
    authNotes: product?.authNotes ?? '',
    zariType: product?.zariType ?? 'NONE',
    zariContent: String(product?.zariContent ?? ''),
    isAuthenticated: product?.isAuthenticated ?? false,
    metaTitle: product?.metaTitle ?? '',
    metaDescription: product?.metaDescription ?? '',
    tags: (product?.tags ?? []).join(', '),
  })

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // Upload images to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      try {
        // Get signed params from our API
        const paramsRes = await fetch('/api/cloudinary-upload-params', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: 'heritage/products' }),
        })
        const { signature, timestamp, api_key, cloud_name, upload_preset } = await paramsRes.json()

        const fd = new FormData()
        fd.append('file', file)
        fd.append('signature', signature)
        fd.append('timestamp', timestamp)
        fd.append('api_key', api_key)
        if (upload_preset) fd.append('upload_preset', upload_preset)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
          method: 'POST',
          body: fd,
        })
        const data = await res.json()
        if (data.public_id) {
          setImages((prev) => [
            ...prev,
            {
              url: data.public_id,
              isHero: prev.length === 0,
              position: prev.length,
              altText: '',
            },
          ])
        }
      } catch {
        setError('Image upload failed. Please try again.')
      }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx).map((img, i) => ({ ...img, position: i })))
  }

  const setHero = (idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isHero: i === idx })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      zariContent: form.zariContent ? parseFloat(form.zariContent) : null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      images: images.map((img, i) => ({ ...img, position: i })),
    }

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Save failed')
      }
      const saved = await res.json()
      router.push(`/admin/products/${saved.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} id="admin-product-form" className="space-y-8">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="font-inter text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ── Images ──────────────────────────────────────────── */}
      <div className="card-heritage p-6">
        <h2 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>Images</h2>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-[3/4] rounded-lg overflow-hidden border-2"
              style={{ borderColor: img.isHero ? 'var(--color-gold-warm)' : 'transparent' }}>
              <Image
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_200,c_fill/${img.url}`}
                alt="" fill className="object-cover" sizes="(max-width: 768px) 33vw, 20vw"
              />
              {img.isHero && (
                <div className="absolute top-1 left-1 bg-[var(--color-gold-warm)] text-white text-[9px] font-inter font-bold px-1 rounded">
                  HERO
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                <button type="button" onClick={() => setHero(idx)}
                  className="p-1 bg-white rounded" title="Set as hero">
                  <Star size={12} className="text-yellow-600" />
                </button>
                <button type="button" onClick={() => removeImage(idx)}
                  className="p-1 bg-white rounded" title="Remove">
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {/* Upload tile */}
          <button type="button" onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:bg-[var(--color-gold-pale)] disabled:opacity-50"
            style={{ borderColor: 'var(--color-gray-light)' }}>
            {uploading
              ? <Loader2 size={20} className="animate-spin text-[var(--color-gold-deep)]" />
              : <UploadCloud size={20} style={{ color: 'var(--color-gray-mid)' }} />}
            <span className="font-inter text-[10px]" style={{ color: 'var(--color-gray-mid)' }}>
              {uploading ? 'Uploading…' : 'Add'}
            </span>
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple
          className="hidden" onChange={handleFileChange} />
        <p className="font-hind text-xs" style={{ color: 'var(--color-gray-mid)' }}>
          First image = hero. Click ⭐ to change. JPEG/PNG/WebP, max 10MB each.
        </p>
      </div>

      {/* ── Core Details ─────────────────────────────────────── */}
      <div className="card-heritage p-6">
        <h2 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>Core Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="SKU *" id="product-sku">
            <input id="product-sku" type="text" value={form.sku} onChange={(e) => update('sku', e.target.value)}
              required placeholder="e.g. HTG-KJV-001" className="field-input" />
          </Field>

          <Field label="Category *" id="product-category">
            <select id="product-category" value={form.category} onChange={(e) => update('category', e.target.value)}
              required className="field-input">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>

          <Field label="Title *" id="product-title" className="sm:col-span-2">
            <input id="product-title" type="text" value={form.title} onChange={(e) => update('title', e.target.value)}
              required placeholder="e.g. Crimson Kanjivaram Silk Saree with Pure Silver Zari" className="field-input" />
          </Field>

          <Field label="Price (₹) *" id="product-price">
            <input id="product-price" type="number" value={form.price} onChange={(e) => update('price', e.target.value)}
              required min={0} placeholder="e.g. 28000" className="field-input" />
          </Field>

          <Field label="Compare Price (₹)" id="product-compare-price">
            <input id="product-compare-price" type="number" value={form.comparePrice ?? ''}
              onChange={(e) => update('comparePrice', e.target.value)}
              min={0} placeholder="Leave blank if no discount" className="field-input" />
          </Field>

          <Field label="Origin" id="product-origin">
            <input id="product-origin" type="text" value={form.origin} onChange={(e) => update('origin', e.target.value)}
              placeholder="e.g. Kanchipuram, Tamil Nadu" className="field-input" />
          </Field>

          <Field label="Era" id="product-era">
            <input id="product-era" type="text" value={form.era} onChange={(e) => update('era', e.target.value)}
              placeholder="e.g. 1970s, Early 1980s" className="field-input" />
          </Field>

          <Field label="Fabric" id="product-fabric">
            <input id="product-fabric" type="text" value={form.fabric} onChange={(e) => update('fabric', e.target.value)}
              placeholder="e.g. Pure Mulberry Silk" className="field-input" />
          </Field>

          <Field label="Condition *" id="product-condition">
            <select id="product-condition" value={form.condition} onChange={(e) => update('condition', e.target.value)}
              required className="field-input">
              {Object.entries(CONDITION_STYLES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Zari Type" id="product-zari-type">
            <select id="product-zari-type" value={form.zariType} onChange={(e) => update('zariType', e.target.value)}
              className="field-input">
              {Object.entries(ZARI_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>

          <Field label="Zari Content (%)" id="product-zari-content">
            <input id="product-zari-content" type="number" value={form.zariContent}
              onChange={(e) => update('zariContent', e.target.value)}
              min={0} max={100} placeholder="e.g. 68" className="field-input" />
          </Field>

          <Field label="Tags (comma-separated)" id="product-tags" className="sm:col-span-2">
            <input id="product-tags" type="text" value={form.tags} onChange={(e) => update('tags', e.target.value)}
              placeholder="kanjivaram, zari, festive, new-arrival" className="field-input" />
          </Field>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 mt-5">
          {[
            { key: 'isAvailable', label: '✅ Available for sale' },
            { key: 'isDraft', label: '📝 Draft (hidden)' },
            { key: 'isFeatured', label: '⭐ Featured on homepage' },
            { key: 'isAuthenticated', label: '🔒 Mark as authenticated' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer font-hind text-sm"
              style={{ color: 'var(--color-gray-dark)' }}>
              <input type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => update(key, e.target.checked)}
                className="accent-[var(--color-gold-warm)] w-4 h-4"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Description & Story ──────────────────────────────── */}
      <div className="card-heritage p-6">
        <h2 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>Description & Story</h2>
        <div className="space-y-4">
          <Field label="Short Description" id="product-description">
            <textarea id="product-description" rows={3} value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A concise, factual product description…" className="field-input" />
          </Field>

          <Field label="Story of This Piece" id="product-story">
            <textarea id="product-story" rows={5} value={form.story}
              onChange={(e) => update('story', e.target.value)}
              placeholder="Tell the heritage story — provenance, weaving tradition, why this piece is special…"
              className="field-input" />
          </Field>

          <Field label="Condition Notes" id="product-condition-note">
            <textarea id="product-condition-note" rows={2} value={form.conditionNote}
              onChange={(e) => update('conditionNote', e.target.value)}
              placeholder="Any specific marks, repairs, fading — be honest." className="field-input" />
          </Field>

          <Field label="Authentication Notes" id="product-auth-notes">
            <textarea id="product-auth-notes" rows={2} value={form.authNotes}
              onChange={(e) => update('authNotes', e.target.value)}
              placeholder="Details of how this piece was authenticated." className="field-input" />
          </Field>
        </div>
      </div>

      {/* ── SEO ─────────────────────────────────────────────── */}
      <div className="card-heritage p-6">
        <h2 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>SEO</h2>
        <div className="space-y-4">
          <Field label="Meta Title" id="product-meta-title">
            <input id="product-meta-title" type="text" value={form.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              placeholder="Leave blank to auto-generate from title" className="field-input" />
          </Field>
          <Field label="Meta Description" id="product-meta-description">
            <textarea id="product-meta-description" rows={2} value={form.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              placeholder="≤160 chars — what the buyer sees in Google search results." className="field-input" />
          </Field>
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 justify-end sticky bottom-4">
        <a href="/admin/products"
          className="px-5 py-2.5 rounded-full border font-inter text-sm transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--color-gray-light)' }}>
          Cancel
        </a>
        {product && (
          <button type="submit" name="action" value="save-draft"
            className="px-5 py-2.5 rounded-full border font-inter text-sm transition-colors hover:bg-[var(--color-gold-pale)]"
            style={{ borderColor: 'var(--color-gold-warm)', color: 'var(--color-gold-deep)' }}
            disabled={saving}>
            Save Draft
          </button>
        )}
        <button type="submit" id="product-save-btn"
          disabled={saving}
          className="btn-gold px-8 py-2.5 text-sm disabled:opacity-60 flex items-center gap-2">
          {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : product ? 'Save Changes' : 'Publish Product'}
        </button>
      </div>
    </form>
  )
}

// Small helper component
function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
        style={{ color: 'var(--color-gray-dark)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
