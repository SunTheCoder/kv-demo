'use client'

import { useState, useEffect } from 'react'
import { Artwork } from '@/lib/kv'

interface ArtworkSelectorProps {
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function ArtworkSelector({ selectedIds, onSelectionChange }: ArtworkSelectorProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [localSelection, setLocalSelection] = useState<Set<string>>(new Set(selectedIds))

  useEffect(() => {
    setLocalSelection(new Set(selectedIds))
  }, [selectedIds])

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const res = await fetch('/api/artworks')
        if (res.ok) {
          const data = await res.json()
          setArtworks(data)
        }
      } catch (error) {
        console.error('Error loading artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  const filteredArtworks = artworks.filter(artwork => 
    artwork.title.toLowerCase().includes(search.toLowerCase()) ||
    artwork.artist.toLowerCase().includes(search.toLowerCase())
  )

  const toggleArtwork = (id: string) => {
    const newSelection = new Set(localSelection)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setLocalSelection(newSelection)
    onSelectionChange(Array.from(newSelection))
  }

  if (loading) return <div>Loading artworks...</div>

  const selectedArtworks = artworks.filter(artwork => localSelection.has(artwork.id))

  return (
    <div className="space-y-4">
      {/* Selected Artworks Preview */}
      {selectedArtworks.length > 0 && (
        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Artworks ({selectedArtworks.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedArtworks.map(artwork => (
              <div 
                key={artwork.id}
                className="relative group"
              >
                {artwork.imageUrl ? (
                  <div className="relative w-16 h-16">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleArtwork(artwork.id)
                      }}
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity"
                    >
                      <span className="text-white text-xs">Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs text-center p-1">
                    {artwork.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search artworks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Artwork Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {filteredArtworks.map(artwork => {
          const isSelected = localSelection.has(artwork.id)
          return (
            <div
              key={artwork.id}
              onClick={() => toggleArtwork(artwork.id)}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-white bg-opacity-20 border-2 border-white scale-95 transform'
                  : 'bg-black bg-opacity-50 border border-gray-700 hover:border-gray-500 hover:scale-[1.02] transform'
              }`}
            >
              {artwork.imageUrl && (
                <div className="relative">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className={`w-full h-32 object-cover rounded mb-2 transition-all duration-200 ${
                      isSelected ? 'brightness-110' : 'hover:brightness-110'
                    }`}
                  />
                  <div 
                    className={`absolute top-2 right-2 bg-white rounded-full p-1 transition-all duration-200 ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                  >
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                </div>
              )}
              <h4 className="font-medium">{artwork.title}</h4>
              <p className="text-sm text-gray-400">{artwork.artist}</p>
            </div>
          )
        })}
      </div>

      {/* No Results Message */}
      {filteredArtworks.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          No artworks found matching "{search}"
        </div>
      )}
    </div>
  )
} 