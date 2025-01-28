'use client'

import { useState } from 'react'
import { Artwork } from '@/lib/kv'
import { Dimensions, DimensionUnit, parseDimensions, formatDimensions } from '@/lib/types'

interface EditArtworkFormProps {
  artwork: Artwork
  onSave: (updatedArtwork: Artwork) => Promise<void>
  onCancel: () => void
}

export default function EditArtworkForm({ artwork, onSave, onCancel }: EditArtworkFormProps) {
  const initialDimensions = parseDimensions(artwork.dimensions) || {
    width: 0,
    height: 0,
    unit: 'in' as DimensionUnit
  }

  const [formData, setFormData] = useState({
    ...artwork,
    dimensions: initialDimensions
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedArtwork = {
      ...formData,
      dimensions: formatDimensions(formData.dimensions as Dimensions)
    }
    await onSave(updatedArtwork as Artwork)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Artist</label>
        <input
          type="text"
          value={formData.artist}
          onChange={e => setFormData(prev => ({ ...prev, artist: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          value={formData.year}
          onChange={e => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dimensions</label>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            value={formData.dimensions.width}
            onChange={e => handleDimensionChange('width', e.target.value)}
            placeholder="Width"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
          <input
            type="number"
            value={formData.dimensions.height}
            onChange={e => handleDimensionChange('height', e.target.value)}
            placeholder="Height"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
          <input
            type="number"
            value={formData.dimensions.depth || ''}
            onChange={e => handleDimensionChange('depth', e.target.value)}
            placeholder="Depth (optional)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
          <select
            value={formData.dimensions.unit}
            onChange={e => handleDimensionChange('unit', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          >
            <option value="in">inches</option>
            <option value="cm">centimeters</option>
            <option value="ft">feet</option>
            <option value="yd">yards</option>
            <option value="m">meters</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <input
          type="text"
          value={formData.style}
          onChange={e => setFormData(prev => ({ ...prev, style: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Medium</label>
        <input
          type="text"
          value={formData.medium}
          onChange={e => setFormData(prev => ({ ...prev, medium: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Colors</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.colors.map((color, index) => (
            <div 
              key={index} 
              className="flex items-center px-2 py-1 rounded" 
              style={{
                backgroundColor: color,
                color: isLightColor(color) ? '#000' : '#fff'
              }}
            >
              <span>{color}</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  colors: prev.colors.filter((_, i) => i !== index)
                }))}
                className="ml-2 hover:opacity-75"
                style={{
                  color: isLightColor(color) ? '#000' : '#fff'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a color and press Enter"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const input = e.currentTarget
              const newColor = input.value.trim()
              if (newColor && !formData.colors.includes(newColor)) {
                setFormData(prev => ({
                  ...prev,
                  colors: [...prev.colors, newColor]
                }))
                input.value = ''
              }
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">Press Enter to add each color</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl || ''}
          onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert color names to hex
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return true
  ctx.fillStyle = color
  const hex = ctx.fillStyle

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}