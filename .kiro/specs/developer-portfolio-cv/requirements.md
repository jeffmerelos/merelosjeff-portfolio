# Requirements Document

## Introduction

A full-stack personal developer portfolio and online CV web application with a neon cyber-tech aesthetic. The application showcases work history, projects, skills, certifications, and a blog, while providing a downloadable resume and a contact form. It is built on Next.js (frontend) and Node.js/Express (backend API), persists data in MySQL, is styled with Tailwind CSS and a CSS custom-property neon token system, and is animated with Framer Motion and GSAP/ScrollTrigger.

The visual theme uses a deep void background with neon pink, violet, and blue accents, Chakra Petch / Rajdhani display fonts, Inter body text, and JetBrains Mono for code and metadata. All pages must meet WCAG AA accessibility standards and be fully responsive across desktop (≥1200 px), tablet (768–1199 px), and mobile (<768 px) viewports.

---

## Glossary

- **Application**: The full-stack developer portfolio and online CV web application.
- **Backend_API**: The Node.js/Express REST API that serves data from the MySQL database.
- **CMS**: Content management system or MDX-driven content layer used for blog posts and project case studies.
- **Command_Palette**: The ⌘K / Ctrl+K terminal-style launcher overlay for keyboard-based navigation.
- **Custom_Cursor**: The custom glowing dot and trailing ring cursor rendered on pointer devices.
- **Database**: The MySQL database named `cv`, managed via XAMPP.
- **Email_Service**: Formspree or Resend integration used to deliver contact form submissions.
- **GitHub_API**: The public GitHub REST API used to fetch live repository statistics and pinned repositories.
- **Hero**: The full-viewport landing section of the Home page featuring the animated developer name.
- **MDX**: Markdown with embedded JSX components, used for blog posts and project case studies.
- **Navbar**: The persistent site-wide navigation bar with scroll-spy and dark/light mode toggle.
- **Neon_Token_System**: The CSS custom-property color palette (`--bg-void`, `--bg-panel`, `--neon-pink`, `--neon-violet`, `--neon-blue`, `--text-primary`, `--text-muted`, `--line`) applied globally.
- **Page_Transition**: The route-change animation (cross-fade + slight scale) applied between all Next.js pages.
- **PDF_Resume**: The downloadable, print-optimized PDF version of the resume/CV.
- **Particle_Background**: The mouse-reactive animated grid / particle canvas rendered on applicable pages.
- **Project**: A portfolio item with a title, description, tech stack, screenshots, and a slug-routed case-study page.
- **Scroll_Reveal**: The fade + slide-up animation (24 px) triggered when a section enters the viewport.
- **Skill**: A categorised proficiency entry visualised as a bar, radar chart segment, or constellation node.
- **Terminal_Effect**: The typewriter-style animated intro line rendered in the Hero section.
- **Timeline_Entry**: A single work experience or education record rendered on the Experience page.
- **Visitor**: Any person accessing the Application via a web browser.

---

## Requirements

### Requirement 1: Neon Token System and Global Theming

**User Story:** As a Visitor, I want a cohesive neon cyber-tech visual theme, so that the portfolio has a distinctive, memorable aesthetic.

#### Acceptance Criteria

1. THE Application SHALL define CSS custom properties for the Neon_Token_System — `--bg-void: #0A0A0F`, `--bg-panel: #12121A`, `--neon-pink: #FF1B6B`, `--neon-violet: #9D4EDD`, `--neon-blue: #4EA8FF`, `--text-primary: #F5F5F7`, `--text-muted: #9A9AA5`, `--line: #2A2A35` — and apply them as the default (dark) theme across all pages.
2. WHEN the Visitor activates the dark/light mode toggle, THE Application SHALL switch between the dark neon theme and a light theme without a full page reload, persist the selected mode in `localStorage`, and the light theme SHALL define overrides for all eight Neon_Token_System tokens.
3. WHEN the page loads, THE Application SHALL load Chakra Petch or Rajdhani as the display font for headings, Inter as the body font, and JetBrains Mono as the code and metadata font, with appropriate generic fallback stacks (sans-serif, monospace) if any font fails to load.
4. WHILE the Visitor has `prefers-reduced-motion: reduce` set in their OS, THE Application SHALL disable all CSS transitions, CSS animations, and JavaScript-driven animations site-wide, except for focus indicators and error state reveals essential to user comprehension.
5. THE Application SHALL meet WCAG AA colour contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text) in both dark and light themes.

