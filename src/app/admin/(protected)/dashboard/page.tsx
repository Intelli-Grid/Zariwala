'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Inbox, CheckCircle, FileText, Clock, TrendingUp, PenLine, ArrowRight } from 'lucide-react'

interface DashboardStats {
  inquiries: {
    total: number
    new: number
    reviewing: number
    offerSent: number
    accepted: number
    completed: number
    last30Days: number
    last7Days: number
  }
  blog: {
    total: number
    published: number
    drafts: number
  }
  recentInquiries: Array<{
    id: string
    reference: string
    sellerName: string
    country: string
    categories: string[]
    status: string
    createdAt: string
  }>
}

const STATUS_STYLES: Record<string, string> = {
  NEW:           'bg-blue-100 text-blue-700',
  IN_REVIEW:     'bg-yellow-100 text-yellow-700',
  OFFER_SENT:    'bg-purple-100 text-purple-700',
  ACCEPTED:      'bg-green-100 text-green-700',
  ITEM_RECEIVED: 'bg-teal-100 text-teal-700',
  PAYMENT_SENT:  'bg-emerald-100 text-emerald-700',
  COMPLETED:     'bg-gray-100 text-gray-700',
  REJECTED:      'bg-red-100 text-red-700',
  ARCHIVED:      'bg-gray-50 text-gray-400',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-ivory-dark)] rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[var(--color-ivory-dark)] rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-red-500 font-body py-8">Failed to load dashboard stats.</div>
  }

  const statCards = [
    { label: 'New Inquiries', value: stats.inquiries.new, icon: Inbox, color: 'bg-blue-50 text-blue-600', href: '/admin/inquiries?status=NEW' },
    { label: 'Under Review', value: stats.inquiries.reviewing, icon: Clock, color: 'bg-yellow-50 text-yellow-600', href: '/admin/inquiries?status=REVIEWING' },
    { label: 'Offers Sent', value: stats.inquiries.offerSent, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', href: '/admin/inquiries?status=OFFER_SENT' },
    { label: 'Completed', value: stats.inquiries.completed, icon: CheckCircle, color: 'bg-green-50 text-green-600', href: '/admin/inquiries?status=COMPLETED' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-[var(--color-espresso)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-gray-500)] mt-1 font-body">
          Overview of your platform activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <Link key={card.label} href={card.href} className="group bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-gold)]/10 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-body font-semibold text-[var(--color-gray-500)] uppercase tracking-wider">{card.label}</p>
                <p className="text-4xl font-display text-[var(--color-espresso)] mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-gold)]/10">
          <p className="text-xs font-body font-semibold text-[var(--color-gray-500)] uppercase tracking-wider mb-1">Total Inquiries</p>
          <p className="text-3xl font-display text-[var(--color-espresso)]">{stats.inquiries.total}</p>
          <p className="text-xs font-body text-[var(--color-gray-500)] mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-gold)]/10">
          <p className="text-xs font-body font-semibold text-[var(--color-gray-500)] uppercase tracking-wider mb-1">Last 7 Days</p>
          <p className="text-3xl font-display text-[var(--color-espresso)]">{stats.inquiries.last7Days}</p>
          <p className="text-xs font-body text-[var(--color-gray-500)] mt-1">New inquiries</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-gold)]/10">
          <p className="text-xs font-body font-semibold text-[var(--color-gray-500)] uppercase tracking-wider mb-1">Blog Posts</p>
          <p className="text-3xl font-display text-[var(--color-espresso)]">{stats.blog.published}</p>
          <p className="text-xs font-body text-[var(--color-gray-500)] mt-1">{stats.blog.drafts} draft{stats.blog.drafts !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Recent Inquiries + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--color-gold)]/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-ivory-dark)]">
            <h2 className="font-display text-lg text-[var(--color-espresso)]">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs font-body text-[var(--color-gold-dark)] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--color-ivory-dark)]">
            {stats.recentInquiries.length === 0 ? (
              <p className="px-6 py-8 text-center font-body text-sm text-[var(--color-gray-500)]">No inquiries yet.</p>
            ) : (
              stats.recentInquiries.map(inquiry => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-ivory)]/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-body font-semibold text-[var(--color-espresso)] text-sm truncate">{inquiry.sellerName}</p>
                      <span className="text-xs text-[var(--color-gray-500)] font-body hidden sm:inline">{inquiry.country}</span>
                    </div>
                    <p className="text-xs font-body text-[var(--color-gray-500)] font-mono">{inquiry.reference}</p>
                    <p className="text-xs font-body text-[var(--color-gray-500)] mt-0.5 truncate">
                      {inquiry.categories.slice(0, 2).join(', ')}{inquiry.categories.length > 2 ? ` +${inquiry.categories.length - 2}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-body whitespace-nowrap ${STATUS_STYLES[inquiry.status] || 'bg-gray-100 text-gray-600'}`}>
                      {inquiry.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[var(--color-gray-500)] font-body hidden md:inline whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-[var(--color-espresso)] rounded-2xl p-6 text-white">
            <h2 className="font-display text-lg text-[var(--color-ivory)] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/blog/new" className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-body text-sm text-white">
                <PenLine className="w-4 h-4 text-[var(--color-gold)]" />
                Write New Blog Post
              </Link>
              <Link href="/admin/inquiries" className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-body text-sm text-white">
                <Inbox className="w-4 h-4 text-[var(--color-gold)]" />
                Review All Inquiries
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-body text-sm text-white">
                <FileText className="w-4 h-4 text-[var(--color-gold)]" />
                Platform Settings
              </Link>
            </div>
          </div>

          {/* Pending credentials reminder */}
          {stats.inquiries.new > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-body text-sm font-bold text-amber-800 mb-1">
                {stats.inquiries.new} new {stats.inquiries.new === 1 ? 'inquiry' : 'inquiries'} waiting
              </p>
              <p className="font-body text-xs text-amber-600 leading-relaxed">
                Review and send offers to keep response times under 24 hours.
              </p>
              <Link href="/admin/inquiries?status=NEW" className="mt-3 inline-block text-xs font-bold text-amber-800 underline font-body">
                Review now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
