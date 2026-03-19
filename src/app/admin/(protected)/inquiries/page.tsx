import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import KanbanBoard from './KanbanBoard'

export const metadata = {
  title: 'Inquiries | Admin',
}

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_REVIEW', label: 'Reviewing' },
  { value: 'OFFER_SENT', label: 'Offer Sent' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'ITEM_RECEIVED', label: 'Item Received' },
  { value: 'PAYMENT_SENT', label: 'Payment Sent' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

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

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string; view?: string; q?: string; category?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const status = searchParams.status || ''
  const q = searchParams.q || ''
  const category = searchParams.category || ''
  const limit = 25
  const skip = (page - 1) * limit
  const view = searchParams.view || 'list'

  const where: any = {}
  
  if (status) where.status = status as any
  if (q) {
    where.OR = [
      { sellerName: { contains: q, mode: 'insensitive' } },
      { reference: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (category) {
    where.OR = where.OR || []
    where.OR.push(
      { category: category },
      { categories: { has: category } }
    )
  }

  const inquiriesPromise = view === 'board'
    ? prisma.inquiry.findMany({
        where: q || category ? where : undefined,
        orderBy: { createdAt: 'desc' },
      })
    : prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })

  const [inquiries, total] = await Promise.all([
    inquiriesPromise,
    prisma.inquiry.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-espresso)]">Inquiries</h1>
          <p className="font-body text-sm text-[var(--color-gray-500)] mt-1">
            {total} total {status ? `· filtered by ${STATUS_OPTIONS.find(s => s.value === status)?.label}` : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <form method="GET" className="flex items-center">
            {view === 'board' && <input type="hidden" name="view" value="board" />}
            {status && <input type="hidden" name="status" value={status} />}
            <input 
              type="text" 
              name="q" 
              defaultValue={q}
              placeholder="Search reference, name..." 
              className="px-3 py-1.5 border border-[var(--color-ivory-dark)] rounded-lg text-sm font-body shadow-sm focus:outline-none focus:border-[var(--color-gold)]"
            />
            <button type="submit" className="ml-2 px-3 py-1.5 bg-[var(--color-espresso)] text-white font-body text-sm rounded-lg shadow-sm">Search</button>
          </form>

          {/* View Toggle */}
          <div className="flex bg-white rounded-lg border border-[var(--color-ivory-dark)] p-1 shadow-sm">
            <Link
              href={`/admin/inquiries?view=list${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              className={`px-4 py-1.5 rounded-md font-body text-sm transition-colors ${view === 'list' ? 'bg-[var(--color-espresso)] text-white shadow-sm' : 'text-[var(--color-gray-500)] hover:bg-[var(--color-ivory)]'}`}
            >
              List
            </Link>
            <Link
              href={`/admin/inquiries?view=board${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              className={`px-4 py-1.5 rounded-md font-body text-sm transition-colors ${view === 'board' ? 'bg-[var(--color-espresso)] text-white shadow-sm' : 'text-[var(--color-gray-500)] hover:bg-[var(--color-ivory)]'}`}
            >
              Board
            </Link>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Status filter tabs (only in list view) */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(opt => (
              <Link
                key={opt.value}
                href={`/admin/inquiries${opt.value ? `?status=${opt.value}` : ''}&view=list`}
                className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all ${
                  status === opt.value
                    ? 'bg-[var(--color-espresso)] text-white shadow-sm'
                    : 'bg-white border border-[var(--color-ivory-dark)] text-[var(--color-gray-500)] hover:border-[var(--color-gold)]/50 hover:text-[var(--color-espresso)]'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gold)]/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-ivory)] border-b border-[var(--color-ivory-dark)]">
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)]">Reference</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)]">Seller</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] hidden md:table-cell">Categories</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] hidden lg:table-cell">Country</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)]">Status</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] hidden xl:table-cell">Date</th>
                  <th className="py-3.5 px-5 font-body text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center font-body text-sm text-[var(--color-gray-500)]">
                      No inquiries found{status ? ` with status "${status}"` : ''}.
                    </td>
                  </tr>
                )}
                {inquiries.map((inquiry: any) => (
                  <tr
                    key={inquiry.id}
                    className="border-b border-[var(--color-ivory-dark)] last:border-0 hover:bg-[var(--color-ivory)]/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs text-[var(--color-espresso)] font-bold">{inquiry.reference}</span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-body text-sm font-semibold text-[var(--color-espresso)]">{inquiry.sellerName}</p>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <p className="font-body text-xs text-[var(--color-gray-500)] truncate max-w-[180px]">
                        {(inquiry.categories || []).slice(0, 2).join(', ')}
                        {inquiry.categories?.length > 2 ? ` +${inquiry.categories.length - 2}` : ''}
                      </p>
                    </td>
                    <td className="py-4 px-5 hidden lg:table-cell">
                      <p className="font-body text-xs text-[var(--color-gray-500)]">{inquiry.country}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-body ${STATUS_STYLES[inquiry.status] || 'bg-gray-100 text-gray-700'}`}>
                        {inquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-5 hidden xl:table-cell">
                      <p className="font-body text-xs text-[var(--color-gray-500)]">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-[var(--color-ivory)] border border-[var(--color-gold)]/20 text-[var(--color-espresso)] text-xs font-body font-semibold rounded-lg hover:bg-[var(--color-gold)]/10 transition-colors"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/admin/inquiries?${status ? `status=${status}&` : ''}view=list&page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-full font-body text-sm transition-all ${
                    p === page
                      ? 'bg-[var(--color-espresso)] text-white'
                      : 'bg-white border border-[var(--color-ivory-dark)] text-[var(--color-gray-500)] hover:border-[var(--color-gold)]/40'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <KanbanBoard initialInquiries={inquiries} />
      )}
    </div>
  )
}
