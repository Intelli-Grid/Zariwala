'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page crashed:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h2 className="text-2xl font-display text-[var(--color-espresso)] mb-4">
        Something went wrong.
      </h2>
      <p className="text-[var(--color-gray-dark)] mb-6 font-body">
        We encountered an error while trying to load this page.
      </p>
      <button
        onClick={() => reset()}
        className="btn-gold-cta px-6 py-2 rounded-full font-ui text-sm border hover:opacity-80 transition-opacity"
        style={{ background: 'var(--color-gold-core)', color: 'white', borderColor: 'var(--color-gold-deep)' }}
      >
        Try again
      </button>
    </div>
  )
}
