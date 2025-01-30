import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Artwork } from '@/lib/kv'

export interface Exhibition {
  id: string
  title: string
  startDate: string
  endDate: string
  description: string
  blueprintUrl?: string
  notes: string[]
  artworkIds: string[]
}

export async function GET() {
  try {
    const exhibitionIds = await kv.smembers('exhibitions')
    const exhibitions = await Promise.all(
      exhibitionIds.map(id => kv.hgetall(`exhibition:${id}`))
    )
    return NextResponse.json(exhibitions.filter(Boolean))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const exhibition = await request.json()
    
    // Store the exhibition data
    await kv.hset(`exhibition:${exhibition.id}`, exhibition)
    await kv.sadd('exhibitions', exhibition.id)
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create exhibition' },
      { status: 500 }
    )
  }
} 