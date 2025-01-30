import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const EXHIBITION_PASSWORD = process.env.EXHIBITION_PASSWORD || 'demo123' // Change this in production!

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (password === EXHIBITION_PASSWORD) {
      const response = NextResponse.json({ success: true })
      
      // Set the cookie in the response
      response.cookies.set('exhibition-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return response
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
} 