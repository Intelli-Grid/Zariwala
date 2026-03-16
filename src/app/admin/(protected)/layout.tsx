import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      {/* Admin Topbar */}
      <div className="h-16 flex items-center justify-between px-6 bg-[var(--color-espresso)] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold text-[var(--color-gold)]">Vintage</span>
          <span className="font-body text-xs tracking-widest uppercase text-[var(--color-ivory-dark)] opacity-80">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-[var(--color-ivory-dark)]">
            {(session as any).user?.name || 'Administrator'}
          </span>
          <a
            href="/api/auth/signout"
            className="font-body text-sm px-4 py-2 rounded-full transition-colors bg-[var(--color-white)]/10 text-[var(--color-ivory)] hover:bg-[var(--color-white)]/20"
          >
            Sign Out
          </a>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2 flex-shrink-0 bg-white border-r border-[var(--color-ivory-dark)]">
          {[
            { href: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
            { href: '/admin/inquiries',   icon: '📥', label: 'Inquiries' },
            { href: '/admin/categories',  icon: '📁', label: 'Categories' },
            { href: '/admin/blog',        icon: '✍️',  label: 'Blog' },
            { href: '/admin/testimonials',icon: '⭐', label: 'Testimonials' },
            { href: '/admin/settings',    icon: '⚙️',  label: 'Settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors hover:bg-[var(--color-ivory)] text-[var(--color-espresso-mid)] hover:text-[var(--color-espresso)] font-medium"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}

