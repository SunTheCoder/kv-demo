'use client'

import { useState } from 'react'
import { Artwork } from '@/lib/kv'
import { Dimensions, DimensionUnit, formatDimensions } from '@/lib/types'

interface AddArtworkFormProps {
  onArtworkAdded: () => void
}

export default function AddArtworkForm({ onArtworkAdded }: AddArtworkFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    style: '',
    medium: '',
    colors: [] as string[],
    description: '',
    imageUrl: '',
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: 'in' as DimensionUnit
    } as Dimensions
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dimensions: formatDimensions(formData.dimensions)
        }),
      })

      if (response.ok) {
        setFormData({
          title: '',
          artist: '',
          year: new Date().getFullYear(),
          style: '',
          medium: '',
          colors: [],
          description: '',
          imageUrl: '',
          dimensions: {
            width: 0,
            height: 0,
            depth: 0,
            unit: 'in' as DimensionUnit
          }
        })
        onArtworkAdded()
      }
    } catch (error) {
      console.error('Error adding artwork:', error)
    }
  }

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'year' ? parseInt(value) : field === 'colors' ? value.split(',').map((c: string) => c.trim()) : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="text"
          placeholder="Artist"
          value={formData.artist}
          onChange={(e) => handleChange('artist', e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => handleChange('year', parseInt(e.target.value))}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="text"
          placeholder="Style"
          value={formData.style}
          onChange={(e) => handleChange('style', e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="text"
          placeholder="Medium"
          value={formData.medium}
          onChange={(e) => handleChange('medium', e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <input
          type="text"
          placeholder="Colors (comma-separated)"
          value={formData.colors.join(', ')}
          onChange={(e) => handleChange('colors', e.target.value.split(',').map(c => c.trim()))}
          required
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Width"
            value={formData.dimensions.width}
            onChange={(e) => handleChange('dimensions', { ...formData.dimensions, width: Number(e.target.value) })}
            required
            className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          <input
            type="number"
            placeholder="Height"
            value={formData.dimensions.height}
            onChange={(e) => handleChange('dimensions', { ...formData.dimensions, height: Number(e.target.value) })}
            required
            className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          <input
            type="number"
            placeholder="Depth"
            value={formData.dimensions.depth}
            onChange={(e) => handleChange('dimensions', { ...formData.dimensions, depth: Number(e.target.value) })}
            required
            className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          <select
            value={formData.dimensions.unit}
            onChange={(e) => handleChange('dimensions', { ...formData.dimensions, unit: e.target.value })}
            className="w-32 p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white focus:outline-none focus:border-white"
          >
            <option value="in">inches</option>
            <option value="cm">cm</option>
            <option value="ft">feet</option>
          </select>
        </div>
        <input
          type="url"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
        />
      </div>
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        required
        className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white h-32"
      />
      <button
        type="submit"
        className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
      >
        Add Artwork
      </button>
    </form>
  )
} 