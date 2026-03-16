'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Trash2, Check, X, Plus, LayoutGrid, Rows3 } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  country: string
  flag: string
  quote: string
  itemSold?: string
  rating: number
  isVisible: boolean
  createdAt: string
}

interface FormState {
  name: string
  country: string
  flag: string
  quote: string
  itemSold: string
  rating: number
}

const EMPTY_FORM: FormState = { name: '', country: '', flag: '🌍', quote: '', itemSold: '', rating: 5 }

const FLAG_OPTIONS = ['🇺🇸', '🇬🇧', '🇯🇵', '🇰🇷', '🇮🇳', '🇦🇺', '🇨🇦', '🇩🇪', '🇫🇷', '🇮🇹', '🇸🇬', '🇲🇾', '🇹🇭', '🇵🇭', '🌍']

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials]   = useState<Testimonial[]>([])
  const [loading, setLoading]             = useState(true)
  const [showForm, setShowForm]           = useState(false)
  const [form, setForm]                   = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [toast, setToast]                 = useState<string | null>(null)
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setTestimonials(data.testimonials || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const toggleVisibility = async (id: string, current: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current }),
    })
    setTestimonials(prev =>
      prev.map(t => t.id === id ? { ...t, isVisible: !current } : t)
    )
    showToast(!current ? 'Testimonial published' : 'Testimonial hidden')
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial permanently?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setTestimonials(prev => prev.filter(t => t.id !== id))
    showToast('Testimonial deleted')
  }

  const submitNew = async () => {
    if (!form.name || !form.quote || !form.country) return
    setSaving(true)
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      setShowForm(false)
      setForm(EMPTY_FORM)
      load()
      showToast('Testimonial added')
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const visible   = testimonials.filter(t => t.isVisible)
  const hidden    = testimonials.filter(t => !t.isVisible)

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-espresso)] text-[var(--color-ivory)] px-5 py-3 rounded-xl shadow-xl font-body text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[var(--color-gold)]" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-[var(--color-espresso)]">Testimonials</h1>
          <p className="text-sm text-[var(--color-gray-500)] font-body mt-1">
            {visible.length} published · {hidden.length} pending approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--color-ivory-dark)] rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
              <LayoutGrid className="w-4 h-4 text-[var(--color-espresso)]" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
              <Rows3 className="w-4 h-4 text-[var(--color-espresso)]" />
            </button>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border border-[var(--color-gold)]/20 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-display text-xl text-[var(--color-espresso)]">New Testimonial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Seller Name *</label>
              <input className="field-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sarah T." />
            </div>
            <div>
              <label className="field-label">Country *</label>
              <input className="field-input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. United Kingdom" />
            </div>
            <div>
              <label className="field-label">Flag Emoji</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {FLAG_OPTIONS.map(flag => (
                  <button
                    key={flag}
                    onClick={() => setForm(f => ({ ...f, flag }))}
                    className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${form.flag === flag ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10' : 'border-transparent hover:border-gray-200'}`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Item Sold (optional)</label>
              <input className="field-input" value={form.itemSold} onChange={e => setForm(f => ({ ...f, itemSold: e.target.value }))} placeholder="e.g. Vintage Levi's 501" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Testimonial Quote *</label>
              <textarea className="field-input min-h-[100px] resize-none" value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="What did the seller say about their experience?" />
            </div>
            <div>
              <label className="field-label">Rating (1–5)</label>
              <div className="flex gap-2 pt-1">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setForm(f => ({ ...f, rating: r }))} className={`text-2xl transition-transform hover:scale-110 ${r <= form.rating ? 'opacity-100' : 'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={submitNew}
              disabled={saving || !form.name || !form.quote || !form.country}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Testimonial'}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
              className="px-6 py-2.5 text-sm border border-[var(--color-ivory-dark)] rounded-xl font-body hover:bg-[var(--color-ivory-dark)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-[var(--color-ivory-dark)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-[var(--color-espresso)] mb-2">No testimonials yet</p>
          <p className="font-body text-[var(--color-gray-500)] mb-6">Add your first seller testimonial to display on the homepage.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6">Add First Testimonial</button>
        </div>
      ) : (
        <>
          {/* Pending section */}
          {hidden.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-[var(--color-espresso)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Pending Approval ({hidden.length})
              </h2>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {hidden.map(t => (
                  <TestimonialCard key={t.id} t={t} onToggle={toggleVisibility} onDelete={deleteTestimonial} />
                ))}
              </div>
            </div>
          )}

          {/* Published section */}
          {visible.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-[var(--color-espresso)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Published ({visible.length})
              </h2>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {visible.map(t => (
                  <TestimonialCard key={t.id} t={t} onToggle={toggleVisibility} onDelete={deleteTestimonial} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function TestimonialCard({
  t, onToggle, onDelete
}: {
  t: Testimonial
  onToggle: (id: string, current: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${t.isVisible ? 'border-[var(--color-gold)]/20' : 'border-[var(--color-ivory-dark)] opacity-70'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{t.flag}</span>
          <div>
            <p className="font-display text-sm text-[var(--color-espresso)]">{t.name}</p>
            <p className="font-body text-xs text-[var(--color-gray-500)]">{t.country}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onToggle(t.id, t.isVisible)}
            title={t.isVisible ? 'Hide testimonial' : 'Publish testimonial'}
            className={`p-1.5 rounded-lg transition-colors ${t.isVisible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-[var(--color-ivory-dark)] text-[var(--color-gray-500)] hover:bg-green-50 hover:text-green-600'}`}
          >
            {t.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(t.id)}
            title="Delete testimonial"
            className="p-1.5 rounded-lg bg-[var(--color-ivory-dark)] text-[var(--color-gray-500)] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="font-body text-sm text-[var(--color-espresso-mid)] leading-relaxed line-clamp-3 italic">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xs ${i < t.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
          ))}
        </div>
        {t.itemSold && (
          <span className="text-xs font-body text-[var(--color-gray-500)] bg-[var(--color-ivory-dark)] px-2 py-0.5 rounded-full">
            {t.itemSold}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${t.isVisible ? 'bg-green-500' : 'bg-amber-400'}`} />
        <span className="text-xs font-body text-[var(--color-gray-500)]">
          {t.isVisible ? 'Published on homepage' : 'Pending approval'}
        </span>
      </div>
    </div>
  )
}
