import { NextResponse } from 'next/server'
import { getArtwork, updateArtwork } from '@/lib/kv'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const artwork = await getArtwork(params.id)
  
  if (!artwork) {
    return NextResponse.json(
      { error: 'Artwork not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(artwork)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artwork = await request.json()
    const success = await updateArtwork(params.id, artwork)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to update artwork' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
} 