'use client'

import { useState } from 'react'
import Link from 'next/link'

type Factor = 'era' | 'condition' | 'brand' | 'type'

export default function ValuationEstimator() {
  const [factors, setFactors] = useState<Record<Factor, string>>({
    era: '',
    condition: '',
    brand: '',
    type: ''
  })
  
  const [hasCalculated, setHasCalculated] = useState(false)

  const handleSelect = (factor: Factor, val: string) => {
    setFactors(prev => ({ ...prev, [factor]: val }))
    setHasCalculated(false)
  }

  const allSelected = Object.values(factors).every(v => v !== '')

  const getEstimate = () => {
    let baseMin = 1000
    let baseMax = 2500
    let multiplier = 1

    // Type base
    if (factors.type === 'denim') { baseMin = 1500; baseMax = 4000 }
    if (factors.type === 'tee') { baseMin = 800; baseMax = 2500 }
    if (factors.type === 'outerwear') { baseMin = 3000; baseMax = 6500 }
    if (factors.type === 'designer') { baseMin = 6500; baseMax = 15000 }
    if (factors.type === 'heritage') { baseMin = 3500; baseMax = 8000 }

    // Era multiplier
    if (factors.era === 'pre-70s') multiplier *= 3.5
    if (factors.era === '80s') multiplier *= 1.8
    if (factors.era === '90s') multiplier *= 1.2
    
    // Brand multiplier
    if (factors.brand === 'grail') multiplier *= 2.5
    if (factors.brand === 'premium') multiplier *= 1.5

    // Condition adj
    if (factors.condition === 'deadstock') multiplier *= 1.4
    if (factors.condition === 'distressed') multiplier *= 0.8
    if (factors.condition === 'flawed') multiplier *= 0.5

    return {
      min: Math.round((baseMin * multiplier) / 100) * 100,
      max: Math.round((baseMax * multiplier) / 100) * 100
    }
  }

  const estimate = allSelected ? getEstimate() : null

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-[var(--color-gold)]/20 mt-20 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl text-[var(--color-espresso)] mb-3">Interactive Valuation Estimator</h2>
        <p className="font-body text-[var(--color-espresso-mid)]">
          Select attributes below to see an approximate estimated range for your item.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">1. Item Type</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tee', label: 'T-Shirt' },
              { id: 'denim', label: 'Denim/Jeans' },
              { id: 'outerwear', label: 'Outerwear/Jacket' },
              { id: 'designer', label: 'Designer/Luxury' },
              { id: 'heritage', label: 'Silk/Heritage Saree' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('type', opt.id)}
                className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.type === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
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
              { id: 'y2k', label: '2000s (Y2K)' },
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
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">3. Brand Tier</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'grail', label: 'Grail (e.g. Big E Levi\'s, Harley, Rare Band)' },
              { id: 'premium', label: 'Premium (e.g. Carhartt, Nike, Ralph Lauren)' },
              { id: 'standard', label: 'Standard/Unbranded Vintage' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('brand', opt.id)}
                 className={`px-4 py-2 rounded-lg font-body text-sm transition-all border ${factors.brand === opt.id ? 'bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-espresso)]' : 'bg-transparent border-[var(--color-ivory-dark)] text-gray-500 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block font-display text-lg text-[var(--color-espresso)] mb-3">4. Condition</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'deadstock', label: 'Deadstock / Mint' },
              { id: 'worn', label: 'Lightly Worn' },
              { id: 'distressed', label: 'Naturally Distressed' },
              { id: 'flawed', label: 'Noticeable Damage' },
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
      </div>

      <div className="mt-12 text-center border-t border-[var(--color-ivory-dark)] pt-10">
        {!hasCalculated ? (
          <button
            onClick={() => setHasCalculated(true)}
            disabled={!allSelected}
            className="btn-primary px-10 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Calculate Estimate
          </button>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <p className="font-body text-sm text-[var(--color-espresso-mid)] uppercase tracking-widest mb-2">Estimated Range</p>
            <div className="font-display text-5xl md:text-6xl text-[var(--color-espresso)] mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-espresso)] to-[var(--color-gold-dark)] mix-blend-multiply">
              ₹{estimate?.min} <span className="text-[var(--color-gray-400)] font-sans text-4xl">~</span> ₹{estimate?.max}
            </div>
            <p className="font-body text-sm text-[var(--color-gray-500)] max-w-sm mx-auto mb-8">
              * This is a rough automated estimate. Actual offers may vary significantly depending on specifics confirmed via photo evaluation.
            </p>
            <Link href="/sell" className="btn-primary px-8 py-3 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-white">
              Get an Official Valuation
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
