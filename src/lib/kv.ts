import { kv } from '@vercel/kv'

export interface Game {
  id: string
  title: string
  description: string
  releaseDate: string
  genre: string
}

export interface Artwork {
  id: string
  title: string
  artist: string
  year: number
  style: string
  medium: string
  colors: string[]
  dimensions: string
  description: string
  imageUrl?: string
}

export async function setValue(key: string, value: any) {
  try {
    if (!kv) {
      throw new Error('Redis connection not initialized')
    }
    await kv.set(key, value)
    return true
  } catch (error) {
    console.error('Error setting value:', error)
    return false
  }
}

export async function getValue(key: string) {
  try {
    if (!kv) {
      throw new Error('Redis connection not initialized')
    }
    const value = await kv.get(key)
    return value
  } catch (error) {
    console.error('Error getting value:', error)
    return null
  }
}

export async function deleteValue(key: string) {
  try {
    if (!kv) {
      throw new Error('Redis connection not initialized')
    }
    await kv.del(key)
    return true
  } catch (error) {
    console.error('Error deleting value:', error)
    return false
  }
}

export async function getAllGames() {
  try {
    const games = await kv.smembers('games')
    return games.map(async (id) => await kv.hgetall(`game:${id}`))
  } catch (error) {
    console.error('Error getting all games:', error)
    return []
  }
}

export async function getTopGames(limit = 10) {
  const games = await getAllGames()
  return games.slice(0, limit)
}

export async function getAllArtworks() {
  try {
    const artworkIds = await kv.smembers('artworks')
    const artworks = await Promise.all(
      artworkIds.map(id => kv.hgetall(`artwork:${id}`))
    )
    return artworks.filter(artwork => artwork !== null)
  } catch (error) {
    console.error('Error getting all artworks:', error)
    return []
  }
}

export async function searchArtworks({
  artist,
  style,
  color,
  yearStart,
  yearEnd
}: {
  artist?: string
  style?: string
  color?: string
  yearStart?: number
  yearEnd?: number
}) {
  try {
    let artworkIds = await kv.smembers('artworks')
    const artworks = await Promise.all(
      artworkIds.map(id => kv.hgetall(`artwork:${id}`))
    )
    return artworks.filter(artwork => artwork !== null)
  } catch (error) {
    console.error('Error searching artworks:', error)
    return []
  }
}

export async function addArtwork(artwork: Artwork) {
  try {
    const artworkData = Object.entries(artwork).reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, unknown>)
    await kv.hset(`artwork:${artwork.id}`, artworkData)
    await kv.sadd('artworks', artwork.id)
    return true
  } catch (error) {
    console.error('Error adding artwork:', error)
    return false
  }
}

export async function getUniqueValues(field: 'artist' | 'style' | 'color') {
  try {
    const artworks = await getAllArtworks()
    const uniqueValues = new Set(artworks.map(artwork => artwork[field]))
    return Array.from(uniqueValues)
  } catch (error) {
    console.error(`Error getting unique ${field}s:`, error)
    return []
  }
}

export async function getArtwork(id: string) {
  try {
    return await kv.hgetall(`artwork:${id}`) as Artwork | null
  } catch (error) {
    console.error('Error getting artwork:', error)
    return null
  }
}

export async function updateArtwork(id: string, artwork: Artwork) {
  try {
    const artworkData = Object.entries(artwork).reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, unknown>)
    
    await kv.hset(`artwork:${id}`, artworkData)
    return true
  } catch (error) {
    console.error('Error updating artwork:', error)
    return false
  }
}

export async function deleteArtwork(id: string) {
  try {
    // Get all fields of the artwork hash
    const artwork = await kv.hgetall(`artwork:${id}`)
    if (!artwork) return false

    // Delete all fields from the hash
    await kv.del(`artwork:${id}`)  // Changed from hdel to del
    await kv.srem('artworks', id)
    return true
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return false
  }
} 