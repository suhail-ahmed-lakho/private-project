import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('token')
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminPath) {
    // Check if user is authenticated and is an admin
    // This is a basic example - you'll want to implement proper admin role checking
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // You should also verify if the user has admin privileges here
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 