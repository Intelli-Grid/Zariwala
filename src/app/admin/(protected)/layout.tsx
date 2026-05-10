import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

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
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[var(--color-espresso)] shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger lives inside AdminSidebar */}
          <AdminSidebar />
          <span className="font-display text-xl font-bold text-[var(--color-gold)]">Zariwala Admin</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="font-body text-sm text-[var(--color-ivory-dark)] hidden sm:block">
            {(session as any).user?.name || 'Administrator'}
          </span>
          <a
            href="/api/auth/signout"
            className="font-body text-sm px-3 sm:px-4 py-2 rounded-full transition-colors bg-[var(--color-white)]/10 text-[var(--color-ivory)] hover:bg-[var(--color-white)]/20 whitespace-nowrap"
          >
            Sign Out
          </a>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar handled by client component above (rendered inside topbar for toggle) */}
        {/* Main content — left margin on desktop to account for sidebar */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-10 md:ml-64">{children}</main>
      </div>
    </div>
  )
}