---

### Requirement 2: Responsive Layout and Navigation

**User Story:** As a Visitor, I want the Application to look correct on any device, so that I can browse it comfortably on desktop, tablet, or mobile.

#### Acceptance Criteria

1. THE Application SHALL render a responsive layout that adapts to desktop (≥1200 px), tablet (768–1199 px), and mobile (<768 px) viewport widths using Tailwind CSS breakpoints.
2. THE Navbar SHALL appear as a fixed horizontal bar on desktop; on viewports narrower than 768 px it SHALL collapse to a hamburger button that, when clicked, opens a slide-in drawer, and tapping any nav link inside the drawer SHALL also close the drawer.
3. WHEN the Visitor scrolls and a section occupies more than 50% of the viewport height, THE Navbar SHALL highlight the navigation link for that section; IF no section meets that condition, THE Navbar SHALL highlight the link for the first section.
4. WHEN the Visitor activates smooth-scroll navigation by clicking a nav link or in-page anchor, THE Application SHALL animate the scroll position to the target section within 400–600 ms.
5. THE Navbar SHALL include links to: Home, About, Projects, Experience, Skills, Certifications, Blog, Resume, and Contact.

---

### Requirement 3: Home / Landing Page

**User Story:** As a Visitor, I want an engaging landing page, so that I immediately understand who the developer is and can explore the portfolio.

#### Acceptance Criteria

1. WHEN the Home page loads, THE Hero SHALL display the developer's name with a glitch-in animation (chromatic-aberration offset) that completes within 2 seconds.
2. WHEN the Hero name animation completes, THE Hero SHALL begin rendering the Terminal_Effect typewriter intro line in JetBrains Mono font at a rate of one character per 50–80 ms.
3. WHEN the stats strip enters the viewport, THE Application SHALL animate at least three key metrics (years of experience, projects completed, certifications count) from 0 to their target values using count-up animations.
4. THE Home page SHALL include an "About Preview" section (minimum 2-sentence bio teaser and a "Read more" link), a "Featured Projects" section (minimum 3 project cards), a "Skills Snapshot" section, an "Experience Teaser" section (minimum 3 timeline items), a "Testimonials Carousel" section, and a CTA band above the footer.
5. WHEN the Visitor hovers over a Featured Project card, THE Application SHALL apply a `translateY(-6px)` lift and a neon border glow within 200 ms.
6. WHEN the Home page loads, THE Application SHALL render a Particle_Background canvas; WHILE the Visitor moves the mouse, particles within 150 px of the cursor SHALL shift position proportionally to cursor velocity.

---

### Requirement 4: About Page (`/about`)

**User Story:** As a Visitor, I want a detailed about page, so that I can learn about the developer's background, interests, and tools.

#### Acceptance Criteria

1. THE Application SHALL render an extended bio section (minimum 100 words) with a portrait image that displays a visible neon glow effect on all four sides of the image border.
2. THE Application SHALL render a "Beyond Code" section describing at least three personal interests outside of software development.
3. THE Application SHALL render a "Tools & Setup" section listing at least four items, grouped into hardware and software categories.
4. THE Application SHALL render a "Fun Facts" section with at least three interesting facts about the developer.
5. WHEN any content section on the About page becomes at least 20% visible in the viewport during scroll, THE Application SHALL trigger a Scroll_Reveal animation (fade + slide-up 24 px).

---

### Requirement 5: Projects Page (`/projects`) and Project Case Study (`/projects/[slug]`)

**User Story:** As a Visitor, I want to browse and filter portfolio projects, so that I can find work relevant to my interests.

