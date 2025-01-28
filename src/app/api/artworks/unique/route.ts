import { NextResponse } from 'next/server'
import { getUniqueValues } from '@/lib/kv'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const field = searchParams.get('field')
  
  if (!field || !['artist', 'style', 'color'].includes(field)) {
    return NextResponse.json(
      { error: 'Invalid field parameter' },
      { status: 400 }
    )
  }
  
  const values = await getUniqueValues(field as 'artist' | 'style' | 'color')
  return NextResponse.json(values)
} 