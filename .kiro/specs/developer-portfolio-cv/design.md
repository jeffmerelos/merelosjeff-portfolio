# Design Document — Developer Portfolio & CV

## Overview

This document describes the technical design for a full-stack personal developer portfolio and online CV web
application. The product is a neon cyber-tech themed site that showcases work history, projects, skills,
certifications, and a blog, and provides a downloadable resume and a contact form.

**Technology Stack**

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS v3 + CSS custom properties (Neon Token System) |
| Animation | Framer Motion v11 + GSAP v3 / ScrollTrigger |
| Backend API | Node.js 20 + Express 5 (REST) |
| Database | MySQL 8 (XAMPP), database name: `cv` |
| Content | MDX (blog posts + project case studies) |
| Email | Formspree or Resend SDK |
| Icons | Lucide-react |
| Fonts | Chakra Petch / Rajdhani (display), Inter (body), JetBrains Mono (code/meta) |
| Hosting | Vercel (frontend) + Railway / Render (API) |
| Analytics | Plausible Analytics or Google Analytics 4 |

**Design Goals**

1. Clear separation between the Next.js frontend and the Express REST backend.
2. All dynamic content driven from MySQL; static content (blog, case studies) driven from MDX files.
3. Accessibility first — WCAG AA in both dark and light themes.
4. Animation as progressive enhancement — fully disabled when `prefers-reduced-motion` is set.
5. GitHub API data cached server-side (≥60 min TTL) to respect rate limits.


---

## Architecture

The application follows a **three-tier architecture**: a Next.js frontend served via Vercel, an Express REST
API hosted on a Node.js server, and a MySQL database managed with XAMPP locally (and a managed MySQL service
in production).

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                      │
│  Next.js App Router (React 18, TypeScript)                  │
│  • Server Components → SSR / ISR                            │
│  • Client Components → Framer Motion, GSAP, interactivity   │
└────────────────────────┬───────────────────────────────────-┘
                         │  HTTP / HTTPS
          ┌──────────────▼──────────────┐
          │     Express REST API         │
          │  Node.js 20 + Express 5      │
          │  • /api/projects             │
          │  • /api/experiences          │
          │  • /api/education            │
          │  • /api/skills               │
          │  • /api/certifications       │
          │  • /api/blog-posts           │
          │  • /api/testimonials         │
          │  • POST /api/contact         │
          │  • GET  /api/github/pinned   │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │        MySQL 8 — `cv`        │
          │  (XAMPP local / managed      │
          │   cloud service in prod)     │
          └─────────────────────────────┘
```

### Data-Flow Summary

- **Dynamic page data** (projects, experience, skills, etc.): Next.js Server Components call the Express API
  on the server at render time, enabling SSR and ISR.
- **Static blog content**: MDX files in `content/blog/` are read at build time and at request time via
  Next.js's file-system conventions. No database involvement.
- **GitHub stats**: A server-side cache module (Node.js `Map` with TTL or Redis in production) stores
  GitHub API responses for ≥60 minutes. The Express API exposes the cached data.
- **Contact form submissions**: The form POSTs to the Express API, which validates, inserts to MySQL, then
  dispatches email via Formspree/Resend.
- **MDX case studies**: Co-located with `content/projects/[slug].mdx`; fetched at build/request time.

### Rendering Strategy per Route

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` | SSR + ISR 60 s | Live GitHub stats |
| `/about` | Static (SSG) | Rarely changes |
| `/projects` | SSR + ISR 300 s | Project cards from DB |
| `/projects/[slug]` | SSR + ISR 600 s | Case study MDX |
| `/experience` | SSR + ISR 300 s | DB data |
| `/skills` | SSR + ISR 300 s | DB data |
| `/certifications` | SSR + ISR 300 s | DB + GitHub heatmap |
| `/blog` | SSR + ISR 60 s | MDX list |
| `/blog/[slug]` | SSR + ISR 300 s | MDX post |
| `/resume` | SSR | DB data, always fresh |
| `/contact` | Static + CSR form | Static shell, form is client |
| `/404` | Static | Error page |


---

## Project Folder Structure

