import { NextResponse } from 'next/server'
import { getAllGames, getTopGames } from '@/lib/kv'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const top = searchParams.get('top') === 'true'
  
  const games = top ? await getTopGames() : await getAllGames()
  return NextResponse.json(games)
} 