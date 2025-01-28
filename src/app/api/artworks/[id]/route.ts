import { NextResponse } from 'next/server'
import { getArtwork } from '@/lib/kv'

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