```
JeffCV/
├── apps/
│   ├── web/                          # Next.js 14 App Router frontend
│   │   ├── app/
│   │   │   ├── (root)/
│   │   │   │   ├── page.tsx          # Home / Landing
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx      # Projects grid
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── experience/page.tsx
│   │   │   │   ├── skills/page.tsx
│   │   │   │   ├── certifications/page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── resume/page.tsx
│   │   │   │   ├── contact/page.tsx
│   │   │   │   └── not-found.tsx     # 404
│   │   │   ├── layout.tsx            # Root layout (fonts, providers, navbar, cursor)
│   │   │   └── globals.css           # Neon token system, base resets
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── PageTransition.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── ScrollReveal.tsx
│   │   │   ├── cursor/
│   │   │   │   └── CustomCursor.tsx
│   │   │   ├── command-palette/
│   │   │   │   └── CommandPalette.tsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── TerminalEffect.tsx
│   │   │   │   ├── ParticleBackground.tsx
│   │   │   │   ├── StatsStrip.tsx
│   │   │   │   ├── FeaturedProjects.tsx
│   │   │   │   ├── SkillsSnapshot.tsx
│   │   │   │   ├── ExperienceTeaser.tsx
│   │   │   │   └── TestimonialsCarousel.tsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectFilter.tsx
│   │   │   │   └── ProjectSearch.tsx
│   │   │   ├── experience/
│   │   │   │   ├── Timeline.tsx
│   │   │   │   └── TimelineEntry.tsx
│   │   │   ├── skills/
│   │   │   │   ├── SkillBar.tsx
│   │   │   │   ├── RadarChart.tsx
│   │   │   │   └── ConstellationGraph.tsx
│   │   │   ├── blog/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── TableOfContents.tsx
│   │   │   │   └── MDXComponents.tsx
│   │   │   ├── certifications/
│   │   │   │   ├── CertCard.tsx
│   │   │   │   └── GitHubHeatmap.tsx
│   │   │   ├── contact/
│   │   │   │   └── ContactForm.tsx
│   │   │   └── resume/
│   │   │       └── ResumeView.tsx
│   │   ├── hooks/
│   │   │   ├── useScrollSpy.ts
│   │   │   ├── useReducedMotion.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useKonamiCode.ts
│   │   │   └── useCommandPalette.ts
│   │   ├── lib/
│   │   │   ├── api.ts                # Typed fetch helpers for Express API
│   │   │   ├── mdx.ts                # MDX loading utilities
│   │   │   ├── readingTime.ts        # Reading-time calculation
│   │   │   └── seo.ts                # Metadata builders
│   │   ├── styles/
│   │   │   └── print.css             # @media print overrides for resume
│   │   ├── public/
│   │   │   ├── resume.pdf
│   │   │   ├── images/
│   │   │   ├── robots.txt
│   │   │   └── sitemap.xml           # Generated at build
│   │   ├── content/
│   │   │   ├── blog/                 # .mdx files for blog posts
│   │   │   └── projects/             # .mdx files for case studies
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── api/                          # Express REST API
│       ├── src/
│       │   ├── index.ts              # Express app entry point
│       │   ├── routes/
│       │   │   ├── projects.ts
│       │   │   ├── experiences.ts
│       │   │   ├── education.ts
│       │   │   ├── skills.ts
│       │   │   ├── certifications.ts
│       │   │   ├── blogPosts.ts
│       │   │   ├── testimonials.ts
│       │   │   ├── contact.ts
│       │   │   └── github.ts
│       │   ├── middleware/
│       │   │   ├── errorHandler.ts
│       │   │   ├── validateBody.ts
│       │   │   └── cors.ts
│       │   ├── db/
│       │   │   └── pool.ts           # MySQL connection pool
│       │   ├── services/
│       │   │   ├── emailService.ts
│       │   │   └── githubCache.ts
│       │   ├── schemas/
│       │   │   └── contactSchema.ts  # Zod schema for contact form
│       │   └── types/
│       │       └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── cv.sql                            # Database schema + seed data
├── .env.local                        # Local env vars (gitignored)
├── .gitignore
└── README.md
```


---

## Database Schema

All tables live in the `cv` database. The schema file is `cv.sql` at the project root.

### Table: `projects`

```sql
CREATE TABLE projects (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(200) NOT NULL UNIQUE,
  title         VARCHAR(200) NOT NULL,
  short_desc    VARCHAR(160) NOT NULL,
  body_mdx      TEXT,                         -- MDX case-study content (optional, may use file)
  tech_stack    JSON NOT NULL,                -- ["React","TypeScript","MySQL"]
  category      VARCHAR(100) NOT NULL,
  cover_image   VARCHAR(500),
  screenshots   JSON,                         -- ["url1","url2"]
  demo_url      VARCHAR(500),
  repo_url      VARCHAR(500),
  featured      TINYINT(1) NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_featured (featured),
  INDEX idx_category (category)
);
```

### Table: `experiences`

```sql
CREATE TABLE experiences (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type          ENUM('work','education') NOT NULL DEFAULT 'work',
  title         VARCHAR(200) NOT NULL,        -- role or degree title
  organisation  VARCHAR(200) NOT NULL,
  location      VARCHAR(200),
  start_date    DATE NOT NULL,
  end_date      DATE,                         -- NULL = current
  short_desc    VARCHAR(200),
  body_mdx      TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  INDEX idx_type (type),
  INDEX idx_start (start_date)
);
```

### Table: `education`

```sql
CREATE TABLE education (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  degree        VARCHAR(200) NOT NULL,
  institution   VARCHAR(200) NOT NULL,
  location      VARCHAR(200),
  start_date    DATE NOT NULL,
  end_date      DATE,
  grade         VARCHAR(50),
  description   TEXT,
  sort_order    INT NOT NULL DEFAULT 0
);
```

### Table: `skills`

