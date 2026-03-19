'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react'
import { sendGAEvent } from '@next/third-parties/google'

const CATEGORIES = [
  { value: 'Denim & Workwear', label: 'Denim & Workwear' },
  { value: 'Retro Sports & Streetwear', label: 'Retro Sports & Streetwear' },
  { value: 'Archive Designer & Luxury', label: 'Archive Designer & Luxury' },
  { value: 'Silk Sarees & Heritage Weaves', label: 'Silk Sarees & Heritage Weaves' },
  { value: 'Jackets & Outerwear', label: 'Jackets & Outerwear' },
  { value: 'Bags, Scarves & Accessories', label: 'Bags, Scarves & Accessories' },
]

const COUNTRIES = [
  'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany',
  'France', 'Japan', 'India', 'Singapore', 'UAE', 'Other'
]

interface UploadedPhoto {
  url: string
  publicId: string
  name: string
}

async function uploadToCloudinary(file: File): Promise<UploadedPhoto> {
  // Get signed upload params from our API
  const sigRes = await fetch('/api/cloudinary/sign', { method: 'POST' })
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const sig = await sigRes.json()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', sig.apiKey)
  formData.append('timestamp', sig.timestamp.toString())
  formData.append('signature', sig.signature)
  formData.append('folder', sig.folder)
  formData.append('upload_preset', sig.uploadPreset)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!uploadRes.ok) throw new Error('Upload failed')
  const data = await uploadRes.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
    name: file.name,
  }
}

