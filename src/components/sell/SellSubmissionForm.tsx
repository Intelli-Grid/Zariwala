'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { generateSellWhatsAppUrl } from '@/lib/contact-links'
import { SELL_CATEGORY_OPTIONS, ERA_OPTIONS } from '@/lib/utils'

const schema = z.object({
  name:             z.string().min(2, 'Name required'),
  phone:            z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  city:             z.string().min(2, 'City required'),
  state:            z.string().optional(),
  preferredContact: z.enum(['whatsapp', 'call', 'email']),
  contactHandle:    z.string().optional(),
  itemCategory:     z.string().min(1, 'Select a category'),
  itemCount:        z.coerce.number().min(1).max(100),
  description:      z.string().min(10, 'Please describe your item(s) — at least 10 characters'),
  estimatedEra:     z.string().optional(),
  condition:        z.string().optional(),
  sareeType:        z.string().optional(),
  hasZari:          z.boolean().optional(),
  zariColor:        z.enum(['gold', 'silver', 'both', 'unsure']).optional(),
  expectedPrice:    z.coerce.number().optional(),
  howDidYouHear:    z.string().optional(),
  website:          z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>

interface UploadedPhoto {
  url: string
  name: string
}

export function SellSubmissionForm() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState<{ refCode: string; confirmWhatsAppUrl: string } | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredContact: 'whatsapp', itemCount: 1 },
  })

  const selectedCategory = watch('itemCategory')
  const preferredContact = watch('preferredContact')
  const isSaree = selectedCategory?.includes('saree')

  // ── Photo Upload via Cloudinary ──────────────────────────────
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: 10 - photos.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (photos.length >= 10) return
      setUploading(true)
      try {
        // Get signed upload params from server
        const paramsRes = await fetch('/api/cloudinary-upload-params?preset=sell_inquiry_photos')
        const params = await paramsRes.json()

        const uploaded: UploadedPhoto[] = []
        for (const file of acceptedFiles.slice(0, 10 - photos.length)) {
          const form = new FormData()
          form.append('file', file)
          form.append('upload_preset', params.uploadPreset)
          form.append('folder', params.folder)
          form.append('api_key', params.apiKey)
          form.append('timestamp', params.timestamp)
          form.append('signature', params.signature)

          const res = await fetch(params.uploadUrl, { method: 'POST', body: form })
          const data = await res.json()
          if (data.secure_url) {
            uploaded.push({ url: data.secure_url, name: file.name })
          }
        }
        setPhotos((prev) => [...prev, ...uploaded])
      } catch (e) {
        console.error('Upload failed', e)
      } finally {
        setUploading(false)
      }
    },
  })

  // ── Form Submit ───────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    if (photos.length === 0) return
    setServerError(null)

    const res = await fetch('/api/sell-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, photos: photos.map((p) => p.url) }),
    })

    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error ?? 'Something went wrong. Please try again or WhatsApp us.')
      return
    }

    setSubmitted({ refCode: json.refCode, confirmWhatsAppUrl: json.confirmWhatsAppUrl })
  }

  // ── Success State ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 px-6 card-heritage" id="sell-form-success">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-gold-warm)' }} />
        <h3 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Inquiry Submitted! 🙏
        </h3>
        <p className="font-hind text-sm mb-1" style={{ color: 'var(--color-gray-mid)' }}>
          Your reference code:
        </p>
        <p className="font-inter text-xl font-bold mb-5" style={{ color: 'var(--color-gold-deep)' }}>
          {submitted.refCode}
        </p>
        <p className="font-hind text-sm mb-6" style={{ color: 'var(--color-gray-dark)' }}>
          Our team will review your photos and respond within 2 hours during business hours.
          Quote your reference code in any follow-up.
        </p>
        <a
          href={submitted.confirmWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp inline-flex"
        >
          <MessageCircle size={16} />
          Follow Up on WhatsApp
        </a>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
      id="sell-submission-form"
      noValidate
    >
      {/* Honeypot */}
      <input {...register('website')} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Contact Details */}
      <div className="card-heritage p-6">
        <h3 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Your Contact Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Full Name *
            </label>
            <input
              {...register('name')}
              id="sell-name"
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--color-gray-light)' }}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Mobile Number * (10-digit)
            </label>
            <input
              {...register('phone')}
              id="sell-phone"
              type="tel"
              placeholder="9XXXXXXXXX"
              maxLength={10}
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
              style={{ borderColor: errors.phone ? '#DC2626' : 'var(--color-gray-light)' }}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              City *
            </label>
            <input
              {...register('city')}
              id="sell-city"
              placeholder="Your city"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
              style={{ borderColor: errors.city ? '#DC2626' : 'var(--color-gray-light)' }}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              State
            </label>
            <input
              {...register('state')}
              id="sell-state"
              placeholder="State (optional)"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--color-gray-light)' }}
            />
          </div>
        </div>

        {/* Preferred Contact */}
        <div className="mt-4">
          <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-2" style={{ color: 'var(--color-gray-dark)' }}>
            How should we contact you? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['whatsapp', 'call', 'email'] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('preferredContact')}
                  type="radio"
                  value={opt}
                  id={`contact-${opt}`}
                  className="accent-[var(--color-gold-warm)]"
                />
                <span className="font-hind text-sm capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Item Details */}
      <div className="card-heritage p-6">
        <h3 className="font-playfair text-lg font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Item Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Item Category *
            </label>
            <select
              {...register('itemCategory')}
              id="sell-category"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 bg-white"
              style={{ borderColor: errors.itemCategory ? '#DC2626' : 'var(--color-gray-light)' }}
            >
              <option value="">Select a category...</option>
              {SELL_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.itemCategory && <p className="text-red-500 text-xs mt-1">{errors.itemCategory.message}</p>}
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              How many pieces?
            </label>
            <input
              {...register('itemCount')}
              id="sell-item-count"
              type="number"
              min={1}
              max={100}
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--color-gray-light)' }}
            />
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Estimated Era
            </label>
            <select
              {...register('estimatedEra')}
              id="sell-era"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}
            >
              <option value="">Unknown / Not sure</option>
              {ERA_OPTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Condition (your view)
            </label>
            <select
              {...register('condition')}
              id="sell-condition"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}
            >
              <option value="">Not sure</option>
              <option value="good">Good — no visible damage</option>
              <option value="fair">Fair — some wear or marks</option>
              <option value="damaged">Damaged — tears, stains</option>
            </select>
          </div>
        </div>

        {/* Saree-specific fields */}
        {isSaree && (
          <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--color-gold-pale)', border: '1px solid rgba(139,105,20,0.15)' }}>
            <p className="font-inter text-xs font-600 uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold-deep)' }}>
              Saree-Specific Details
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
                  Saree Type
                </label>
                <input
                  {...register('sareeType')}
                  id="sell-saree-type"
                  placeholder="e.g. Kanjivaram, Banarasi…"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: 'var(--color-gray-light)' }}
                />
              </div>
              <div>
                <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
                  Zari Colour (if any)
                </label>
                <select
                  {...register('zariColor')}
                  id="sell-zari-color"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: 'var(--color-gray-light)' }}
                >
                  <option value="">No zari / Not sure</option>
                  <option value="gold">Gold-coloured zari</option>
                  <option value="silver">Silver-coloured zari</option>
                  <option value="both">Both gold and silver</option>
                  <option value="unsure">Has zari but unsure of type</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-4">
          <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
            Describe Your Item(s) *
          </label>
          <textarea
            {...register('description')}
            id="sell-description"
            rows={4}
            placeholder="Tell us what you have — the more detail the better. Include any known history, storage conditions, any damage or repairs..."
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: errors.description ? '#DC2626' : 'var(--color-gray-light)' }}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="mt-4">
          <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
            Expected Price (₹) — Optional
          </label>
          <input
            {...register('expectedPrice')}
            id="sell-expected-price"
            type="number"
            placeholder="What are you hoping to get? (optional)"
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--color-gray-light)' }}
          />
        </div>
      </div>

      {/* Photo Upload */}
      <div className="card-heritage p-6">
        <h3 className="font-playfair text-lg font-bold mb-1" style={{ color: 'var(--color-charcoal)' }}>
          Photos *
        </h3>
        <p className="font-hind text-xs mb-4" style={{ color: 'var(--color-gray-mid)' }}>
          Upload at least 1 photo (max 10). Include: full piece, border close-up, any labels/tags, any visible damage.
        </p>

        {/* Drop zone */}
        {photos.length < 10 && (
          <div
            {...getRootProps()}
            id="photo-upload-zone"
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
            style={{
              borderColor: isDragActive ? 'var(--color-gold-warm)' : 'var(--color-gray-light)',
              background: isDragActive ? 'var(--color-gold-pale)' : 'transparent',
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" style={{ color: 'var(--color-gold-warm)' }} />
            ) : (
              <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-gray-mid)' }} />
            )}
            <p className="font-hind text-sm" style={{ color: 'var(--color-gray-dark)' }}>
              {isDragActive ? 'Drop photos here…' : 'Drag & drop photos, or click to select'}
            </p>
            <p className="font-inter text-xs mt-1" style={{ color: 'var(--color-gray-mid)' }}>
              JPG, PNG, WEBP, HEIC — up to 10MB each
            </p>
          </div>
        )}

        {/* Uploaded photos grid */}
        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && (
          <p className="text-red-500 text-xs mt-2">Please upload at least one photo</p>
        )}
      </div>

      {/* How did you hear */}
      <div className="card-heritage p-4">
        <label className="block font-inter text-xs font-600 uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
          How did you hear about us?
        </label>
        <input
          {...register('howDidYouHear')}
          id="sell-how-heard"
          placeholder="Google, Instagram, friend's recommendation…"
          className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--color-gray-light)' }}
        />
      </div>

      {/* Error */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm font-hind">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        id="sell-form-submit"
        disabled={isSubmitting || uploading || photos.length === 0}
        className="w-full btn-gold py-4 text-base font-inter flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Sell Inquiry
          </>
        )}
      </button>

      <p className="text-center font-hind text-xs" style={{ color: 'var(--color-gray-mid)' }}>
        By submitting, you agree to our{' '}
        <a href="/terms-conditions" className="underline hover:text-[var(--color-gold-deep)]">Terms</a>{' '}
        and{' '}
        <a href="/privacy-policy" className="underline hover:text-[var(--color-gold-deep)]">Privacy Policy</a>.
        We never share your photos or contact details with third parties.
      </p>
    </form>
  )
}
