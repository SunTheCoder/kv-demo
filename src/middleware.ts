import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip the login page from protection
  if (request.nextUrl.pathname === '/exhibitions/login') {
    return NextResponse.next()
  }

  // Protect other exhibition routes
  if (request.nextUrl.pathname.startsWith('/exhibitions')) {
    const authToken = request.cookies.get('exhibition-auth')?.value
    
    // If no auth token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/exhibitions/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/exhibitions/:path*'
} 