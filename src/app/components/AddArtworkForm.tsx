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
            unit: 'in' as DimensionUnit
          }
        })
        onArtworkAdded()
      }
    } catch (error) {
      console.error('Error adding artwork:', error)
    }
  }

  const handleDimensionChange = (field: keyof Dimensions, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: field === 'unit' ? value : Number(value)
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Artist</label>
        <input
          type="text"
          value={formData.artist}
          onChange={e => setFormData(prev => ({ ...prev, artist: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          value={formData.year}
          onChange={e => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              value={formData.dimensions.width || ''}
              onChange={e => handleDimensionChange('width', e.target.value)}
              placeholder="Width"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.dimensions.height || ''}
              onChange={e => handleDimensionChange('height', e.target.value)}
              placeholder="Height"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.dimensions.depth || ''}
              onChange={e => handleDimensionChange('depth', e.target.value)}
              placeholder="Depth (optional)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={formData.dimensions.unit}
              onChange={e => handleDimensionChange('unit', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="in">inches</option>
              <option value="cm">centimeters</option>
              <option value="ft">feet</option>
              <option value="yd">yards</option>
              <option value="m">meters</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <input
          type="text"
          value={formData.style}
          onChange={e => setFormData(prev => ({ ...prev, style: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Medium</label>
        <input
          type="text"
          value={formData.medium}
          onChange={e => setFormData(prev => ({ ...prev, medium: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <input
          type="text"
          value={formData.colors.join(', ')}
          onChange={e => setFormData(prev => ({ ...prev, colors: e.target.value.split(',').map(c => c.trim()) }))}
          placeholder="Separate colors with commas"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Artwork
        </button>
      </div>
    </form>
  )
} 