export default function SellPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    sendGAEvent({ event: 'sell_form_started' })
  }, [])

  const [formData, setFormData] = useState({
    sellerName: '',
    email: '',
    whatsapp: '',
    contactMethod: 'WHATSAPP' as 'WHATSAPP' | 'EMAIL',
    country: '',
    categories: [] as string[],
    itemCount: 1,
    description: '',
    condition: '',
    // honeypot
    website: '',
  })

  // Photo upload state
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }))
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (photos.length + files.length > 8) {
      alert('Maximum 8 photos allowed')
      return
    }

    setUploading(true)
    const newPhotos: UploadedPhoto[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Uploading ${file.name} (${i + 1}/${files.length})…`)
      try {
        const uploaded = await uploadToCloudinary(file)
        newPhotos.push(uploaded)
      } catch (err) {
        console.error('Upload error:', err)
        alert(`Failed to upload ${file.name}. Please try again.`)
      }
    }

    setPhotos(prev => [...prev, ...newPhotos])
    setUploading(false)
    setUploadProgress('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [photos.length])

  const removePhoto = (publicId: string) => {
    setPhotos(prev => prev.filter(p => p.publicId !== publicId))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: photos.map(p => p.url),
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push(`/sell/success?ref=${data.reference}`)
      } else if (res.status === 429) {
        setSubmitError(data.error || 'Too many submissions. Please wait and try again.')
        setIsSubmitting(false)
      } else {
        setSubmitError(data.error || 'Error submitting inquiry. Please try again.')
        setIsSubmitting(false)
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  const canProceedStep1 = formData.sellerName.length >= 2 && formData.country.length > 0
  const canProceedStep2 = formData.categories.length > 0 && formData.itemCount >= 1

  return (
    <div className="py-16 md:py-24 min-h-[80vh]" style={{ background: 'var(--zari-pale)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--zari-gold)' }}>
            Free Valuation
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ color: 'var(--ink)' }}>
            Sell Your Collection
          </h1>
          <p className="font-body leading-relaxed" style={{ color: 'var(--muted)' }}>
            Tell us about your vintage pieces. We'll review and respond within 24 hours.
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center mb-10 relative max-w-xs mx-auto">
          <div className="absolute left-0 top-1/2 w-full h-0.5 -z-10 -translate-y-1/2" style={{ background: '#e5e7eb' }} />
          <div
            className="absolute left-0 top-1/2 h-0.5 transition-all duration-500 -z-10 -translate-y-1/2"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', background: 'var(--zari-gold)' }}
          />
          {[1, 2, 3].map(n => (
            <div key={n} className={`w-10 h-10 rounded-full font-ui text-base flex items-center justify-center border-2 transition-all duration-300 ${
              step > n
                ? 'text-white'
                : step === n
                ? 'text-white'
                : 'bg-white'
            }`} style={{
              background: step > n ? 'var(--zari-gold)' : step === n ? 'var(--ink)' : '#fff',
              borderColor: step > n ? 'var(--zari-gold)' : step === n ? 'var(--ink)' : '#e5e7eb',
              color: step >= n ? '#fff' : '#9ca3af'
            }}>
              {step > n ? '✓' : n}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-10" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
          <form onSubmit={handleSubmit}>
            {/* honeypot — invisible to humans */}
            <input type="text" name="website" value={formData.website} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

            {/* ─── STEP 1: Contact ─────────── */}
            {step === 1 && (
              <div className="space-y-6 animate-float-up">
                <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Your Contact Details</h2>
                
                <div>
                  <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Full Name *</label>
                  <input
                    type="text"
                    name="sellerName"
                    required
                    value={formData.sellerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Country *</label>
                  <select name="country" required value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body bg-white">
                    <option value="">Select your country…</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-3" style={{ color: 'var(--body-color)' }}>Preferred Contact Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['WHATSAPP', 'EMAIL'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, contactMethod: method }))}
                        className={`py-3 rounded-xl border-2 font-body text-sm font-medium transition-all ${
                          formData.contactMethod === method
                            ? 'border-[var(--zari-gold)] bg-[var(--zari-gold)]/10 text-[var(--ink)]'
                            : 'border-gray-200 text-gray-500 hover:border-[var(--zari-gold)]/50'
                        }`}
                      >
                        {method === 'WHATSAPP' ? '📱 WhatsApp' : '✉️ Email'}
                      </button>
                    ))}
                  </div>
                </div>

                {(formData.contactMethod === 'WHATSAPP') && (
                  <div>
                    <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>WhatsApp Number *</label>
                    <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body" placeholder="+91 98765 43210" />
                  </div>
                )}

                {(formData.contactMethod === 'EMAIL') && (
                  <div>
                    <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body" placeholder="you@example.com" />
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="w-full py-4 px-8 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-1"
                    style={{ background: !canProceedStep1 ? '#9ca3af' : 'var(--zari-gold)' }}
                  >
                    Next: Your Collection →
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: Collection ─────────── */}
            {step === 2 && (
              <div className="space-y-6 animate-float-up">
                <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>About Your Collection</h2>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-3" style={{ color: 'var(--body-color)' }}>
                    Categories * <span className="font-normal text-xs text-gray-500">(select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-4 py-3 rounded-xl text-left font-body text-sm transition-all border-2 ${
                          formData.categories.includes(cat.value)
                            ? 'border-[var(--zari-gold)] bg-[var(--zari-gold)]/10 text-[var(--ink)] font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-[var(--zari-gold)]/40'
                        }`}
                      >
                        {formData.categories.includes(cat.value) ? '✓ ' : ''}{cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>
                    Approximate number of items *
                  </label>
                  <input
                    type="number"
                    name="itemCount"
                    required
                    min={1}
                    max={9999}
                    value={formData.itemCount}
                    onChange={e => setFormData(prev => ({ ...prev, itemCount: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body"
                    placeholder="e.g. 12"
                  />
                </div>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>
                    Overall Condition
                  </label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body bg-white">
                    <option value="">Select condition…</option>
                    <option value="Excellent">Excellent — no visible wear</option>
                    <option value="Very Good">Very Good — minor wash wear only</option>
                    <option value="Good">Good — some fading/wear, no damage</option>
                    <option value="Fair">Fair — visible wear or minor repairs</option>
                    <option value="Mixed">Mixed — varies across items</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>
                    Additional Details
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 focus:ring-[var(--zari-gold)] outline-none transition-colors font-body resize-none"
                    placeholder="List any specific brands, known eras, notable pieces, or anything you'd like us to know…"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1 py-4 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full font-ui">← Back</button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 py-4 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-1"
                    style={{ background: !canProceedStep2 ? '#9ca3af' : 'var(--zari-gold)' }}
                  >
                    Next: Upload Photos →
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Photos + Submit ─────────── */}
            {step === 3 && (
              <div className="space-y-6 animate-float-up">
                <div>
                  <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Upload Photos</h2>
                  <p className="font-body text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    Photos help us give you a more accurate valuation. Upload up to 8 images (optional).
                  </p>
                </div>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-[var(--zari-gold)]/40 rounded-2xl p-8 text-center hover:bg-[var(--zari-gold)]/5 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: 'var(--zari-pale)' }}
                >
                  {uploading ? (
                    <div className="space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--zari-gold)' }} />
                      <p className="font-body text-sm text-[var(--body-color)]">{uploadProgress}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--zari-gold)' }} />
                      <p className="font-body font-medium" style={{ color: 'var(--ink)' }}>Drop photos here or click to browse</p>
                      <p className="font-body text-xs mt-1" style={{ color: 'var(--muted)' }}>JPG, PNG, WEBP · up to 10MB each · max 8 photos</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileSelect(e.target.files)}
                    disabled={uploading || photos.length >= 8}
                  />
                </div>

                {/* Uploaded photo previews */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {photos.map(photo => (
                      <div key={photo.publicId} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.publicId)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 flex items-center justify-center py-1">
                          <CheckCircle className="w-3 h-3 text-white mr-1" />
                          <span className="text-white text-xs">Uploaded</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-body text-sm">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1 py-4 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full font-ui">← Back</button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-1"
                    style={{ background: 'var(--zari-gold)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                </div>
                <p className="font-body text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
                  You'll receive a confirmation reference number instantly.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-fade-in-up" style={{ color: 'var(--muted)' }}>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>🛡️</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>No Obligation</h3>
            <p className="font-body text-xs">You are completely free to decline our offer. Valuations are 100% free.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>⚡</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Fast Responses</h3>
            <p className="font-body text-xs">Quick evaluations and same-day deposits upon securing agreed items.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>🌍</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Global Purchasing</h3>
            <p className="font-body text-xs">We provide pre-paid FedEx labels to sellers worldwide seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