#### Acceptance Criteria

1. THE Application SHALL display all projects in a responsive card grid, with each card showing the project name, short description (maximum 160 characters), technology badges, and a cover image; IF a cover image is unavailable, THE Application SHALL display a placeholder image.
2. THE Application SHALL provide a filter bar allowing the Visitor to filter projects by technology tag or category; filtering SHALL execute client-side without a page reload.
3. WHEN the Visitor types a query into the search input, THE Application SHALL filter visible project cards within 300 ms by matching the query against project titles and descriptions.
4. THE Application SHALL provide a toggle to switch the project list between grid view and list view.
5. WHEN the Visitor navigates to `/projects/[slug]`, THE Application SHALL render a case-study page containing: a hero banner, a problem → approach → solution narrative, technology stack badges, screenshots or demo embed, results and learnings, and previous/next project navigation (hidden at first/last project boundaries).
6. IF a requested project slug does not exist in the Database, THEN THE Backend_API SHALL return a 404 status and THE Application SHALL redirect the Visitor to the themed 404 page.
7. IF no projects match the active filter or search query, THEN THE Application SHALL display a "No projects found" message while preserving the filter/search state.

---

### Requirement 6: Experience Page (`/experience`)

**User Story:** As a Visitor, I want to see an animated timeline of work and education history, so that I can understand the developer's career progression.

#### Acceptance Criteria

1. THE Application SHALL render a vertical animated timeline where each Timeline_Entry shows: role/degree title, organisation name, date range, location, and a short description (maximum 200 characters).
2. WHEN the SVG path of the timeline enters the viewport during scroll, THE Application SHALL animate the path draw using GSAP/ScrollTrigger.
3. THE Application SHALL provide a filter toggle with three states — "Work", "Education", and "All" (default) — that filters entries client-side without a page reload and updates immediately.
4. THE Experience page SHALL include a CTA button labeled "View Resume" that navigates to `/resume`.
5. WHEN a Timeline_Entry becomes at least 20% visible in the viewport, THE Application SHALL trigger a Scroll_Reveal animation (fade + slide-up 24 px, ease cubic-bezier(0.16, 1, 0.3, 1)).
6. IF the active filter produces no matching entries, THE Application SHALL display a "No entries found" message without breaking the timeline structure.

---

### Requirement 7: Skills Page (`/skills`)

**User Story:** As a Visitor, I want to see the developer's technical skills visualised, so that I can quickly assess relevant expertise.

#### Acceptance Criteria

1. THE Application SHALL group skills sourced from the Database into named categories (e.g., Frontend, Backend, DevOps, Design), each with proficiency values as integers from 0 to 100, and render each group with individual proficiency bars.
2. WHEN the skills section enters the viewport, THE Application SHALL animate skill proficiency bars from 0% to their target values over 600 ms with ease-out easing.
3. WHEN the radar chart section enters the viewport, THE Application SHALL animate chart segments filling from 0 to their target values over 600 ms.
4. WHEN the page loads, THE Application SHALL render a constellation node graph where each node represents a skill and edges represent Database-stored skill relationships; IF no edge data exists for a skill, that node SHALL render without edges.
5. THE Application SHALL display each skill with an icon from Lucide-react or Phosphor Icons; IF no matching icon exists for a skill, THE Application SHALL render a generic placeholder icon.

---

### Requirement 8: Certifications Page (`/certifications`)

**User Story:** As a Visitor, I want to see the developer's certifications and achievements, so that I can verify qualifications.

#### Acceptance Criteria

1. THE Application SHALL render certifications and awards in a responsive card grid (3 columns on desktop, 2 on tablet, 1 on mobile), with each card showing the credential name, issuing organisation, issue date (formatted as "Mon YYYY"), and a badge image; IF a badge image is unavailable, THE Application SHALL display a placeholder image.
2. THE Application SHALL render a 52-week GitHub contribution heatmap calendar sourced from the GitHub_API on the Certifications page showing the most recent 52 weeks of contribution data.
3. IF the GitHub_API is unreachable or returns an error, THE Application SHALL display a fallback message in place of the contribution graph without breaking the page layout.
4. WHEN a certification card becomes at least 20% visible in the viewport, THE Application SHALL trigger a Scroll_Reveal animation.
5. WHERE a certification record includes a verification URL, THE Application SHALL display a "Verify" link that opens the credential in a new browser tab with `rel="noopener noreferrer"`.

