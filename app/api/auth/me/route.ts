// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(SECRET_KEY)
    const { payload } = await jwtVerify(token, secret)

    // payload contains: { id, email, role, iat, exp }
    // We need to fetch full user (name, avatar) from Excel since JWT doesn't store them
    // But for simplicity and performance, we'll return minimal safe data from token
    // You can extend this later to fetch from DB if needed

    const user = {
      id: payload.id as number,
      email: payload.email as string,
      role: payload.role as 'agent' | 'scout' | 'club',
      // name and avatar are NOT in token → we'll handle in frontend fallback
      name: payload.name || 'User', // optional: add name to JWT in login if needed
      avatar: payload.avatar as string | undefined,
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Invalid token:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}