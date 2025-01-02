import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  // If no session and trying to access admin routes, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}