'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WA_LINKS } from '@/lib/whatsapp'
import { sendGAEvent } from '@next/third-parties/google'

type Factor = 'category' | 'era' | 'condition' | 'tags' | 'repairs'

export default function ValuationEstimator() {
  const [factors, setFactors] = useState<Record<Factor, string>>({
    category: '',
    era: '',
    condition: '',
    tags: '',
    repairs: ''
  })
  
  const [hasCalculated, setHasCalculated] = useState(false)

  const handleSelect = (factor: Factor, val: string) => {
    setFactors(prev => ({ ...prev, [factor]: val }))
    setHasCalculated(false)
  }

  const allSelected = Object.values(factors).every(v => v !== '')

  const getEstimate = () => {
    let baseMinUsd = 10
    let baseMaxUsd = 25
    let multiplier = 1

    // Category base
    if (factors.category === 'denim') { baseMinUsd = 40; baseMaxUsd = 100 }
    if (factors.category === 'sportswear') { baseMinUsd = 30; baseMaxUsd = 80 }
    if (factors.category === 'designer') { baseMinUsd = 80; baseMaxUsd = 200 }
    if (factors.category === 'heritage') { baseMinUsd = 50; baseMaxUsd = 150 }
    if (factors.category === 'outerwear') { baseMinUsd = 60; baseMaxUsd = 180 }
    if (factors.category === 'accessories') { baseMinUsd = 35; baseMaxUsd = 90 }

    // Era multiplier
    if (factors.era === 'pre-70s') multiplier *= 3.0
    if (factors.era === '80s') multiplier *= 1.8
    if (factors.era === '90s') multiplier *= 1.2
    
    // Condition adj
    if (factors.condition === 'excellent') multiplier *= 1.5
    if (factors.condition === 'good') multiplier *= 1.0
    if (factors.condition === 'fair') multiplier *= 0.6
    
    // Tags Multiplier
    if (factors.tags === 'yes') multiplier *= 1.4
    if (factors.tags === 'partial') multiplier *= 1.1

    // Repairs Multiplier
    if (factors.repairs === 'none') multiplier *= 1.1
    if (factors.repairs === 'minor') multiplier *= 0.9
    if (factors.repairs === 'major') multiplier *= 0.5

    const finalMinUsd = Math.round(baseMinUsd * multiplier)
    const finalMaxUsd = Math.round(baseMaxUsd * multiplier * 2.5) // spread the max

    return {
      minUsd: finalMinUsd,
      maxUsd: finalMaxUsd,
      minInr: finalMinUsd * 83,
      maxInr: finalMaxUsd * 83
    }
  }

  const calculate = () => {
    setHasCalculated(true)
    sendGAEvent({ event: 'valuation_tool_used', value: factors })
  }

  const estimate = allSelected ? getEstimate() : null

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-[var(--color-gold)]/20 mt-20 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl text-[var(--color-espresso)] mb-3">Interactive Valuation Estimator</h2>
        <p className="font-body text-[var(--color-espresso-mid)]">
          Select attributes below to preview an approximate range for your item.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">1. Category</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'denim', label: 'Denim & Workwear' },
              { id: 'sportswear', label: 'Retro Sports & Streetwear' },
              { id: 'designer', label: 'Archive Designer & Luxury' },
              { id: 'heritage', label: 'Silk Sarees & Heritage Weaves' },
              { id: 'outerwear', label: 'Jackets & Outerwear' },
              { id: 'accessories', label: 'Bags, Scarves & Accessories' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('category', opt.id)}
                className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.category === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">2. Era</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'pre-70s', label: '1940s - 1970s' },
              { id: '80s', label: '1980s' },
              { id: '90s', label: '1990s' },
              { id: 'y2k', label: 'Unknown / Modern' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('era', opt.id)}
                 className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.era === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">3. Condition</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'excellent', label: 'Excellent' },
              { id: 'good', label: 'Good' },
              { id: 'fair', label: 'Fair' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('condition', opt.id)}
                 className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.condition === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">4. Original Label / Tags?</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'yes', label: 'Yes - Fully Intact' },
              { id: 'partial', label: 'Partial / Faded' },
              { id: 'no', label: 'No / Missing' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('tags', opt.id)}
                 className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.tags === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">5. Repairs or Alterations?</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'none', label: 'None' },
              { id: 'minor', label: 'Minor Repairs' },
              { id: 'major', label: 'Major Alterations' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('repairs', opt.id)}
                 className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.repairs === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center border-t border-[var(--color-ivory-dark)] pt-10">
        {!hasCalculated ? (
          <button
            onClick={calculate}
            disabled={!allSelected}
            className="btn-primary px-10 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-ui shadow-md"
            style={{ background: !allSelected ? '#9ca3af' : 'var(--zari-gold)', color: '#fff' }}
          >
            Calculate Estimate
          </button>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <p className="font-body text-sm text-[var(--color-espresso-mid)] uppercase tracking-widest mb-2">Estimated Range</p>
            <div className="font-display text-4xl md:text-5xl text-[var(--color-espresso)] mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-espresso)] to-[var(--color-gold-dark)] mix-blend-multiply flex flex-col items-center gap-2">
              <span>${estimate?.minUsd} ~ ${estimate?.maxUsd}</span>
              <span className="text-2xl text-[var(--color-gray-500)] text-solid">
                (₹{estimate?.minInr.toLocaleString()} ~ ₹{estimate?.maxInr.toLocaleString()})
              </span>
            </div>
            <p className="font-body text-sm text-[var(--color-gray-500)] max-w-sm mx-auto mb-8">
              * This is a rough automated estimate. Actual offers may vary significantly depending on specifics confirmed via photo evaluation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WA_LINKS.valuationGuide} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-8 py-3 text-white inline-flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform">
                <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" /></svg>
                Get Exact Offer
              </a>
              <Link href="/sell" className="btn-primary px-8 py-3 bg-white border border-[var(--color-gold)] text-[var(--color-espresso)] hover:bg-[var(--color-gold)]/5 hover:-translate-y-1 transition-transform">
                Use Sell Form
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
