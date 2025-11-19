# TinyLink - URL Shortener

A modern URL shortening service built with Next.js, Prisma, and PostgreSQL.

## Features

- ✅ Create short links with auto-generated or custom codes
- ✅ Track click statistics
- ✅ View detailed analytics per link
- ✅ Search and filter links
- ✅ Responsive design
- ✅ Copy to clipboard functionality
- ✅ Soft delete with data retention

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd tinylink
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /healthz
```

### Links Management
```
POST   /api/links          - Create new link
GET    /api/links          - List all links
GET    /api/links/:code    - Get link stats
DELETE /api/links/:code    - Delete link
```

### Redirect
```
GET /:code                 - Redirect to target URL (302)
```

## Routes

- `/` - Dashboard (list and create links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to target URL

## Database Schema
```prisma
model Link {
  id              Int       @id @default(autoincrement())
  code            String    @unique
  target_url      String
  clicks          Int       @default(0)
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
  last_clicked_at DateTime?
  deleted_at      DateTime?
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel dashboard

3. Add environment variables:
   - `DATABASE_URL` - Your Neon database URL
   - `NEXT_PUBLIC_BASE_URL` - Your Vercel app URL

4. Deploy!

5. Run database migrations in production:
```bash
npx prisma migrate deploy
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | `https://tinylink.vercel.app` |

## License

MIT