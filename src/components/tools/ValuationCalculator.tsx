'use client'

import { useState } from 'react'
import { formatINR } from '@/lib/utils'

const FABRIC_MULTIPLIERS: Record<string, number> = {
  pure_silk: 2.5,
  silk_cotton: 1.5,
  cotton: 0.8,
  synthetic: 0.3,
  unknown: 1.0,
}

const ZARI_PRICES_PER_GRAM = {
  pure_silver: 90,
  gold_wash_silver: 50,
  pure_gold: 6500,
  imitation: 5,
  none: 0,
}

const CONDITION_MULTIPLIERS: Record<string, number> = {
  mint: 1.0,
  excellent: 0.85,
  good: 0.65,
  fair: 0.40,
}

const ERA_MULTIPLIERS: Record<string, number> = {
  pre_1970: 1.8,
  '1970s': 1.5,
  '1980s': 1.3,
  '1990s': 1.1,
  y2k: 0.9,
  unknown: 1.0,
}

export function ValuationCalculator() {
  const [form, setForm] = useState({
    fabric: 'pure_silk',
    zariType: 'pure_silver',
    zariWeightGrams: '30',
    totalWeightGrams: '600',
    condition: 'good',
    era: '1980s',
    hasOriginalBlouse: false,
    hasLabel: false,
    isNamedWeaver: false,
    region: 'kanjivaram',
  })

  const [showBreakdown, setShowBreakdown] = useState(false)

  const calculate = () => {
    const zariWeight = parseFloat(form.zariWeightGrams) || 0
    const totalWeight = parseFloat(form.totalWeightGrams) || 0
    const fabricWeight = Math.max(0, totalWeight - zariWeight)

    // Zari scrap value
    const zariPricePerGram = ZARI_PRICES_PER_GRAM[form.zariType as keyof typeof ZARI_PRICES_PER_GRAM] ?? 0
    const zariValue = zariWeight * zariPricePerGram

    // Base fabric value (₹/gram roughly)
    const baseFabricRate = 2.5
    const fabricValue = fabricWeight * baseFabricRate * (FABRIC_MULTIPLIERS[form.fabric] ?? 1)

    // Era and condition multipliers
    const eraMultiplier = ERA_MULTIPLIERS[form.era] ?? 1
    const conditionMultiplier = CONDITION_MULTIPLIERS[form.condition] ?? 0.7

    // Bonuses
    const blouseBonus = form.hasOriginalBlouse ? 800 : 0
    const labelBonus = form.hasLabel ? 500 : 0
    const weaverBonus = form.isNamedWeaver ? 3000 : 0

    const baseValue = (zariValue + fabricValue) * eraMultiplier * conditionMultiplier
    const total = baseValue + blouseBonus + labelBonus + weaverBonus

    return {
      zariValue: Math.round(zariValue),
      fabricValue: Math.round(fabricValue * eraMultiplier * conditionMultiplier),
      blouseBonus,
      labelBonus,
      weaverBonus,
      lowEstimate: Math.round(total * 0.7),
      midEstimate: Math.round(total),
      highEstimate: Math.round(total * 1.4),
    }
  }

  const result = calculate()

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6" id="valuation-calculator">
      {/* Form */}
      <div className="card-heritage p-6 space-y-5">
        <h2 className="font-playfair text-xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
          Tell Us About Your Piece
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Fabric */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Fabric Type
            </label>
            <select value={form.fabric} onChange={(e) => update('fabric', e.target.value)}
              id="calc-fabric"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}>
              <option value="pure_silk">Pure Silk</option>
              <option value="silk_cotton">Silk-Cotton Blend</option>
              <option value="cotton">Pure Cotton</option>
              <option value="synthetic">Synthetic / Art Silk</option>
              <option value="unknown">Not Sure</option>
            </select>
          </div>

          {/* Zari type */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Zari Type
            </label>
            <select value={form.zariType} onChange={(e) => update('zariType', e.target.value)}
              id="calc-zari-type"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}>
              <option value="pure_silver">Pure Silver Zari</option>
              <option value="gold_wash_silver">Gold-Wash Silver Zari</option>
              <option value="pure_gold">Pure Gold Zari (rare)</option>
              <option value="imitation">Imitation / Plastic Zari</option>
              <option value="none">No Zari</option>
            </select>
          </div>

          {/* Zari weight */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Estimated Zari Weight (grams)
            </label>
            <input type="number" value={form.zariWeightGrams} onChange={(e) => update('zariWeightGrams', e.target.value)}
              id="calc-zari-weight"
              min={0} max={500} placeholder="e.g. 30"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
              style={{ borderColor: 'var(--color-gray-light)' }}
            />
            <p className="font-hind text-xs mt-1" style={{ color: 'var(--color-gray-mid)' }}>
              Tip: Zari in a typical Kanjivaram borders ≈ 20–60g
            </p>
          </div>

          {/* Total weight */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Total Saree Weight (grams)
            </label>
            <input type="number" value={form.totalWeightGrams} onChange={(e) => update('totalWeightGrams', e.target.value)}
              id="calc-total-weight"
              min={100} max={3000} placeholder="e.g. 600"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
              style={{ borderColor: 'var(--color-gray-light)' }}
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Condition
            </label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)}
              id="calc-condition"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}>
              <option value="mint">Mint — never worn, no damage</option>
              <option value="excellent">Excellent — minimal wear</option>
              <option value="good">Good — used, clean, small marks</option>
              <option value="fair">Fair — significant wear/repairs</option>
            </select>
          </div>

          {/* Era */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-gray-dark)' }}>
              Estimated Era
            </label>
            <select value={form.era} onChange={(e) => update('era', e.target.value)}
              id="calc-era"
              className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none bg-white"
              style={{ borderColor: 'var(--color-gray-light)' }}>
              <option value="pre_1970">Before 1970</option>
              <option value="1970s">1970s</option>
              <option value="1980s">1980s</option>
              <option value="1990s">1990s</option>
              <option value="y2k">2000s / Y2K</option>
              <option value="unknown">Not Sure</option>
            </select>
          </div>
        </div>

        {/* Bonus factors */}
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-gray-dark)' }}>
            Bonus Factors
          </p>
          <div className="space-y-2">
            {[
              { key: 'hasOriginalBlouse', label: 'Has original matching blouse (+₹800)' },
              { key: 'hasLabel', label: 'Has weaver/shop label tag (+₹500)' },
              { key: 'isNamedWeaver', label: 'Known / named weaver family (+₹3,000)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => update(key, e.target.checked)}
                  className="accent-[var(--color-gold-warm)] w-4 h-4"
                />
                <span className="font-hind text-sm" style={{ color: 'var(--color-gray-dark)' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card-heritage p-6"
        style={{ background: 'linear-gradient(135deg, var(--color-gold-pale), #FFF9E8)', border: '2px solid rgba(139,105,20,0.2)' }}>
        <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Estimated Value Range
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Conservative', value: result.lowEstimate, sub: 'If sold quickly' },
            { label: 'Fair Market', value: result.midEstimate, sub: 'Typical resale' },
            { label: 'Collector', value: result.highEstimate, sub: 'To right buyer' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white shadow-sm">
              <p className="font-inter text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-gray-mid)' }}>{label}</p>
              <p className="font-inter text-xl font-bold" style={{ color: 'var(--color-gold-deep)' }}>{formatINR(value)}</p>
              <p className="font-hind text-xs" style={{ color: 'var(--color-gray-mid)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Breakdown toggle */}
        <button onClick={() => setShowBreakdown(!showBreakdown)}
          className="font-inter text-xs underline mb-3"
          style={{ color: 'var(--color-gold-deep)' }}>
          {showBreakdown ? 'Hide' : 'Show'} breakdown
        </button>

        {showBreakdown && (
          <div className="space-y-1.5 font-hind text-sm border-t pt-3" style={{ borderColor: 'rgba(139,105,20,0.15)' }}>
            {[
              { label: 'Zari scrap value', value: result.zariValue },
              { label: 'Fabric + age + condition', value: result.fabricValue },
              result.blouseBonus > 0 ? { label: 'Original blouse bonus', value: result.blouseBonus } : null,
              result.labelBonus > 0 ? { label: 'Label/tag bonus', value: result.labelBonus } : null,
              result.weaverBonus > 0 ? { label: 'Named weaver bonus', value: result.weaverBonus } : null,
            ].filter(Boolean).map((row) => row && (
              <div key={row.label} className="flex justify-between">
                <span style={{ color: 'var(--color-gray-dark)' }}>{row.label}</span>
                <span className="font-semibold" style={{ color: 'var(--color-gold-deep)' }}>{formatINR(row.value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