---

### Requirement 9: Blog (`/blog`) and Blog Post (`/blog/[slug]`)

**User Story:** As a Visitor, I want to read the developer's blog posts, so that I can learn from their technical writing.

#### Acceptance Criteria

1. THE Application SHALL list all posts where `published: true`, each showing a cover image, title, excerpt (maximum 280 characters), estimated reading time (calculated at 200 wpm, rounded up to a minimum of 1 minute), publication date, and tag list.
2. THE Application SHALL render individual blog posts using MDX with support for: code blocks with syntax highlighting, inline code, blockquotes, images, and custom React components registered in the MDX component map.
3. THE Application SHALL render a Table of Contents sidebar on each blog post page; WHEN the Visitor scrolls, THE Application SHALL highlight the TOC entry for the topmost heading whose top edge is within the upper 30% of the viewport.
4. WHEN the Visitor selects a tag filter on the Blog page, THE Application SHALL filter the visible post list client-side to only posts containing that tag without a page reload.
5. IF no posts match the selected tag, THE Application SHALL display a "No posts found" message while preserving the tag selection.
6. IF a requested blog slug does not exist in the CMS, THEN THE Application SHALL redirect the Visitor to the themed 404 page.

---

### Requirement 10: Resume / CV Page (`/resume`)

**User Story:** As a Visitor, I want to view and download the developer's resume, so that I can consider them for opportunities.

#### Acceptance Criteria

1. WHEN the Visitor navigates to `/resume`, THE Application SHALL render an embedded, styled resume/CV populated from the `experiences`, `education`, `skills`, and `certifications` Database tables.
2. IF the Database is unavailable when the Resume page loads, THE Application SHALL display a graceful error message and a link to download the PDF_Resume directly.
3. WHEN the Visitor clicks "Download PDF", THE Application SHALL trigger a browser download of the PDF_Resume file.
4. IF the PDF_Resume file is unavailable at download time, THE Application SHALL display an inline error message and keep the Visitor on the current page.
5. THE Application SHALL include a `@media print` stylesheet that hides the Navbar, the Download PDF button, page backgrounds, and neon effects, and renders the resume content in black text on a white background.
6. THE Resume page SHALL include a CTA button labeled "Contact Me" that navigates to `/contact`.

---

### Requirement 11: Contact Page (`/contact`) and Contact Form

**User Story:** As a Visitor, I want to send a message to the developer, so that I can reach out for opportunities or collaboration.

#### Acceptance Criteria

1. THE Application SHALL render a contact form with fields: name (required, max 100 characters), email (required, RFC 5322 format validation), subject (required, max 150 characters), and message (required, 20–2000 characters).
2. WHEN the Visitor submits the contact form with valid data, THE Backend_API SHALL insert a `contact_messages` record into the Database and then dispatch the message via the Email_Service.
3. WHEN email delivery succeeds, THE Application SHALL display a success confirmation toast to the Visitor.
4. IF the Email_Service fails after a successful Database insert, THE Application SHALL display an error message to the Visitor, retain the form field values, and allow resubmission.
5. IF the Visitor submits the contact form with invalid or missing required fields, THE Application SHALL display inline field-level validation error messages without submitting the form.
6. THE Contact page SHALL display the developer's email address and social media profile links.
7. THE Application SHALL implement spam protection on the contact form via a hidden honeypot field or CAPTCHA that is not visible to non-automated visitors.
8. WHEN the Visitor clicks the email address displayed on the Contact page, THE Application SHALL copy the address to the clipboard and display a confirmation toast that auto-dismisses after 3 seconds.
9. WHERE a Calendly URL is provided in application configuration, THE Application SHALL render the Calendly booking widget on the Contact page.

