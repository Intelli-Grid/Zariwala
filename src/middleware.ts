import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Always allow the login page and NextAuth API routes through
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // All other /admin routes require a valid session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all admin routes AND the auth API routes
  matcher: ['/admin/:path*'],
}