```sql
CREATE TABLE skills (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  category      VARCHAR(100) NOT NULL,        -- Frontend, Backend, DevOps, Design
  proficiency   TINYINT UNSIGNED NOT NULL,    -- 0–100
  icon_key      VARCHAR(100),                 -- Lucide icon name
  sort_order    INT NOT NULL DEFAULT 0,
  INDEX idx_category (category)
);

CREATE TABLE skill_relationships (
  skill_id      INT UNSIGNED NOT NULL,
  related_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (skill_id, related_id),
  FOREIGN KEY (skill_id)   REFERENCES skills(id) ON DELETE CASCADE,
  FOREIGN KEY (related_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### Table: `certifications`

```sql
CREATE TABLE certifications (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  issuer        VARCHAR(200) NOT NULL,
  issue_date    DATE NOT NULL,
  expiry_date   DATE,
  badge_image   VARCHAR(500),
  verify_url    VARCHAR(500),
  sort_order    INT NOT NULL DEFAULT 0,
  INDEX idx_issue_date (issue_date)
);
```

### Table: `blog_posts`

```sql
CREATE TABLE blog_posts (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(200) NOT NULL UNIQUE,
  title         VARCHAR(300) NOT NULL,
  excerpt       VARCHAR(280),
  cover_image   VARCHAR(500),
  tags          JSON,                         -- ["TypeScript","Next.js"]
  published     TINYINT(1) NOT NULL DEFAULT 0,
  published_at  TIMESTAMP,
  mdx_file      VARCHAR(500),                 -- relative path to .mdx file
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_published (published, published_at)
);
```

### Table: `contact_messages`

```sql
CREATE TABLE contact_messages (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(254) NOT NULL,
  subject       VARCHAR(150) NOT NULL,
  message       TEXT NOT NULL,               -- 20–2000 chars enforced in API
  email_sent    TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
);
```

### Table: `testimonials`

```sql
CREATE TABLE testimonials (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_name   VARCHAR(200) NOT NULL,
  author_title  VARCHAR(200),
  author_image  VARCHAR(500),
  body          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0
);
```


---

## Components and Interfaces

### API Endpoint Design

All Express routes are prefixed `/api`. Responses always include a `Content-Type: application/json` header.

#### Resource Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | All projects (sorted by `sort_order`) |
| GET | `/api/projects/:slug` | Single project by slug |
| GET | `/api/experiences` | All experience entries |
| GET | `/api/education` | All education entries |
| GET | `/api/skills` | All skills + relationship edges |
| GET | `/api/certifications` | All certifications |
| GET | `/api/blog-posts` | Published blog post metadata (no MDX body) |
| GET | `/api/blog-posts/:slug` | Single blog post metadata |
| GET | `/api/testimonials` | All testimonials |
| GET | `/api/github/pinned` | Up to 6 pinned repos (server-cached 60 min) |
| POST | `/api/contact` | Submit contact form |

#### Standard Response Shapes

```typescript
// Success — collection
{ data: T[], meta?: { total: number } }

// Success — single item
{ data: T }

// Error (4xx / 5xx)
{ error: { message: string; fields?: Record<string, string[]> } }
```

#### Contact Form Request Body (Zod schema)

```typescript
const ContactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(20).max(2000),
  _honey:  z.string().max(0).optional(),  // honeypot — must be empty
});
```

#### HTTP Status Codes

| Scenario | Status |
|----------|--------|
| Success (GET) | 200 |
| Success (POST contact) | 201 |
| Validation failure | 422 |
| Not found | 404 |
| Email dispatch failure (DB insert succeeded) | 502 |
| DB unavailable | 503 |
| Unexpected server error | 500 |

### Key React Component Interfaces

```typescript
// Navbar
interface NavbarProps {
  links: { label: string; href: string }[];
  activeSection: string;
}

// ProjectCard
interface ProjectCardProps {
  project: Project;            // from API
  variant?: 'grid' | 'list';
}

// TimelineEntry
interface TimelineEntryProps {
  entry: ExperienceEntry;
  index: number;               // used for stagger delay
}

// SkillBar
interface SkillBarProps {
  name: string;
  proficiency: number;         // 0–100
  iconKey?: string;
  animate: boolean;            // false when prefers-reduced-motion
}

// ScrollReveal (wrapper)
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;              // ms, default 0
  disabled?: boolean;          // true when prefers-reduced-motion
}

// CommandPalette
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pages: { label: string; href: string }[];
}

// ContactForm
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honey: string;
  status: 'idle' | 'submitting' | 'success' | 'error';
  errors: Partial<Record<keyof ContactFormState, string>>;
}
```


---

## Data Models

### TypeScript Types (shared across frontend and API)

```typescript
export interface Project {
  id: number;
  slug: string;
  title: string;
  shortDesc: string;
  techStack: string[];
  category: string;
  coverImage: string | null;
  screenshots: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  sortOrder: number;
}

