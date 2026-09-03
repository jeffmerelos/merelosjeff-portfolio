# Environment Configuration

This application supports both local development and production deployment with automatic environment detection.

## Local Development

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. The default configuration works with the local backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_ADMIN_ROUTE_PREFIX=/admin-portal
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

1. Go to your Vercel dashboard
2. Navigate to Project Settings > Environment Variables
3. Add these variables:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://merelosjeff-portfolio-backend.vercel.app` |
   | `NEXT_PUBLIC_SITE_URL` | `https://merelosjeff-portfolio-frontend.vercel.app` |
   | `NEXT_PUBLIC_ADMIN_ROUTE_PREFIX` | `/admin-portal` |
   | `NEXT_PUBLIC_SITE_NAME` | `Jeff Developer` |
   | `NEXT_PUBLIC_GITHUB_USERNAME` | `jeffdev` |

4. Deploy your application

## How It Works

The API client automatically detects the environment:

- **Development**: Uses `http://localhost:5000` (local backend)
- **Production**: Uses `https://merelosjeff-portfolio-backend.vercel.app` (Vercel backend)
- **Environment Variables**: If `NEXT_PUBLIC_API_URL` is set, it takes priority

## Admin Portal Access

- **Local**: `http://localhost:3000/admin-portal/login`
- **Production**: `https://your-domain.com/admin-portal-7x9k/login`

The admin route prefix changes between environments for security reasons.