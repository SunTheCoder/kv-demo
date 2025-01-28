'use client'

import { useState } from 'react'
import ArtworkList from './components/ArtworkList'
import AddArtworkForm from './components/AddArtworkForm'

export default function Home() {
  const [key, setKey] = useState(0) // Used to force re-render of ArtworkList

  const handleArtworkAdded = () => {
    setKey(prev => prev + 1) // Force ArtworkList to re-render
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Art Gallery</h1>
      <div className="mb-8">
        <AddArtworkForm onArtworkAdded={handleArtworkAdded} />
      </div>
      <ArtworkList key={key} /> {/* Key prop forces re-render when changed */}
    </main>
  )
} 