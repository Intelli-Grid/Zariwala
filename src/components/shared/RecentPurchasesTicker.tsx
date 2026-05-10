'use client'

import { useEffect, useState } from 'react'

interface PurchaseTick {
  city: string
  category: string
  amount: string | null
  timeAgo: string
}

export function RecentPurchasesTicker() {
  const [items, setItems] = useState<PurchaseTick[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetch('/api/recent-purchases')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const timer = setInterval(() => {
      // Fade out then advance
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % items.length)
        setVisible(true)
      }, 300)
    }, 4500)
    return () => clearInterval(timer)
  }, [items])

  if (items.length === 0) return null
  const item = items[currentIndex]

  return (
    <div
      className="fixed bottom-24 left-4 z-40 max-w-[260px] hidden lg:block"
      aria-live="polite"
      aria-label="Recent purchases notification"
    >
      <div
        className="flex items-start gap-3 p-3.5 rounded-xl shadow-lg transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          background: 'var(--surface-deep)',
          border: '1px solid var(--border-on-dark)',
        }}
      >
        {/* Gold icon */}
        <span
          className="text-lg flex-shrink-0 mt-0.5"
          style={{ color: 'var(--gold-bright)' }}
          aria-hidden="true"
        >
          ✦
        </span>

        <div className="min-w-0">
          <p className="font-ui text-xs font-semibold truncate" style={{ color: 'var(--gold-bright)' }}>
            {item.city} · {item.timeAgo}
          </p>
          <p className="font-body text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-on-dark-sub)' }}>
            Sold {item.category}
            {item.amount ? (
              <span className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {' '}for {item.amount}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  )
}
