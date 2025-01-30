'use client'

import { useState } from 'react'
import { Exhibition } from '../api/exhibitions/route'

interface EditExhibitionModalProps {
  exhibition: Exhibition
  onClose: () => void
  onExhibitionUpdated: (updatedExhibition: Exhibition) => void
}

export default function EditExhibitionModal({ exhibition, onClose, onExhibitionUpdated }: EditExhibitionModalProps) {
  const [formData, setFormData] = useState({
    title: exhibition.title,
    startDate: exhibition.startDate,
    endDate: exhibition.endDate,
    description: exhibition.description,
    artist: exhibition.artist || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`/api/exhibitions/${exhibition.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        // Get the updated exhibition data
        const updatedExhibition = await res.json()
        onExhibitionUpdated(updatedExhibition) // Pass the updated data
        onClose()
      }
    } catch (error) {
      console.error('Error updating exhibition:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Edit Exhibition</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Artist (optional)
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white"
              placeholder="For living artist exhibitions"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full p-2 rounded-lg bg-black bg-opacity-50 border border-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 