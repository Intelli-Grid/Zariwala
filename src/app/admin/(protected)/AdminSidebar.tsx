'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
  { href: '/admin/inquiries',    icon: '📥', label: 'Inquiries' },
  { href: '/admin/categories',   icon: '📁', label: 'Categories' },
  { href: '/admin/blog',         icon: '✍️',  label: 'Blog' },
  { href: '/admin/testimonials', icon: '⭐', label: 'Testimonials' },
  { href: '/admin/settings',     icon: '⚙️',  label: 'Settings' },
]

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu toggle — visible only on small screens */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-ivory)' }}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        )}
      </button>

      {/* Sidebar nav */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2 flex-shrink-0
          bg-white border-r border-[var(--color-ivory-dark)]
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ top: '4rem' }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors hover:bg-[var(--color-ivory)] text-[var(--color-espresso-mid)] hover:text-[var(--color-espresso)] font-medium"
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Overlay — closes sidebar when tapping outside on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