export interface ExperienceEntry {
  id: number;
  type: 'work' | 'education';
  title: string;
  organisation: string;
  location: string | null;
  startDate: string;           // ISO date string
  endDate: string | null;
  shortDesc: string | null;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  iconKey: string | null;
  relatedIds: number[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;           // "Mon YYYY" formatted on client
  expiryDate: string | null;
  badgeImage: string | null;
  verifyUrl: string | null;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface Testimonial {
  id: number;
  authorName: string;
  authorTitle: string | null;
  authorImage: string | null;
  body: string;
}

export interface GitHubRepo {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  _honey?: string;
}
```


---

## State Management

The application uses **React Server Components + URL state + minimal client state**. There is no global
client-side state manager (no Redux, no Zustand). Rationale: most data is fetched server-side; client state
needs are small and co-located.

### State Layers

| Layer | Tool | Used for |
|-------|------|---------|
| Server / SSR | Next.js Server Components | API data, MDX content |
| URL state | `useSearchParams` / `useRouter` | Project filter, blog tag filter |
| Local component state | `useState` / `useReducer` | Form state, drawer open/close, palette query |
| Persisted client state | `localStorage` | Theme preference |
| Global signals | React Context | Theme, reduced-motion, command palette open |

### Context Providers (in `app/layout.tsx`)

```typescript
// ThemeProvider — dark/light mode, persists to localStorage
// ReducedMotionProvider — reads prefers-reduced-motion, re-exported for all consumers
// CommandPaletteProvider — isOpen flag + keyboard shortcut listener
```

### Data Fetching Pattern

```typescript
// Server Component (no client bundle cost)
async function ProjectsPage() {
  const projects = await fetchProjects();   // calls Express API server-side
  return <ProjectGrid projects={projects} />;
}

// Client Component for interactivity
'use client';
function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useQueryState('tag');
  const filtered = useProjectFilter(projects, filter);
  return /* … */;
}
```


---

## Animation Architecture

### Library Responsibilities

| Library | Responsibility |
|---------|---------------|
| Framer Motion | Page transitions, scroll-reveal, hover states, stagger entry animations, count-up |
| GSAP + ScrollTrigger | SVG timeline path draw, particle canvas, scanline sweep |
| CSS transitions | Theme switch, focus indicators, reduced-motion fallbacks |

### Reduced-Motion Gate

Every animation is wrapped by the `useReducedMotion` hook. When the OS preference is set, all animation
durations collapse to 0 and elements render in their final state.

```typescript
// hooks/useReducedMotion.ts
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
```

All `motion.*` components receive `transition={{ duration: prefersReducedMotion ? 0 : actualDuration }}`.
All GSAP timelines are wrapped: `if (!prefersReducedMotion) { tl.play(); }`.

### Page Transitions

```typescript
// components/layout/PageTransition.tsx
// Wraps each page in an AnimatePresence with:
const variants = {
  initial:  { opacity: 0, scale: 0.98 },
  animate:  { opacity: 1, scale: 1,   transition: { duration: 0.2 } },
  exit:     { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};
```

### Scroll-Reveal Wrapper

```typescript
// components/ui/ScrollReveal.tsx
// Uses Framer Motion whileInView with once: true
// threshold: 0.2 (triggers at 20% visibility)
const variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
```

### Hero Glitch Animation

The name glitch effect uses a CSS keyframe animation with chromatic aberration via `text-shadow` offsets.
Framer Motion orchestrates the sequence: glitch-in (0–2 s) → stable → begin typewriter.

```css
@keyframes glitch-clip {
  0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
  20%       { clip-path: inset(33% 0 33% 0); transform: translate(-4px, 2px); }
  40%       { clip-path: inset(0 0 66% 0); transform: translate(4px, -2px); }
  60%       { clip-path: inset(66% 0 0 0); transform: translate(-2px, 4px); }
  80%       { clip-path: inset(50% 0 10% 0); transform: translate(2px, -4px); }
}
```

### GSAP Timeline Path Draw

```typescript
// components/experience/Timeline.tsx
useEffect(() => {
  if (prefersReducedMotion) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(pathRef.current,
    { strokeDashoffset: pathLength },
    {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%', end: 'bottom 20%', scrub: 1 },
    }
  );
}, [pathLength, prefersReducedMotion]);
```

### Particle Background

The particle canvas uses a `requestAnimationFrame` loop. GSAP is used only for the mouse-proximity shift
tween (smooth lerp toward cursor position). Canvas is hidden and RAF loop cancelled on component unmount
and when `prefers-reduced-motion` is set.

### Magnetic CTA Button

```typescript
// Within button onMouseMove handler:
const dx = (e.clientX - cx) / RADIUS;  // normalised -1..1
const dy = (e.clientY - cy) / RADIUS;
animate(buttonRef.current, { x: dx * 12, y: dy * 12 }, { type: 'spring', stiffness: 300, damping: 20 });
```

### Scanline Sweep

A repeating GSAP timeline runs every 8 s after 5 s of scroll-idle time. It moves a `::after` pseudo-element
(a semi-transparent horizontal stripe) from top to bottom of the hero section over 1.5 s.


---

## Neon Token System CSS Implementation

All eight design tokens are defined in `app/globals.css` on `:root` (dark theme default). The light theme
overrides every token under a `[data-theme="light"]` attribute selector applied to `<html>`.

```css
/* app/globals.css */

:root {
  --bg-void:      #0A0A0F;
  --bg-panel:     #12121A;
  --neon-pink:    #FF1B6B;
  --neon-violet:  #9D4EDD;
  --neon-blue:    #4EA8FF;
  --text-primary: #F5F5F7;
  --text-muted:   #9A9AA5;
  --line:         #2A2A35;
}

[data-theme="light"] {
  --bg-void:      #F5F5F7;
  --bg-panel:     #FFFFFF;
  --neon-pink:    #D10054;
  --neon-violet:  #7B2FBE;
  --neon-blue:    #1A6FCC;
  --text-primary: #0A0A0F;
  --text-muted:   #5A5A68;
  --line:         #D0D0DA;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Tailwind Integration

`tailwind.config.ts` maps every token to a Tailwind colour alias so Tailwind utility classes stay semantic:

```typescript
theme: {
  extend: {
    colors: {
      void:    'var(--bg-void)',
      panel:   'var(--bg-panel)',
      pink:    'var(--neon-pink)',
      violet:  'var(--neon-violet)',
      blue:    'var(--neon-blue)',
      primary: 'var(--text-primary)',
      muted:   'var(--text-muted)',
      line:    'var(--line)',
    },
    fontFamily: {
      display: ['Chakra Petch', 'Rajdhani', 'sans-serif'],
      body:    ['Inter', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
    },
  },
}
```

### Theme Persistence (`useTheme` hook)

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}
```

### Neon Glow Utilities

Reusable Tailwind plugin or CSS utility classes for consistent glow effects:

```css
.glow-pink   { box-shadow: 0 0 8px var(--neon-pink),  0 0 24px color-mix(in srgb, var(--neon-pink) 40%, transparent); }
.glow-violet { box-shadow: 0 0 8px var(--neon-violet), 0 0 24px color-mix(in srgb, var(--neon-violet) 40%, transparent); }
.glow-blue   { box-shadow: 0 0 8px var(--neon-blue),  0 0 24px color-mix(in srgb, var(--neon-blue) 40%, transparent); }
```


---

## MDX Content Pipeline

Blog posts and project case studies are stored as `.mdx` files in `content/blog/` and
`content/projects/` respectively. The Next.js app reads them at build/request time using
**`next-mdx-remote`** (for on-demand fetching) combined with **`gray-matter`** for frontmatter parsing.

### Frontmatter Shape (Blog Post)

```yaml
---
title: "Understanding TypeScript Generics"
excerpt: "A practical guide to generics in TypeScript with real-world examples."
coverImage: /images/blog/ts-generics.jpg
tags: ["TypeScript", "Tutorial"]
published: true
publishedAt: "2024-11-15"
---
```

### MDX Component Map

Custom components registered in the MDX component map (`components/blog/MDXComponents.tsx`):

| Tag/Component | Renders |
|--------------|---------|
| `pre` + `code` | Syntax-highlighted code block (Prism / Shiki) |
| `code` (inline) | `<code>` with `font-mono` + muted background |
| `blockquote` | Styled callout with neon-violet left border |
| `img` | Next.js `<Image>` with lazy loading |
| `Callout` | Custom info/warning box component |
| `Demo` | Interactive demo embed (iframe or inline) |

### Reading Time Calculation

```typescript
// lib/readingTime.ts
export function calculateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
```

### Table of Contents Generation

Headings (h2, h3) are extracted from the MDX AST at compile time using a remark plugin. The TOC is passed as
a prop to the blog post layout. Active heading is tracked with a `useScrollSpy` hook that monitors heading
intersection (top within upper 30% of viewport).

### Syntax Highlighting

Uses **Shiki** (via `rehype-shiki` or `@shikijs/rehype`) with a custom theme based on the neon token
palette. Code blocks include a language badge and a copy-to-clipboard button.


---

## GitHub API Integration with Caching

### Architecture

The Express API acts as a proxy between the Next.js frontend and the GitHub REST API. This keeps the GitHub
token server-side and implements a 60-minute TTL cache.

```
Next.js SSR  →  GET /api/github/pinned  →  githubCache.ts  →  GitHub REST API
                                               ↑ cache hit (< 60 min): return cached data
                                               ↑ cache miss / expired: fetch + store + return
```

### Cache Module (`services/githubCache.ts`)

```typescript
interface CacheEntry<T> {
  data: T;
  fetchedAt: number;   // Date.now() timestamp
}

const CACHE_TTL_MS = 60 * 60 * 1000;  // 60 minutes

class GitHubCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) { this.store.delete(key); return null; }
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, fetchedAt: Date.now() });
  }
}

