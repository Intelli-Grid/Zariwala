'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ExternalLink, MessageCircle, Send, Mail,
  ChevronDown, Loader2, CheckCircle2, Clock, Package,
  Banknote, XCircle, Archive, Edit3, Save, X
} from 'lucide-react'

const STATUS_FLOW = [
  { value: 'NEW',           label: 'New',            icon: Clock,        color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'IN_REVIEW',     label: 'Reviewing',      icon: Edit3,        color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'OFFER_SENT',    label: 'Offer Sent',     icon: Send,         color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'ACCEPTED',      label: 'Accepted',       icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'ITEM_RECEIVED', label: 'Item Received',  icon: Package,      color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 'PAYMENT_SENT',  label: 'Payment Sent',   icon: Banknote,     color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'COMPLETED',     label: 'Completed',      icon: CheckCircle2, color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { value: 'REJECTED',      label: 'Rejected',       icon: XCircle,      color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'ARCHIVED',      label: 'Archived',       icon: Archive,      color: 'bg-gray-100 text-gray-500 border-gray-200' },
]

function getStatusStyle(status: string) {
  return STATUS_FLOW.find(s => s.value === status) || STATUS_FLOW[0]
}

export default function AdminInquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [inquiry, setInquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Editable fields
  const [status, setStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [offerAmount, setOfferAmount] = useState<string>('')
  const [editing, setEditing] = useState(false)

  // Activity Log Notes
  const [activityNotes, setActivityNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // Selected photo for lightbox
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      fetch(`/api/admin/inquiries/${id}`).then(r => r.json()),
      fetch(`/api/admin/inquiries/${id}/notes`).then(r => r.json())
    ])
      .then(([inquiryData, notesData]) => {
        if (inquiryData.inquiry) {
          setInquiry(inquiryData.inquiry)
          setStatus(inquiryData.inquiry.status || 'NEW')
          setAdminNotes(inquiryData.inquiry.adminNotes || '')
          setOfferAmount(inquiryData.inquiry.offerAmount?.toString() || '')
        } else {
          setError('Inquiry not found')
        }
        if (notesData.notes) {
          setActivityNotes(notesData.notes)
        }
      })
      .catch(() => setError('Failed to load inquiry data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: adminNotes || null,
          offerAmount: offerAmount ? parseFloat(offerAmount) : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setInquiry(data.inquiry)
        setSaved(true)
        setEditing(false)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || 'Save failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setSavingNote(true)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote })
      })
      const data = await res.json()
      if (res.ok) {
        // Need to fetch again to get the exact author name via join, 
        // or just cheat and use current admin's (we don't have it locally though).
        // Best approach is reloading notes purely.
        const r = await fetch(`/api/admin/inquiries/${id}/notes`)
        const rd = await r.json()
        setActivityNotes(rd.notes || [])
        setNewNote('')
      } else {
        alert(data.error || 'Failed to add note')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setSavingNote(false)
    }
  }

  const waLink = inquiry?.whatsapp
    ? `https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inquiry.sellerName}, this is the Zariwala team regarding your inquiry ${inquiry.reference}.`)}`
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)]" />
      </div>
    )
  }

  if (error && !inquiry) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4 font-body">{error}</p>
        <Link href="/admin/inquiries" className="btn-primary">← Back to Inquiries</Link>
      </div>
    )
  }

  const statusInfo = getStatusStyle(status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inquiries" className="text-[var(--color-espresso-mid)] hover:text-[var(--color-espresso)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-[var(--color-espresso)]">
              {inquiry.reference}
            </h1>
            <p className="font-body text-sm text-[var(--color-gray-500)] mt-0.5">
              Received {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn-ghost px-4 py-2 flex items-center gap-1.5 text-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => { setEditing(false); setStatus(inquiry.status); setAdminNotes(inquiry.adminNotes || ''); setOfferAmount(inquiry.offerAmount?.toString() || '') }}
                className="btn-ghost px-4 py-2 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-5 py-2 flex items-center gap-1.5 text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-body text-sm">
          <CheckCircle2 className="w-4 h-4" /> Changes saved successfully.
        </div>
      )}
      {error && (
        <div className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-body text-sm">{error}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Seller info + Photos */}
        <div className="md:col-span-2 space-y-5">
          {/* Seller Details */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-4">Seller Details</h2>
            <dl className="grid grid-cols-2 gap-y-3 font-body text-sm">
              <dt className="text-[var(--color-gray-500)]">Name</dt>
              <dd className="text-[var(--color-espresso)] font-semibold">{inquiry.sellerName}</dd>

              <dt className="text-[var(--color-gray-500)]">Country</dt>
              <dd className="text-[var(--color-espresso)]">{inquiry.country || '—'}</dd>

              <dt className="text-[var(--color-gray-500)]">Contact Method</dt>
              <dd className="text-[var(--color-espresso)] capitalize">{inquiry.contactMethod?.toLowerCase()}</dd>

              {inquiry.whatsapp && (
                <>
                  <dt className="text-[var(--color-gray-500)]">WhatsApp</dt>
                  <dd>
                    <a href={waLink!} target="_blank" rel="noopener noreferrer"
                      className="text-green-700 hover:underline flex items-center gap-1">
                      {inquiry.whatsapp} <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </>
              )}
              {inquiry.email && (
                <>
                  <dt className="text-[var(--color-gray-500)]">Email</dt>
                  <dd>
                    <a href={`mailto:${inquiry.email}`} className="text-[var(--color-espresso)] hover:underline flex items-center gap-1">
                      {inquiry.email} <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </>
              )}
            </dl>

            {/* Quick contact buttons */}
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[var(--color-ivory-dark)]">
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
              {inquiry.email && (
                <a href={`mailto:${inquiry.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-gold)]/30 rounded-lg text-[var(--color-espresso)] hover:bg-[var(--color-ivory)] transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-4">Item Details</h2>
            <dl className="grid grid-cols-2 gap-y-3 font-body text-sm mb-4">
              <dt className="text-[var(--color-gray-500)]">Categories</dt>
              <dd className="text-[var(--color-espresso)]">
                {inquiry.categories?.length > 0
                  ? inquiry.categories.join(', ')
                  : '—'}
              </dd>

              <dt className="text-[var(--color-gray-500)]">Item Count</dt>
              <dd className="text-[var(--color-espresso)] font-semibold">{inquiry.itemCount}</dd>

              <dt className="text-[var(--color-gray-500)]">Condition</dt>
              <dd className="text-[var(--color-espresso)] capitalize">{inquiry.condition || '—'}</dd>
            </dl>
            {inquiry.description && (
              <div>
                <p className="font-body text-xs text-[var(--color-gray-500)] uppercase tracking-widest mb-2">Description</p>
                <p className="font-body text-sm text-[var(--color-espresso)] leading-relaxed bg-[var(--color-ivory)] rounded-xl p-3">
                  {inquiry.description}
                </p>
              </div>
            )}
          </div>

          {/* Photos */}
          {inquiry.photos?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
              <h2 className="font-display text-lg text-[var(--color-espresso)] mb-4">
                Photos ({inquiry.photos.length})
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {inquiry.photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setLightboxSrc(photo)}
                    className="aspect-square rounded-xl overflow-hidden bg-[var(--color-ivory-dark)] hover:opacity-90 transition-opacity cursor-zoom-in"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Status + Admin Notes */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-4">Status</h2>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-body font-semibold border mb-4 ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </div>

            {editing ? (
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-[var(--color-ivory-dark)] bg-[var(--color-ivory)] font-body text-sm text-[var(--color-espresso)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
              >
                {STATUS_FLOW.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            ) : (
              <p className="font-body text-xs text-[var(--color-gray-500)] mt-1">Click &ldquo;Edit&rdquo; to change status</p>
            )}
          </div>

          {/* Offer Amount */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-3">Offer Amount</h2>
            {editing ? (
              <input
                type="number"
                value={offerAmount}
                onChange={e => setOfferAmount(e.target.value)}
                placeholder="e.g. 250.00"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-ivory-dark)] bg-[var(--color-ivory)] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
              />
            ) : (
              <p className="font-display text-2xl text-[var(--color-gold-dark)]">
                {inquiry.offerAmount != null
                  ? `$${parseFloat(inquiry.offerAmount).toFixed(2)}`
                  : <span className="text-base font-body text-[var(--color-gray-500)]">No offer yet</span>}
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-3">Admin Notes</h2>
            {editing ? (
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={6}
                placeholder="Internal notes about this inquiry…"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-ivory-dark)] bg-[var(--color-ivory)] font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
              />
            ) : (
              <p className="font-body text-sm text-[var(--color-espresso-mid)] leading-relaxed">
                {inquiry.adminNotes || <span className="text-[var(--color-gray-500)] italic">No notes yet</span>}
              </p>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl border border-[var(--color-gold)]/10 p-6 shadow-sm flex flex-col h-[400px]">
            <h2 className="font-display text-lg text-[var(--color-espresso)] mb-4">Activity Log</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {activityNotes.length === 0 ? (
                <p className="font-body text-sm text-[var(--color-gray-500)] italic text-center mt-4">No activity logged yet.</p>
              ) : (
                activityNotes.map(note => (
                  <div key={note.id} className="bg-[var(--color-ivory)] rounded-xl p-3 border border-[var(--color-ivory-dark)]">
                    <p className="font-body text-[var(--color-espresso)] text-sm whitespace-pre-wrap">{note.note}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-ivory-dark)]/50">
                      <span className="font-display text-xs text-[var(--color-gold-dark)]">{note.authorName}</span>
                      <span className="font-body text-[10px] text-[var(--color-gray-500)]">
                        {new Date(note.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 relative">
              <input
                type="text"
                placeholder="Log activity or note..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                disabled={savingNote}
                className="w-full rounded-xl border border-[var(--color-ivory-dark)] bg-white px-3 py-2.5 font-body text-sm focus:outline-none focus:border-[var(--color-gold)]/50 focus:ring-1 focus:ring-[var(--color-gold)] pr-10"
              />
              <button
                onClick={handleAddNote}
                disabled={savingNote || !newNote.trim()}
                className="absolute right-2 top-1.5 p-1.5 text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] disabled:opacity-50 transition-colors"
              >
                {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxSrc} alt="Photo" className="w-full h-full object-contain rounded-xl" />
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
