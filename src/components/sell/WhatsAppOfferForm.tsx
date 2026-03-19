'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendGAEvent } from '@next/third-parties/google'
import { buildOfferLink, OfferFormData } from '@/lib/whatsapp'

const CATEGORIES = [
  { value: 'Denim & Workwear', slug: 'denim' },
  { value: 'Retro Sports & Streetwear', slug: 'sportswear' },
  { value: 'Archive Designer & Luxury', slug: 'designer' },
  { value: 'Silk Sarees & Heritage Weaves', slug: 'heritage-textiles' },
  { value: 'Jackets & Outerwear', slug: 'outerwear' },
  { value: 'Bags, Scarves & Accessories', slug: 'accessories' },
]

const ERAS = ['1940s or earlier', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Not sure']

export function WhatsAppOfferForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get('category')

  const [step, setStep] = useState<1 | 2 | 3 | 'review'>(1)
  
  const [formData, setFormData] = useState<OfferFormData>({
    category: '',
    itemType: '',
    era: '',
    itemCount: 1,
    condition: 'Good',
    originalTags: 'No',
    flaws: '',
    name: '',
    location: ''
  })

  useEffect(() => {
    sendGAEvent({ event: 'offer_panel_opened' })
    if (categoryParam) {
      const match = CATEGORIES.find(c => c.slug === categoryParam)
      if (match) {
        setFormData(prev => ({ ...prev, category: match.value }))
      }
    }
  }, [categoryParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validations
  const canProceedStep1 = formData.category.length > 0 && formData.itemType.length > 2 && formData.era.length > 0
  const canProceedStep2 = formData.condition && formData.originalTags
  const canProceedStep3 = formData.name.length >= 2

  const nextStep = () => {
    if (step === 1) {
      sendGAEvent({ event: 'offer_step_completed', step_number: 1 })
      setStep(2)
    } else if (step === 2) {
      sendGAEvent({ event: 'offer_step_completed', step_number: 2 })
      setStep(3)
    } else if (step === 3) {
      sendGAEvent({ event: 'offer_step_completed', step_number: 3 })
      setStep('review')
    }
  }

  const prevStep = () => {
    if (step === 'review') setStep(3)
    else if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
  }

  const handleWhatsAppRedirect = () => {
    sendGAEvent({ event: 'offer_whatsapp_clicked' })
    const link = buildOfferLink(formData)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  // Helper context mapping
  const helperText = CATEGORIES.find(c => c.value === formData.category)?.slug === 'heritage-textiles' 
    ? "We buy Banarasi, Kanjivaram, Patola, and other heritage weaves. Offers made in ₹ for India sellers."
    : CATEGORIES.find(c => c.value === formData.category)?.slug === 'denim'
    ? "We specialise in vintage Levi's, Lee, Wrangler, and workwear from the 1960s–1990s."
    : CATEGORIES.find(c => c.value === formData.category)?.slug === 'designer'
    ? "We assess pre-2000 pieces from Issey Miyake, Helmut Lang, Versace, and more."
    : "Fill out the details below to receive a fast, free valuation directly on WhatsApp."

  return (
    <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-10 border-[rgba(184,134,11,0.15)]">
      {/* ─── STEP 1 ─── */}
      {step === 1 && (
        <div className="space-y-6 animate-float-up">
          <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Step 1: What Are You Selling?</h2>
          {formData.category && (
            <p className="font-body text-sm font-medium" style={{ color: 'var(--zari-gold-dark)' }}>{helperText}</p>
          )}

          <div>
            <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Category *</label>
            <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 outline-none transition-colors font-body bg-white appearance-none">
              <option value="" disabled>Select the category...</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Item Type / Brand *</label>
            <input
              type="text"
              name="itemType"
              required
              value={formData.itemType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 outline-none transition-colors font-body"
              placeholder="e.g. Levi's 501 jeans, Banarasi Saree, Vintage Nike Tee"
            />
          </div>

          <div>
            <label className="block font-ui text-sm font-semibold mb-3" style={{ color: 'var(--body-color)' }}>Era / Decade *</label>
            <div className="flex gap-2 flex-wrap">
              {ERAS.map(era => (
                <button
                  key={era}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, era }))}
                  className={`px-4 py-2.5 rounded-full text-sm font-body border-2 transition-all ${
                    formData.era === era
                      ? 'border-[var(--zari-gold)] bg-[var(--zari-gold)]/10 text-[var(--ink)] font-semibold'
                      : 'border-gray-100 text-gray-600 hover:border-[var(--zari-gold)]/40'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Number of Items *</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setFormData(p => ({ ...p, itemCount: Math.max(1, p.itemCount - 1) }))} className="w-12 h-12 rounded-xl border-2 border-gray-200 text-xl font-medium hover:border-[var(--zari-gold)] flex items-center justify-center">−</button>
              <div className="w-16 text-center font-body text-xl font-semibold">{formData.itemCount}</div>
              <button type="button" onClick={() => setFormData(p => ({ ...p, itemCount: Math.min(99, p.itemCount + 1) }))} className="w-12 h-12 rounded-xl border-2 border-gray-200 text-xl font-medium hover:border-[var(--zari-gold)] flex items-center justify-center">+</button>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={nextStep}
              disabled={!canProceedStep1}
              className="w-full py-4 px-8 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-1 block text-center"
              style={{ background: !canProceedStep1 ? '#9ca3af' : 'var(--zari-gold)' }}
            >
              Next: Item Condition →
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 2 && (
        <div className="space-y-6 animate-float-up">
          <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Step 2: Condition</h2>
          
          <div>
            <label className="block font-ui text-sm font-semibold mb-3" style={{ color: 'var(--body-color)' }}>How would you rate its condition? *</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Excellent', 'Good', 'Fair', 'Poor'] as const).map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                  className={`p-4 rounded-xl text-left border-2 transition-all ${
                    formData.condition === cond
                      ? 'border-[var(--zari-gold)] bg-[var(--zari-gold)]/10 text-[var(--ink)]'
                      : 'border-gray-100 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <p className="font-ui font-semibold text-base mb-1">{cond}</p>
                  <p className="font-body text-xs opacity-80">
                    {cond === 'Excellent' ? 'No visible flaws, almost new' : cond === 'Good' ? 'Light wear, fully intact' : cond === 'Fair' ? 'Visible wear, minor repairs' : 'Damaged, selling for parts/repair'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block font-ui text-sm font-semibold mb-3" style={{ color: 'var(--body-color)' }}>Are original tags or labels present? *</label>
             <div className="grid grid-cols-3 gap-3">
              {(['Yes', 'Partial', 'No'] as const).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, originalTags: tag }))}
                  className={`p-3 rounded-xl text-center font-ui text-sm font-medium border-2 transition-all ${
                    formData.originalTags === tag
                      ? 'border-[var(--zari-gold)] bg-[var(--zari-gold)]/10 text-[var(--ink)]'
                      : 'border-gray-100 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
             </div>
          </div>

          <div>
            <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Any visible flaws or alterations? (Optional)</label>
            <textarea
              name="flaws"
              value={formData.flaws}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 outline-none transition-colors font-body resize-none"
              placeholder="e.g. Small stain on collar, missing 1 button, tailoring to waist..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={prevStep} className="btn-ghost flex-1 py-4 border-gray-200 text-gray-600 rounded-full font-ui">← Back</button>
            <button
              onClick={nextStep}
              disabled={!canProceedStep2}
              className="flex-[2] py-4 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform block text-center"
              style={{ background: !canProceedStep2 ? '#9ca3af' : 'var(--zari-gold)' }}
            >
              Next: Contact Details →
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3 ─── */}
      {step === 3 && (
        <div className="space-y-6 animate-float-up">
          <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Step 3: How Can We Reach You?</h2>
          
          <div>
            <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Your Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 outline-none transition-colors font-body"
              placeholder="e.g. Priya"
            />
          </div>

          <div>
             <label className="block font-ui text-sm font-semibold mb-1.5" style={{ color: 'var(--body-color)' }}>Your City / Country (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--zari-gold)] focus:ring-1 outline-none transition-colors font-body"
              placeholder="e.g. Mumbai, India or London, UK"
            />
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex gap-3 text-sm font-body text-green-900 mt-2">
            <span className="text-xl leading-none">💬</span>
            <p>You will submit your offer directly to our secure WhatsApp channel on the next screen.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={prevStep} className="btn-ghost flex-1 py-4 border-gray-200 text-gray-600 rounded-full font-ui">← Back</button>
            <button
              onClick={nextStep}
              disabled={!canProceedStep3}
              className="flex-[2] py-4 rounded-full text-white font-ui font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform block text-center"
              style={{ background: !canProceedStep3 ? '#9ca3af' : 'var(--zari-gold)' }}
            >
              Preview My Offer →
            </button>
          </div>
        </div>
      )}

      {/* ─── REVIEW STEP ─── */}
      {step === 'review' && (
        <div className="space-y-6 animate-float-up">
          <h2 className="font-display text-2xl text-green-700">✅ Your Offer Summary</h2>
          <p className="font-body text-sm" style={{ color: 'var(--muted)' }}>Here is the structured offer we will send via WhatsApp for your instant valuation.</p>
          
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 font-mono text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {`Hi Zariwala! I'd like to sell the following:\n\n` +
             `📦 Category: ${formData.category}\n` +
             `🏷️ Item Type: ${formData.itemType}\n` +
             `📅 Era / Decade: ${formData.era}\n` +
             `🔢 Number of Items: ${formData.itemCount}\n` +
             `⭐ Condition: ${formData.condition}\n` +
             `🏷️ Original Tags: ${formData.originalTags}\n` +
             `📝 Flaws / Notes: ${formData.flaws?.trim() || 'None mentioned'}\n\n` +
             `👤 My Name: ${formData.name}${formData.location ? `\n📍 Location: ${formData.location}` : ''}\n\n` +
             `I'll send photos now. Please let me know your offer!`}
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full py-4 px-8 rounded-full text-white font-ui text-lg font-bold shadow-xl transition-transform hover:-translate-y-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a]"
            >
              <svg className="w-6 h-6 fill-white drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z"/>
              </svg>
              Send Offer on WhatsApp →
            </button>
            <p className="text-center font-ui text-xs text-gray-500">Opens WhatsApp. You will be able to attach photos immediately.</p>
            <button onClick={prevStep} className="text-gray-500 font-ui hover:underline text-sm font-semibold mx-auto mt-2">← Wait, I need to edit details</button>
          </div>
        </div>
      )}
    </div>
  )
}
