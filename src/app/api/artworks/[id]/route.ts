import { NextRequest, NextResponse } from 'next/server'
import { getArtwork, updateArtwork } from '@/lib/kv'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const artwork = await getArtwork(context.params.id)
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }
    return NextResponse.json(artwork)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const artwork = await req.json()
    const success = await updateArtwork(context.params.id, artwork)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
} 