export const githubCache = new GitHubCache();
```

### Pinned Repositories Fetch

GitHub does not expose pinned repos via the REST API; they require the **GraphQL API**. The query:

```graphql
query PinnedRepos($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          url
          description
          stargazerCount
          forkCount
          primaryLanguage { name }
        }
      }
    }
  }
}
```

The cache key is `"pinned"`. On error, the route returns the cached value if present, or a 503 with the
`"GitHub stats unavailable"` message if not.

### Contribution Heatmap

The 52-week heatmap on the Certifications page uses the GitHub REST API
(`/users/{username}/contributions` or the GraphQL `contributionCalendar` field). The same caching strategy
applies (60-minute TTL). The heatmap component renders a 52×7 grid of `<rect>` elements coloured by
contribution count using neon token variants.


---

## Authentication and Security Considerations

This is a **public read-only portfolio**. There is no user authentication. Security measures focus on API
integrity and input validation.

### Backend Security

| Concern | Mitigation |
|---------|-----------|
| CORS | Restrict to known frontend origin(s) via `cors` middleware with `origin` whitelist |
| Input validation | All POST bodies validated with Zod before any DB operation |
| Spam / bots | Hidden honeypot field `_honey` (must be empty); rejected with 422 if populated |
| SQL injection | MySQL `mysql2` parameterised queries (`?` placeholders) throughout |
| Secrets management | All credentials in environment variables; `.env.local` gitignored |
| Error exposure | Generic error messages to client; full details logged server-side only |
| Rate limiting | `express-rate-limit` on `POST /api/contact` (max 5 req / 15 min per IP) |
| Header hardening | `helmet` middleware for `X-Content-Type-Options`, `X-Frame-Options`, CSP |

### Frontend Security

| Concern | Mitigation |
|---------|-----------|
| XSS via MDX | MDX is compiled at build time; no user-supplied MDX is ever rendered |
| Open redirect | All internal navigation uses Next.js `<Link>`; no dynamic `href` from user input |
| External links | All external links use `rel="noopener noreferrer"` |
| HTTPS | Vercel enforces HTTPS and HTTP→HTTPS redirect automatically |
| Analytics opt-out | DNT header detection suppresses all tracking |

### Environment Variables

```
# apps/api/.env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASS=
DATABASE_NAME=cv
GITHUB_TOKEN=ghp_...
EMAIL_SERVICE=resend          # or formspree
RESEND_API_KEY=re_...
ALLOWED_ORIGIN=https://jeffcv.vercel.app

