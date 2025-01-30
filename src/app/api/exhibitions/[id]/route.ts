import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Exhibition } from '../route'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const updates = await request.json()
    
    const exhibition = await kv.hgetall(`exhibition:${id}`) as Record<string, unknown>
    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    }
    
    const updatedExhibition = {
      ...(exhibition as unknown as Exhibition),
      ...updates,
      id
    }
    
    await kv.hset(`exhibition:${id}`, updatedExhibition)
    
    return NextResponse.json(updatedExhibition)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update exhibition' },
      { status: 500 }
    )
  }
} 