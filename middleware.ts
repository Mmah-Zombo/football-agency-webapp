// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const protectedRoutes = ['/dashboard', '/players', '/contracts', '/clubs', '/matches', '/profile'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/players/:path*', '/contracts/:path*', '/clubs/:path*', '/matches/:path*', '/profile/:path*'],
};