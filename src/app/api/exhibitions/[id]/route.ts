import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Exhibition } from '../route'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()
    
    const exhibition = await kv.hgetall(`exhibition:${id}`) as Exhibition
    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    }
    
    // Merge existing data with updates
    const updatedExhibition = {
      ...exhibition,
      ...updates,
      id // Ensure ID is preserved
    }
    
    // Save the updated exhibition
    await kv.hset(`exhibition:${id}`, updatedExhibition)
    
    // Return the updated exhibition data
    return NextResponse.json(updatedExhibition)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update exhibition' },
      { status: 500 }
    )
  }
} 