---

### Requirement 12: Database Schema

**User Story:** As a developer, I want a well-structured MySQL database, so that all dynamic content is consistently persisted and queryable.

#### Acceptance Criteria

1. THE Database SHALL contain the following tables: `projects`, `experiences`, `education`, `skills`, `certifications`, `blog_posts`, `contact_messages`, and `testimonials`.
2. THE Database schema SHALL be defined in a file named `cv.sql` at the project root, including `CREATE TABLE` statements, column definitions, indexes, and at least one sample seed data row per table.
3. THE Backend_API SHALL connect to the Database named `cv` via a MySQL connection pool, with credentials stored in environment variables and never committed to source control.
4. IF a Database query fails, THEN THE Backend_API SHALL return an HTTP 5xx status code and a JSON error response, and SHALL log the error server-side.
5. IF the Database connection cannot be established at startup, THEN THE Backend_API SHALL return HTTP 503 with a JSON error response and log the connection failure server-side.

---

### Requirement 13: Backend API

**User Story:** As a developer, I want a clean REST API, so that the frontend can fetch and submit all dynamic data reliably.

#### Acceptance Criteria

1. THE Backend_API SHALL expose GET endpoints that return JSON arrays for: projects, experiences, education entries, skills, certifications, blog posts, and testimonials.
2. THE Backend_API SHALL expose a `POST /api/contact` endpoint that, in order: validates the request body against a defined schema, inserts a `contact_messages` record into the Database, then dispatches the message via the Email_Service.
3. WHEN the Backend_API receives a request for a resource that does not exist, THE Backend_API SHALL return a JSON response with HTTP status 404 and an error message field.
4. THE Backend_API SHALL include CORS configuration that restricts cross-origin requests to the known frontend origin(s).
5. THE Backend_API SHALL validate all incoming request bodies using a defined schema-validation library before processing.
6. IF request body validation fails, THEN THE Backend_API SHALL return HTTP 422 with a JSON response containing field-level error details.
7. IF the Email_Service dispatch fails after a successful Database insert, THEN THE Backend_API SHALL return HTTP 502 and retain the inserted `contact_messages` record in the Database.

---

### Requirement 14: GitHub API Integration

**User Story:** As a Visitor, I want to see the developer's live GitHub statistics, so that I can assess their open-source activity.

#### Acceptance Criteria

1. WHEN the Home page and the Projects page load, THE Application SHALL fetch up to 6 of the developer's pinned repositories from the GitHub_API and display each with: repository name, link, star count, fork count, and primary language.
2. THE Application SHALL cache GitHub_API responses server-side for a minimum of 60 minutes to avoid exceeding rate limits.
3. IF the GitHub_API is unreachable or returns an error and a cached response exists, THE Application SHALL display the cached data.
4. IF the GitHub_API is unreachable and no cache exists, THE Application SHALL display a "GitHub stats unavailable" message in the affected component without breaking page rendering.

---

### Requirement 15: Animations and Micro-interactions

**User Story:** As a Visitor, I want smooth, purposeful animations, so that the portfolio feels polished and professional.

#### Acceptance Criteria

1. WHEN a page loads, THE Application SHALL apply a staggered fade + slide-up animation to all above-the-fold elements with a 60–120 ms stagger per element and ease `cubic-bezier(0.16, 1, 0.3, 1)`.
2. WHEN a content section enters the viewport, THE Application SHALL trigger a Scroll_Reveal animation (fade + slide-up 24 px) over 500 ms with ease `cubic-bezier(0.16, 1, 0.3, 1)`.
3. WHILE the pointer is within 80 px of a magnetic CTA button, THE Application SHALL translate the button up to 12 px toward the cursor position; WHEN the pointer leaves the 80 px radius, THE button SHALL return to its original position.
4. WHEN a statistics section enters the viewport, THE Application SHALL animate statistic figures from 0 to their target values over 1000 ms with ease-out easing.
5. WHEN the page has been scroll-idle for more than 5 seconds, THE Application SHALL trigger a scanline sweep accent every 8 seconds on hero and section-divider elements.
6. WHEN a Next.js route change begins, THE Application SHALL apply a Page_Transition animation (cross-fade + scale from 0.98 to 1.0) over 200 ms.
7. WHILE the Visitor has `prefers-reduced-motion: reduce` set, THE Application SHALL skip all animations defined in criteria 1–6 and render elements in their final visible state.

