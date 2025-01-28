'use client'

import { useState, useEffect } from 'react'
import { Artwork } from '@/lib/kv'

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
    artists: [],
    styles: [],
    colors: []
  })

  const loadArtworks = async () => {
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    )
    const res = await fetch(`/api/artworks?${queryParams}`)
    const data = await res.json()
    
    // Filter artworks based on criteria
    const filteredArtworks = data.filter(artwork => {
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
    const [artists, styles, colors] = await Promise.all([
      fetch('/api/artworks/unique?field=artist').then(res => res.json()),
      fetch('/api/artworks/unique?field=style').then(res => res.json()),
      fetch('/api/artworks/unique?field=color').then(res => res.json())
    ])
    setUniqueValues({ artists, styles, colors })
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
      <div className="mb-6 grid grid-cols-5 gap-4">
        <select
          name="artist"
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Artists</option>
          {uniqueValues.artists.map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>

        <select
          name="style"
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Styles</option>
          {uniqueValues.styles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <select
          name="color"
          onChange={handleFilterChange}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="yearEnd"
          placeholder="End Year"
          onChange={e => setFilters(prev => ({ ...prev, yearEnd: e.target.value }))}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork: Artwork) => (
          <div key={artwork.id} className="border rounded-lg overflow-hidden shadow-lg">
            {artwork.imageUrl && (
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold">{artwork.title}</h2>
              <p className="text-gray-600">{artwork.artist}, {artwork.year}</p>
              <p className="mt-2">{artwork.description}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Style: {artwork.style}</p>
                <p className="text-sm text-gray-500">Medium: {artwork.medium}</p>
                <p className="text-sm text-gray-500">Dimensions: {artwork.dimensions}</p>
                <div className="mt-2 flex gap-2">
                  {artwork.colors.map(color => (
                    <span 
                      key={color}
                      className="px-2 py-1 text-xs rounded text-white"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}