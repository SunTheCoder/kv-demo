# Next.js Art Gallery Management System

A modern web application for managing art galleries and exhibitions, built with Next.js and Vercel KV. This system helps galleries manage their artwork collection and plan exhibitions efficiently.

## Features

### Gallery Management
- Browse and search the art collection
- View detailed artwork information (title, artist, dimensions, year, colors)
- Edit and delete artworks
- Paginated artwork display

### Exhibition Planning
- Create and manage exhibitions with titles, dates, and descriptions
- Support for both historical and contemporary artists
- Curate artworks for each exhibition
- Add installation notes and blueprints
- Password-protected exhibition management

## Getting Started

First, set up your environment variables:

```bash
# Create a .env.local file with:
EXHIBITION_PASSWORD=your_secure_password
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [Vercel KV](https://vercel.com/storage/kv) - Redis database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Next.js App Router](https://nextjs.org/docs/app) - Routing
- [Vercel Blob Storage](https://vercel.com/storage/blob) - Image storage

## API Routes

### Artworks
- `GET /api/artworks` - List artworks
- `POST /api/artworks` - Add artwork
- `PATCH /api/artworks/[id]` - Update artwork
- `DELETE /api/artworks/[id]` - Delete artwork

### Exhibitions
- `GET /api/exhibitions` - List exhibitions
- `POST /api/exhibitions` - Create exhibition
- `PATCH /api/exhibitions/[id]` - Update exhibition
- `POST /api/exhibitions/[id]/notes` - Add note
- `POST /api/exhibitions/blueprint` - Upload blueprint

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
