import { NextResponse } from 'next/server'
import { getAllArtworks, searchArtworks, addArtwork } from '@/lib/kv'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // If there are any search params, use search function
  if (searchParams.size > 0) {
    const artworks = await searchArtworks({
      artist: searchParams.get('artist') || undefined,
      style: searchParams.get('style') || undefined,
      color: searchParams.get('color') || undefined,
      yearStart: searchParams.get('yearStart') ? Number(searchParams.get('yearStart')) : undefined,
      yearEnd: searchParams.get('yearEnd') ? Number(searchParams.get('yearEnd')) : undefined
    })
    return NextResponse.json(artworks)
  }
  
  // Otherwise return all artworks
  const artworks = await getAllArtworks()
  return NextResponse.json(artworks)
}

export async function POST(request: Request) {
  try {
    const artwork = await request.json()
    const success = await addArtwork({
      id: crypto.randomUUID(), // Generate a unique ID
      ...artwork
    })
    
    if (success) {
      return NextResponse.json({ success: true }, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to add artwork' },
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