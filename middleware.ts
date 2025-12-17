// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
)

const protectedRoutes = [
  '/dashboard',
  '/players',
  '/contracts',
  '/clubs',
  '/matches',
  '/profile',
]

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const pathname = req.nextUrl.pathname

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
      await jwtVerify(token, secret, {
        algorithms: ['HS256'],
      })

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/players/:path*',
    '/contracts/:path*',
    '/clubs/:path*',
    '/matches/:path*',
    '/profile/:path*',
  ],
}
