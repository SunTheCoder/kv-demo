'use client'

import { useState, ChangeEvent } from 'react'

export default function KVExample() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleGet = async () => {
    const res = await fetch(`/api/kv?key=${key}`)
    const data = await res.json()
    setResult(data.value)
  }

  const handleSet = async () => {
    const res = await fetch('/api/kv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    })
    const data = await res.json()
    setResult(data.success ? 'Value set successfully' : 'Error setting value')
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/kv?key=${key}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    setResult(data.success ? 'Value deleted successfully' : 'Error deleting value')
  }

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => setKey(e.target.value)
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={handleKeyChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={handleValueChange}
            className="border p-2"
          />
        </div>
        <div className="space-x-2">
          <button onClick={handleGet} className="bg-blue-500 text-white px-4 py-2 rounded">
            Get
          </button>
          <button onClick={handleSet} className="bg-green-500 text-white px-4 py-2 rounded">
            Set
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
        {result && (
          <div className="mt-4">
            <h3>Result:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
} 