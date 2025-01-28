import { NextRequest, NextResponse } from 'next/server'
import { getArtwork, updateArtwork } from '@/lib/kv'

type Params = Promise<{ id: string }>

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const artwork = await getArtwork(id)
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }
    return NextResponse.json(artwork)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params
    const artwork = await request.json()
    const success = await updateArtwork(id, artwork)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
} 