---

### Requirement 16: Custom Cursor

**User Story:** As a Visitor on a pointer device, I want a custom cursor, so that the interaction feels immersive and on-brand.

#### Acceptance Criteria

1. WHEN the Application loads on a device where `pointer: fine` is true, THE Application SHALL hide the native browser cursor (via `cursor: none`) and render a Custom_Cursor: a 10 px neon dot (primary) in `--neon-pink` and a 32 px trailing ring (secondary) in `--neon-violet` that follows the pointer position.
2. WHEN the pointer hovers over an interactive element (link, button, or card), THE Custom_Cursor dot SHALL scale to 1.5× and the ring SHALL change colour to `--neon-blue` within 150 ms.
3. WHEN the Application loads on a device where `pointer: coarse` is true (touch device), THE Application SHALL not render the Custom_Cursor and SHALL leave the native cursor unchanged.
4. WHILE the Visitor has `prefers-reduced-motion: reduce` set, THE Application SHALL not render the Custom_Cursor and SHALL restore the default browser cursor.

---

### Requirement 17: Command Palette

**User Story:** As a power-user Visitor, I want a keyboard-driven command palette, so that I can navigate the portfolio quickly without using the mouse.

#### Acceptance Criteria

1. WHEN the Visitor presses ⌘K (macOS) or Ctrl+K (Windows/Linux), THE Command_Palette SHALL open as a full-screen modal overlay with a search input that receives focus automatically.
2. THE Command_Palette SHALL list all top-level pages; WHEN the Visitor types a query, THE Command_Palette SHALL filter the list to items whose titles match the query; IF no items match, THE Command_Palette SHALL display a "No results found" message.
3. WHEN the Visitor presses Escape, THE Command_Palette SHALL close without navigating.
4. WHEN the Command_Palette is open, THE Application SHALL trap keyboard focus inside the modal; arrow keys SHALL move selection up/down (wrapping at list boundaries), and Enter SHALL navigate to the selected item and close the palette.
5. THE Command_Palette SHALL be rendered as a `role="dialog"` element with `aria-label="Command palette"` announced to screen readers.
6. WHEN the Visitor selects a navigation item in the Command_Palette, THE Application SHALL navigate to the selected page and close the Command_Palette.

---

### Requirement 18: SEO and Meta

**User Story:** As a developer, I want strong SEO, so that the portfolio ranks well in search engines and shares cleanly on social media.

#### Acceptance Criteria

1. THE Application SHALL include per-page `<title>`, `<meta name="description">`, and canonical `<link rel="canonical">` tags; canonical URLs SHALL be absolute (including scheme and domain).
2. THE Application SHALL include Open Graph tags (`og:title`, `og:description`, `og:image` at 1200×630 px, `og:url`) and Twitter Card meta tags on every public page.
3. THE Application SHALL generate a `sitemap.xml` containing all public page URLs and a `robots.txt` referencing the sitemap URL automatically at build time.
4. THE Application SHALL include JSON-LD structured data using Schema.org types: `Person` on About and Home pages, `BlogPosting` on individual blog post pages, and `ItemList` on the Projects page.
5. THE Application SHALL export static or server-side-rendered HTML for all public pages so that search engine crawlers can read page content without executing JavaScript.

---

### Requirement 19: Analytics and Performance

**User Story:** As a developer, I want analytics and performance monitoring, so that I can understand visitor behaviour and maintain quality.

#### Acceptance Criteria

