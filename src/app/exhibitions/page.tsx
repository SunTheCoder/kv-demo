'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AddExhibitionModal from '../components/AddExhibitionModal'
import { Exhibition } from '../api/exhibitions/route'
import ArtworkSelector from '../components/ArtworkSelector'
import { Artwork } from '@/lib/kv'
import EditExhibitionModal from '../components/EditExhibitionModal'

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showArtworkSelector, setShowArtworkSelector] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const ARTWORKS_PER_PAGE = 6
  const [showEditModal, setShowEditModal] = useState(false)

  const loadExhibitions = async () => {
    try {
      const res = await fetch('/api/exhibitions')
      if (res.ok) {
        const data = await res.json()
        setExhibitions(data)
      }
    } catch (error) {
      console.error('Error loading exhibitions:', error)
    }
  }

  const loadArtworks = async () => {
    try {
      const res = await fetch('/api/artworks')
      if (res.ok) {
        const data = await res.json()
        setArtworks(data)
      }
    } catch (error) {
      console.error('Error loading artworks:', error)
    }
  }

  useEffect(() => {
    loadExhibitions()
    loadArtworks()
  }, [])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when changing exhibitions
  }, [selectedExhibition?.id])

  const handleAddBlueprint = async (exhibitionId: string, file: File) => {
    const formData = new FormData()
    formData.append('blueprint', file)
    formData.append('exhibitionId', exhibitionId)
    
    const res = await fetch('/api/exhibitions/blueprint', {
      method: 'POST',
      body: formData
    })
    
    if (res.ok) {
      // Refresh exhibitions
    }
  }

  const handleAddNote = async (exhibitionId: string, note: string) => {
    const res = await fetch(`/api/exhibitions/${exhibitionId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    })
    
    if (res.ok) {
      setNewNote('')
      setIsAddingNote(false)
      // Refresh exhibitions
    }
  }

  const handleArtworkSelection = async (exhibitionId: string, artworkIds: string[]) => {
    try {
      const res = await fetch(`/api/exhibitions/${exhibitionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkIds })
      })
      
      if (res.ok) {
        // Fetch the updated exhibition data
        const updatedExhibitionRes = await fetch('/api/exhibitions')
        if (updatedExhibitionRes.ok) {
          const data = await updatedExhibitionRes.json()
          setExhibitions(data)
          // Update the selected exhibition with new data
          const updated = data.find((e: Exhibition) => e.id === exhibitionId)
          if (updated) {
            setSelectedExhibition(updated)
          }
        }
      }
    } catch (error) {
      console.error('Error updating exhibition artworks:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Gallery
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            New Exhibition
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white bg-opacity-10 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Exhibitions</h2>
            <div className="space-y-2">
              {exhibitions.map(exhibition => (
                <button
                  key={exhibition.id}
                  onClick={() => setSelectedExhibition(exhibition)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedExhibition?.id === exhibition.id
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <h3 className="font-semibold">{exhibition.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white bg-opacity-10 p-4 rounded-lg">
            {selectedExhibition ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedExhibition.title}</h2>
                    {selectedExhibition.artist && (
                      <p className="text-gray-400 mt-1">Artist: {selectedExhibition.artist}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(selectedExhibition.startDate).toLocaleDateString()} - {new Date(selectedExhibition.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300 mt-2">{selectedExhibition.description}</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Selected Artworks</h3>
                    <button
                      onClick={() => {
                        if (showArtworkSelector) {
                          // When closing selector, refresh the exhibitions data
                          loadExhibitions()
                        }
                        setShowArtworkSelector(!showArtworkSelector)
                      }}
                      className="text-sm bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
                    >
                      {showArtworkSelector ? 'Done' : 'Select Artworks'}
                    </button>
                  </div>
                  
                  {showArtworkSelector ? (
                    <ArtworkSelector
                      selectedIds={selectedExhibition.artworkIds || []}
                      onSelectionChange={(ids) => handleArtworkSelection(selectedExhibition.id, ids)}
                    />
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {(selectedExhibition.artworkIds || [])
                          .slice((currentPage - 1) * ARTWORKS_PER_PAGE, currentPage * ARTWORKS_PER_PAGE)
                          .map((artworkId) => {
                            const artwork = artworks.find(a => a.id === artworkId)
                            if (!artwork) return null
                            return (
                              <div key={artworkId} className="bg-black bg-opacity-50 rounded-lg p-2">
                                {artwork.imageUrl && (
                                  <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-32 object-cover rounded mb-2"
                                  />
                                )}
                                <h4 className="font-medium">{artwork.title}</h4>
                                <p className="text-sm text-gray-400">{artwork.artist}</p>
                              </div>
                            )
                          })}
                      </div>
                      
                      {/* Pagination Controls */}
                      {selectedExhibition.artworkIds && selectedExhibition.artworkIds.length > ARTWORKS_PER_PAGE && (
                        <div className="flex justify-center items-center space-x-2 mt-4">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${
                              currentPage === 1
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                          >
                            Previous
                          </button>
                          
                          <span className="text-sm text-gray-400">
                            Page {currentPage} of {Math.ceil((selectedExhibition.artworkIds.length || 0) / ARTWORKS_PER_PAGE)}
                          </span>
                          
                          <button
                            onClick={() => setCurrentPage(prev => 
                              Math.min(Math.ceil((selectedExhibition.artworkIds?.length || 0) / ARTWORKS_PER_PAGE), prev + 1)
                            )}
                            disabled={currentPage >= Math.ceil((selectedExhibition.artworkIds?.length || 0) / ARTWORKS_PER_PAGE)}
                            className={`px-3 py-1 rounded ${
                              currentPage >= Math.ceil((selectedExhibition.artworkIds?.length || 0) / ARTWORKS_PER_PAGE)
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Blueprint</h3>
                  {selectedExhibition.blueprintUrl ? (
                    <img 
                      src={selectedExhibition.blueprintUrl} 
                      alt="Exhibition Blueprint" 
                      className="max-w-full rounded-lg"
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleAddBlueprint(selectedExhibition.id, file)
                          }
                        }}
                        className="hidden"
                        id="blueprint-upload"
                      />
                      <label
                        htmlFor="blueprint-upload"
                        className="cursor-pointer text-gray-400 hover:text-white"
                      >
                        Upload Blueprint
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Installation Notes</h3>
                  <div className="space-y-2">
                    {selectedExhibition.notes.map((note, index) => (
                      <div key={index} className="bg-black bg-opacity-50 p-3 rounded">
                        {note}
                      </div>
                    ))}
                    {isAddingNote ? (
                      <div className="space-y-2">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add installation note..."
                          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-700 text-white"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setIsAddingNote(false)}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddNote(selectedExhibition.id, newNote)}
                            className="px-4 py-2 bg-white text-black rounded"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingNote(true)}
                        className="text-gray-400 hover:text-white"
                      >
                        + Add Note
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                Select an exhibition to view details
              </div>
            )}
          </div>
        </div>

        {showAddModal && (
          <AddExhibitionModal
            onClose={() => setShowAddModal(false)}
            onExhibitionAdded={loadExhibitions}
          />
        )}

        {showEditModal && selectedExhibition && (
          <EditExhibitionModal
            exhibition={selectedExhibition}
            onClose={() => setShowEditModal(false)}
            onExhibitionUpdated={(updatedExhibition) => {
              setExhibitions(prevExhibitions => 
                prevExhibitions.map(ex => 
                  ex.id === updatedExhibition.id ? updatedExhibition : ex
                )
              )
              setSelectedExhibition(updatedExhibition)
              setShowEditModal(false)
            }}
          />
        )}
      </div>
    </main>
  )
} 