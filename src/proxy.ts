import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const response = NextResponse.next()

  // 1. Geography & Multi-Region Setup
  // Attempt to extract the visitor's country from Cloudflare or Vercel headers
  const country = req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || 'IN'
  response.headers.set('x-user-country', country)

  // 2. Admin Authentication
  if (pathname.startsWith('/admin')) {
    // Always allow the login page and NextAuth API routes through
    if (
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/api/auth')
    ) {
      return response
    }

    // All other /admin routes require a valid session token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return response
}

export const config = {
  // Match all request paths except for static assets, images, etc.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|\\.png|\\.jpg|\\.svg).*)',
  ],
}
