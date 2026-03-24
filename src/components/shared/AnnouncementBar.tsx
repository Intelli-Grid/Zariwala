'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  '🪡 Zariwala pays top prices for vintage Levi\'s, Lee, Wrangler & heritage denim',
  '🎸 Vintage band tees from the 70s–90s wanted — send photos on WhatsApp',
  '📦 We buy from the US, UK, and Asia — fast valuations within 24 hours',
  '🌿 Vintage is the original sustainable fashion — give it new life with Zariwala',
  '💎 Complete wardrobes or single grail pieces — no collection too small',
]

export function AnnouncementBar() {
  const [messageIdx, setMessageIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx(i => (i + 1) % MESSAGES.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      id="announcement-bar"
      className="text-center px-4 py-2.5 text-xs font-ui font-semibold"
      style={{ background: 'var(--gold-core)', color: 'var(--surface-void)', letterSpacing: '0.06em' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <span key={messageIdx}>{MESSAGES[messageIdx]}</span>
      </div>
    </div>
  )
}
