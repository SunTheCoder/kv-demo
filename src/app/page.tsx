import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">The Redis Gallery</h1>
          <p className="text-2xl mb-8">The World's Fastest Art Gallery</p>
          <div className="space-y-4 mb-12">
            <p className="text-lg">
              Powered by Vercel KV and Redis for lightning-fast performance
            </p>
            <p className="text-lg">
              Experience instant search, real-time updates, and seamless filtering
            </p>
          </div>
          <div className="flex justify-center space-x-6">
            <Link 
              href="/gallery" 
              className="bg-white text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Enter Gallery
            </Link>
            <a 
              href="https://vercel.com/docs/storage/vercel-kv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Instant Search</h3>
            <p>Find artworks in milliseconds with our Redis-powered search</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p>See changes instantly with our live data synchronization</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Smart Filtering</h3>
            <p>Filter by artist, style, colors, and more with zero lag</p>
          </div>
        </div>
      </div>
    </main>
  )
}