1. THE Application SHALL integrate Plausible Analytics or Google Analytics 4 and record page-view and custom events for all public pages.
2. IF the Visitor's browser sends a `DNT: 1` header or an equivalent opt-out signal, THEN THE Application SHALL suppress all analytics data collection for that session.
3. WHEN a page load completes, THE Application SHALL record Core Web Vitals (LCP, CLS, INP) and report them to the analytics platform.
4. THE Application SHALL achieve a Lighthouse performance score of ≥ 90 on the Home page when audited in mobile mode against the production build.
5. THE Application SHALL lazy-load all off-screen images using the Next.js `Image` component with explicit `width` and `height` attributes; informational images SHALL have non-empty `alt` text and decorative images SHALL use `alt=""`.

---

### Requirement 20: Easter Egg — Konami Code

**User Story:** As an inquisitive Visitor, I want a hidden easter egg, so that the portfolio rewards curiosity.

#### Acceptance Criteria

1. WHEN the Visitor enters the Konami code sequence (↑ ↑ ↓ ↓ ← → ← → B A) on any page, THE Application SHALL display a full-screen overlay with a neon particle burst animation and a hidden message; the overlay SHALL remain visible for 3–8 seconds.
2. THE Application SHALL not expose or hint at the easter egg in any rendered UI text, accessible labels, or tooltip attributes.
3. WHEN the easter egg overlay is active, the Visitor SHALL be able to dismiss it by pressing Escape or clicking outside the overlay.
4. WHEN the Visitor navigates to a different page, THE Application SHALL reset the Konami code sequence progress.

---

### Requirement 21: 404 Page (`/404`)

**User Story:** As a Visitor who reaches a non-existent URL, I want a themed error page, so that the experience remains cohesive.

#### Acceptance Criteria

1. WHEN the Visitor navigates to a URL that does not match any defined route, THE Application SHALL render the themed 404 page with a "Signal Lost" headline styled using `--bg-void` or `--bg-panel` as background and a neon accent token on the headline text.
2. THE 404 page SHALL include a keyboard-operable link labeled "Go Home" that navigates to `/`.
3. THE Application SHALL return HTTP status 404 for unmatched routes.
4. WHEN the 404 page loads, THE Application SHALL apply the standard page-load entrance animation defined in Requirement 15 criterion 1 to the page content.

---

### Requirement 22: Accessibility

**User Story:** As a Visitor using assistive technology, I want the Application to be accessible, so that I can use the portfolio regardless of disability.

#### Acceptance Criteria

1. THE Application SHALL provide `alt` text for all meaningful images that describes the image's purpose or content in plain language; decorative images SHALL use `alt=""`.
2. THE Application SHALL ensure all interactive elements are reachable via Tab key in a top-to-bottom, left-to-right reading sequence and operable via Enter or Space, with no keyboard traps outside intentional modal dialogs.
3. THE Application SHALL use semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`) on every page, and SHALL provide a visible keyboard focus indicator distinguishable from the unfocused state without relying on colour alone.
4. WHEN a toast notification is triggered, a modal is opened, or a route change completes, THE Application SHALL announce the nature of the change to screen readers using an ARIA live region or the appropriate ARIA role.
5. WHEN the Visitor submits the contact form with invalid or missing values, THE Application SHALL display descriptive error messages linked to their respective inputs via `aria-describedby`, and each input SHALL have an associated `<label>` element.

---

### Requirement 23: Hosting and Deployment

**User Story:** As a developer, I want a reliable deployment pipeline, so that the Application is publicly accessible and easy to update.

#### Acceptance Criteria

1. THE Application SHALL be deployable to Vercel or Netlify via a Git-connected CI/CD pipeline that automatically builds and deploys on push to the main branch.
2. THE Application SHALL store all environment-specific secrets (Database credentials, API keys, Email_Service tokens) in platform environment variables and SHALL NOT commit them to the repository.
3. THE Application SHALL serve all pages over HTTPS and SHALL redirect any HTTP requests to the equivalent HTTPS URL.
4. IF the build or deployment step fails, THEN the deployment platform SHALL block the release, keep the previous live version running, and send a notification to the developer's registered email or dashboard alert.
