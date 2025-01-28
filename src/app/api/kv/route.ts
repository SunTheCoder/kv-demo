import { NextResponse } from 'next/server'
import { getValue, setValue, deleteValue } from '../../../lib/kv'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  
  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 })
  }

  const value = await getValue(key)
  return NextResponse.json({ value })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { key, value } = body

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
  }

  const success = await setValue(key, value)
  return NextResponse.json({ success })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  
  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 })
  }

  const success = await deleteValue(key)
  return NextResponse.json({ success })
} 