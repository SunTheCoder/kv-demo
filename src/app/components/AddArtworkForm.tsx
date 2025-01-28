'use client'

import { useState } from 'react'
import { Artwork } from '@/lib/kv'

interface AddArtworkFormProps {
  onArtworkAdded?: () => void
}

export default function AddArtworkForm({ onArtworkAdded }: AddArtworkFormProps) {
  const [artwork, setArtwork] = useState<Partial<Artwork>>({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    style: '',
    medium: '',
    colors: [],
    dimensions: '',
    description: '',
    imageUrl: ''
  })
  const [newColor, setNewColor] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArtwork(prev => ({ ...prev, [name]: value }))
  }

  const handleAddColor = () => {
    if (newColor && !artwork.colors?.includes(newColor)) {
      setArtwork(prev => ({
        ...prev,
        colors: [...(prev.colors || []), newColor]
      }))
      setNewColor('')
    }
  }

  const handleRemoveColor = (colorToRemove: string) => {
    setArtwork(prev => ({
      ...prev,
      colors: prev.colors?.filter(color => color !== colorToRemove) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artwork)
      })

      if (!response.ok) {
        throw new Error('Failed to add artwork')
      }

      setStatus('success')
      setArtwork({
        title: '',
        artist: '',
        year: new Date().getFullYear(),
        style: '',
        medium: '',
        colors: [],
        dimensions: '',
        description: '',
        imageUrl: ''
      })
      
      onArtworkAdded?.()

      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Add New Artwork</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={artwork.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Artist</label>
          <input
            type="text"
            name="artist"
            value={artwork.artist}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            name="year"
            value={artwork.year}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <input
            type="text"
            name="style"
            value={artwork.style}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medium</label>
          <input
            type="text"
            name="medium"
            value={artwork.medium}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            value={artwork.dimensions}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="block w-full rounded border-gray-300 shadow-sm text-gray-900"
            placeholder="Add a color"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {artwork.colors?.map(color => (
            <span
              key={color}
              className="px-2 py-1 bg-gray-100 rounded-full flex items-center gap-2 text-gray-900"
            >
              {color}
              <button
                type="button"
                onClick={() => handleRemoveColor(color)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={artwork.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={artwork.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm text-gray-900"
          required
        />
      </div>

      {status === 'error' && (
        <div className="text-red-500">{errorMessage}</div>
      )}

      {status === 'success' && (
        <div className="text-green-500">Artwork added successfully!</div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {status === 'loading' ? 'Adding...' : 'Add Artwork'}
      </button>
    </form>
  )
} 