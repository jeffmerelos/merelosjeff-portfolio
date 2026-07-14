# Jeff's Developer Portfolio

A modern, neon-themed developer portfolio built with Next.js, Node.js, and MySQL.

## Project Structure

```
JeffCV/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── database/          # MySQL database scripts
└── docs/              # Documentation
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MySQL
- **Database**: MySQL (via XAMPP)
- **UI Libraries**: Lucide Icons, Framer Motion, GSAP
- **Typography**: Chakra Petch, Inter, JetBrains Mono

## Prerequisites

- Node.js 18+ and npm
- XAMPP (for MySQL)
- Git

## Setup Instructions

### 1. Database Setup

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database:
   ```
   Import database/cv.sql
   ```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

The backend API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Run Both (from root)

```bash
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cv
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Features

- 🎨 Neon cyber-tech theme with dark mode
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🚀 Optimized performance
- 🔍 SEO-friendly
- ♿ Accessibility compliant
- 📧 Contact form with email integration
- 📊 Project showcase with filtering
- 📈 Skills visualization
- 📅 Interactive timeline
- 📄 Downloadable resume
- 🎯 GitHub integration

## Pages

- `/` - Home (Landing)
- `/about` - About / Bio
- `/projects` - Projects Grid
- `/projects/[slug]` - Project Case Study
- `/experience` - Experience Timeline
- `/skills` - Skills & Tech Stack
- `/certifications` - Certificates & Achievements
- `/blog` - Blog (optional)
- `/resume` - Resume/CV
- `/contact` - Contact Form

## API Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get single project
- `GET /api/experience` - Get experience timeline
- `GET /api/skills` - Get skills
- `GET /api/certifications` - Get certifications
- `POST /api/contact` - Submit contact form
- `GET /api/github` - Get GitHub stats

## Development

- Frontend hot reload: Changes auto-refresh
- Backend hot reload: Uses nodemon
- Database: Use phpMyAdmin for management

## Building for Production

```bash
npm run build
npm start
```

## License

Private - All Rights Reserved
