'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-[var(--color-gold)]/20">
        <div>
          <h2 className="mt-6 text-center font-display text-4xl text-[var(--color-espresso)]">
            Vintage Admin
          </h2>
          <p className="mt-2 text-center font-body text-sm text-[var(--color-gray-500)]">
            Secure login for platform administrators
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-body font-medium border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-espresso-mid)] mb-1 font-body">
                Email address
              </label>
              <input
                type="email"
                required
                className="field-input w-full"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-espresso-mid)] mb-1 font-body">
                Password
              </label>
              <input
                type="password"
                required
                className="field-input w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 btn-primary"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
          
          <p className="text-center font-body text-xs text-[var(--color-gray-500)] mt-6 pt-6 border-t border-[var(--color-ivory-dark)]">
            Warning: This system is audited and monitored. Unauthorized access is strictly prohibited.
          </p>
        </form>
      </div>
    </div>
  )
}
