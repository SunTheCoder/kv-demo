'use client'

import { useState } from 'react'
import ArtworkList from '../components/ArtworkList'
import AddArtworkForm from '../components/AddArtworkForm'
import Link from 'next/link'

export default function GalleryPage() {
  const [key, setKey] = useState(0)
  const [isAddingArtwork, setIsAddingArtwork] = useState(false)

  const handleArtworkAdded = () => {
    setKey(prev => prev + 1)
    setIsAddingArtwork(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </Link>
          <button
            onClick={() => setIsAddingArtwork(!isAddingArtwork)}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            {isAddingArtwork ? 'Cancel' : 'Add New Artwork'}
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">The Redis Gallery</h1>
        
        {isAddingArtwork && (
          <div className="mb-8 bg-white bg-opacity-10 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Add New Artwork</h2>
            <AddArtworkForm onArtworkAdded={handleArtworkAdded} />
          </div>
        )}

        <ArtworkList key={key} />
      </div>
    </main>
  )
} 