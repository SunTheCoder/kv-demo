'use client'

import { useState, useEffect } from 'react'
import { Artwork } from '@/lib/kv'
import EditArtworkForm from './EditArtworkForm'

export default function ArtworkList() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    artist: '',
    style: '', 
    color: '',
    yearStart: '',
    yearEnd: ''
  })
  const [uniqueValues, setUniqueValues] = useState({
    artists: [] as string[],
    styles: [] as string[],
    colors: [] as string[]
  })
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)

  const loadArtworks = async () => {
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    )
    const res = await fetch(`/api/artworks?${queryParams}`)
    const data = await res.json()
    
    // Filter artworks based on criteria
    const filteredArtworks = data.filter((artwork: Artwork) => {
      const matchesArtist = !filters.artist || artwork.artist === filters.artist
      const matchesStyle = !filters.style || artwork.style === filters.style
      const matchesColor = !filters.color || artwork.colors.includes(filters.color)
      const matchesYearStart = !filters.yearStart || artwork.year >= parseInt(filters.yearStart)
      const matchesYearEnd = !filters.yearEnd || artwork.year <= parseInt(filters.yearEnd)
      
      return matchesArtist && matchesStyle && matchesColor && matchesYearStart && matchesYearEnd
    })

    setArtworks(filteredArtworks)
    setLoading(false)
  }

  const loadUniqueValues = async () => {
    // Get all artworks first
    const res = await fetch('/api/artworks')
    const data = await res.json()

    // Extract unique values
    const artists = Array.from(new Set(data.map((a: Artwork) => a.artist))) as string[]
    const styles = Array.from(new Set(data.map((a: Artwork) => a.style))) as string[]
    const colors = Array.from(new Set(data.flatMap((a: Artwork) => a.colors))) as string[]

    setUniqueValues({ 
      artists: artists.filter(Boolean),
      styles: styles.filter(Boolean),
      colors: colors.filter(Boolean)
    })
  }

  const handleSaveEdit = async (updatedArtwork: Artwork) => {
    try {
      const res = await fetch(`/api/artworks/${updatedArtwork.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArtwork),
      })
      
      if (res.ok) {
        setEditingArtwork(null)
        loadArtworks() // Reload the list
      }
    } catch (error) {
      console.error('Error updating artwork:', error)
    }
  }

  useEffect(() => {
    loadUniqueValues()
    loadArtworks()
  }, [])

  // Add filters dependency to trigger reload when filters change
  useEffect(() => {
    loadArtworks()
  }, [filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return <div>Loading artworks...</div>

  return (
    <div>
      {editingArtwork ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Edit Artwork</h2>
            <EditArtworkForm
              artwork={editingArtwork}
              onSave={handleSaveEdit}
              onCancel={() => setEditingArtwork(null)}
            />
          </div>
        </div>
      ) : null}
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          name="artist"
          onChange={handleFilterChange}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:border-white"
        >
          <option value="">All Artists</option>
          {uniqueValues.artists.map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>

        <select
          name="style"
          onChange={handleFilterChange}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:border-white"
        >
          <option value="">All Styles</option>
          {uniqueValues.styles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <select
          name="color"
          onChange={handleFilterChange}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:border-white"
        >
          <option value="">All Colors</option>
          {uniqueValues.colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>

        <input
          type="number"
          name="yearStart"
          placeholder="Start Year"
          onChange={e => setFilters(prev => ({ ...prev, yearStart: e.target.value }))}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />

        <input
          type="number"
          name="yearEnd"
          placeholder="End Year"
          onChange={e => setFilters(prev => ({ ...prev, yearEnd: e.target.value }))}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork: Artwork) => (
          <div key={artwork.id} className="bg-white bg-opacity-10 rounded-lg overflow-hidden border border-gray-700 hover:border-white transition-colors">
            {artwork.imageUrl && (
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">{artwork.title}</h2>
              <p className="text-gray-400">{artwork.artist}, {artwork.year}</p>
              <p className="mt-2 text-gray-300">{artwork.description}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Style: {artwork.style}</p>
                <p className="text-sm text-gray-400">Medium: {artwork.medium}</p>
                <p className="text-sm text-gray-400">Dimensions: {artwork.dimensions}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {artwork.colors.map(color => (
                    <span 
                      key={color}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: color.toLowerCase(),
                        color: ['white', 'yellow', 'pink', 'light'].some(c => color.toLowerCase().includes(c)) ? '#000' : '#fff'
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setEditingArtwork(artwork)}
                className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}