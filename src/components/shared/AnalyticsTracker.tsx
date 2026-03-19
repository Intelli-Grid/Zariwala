'use client'

import { useEffect } from 'react'
import { sendGAEvent } from '@next/third-parties/google'

export default function AnalyticsTracker() {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Traverse up to find an anchor tag if clicking on an icon/span inside
      let target = e.target as HTMLElement | null
      while (target && target.tagName !== 'A') {
        target = target.parentElement
      }

      if (target && target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href || ''
        if (href.includes('wa.me')) {
          sendGAEvent({ event: 'whatsapp_clicked', value: { url: href } })
        }
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => document.removeEventListener('click', handleGlobalClick)
  }, [])

  return null
}