# apps/web/.env.local
NEXT_PUBLIC_API_URL=https://api.jeffcv.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jeffcv.com
```


---

## Performance Optimization Strategy

### Target: Lighthouse ≥90 (Mobile)

| Technique | Detail |
|-----------|--------|
| SSR + ISR | Pages pre-rendered; stale-while-revalidate keeps content fresh |
| Next.js `<Image>` | Automatic WebP/AVIF, `srcset`, lazy loading, explicit `width`/`height` |
| Font subsetting | Next.js `next/font` with `display: swap`; only latin subset loaded |
| Code splitting | App Router automatic per-route splitting; no large vendor bundle |
| Dynamic imports | Heavy components (GSAP, ParticleBackground, ConstellationGraph) lazy-loaded with `next/dynamic` |
| Bundle analysis | `@next/bundle-analyzer` used during development to catch regressions |
| API response compression | `compression` middleware on Express |
| ISR cache headers | Vercel CDN caches ISR pages at the edge |
| Critical CSS | Tailwind purge removes unused classes; globals.css inlined |
| Preconnect | `<link rel="preconnect">` for Google Fonts and API origin in `<head>` |
| Core Web Vitals | LCP target: hero image/text < 2.5 s; CLS: explicit image dimensions prevent layout shift; INP: no long tasks in main thread |

### Lazy-Loading Strategy for Heavy Components

```typescript
// Dynamic imports with loading skeletons
const ParticleBackground = dynamic(() => import('@/components/home/ParticleBackground'), {
  ssr: false,
  loading: () => null,
});

const ConstellationGraph = dynamic(() => import('@/components/skills/ConstellationGraph'), {
  ssr: false,
  loading: () => <SkeletonGraph />,
});
```

### Image Optimization

All project screenshots and blog cover images are stored in `public/images/` and served via Next.js Image.
Portrait and badge images use `sizes` attribute for responsive delivery:

```tsx
<Image src={src} alt={alt} width={800} height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur" blurDataURL={blurDataURL} />
```


---

## Deployment Configuration

### Frontend (Vercel)

`vercel.json` at `apps/web/`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.jeffcv.com/api/:path*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Backend API (Railway or Render)

`apps/api/` is deployed as a Node.js service. The `Procfile` or start command:

```
node dist/index.js
```

Build step: `tsc --project tsconfig.json`

Environment variables are set in the platform dashboard — never in source control.

### CI/CD Pipeline

Both services connect to the GitHub `main` branch. On every push to `main`:

1. Tests run (unit + integration).
2. TypeScript compilation verified.
3. Frontend build attempted.
4. If all checks pass → deploy.
5. If any check fails → deploy blocked, previous version stays live, developer notified.

### Sitemap Generation

`apps/web/next-sitemap.config.js` uses `next-sitemap` to generate `sitemap.xml` and `robots.txt` at build
time. Dynamic routes (blog slugs, project slugs) are included via `getServerSideSitemap` or a custom
`generateSitemaps` function.

```javascript
module.exports = {
  siteUrl: 'https://jeffcv.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: ['https://jeffcv.vercel.app/sitemap.xml'],
  },
};
```

### Print Stylesheet (`styles/print.css`)

```css
@media print {
  nav, .download-btn, .particle-bg, .custom-cursor,
  [data-neon-effect], footer { display: none !important; }
  body { background: #fff !important; color: #000 !important; }
  a[href]::after { content: " (" attr(href) ")"; }
}
```


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a
system — essentially, a formal statement about what the system should do. Properties serve as the bridge
between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties were derived from the acceptance criteria via the prework analysis. Properties
cover the pure-logic layer of the application (validation, filtering, calculation, state machines) where
input variation is high and property-based testing provides meaningful coverage beyond 2–3 examples.

---

### Property 1: Theme Toggle Round Trip

*For any* initial theme state (dark or light), applying the toggle function twice returns the application
to the original theme state.

**Validates: Requirements 1.2**

---

### Property 2: Theme Persistence

*For any* theme value written to `localStorage` by `useTheme`, reading `localStorage.getItem('theme')`
immediately afterwards returns the same value.

**Validates: Requirements 1.2**

---

### Property 3: Scroll Spy Active Section

*For any* list of page sections with varying heights and scroll positions, the scroll-spy function returns
the section whose top edge is closest to the top of the viewport while its bottom edge is below the
viewport midpoint; if no section satisfies that condition it returns the first section's id.

**Validates: Requirements 2.3**

---

### Property 4: Typewriter Timing Bounds

*For any* non-empty string of length N, the typewriter animation completes in no fewer than `N × 50 ms`
and no more than `N × 80 ms` of elapsed time.

**Validates: Requirements 3.2**

---

### Property 5: Count-Up Ends at Target

*For any* non-negative integer target T, the count-up animation starts at 0 and its final emitted value
equals T.

**Validates: Requirements 3.3**

---

### Property 6: Project Filter Completeness and Soundness

*For any* non-empty array of projects and any technology tag, the result of `filterProjects(projects, tag)`
contains only projects whose `techStack` array includes that tag, and contains every project from the
input whose `techStack` includes that tag.

**Validates: Requirements 5.2**

---

### Property 7: Project Search Soundness

*For any* array of projects and any non-empty query string, the result of `searchProjects(projects, query)`
contains only projects where the title or short description contains the query string
(case-insensitive), and no matching project is excluded from the result.

**Validates: Requirements 5.3**

---

### Property 8: Experience Filter Partitions Correctly

*For any* array of timeline entries containing a mix of `'work'` and `'education'` types, filtering by
`'work'` returns only entries with `type === 'work'`, filtering by `'education'` returns only entries
with `type === 'education'`, and filtering by `'all'` returns the original array unchanged.

**Validates: Requirements 6.3**

---

### Property 9: Skill Grouping Preserves All Skills

*For any* non-empty array of skills, `groupSkillsByCategory(skills)` produces a partition where every
skill from the input appears in exactly one group, and the union of all groups equals the input set.

**Validates: Requirements 7.1**

---

### Property 10: Reading Time Calculation

*For any* string of content, `calculateReadingTime(content)` returns
`Math.max(1, Math.ceil(wordCount / 200))` where `wordCount` is the number of whitespace-separated
non-empty tokens in the content.

**Validates: Requirements 9.1**

---

### Property 11: Contact Form Validation — Field Constraint Enforcement

*For any* contact form submission object, `validateContactForm(payload)` returns an error for the `name`
field if and only if `name` is empty or longer than 100 characters; an error for `email` if and only if
it is not a valid RFC 5322 email address; an error for `subject` if and only if it is empty or longer
than 150 characters; an error for `message` if and only if its length is outside the range [20, 2000];
and no error for any field that satisfies its constraint.

**Validates: Requirements 11.1, 11.5**

---

### Property 12: API Validation Pipeline — 422 on Invalid Body

*For any* POST `/api/contact` request body that fails the Zod schema, the API returns HTTP 422 and the
response body contains a `fields` object with at least one entry identifying the failing field.

**Validates: Requirements 13.2, 13.6**

---

### Property 13: GitHub Cache Hit Within TTL

*For any* cached GitHub API response and any subsequent request made within 60 minutes of the cache
entry's `fetchedAt` timestamp, the cache module returns the stored data without making a new outbound
HTTP request to the GitHub API.

**Validates: Requirements 14.2**

---

### Property 14: Command Palette Filter Soundness

*For any* array of page items and any non-empty query string, `filterPaletteItems(items, query)` returns
only items whose label contains the query string (case-insensitive), and includes every item whose label
matches.

**Validates: Requirements 17.2**

---

### Property 15: Command Palette Keyboard Navigation Wrapping

*For any* list of N items (N ≥ 2), navigating "down" when the current selection is the last item (index
N−1) wraps to the first item (index 0); navigating "up" when the current selection is the first item
(index 0) wraps to the last item (index N−1).

**Validates: Requirements 17.4**

---

### Property 16: Konami Code State Machine

*For any* sequence of keyboard events, the Konami code state machine fires the activation callback if
and only if the last 10 events in the sequence match the canonical sequence
[ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, KeyB, KeyA]
exactly.

**Validates: Requirements 20.1**


---

## Error Handling

### Frontend Error Boundaries

Each page segment is wrapped in a Next.js `error.tsx` boundary that renders a themed error card with a
"Try again" button and a link home. The `not-found.tsx` handler covers 404s globally.

### API Error Response Contract

All errors from the Express API follow this shape:

```json
{
  "error": {
    "message": "Human-readable description",
    "fields": { "email": ["Must be a valid email address"] }
  }
}
```

`fields` is only present for 422 validation errors.

### Database Failure Handling

| Scenario | API Behaviour | Frontend Behaviour |
|----------|--------------|-------------------|
| Query fails | HTTP 500 + log | Error boundary or "unavailable" message |
| Connection lost at startup | HTTP 503 on all requests + log | Entire API returns 503; frontend shows maintenance message |
| No rows returned | HTTP 200 `{ data: [] }` | Empty-state UI (e.g., "No projects found") |

### GitHub API Failure Handling

| Scenario | Behaviour |
|----------|----------|
| API error, cache exists | Return stale cached data |
| API error, no cache | HTTP 503 from Express; frontend renders "GitHub stats unavailable" in the component, page continues rendering |

### Email Dispatch Failure

If Resend/Formspree returns an error after the `contact_messages` row has been inserted, the API returns
HTTP 502. The `email_sent` column remains `0` so the message can be retried or viewed in the database.
The frontend retains form field values and shows an error toast prompting resubmission.

### PDF Download Failure

If `public/resume.pdf` is missing at download time, the `<a href>` will result in a 404 from the CDN.
The frontend detects this via a `fetch` HEAD request before triggering the download link; on failure it
shows an inline error message without navigating away.


---

## Testing Strategy

### Dual Testing Approach

Unit and property tests run with **Vitest** (fast, TypeScript-native). Component tests use
**React Testing Library** + Vitest. Property-based tests use **fast-check** (TypeScript-first PBT library).
End-to-end tests use **Playwright**.

### Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: { provider: 'v8', threshold: { lines: 80 } },
  },
});
```

### Property-Based Test Configuration

All property tests run a minimum of **100 iterations** via fast-check's `fc.assert(fc.property(...))`.
Higher iteration counts (500) are used for pure functions with cheap execution.

Each property test is tagged with a comment referencing the design property:

```typescript
// Feature: developer-portfolio-cv, Property 6: Project filter completeness and soundness
it('filterProjects — completeness and soundness', () => {
  fc.assert(
    fc.property(fc.array(arbitraryProject()), fc.string({ minLength: 1 }), (projects, tag) => {
      const result = filterProjects(projects, tag);
      return result.every(p => p.techStack.includes(tag)) &&
             projects.filter(p => p.techStack.includes(tag)).length === result.length;
    }),
    { numRuns: 500 }
  );
});
```

### Unit Tests (Example-Based)

Focus areas for example-based unit tests:

- Navbar collapse/open behaviour at specific viewport widths
- Hover animation CSS class application on project cards
- Theme toggle `data-theme` attribute update on `<html>`
- WCAG contrast ratio checks for each neon token pair
- MDX render output for specific fixtures (code blocks, callouts)
- DNS/TTL: Analytics suppressed when `navigator.doNotTrack === '1'`
- Smooth-scroll duration is within 400–600 ms bounds

### Integration Tests

- Express API routes: database mock via `jest-mock-extended` or direct test DB
- Contact form pipeline: validate → insert → email dispatch mock → response assertions
- GitHub cache: cache miss triggers fetch; cache hit skips fetch; expired entry triggers refetch
- 404 route returns HTTP 404 for unknown slugs

### End-to-End Tests (Playwright)

| Scenario | Covered |
|----------|---------|
| Full page load and nav smoke test | All public routes render without JS errors |
| Contact form happy path | Form submits, success toast shown |
| Contact form validation | Invalid fields show inline errors, no submit |
| Command palette open/filter/navigate | Keyboard-driven navigation works end-to-end |
| Theme toggle persistence | Theme persists across page reload |
| Konami code activation | Easter egg overlay appears |
| 404 page | Unknown route shows "Signal Lost" page |

### Property Tests — Library and Tagging

**Library**: `fast-check` v3 (TypeScript, runs in Vitest)

**Tag format**: `// Feature: developer-portfolio-cv, Property {N}: {property_text}`

**Minimum iterations**: 100 (pure functions: 500)

Properties to implement as fast-check tests:

| # | Function under test | fast-check arbitrary |
|---|--------------------|--------------------|
| 1 | `useTheme` toggle | `fc.constantFrom('dark', 'light')` |
| 2 | `localStorage` persistence | `fc.constantFrom('dark', 'light')` |
| 3 | `getActiveSection` | `fc.array(arbitrarySection(), { minLength: 1 })` |
| 4 | `typewriterDuration` | `fc.string({ minLength: 1, maxLength: 200 })` |
| 5 | `countUp` final value | `fc.nat({ max: 100_000 })` |
| 6 | `filterProjects` | `fc.array(arbitraryProject())`, `fc.string()` |
| 7 | `searchProjects` | `fc.array(arbitraryProject())`, `fc.string()` |
| 8 | `filterExperience` | `fc.array(arbitraryEntry())` |
| 9 | `groupSkillsByCategory` | `fc.array(arbitrarySkill(), { minLength: 1 })` |
| 10 | `calculateReadingTime` | `fc.string()` |
| 11 | `validateContactForm` | `fc.record(arbitraryContactPayload())` |
| 12 | `POST /api/contact` (mocked DB) | `fc.record(arbitraryContactPayload())` |
| 13 | `GitHubCache.get` | `fc.record(arbitraryGitHubResponse())`, `fc.nat()` (elapsed ms) |
| 14 | `filterPaletteItems` | `fc.array(arbitraryPageItem())`, `fc.string()` |
| 15 | `paletteNavReducer` | `fc.array(arbitraryPageItem(), { minLength: 2 })` |
| 16 | `konamiReducer` | `fc.array(fc.string(), { maxLength: 20 })` |

