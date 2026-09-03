# Design Document: Portfolio Admin Portal & Authentication System

## Overview

The Portfolio Admin Portal is a secure, feature-rich administrative interface that enables the portfolio owner to manage all content through a web-based dashboard. The system implements enterprise-grade security with mandatory Two-Factor Authentication (TOTP), comprehensive session management, audit logging, and content CRUD operations across all portfolio entities (projects, skills, experience, education, certifications, contact messages).

### Key Features

- **Security-First Authentication**: Username/password + mandatory TOTP 2FA with backup codes
- **Comprehensive Content Management**: Full CRUD operations for all portfolio entities
- **Contact Message Management**: View, filter, search, and manage contact form submissions
- **Audit Trail**: Complete activity logging for security monitoring and compliance
- **Session Management**: Secure session handling with device tracking and multi-session support
- **Responsive Admin UI**: Desktop and mobile-optimized interface with modern UX patterns

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router, TypeScript)
- React 18+ (Server Components + Client Components)
- Tailwind CSS for styling
- React Hook Form + Zod for validation
- Axios for API communication
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- Supabase PostgreSQL (existing database)
- express-validator for input validation
- express-rate-limit for rate limiting
- helmet for security headers
- morgan for logging

**Authentication & Security:**
- otplib (TOTP generation and verification)
- bcrypt (password hashing with cost factor 12)
- cookie-parser (secure session cookies)
- csurf or csrf-csrf (CSRF protection)
- uuid (session token generation)

**File Storage:**
- Supabase Storage (image uploads)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Public Portfolio │         │  Admin Portal     │          │
│  │  (Next.js SSR)   │         │  (Next.js SSR)   │          │
│  │  /               │         │  /admin-xyz      │          │
│  └──────────────────┘         └──────────────────┘          │
│         │                              │                      │
└─────────┼──────────────────────────────┼──────────────────────┘
          │                              │
          │ Public API                   │ Admin API
          │ (read-only)                  │ (authenticated)
          │                              │
┌─────────▼──────────────────────────────▼──────────────────────┐
│                   API GATEWAY / BACKEND                        │
│                  (Node.js + Express.js)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Security Middleware Stack                   │  │
│  │  • CORS        • Rate Limiting    • CSRF Protection     │  │
│  │  • Helmet      • Input Validation • Session Validation  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Auth Service │  │Content Manager│  │Contact Manager│        │
│  │ • Login      │  │ • Projects    │  │ • View        │        │
│  │ • 2FA        │  │ • Skills      │  │ • Filter      │        │
│  │ • Sessions   │  │ • Experience  │  │ • Search      │        │
│  │ • Audit      │  │ • Education   │  │ • Archive     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    DATA LAYER                                    │
│                                                                   │
│  ┌─────────────────────┐         ┌─────────────────────┐        │
│  │ Supabase PostgreSQL │         │  Supabase Storage   │        │
│  │ • Admin tables      │         │  • Profile images   │        │
│  │ • Content tables    │         │  • Project images   │        │
│  │ • Audit tables      │         │  • Certificates     │        │
│  └─────────────────────┘         └─────────────────────┘        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌────────┐                                              ┌────────┐
│ Admin  │                                              │ Server │
└───┬────┘                                              └───┬────┘
    │                                                       │
    │ 1. Navigate to /admin-xyz                            │
    │ ─────────────────────────────────────────────────────>
    │                                                       │
    │ 2. Render Login Page (if not authenticated)          │
    │ <─────────────────────────────────────────────────────
    │                                                       │
    │ 3. Submit username + password                        │
    │ ─────────────────────────────────────────────────────>
    │                          4. Verify credentials        │
    │                             (bcrypt compare)          │
    │                                                       │
    │ 5. Prompt for TOTP code                              │
    │ <─────────────────────────────────────────────────────
    │                                                       │
    │ 6. Submit TOTP code (or backup code)                 │
    │ ─────────────────────────────────────────────────────>
    │                          7. Verify TOTP               │
    │                             (otplib.verify)           │
    │                          8. Create session            │
    │                             (generate token)          │
    │                          9. Set HTTP-only cookie      │
    │                                                       │
    │ 10. Redirect to Dashboard + Set-Cookie               │
    │ <─────────────────────────────────────────────────────
    │                                                       │
    │ 11. Subsequent requests include session cookie       │
    │ ─────────────────────────────────────────────────────>
    │                          12. Validate session         │
    │                              (middleware)             │
    │                          13. Return protected data    │
    │ <─────────────────────────────────────────────────────
    │                                                       │
```

### Request Flow for Admin Operations

```
Client Request
     │
     ├──> Rate Limiter (100 req/min)
     │
     ├──> CORS Validation (allowed origins)
     │
     ├──> Helmet Security Headers
     │
     ├──> Session Validation Middleware
     │         ├──> Extract cookie token
     │         ├──> Query sessions table
     │         ├──> Check expiration
     │         ├──> Update last_activity_at
     │         └──> Attach admin_user to req.user
     │
     ├──> CSRF Token Validation (for POST/PUT/DELETE)
     │
     ├──> Input Validation (express-validator)
     │
     ├──> Route Handler
     │         ├──> Business logic
     │         ├──> Database operations
     │         └──> Audit logging
     │
     └──> Response
```

---

## Components and Interfaces

### Frontend Component Hierarchy

```
app/
├── (public)/                          # Public portfolio routes
│   ├── layout.tsx                     # Public layout
│   ├── page.tsx                       # Home page
│   ├── projects/
│   ├── about/
│   └── contact/
│
└── admin-xyz/                         # Admin portal (non-obvious route)
    ├── layout.tsx                     # Admin layout (separate from public)
    ├── (auth)/                        # Auth routes (no layout)
    │   ├── login/
    │   │   └── page.tsx              # Login form (username/password)
    │   ├── verify-2fa/
    │   │   └── page.tsx              # TOTP verification
    │   └── setup-2fa/
    │       └── page.tsx              # Initial 2FA setup with QR code
    │
    └── (dashboard)/                   # Protected dashboard routes
        ├── layout.tsx                 # Dashboard layout (sidebar + header)
        ├── page.tsx                   # Dashboard home (metrics)
        ├── profile/
        │   └── page.tsx              # Profile management
        ├── projects/
        │   ├── page.tsx              # Projects list
        │   ├── new/
        │   │   └── page.tsx          # Create project
        │   └── [slug]/
        │       └── edit/
        │           └── page.tsx      # Edit project
        ├── skills/
        │   └── page.tsx              # Skills management
        ├── experience/
        │   └── page.tsx              # Experience management
        ├── education/
        │   └── page.tsx              # Education management
        ├── certifications/
        │   └── page.tsx              # Certifications management
        ├── messages/
        │   ├── page.tsx              # Contact messages list
        │   └── [id]/
        │       └── page.tsx          # Message detail
        ├── activity/
        │   └── page.tsx              # Activity log
        └── settings/
            ├── page.tsx              # Settings home
            ├── security/
            │   └── page.tsx          # Password, 2FA, sessions
            └── backup/
                └── page.tsx          # Export/import data
```

### Key Frontend Components

#### Layout Components

**AdminLayout** (`app/admin-xyz/(dashboard)/layout.tsx`)
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}

// Responsibilities:
// - Session check (redirect to login if not authenticated)
// - Sidebar navigation with collapsible menu
// - Top header with user info and logout
// - Unread message badge
// - Mobile-responsive drawer
```

**AuthLayout** (`app/admin-xyz/(auth)/layout.tsx`)
```typescript
// Minimal layout for login/2FA pages
// - No sidebar/header
// - Centered card design
// - Redirect to dashboard if already authenticated
```

#### Authentication Components

**LoginForm** (Client Component)
```typescript
interface LoginFormData {
  username: string;
  password: string;
}

// Features:
// - React Hook Form + Zod validation
// - Error display (invalid credentials, rate limited)
// - Remember me checkbox (optional)
// - CSRF token included in submission
// - Loading state during submission
```

**TwoFactorVerifyForm** (Client Component)
```typescript
interface TwoFactorFormData {
  code: string; // 6-digit TOTP or backup code
}

// Features:
// - 6-digit code input with auto-focus
// - Toggle between TOTP and backup code
// - Countdown timer showing remaining time window
// - Failed attempt counter
// - Link to backup code entry
```

**TwoFactorSetupCard** (Client Component)
```typescript
interface TwoFactorSetupProps {
  secret: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

// Features:
// - Display QR code for scanning
// - Display manual entry key
// - Verification code input to confirm setup
// - Backup codes display (one-time view)
// - Download backup codes as text file
```

#### Dashboard Components

**DashboardMetrics** (Server Component)
```typescript
interface DashboardMetrics {
  projectCount: number;
  skillCount: number;
  unreadMessages: number;
  recentMessages: number; // last 7 days
  remainingBackupCodes: number;
  currentSession: SessionInfo;
  recentLoginAttempts: LoginAttempt[];
}

// Displays overview cards with metrics
// Auto-refreshes every 60 seconds (Client Component wrapper)
```

**DataTable** (Client Component)
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  sortable?: boolean;
  onRowClick?: (row: T) => void;
}

// Reusable table for projects, skills, messages, etc.
// Features: sort, filter, search, pagination
// Used across all list views
```

**FormDialog** (Client Component)
```typescript
interface FormDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
}

// Modal wrapper for create/edit forms
// Handles loading states and error display
```

#### Content Management Components

**ProjectForm** (Client Component)
```typescript
interface ProjectFormData {
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  problem?: string;
  approach?: string;
  solution?: string;
  results?: string;
  learnings?: string;
  coverImage?: File;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  status: string;
  role?: string;
  timeframe?: string;
  isFeatured: boolean;
  isPinned: boolean;
  technologies: number[]; // skill IDs
  additionalImages?: { file: File; caption: string }[];
}

// Features:
// - Multi-step form (basic info, details, images, technologies)
// - Rich text editor for long descriptions
// - Image upload with preview
// - Technology multi-select with search
// - Slug auto-generation from title
// - Validation with real-time feedback
```

**SkillForm** (Client Component)
```typescript
interface SkillFormData {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other';
  proficiency: number; // 1-100
  iconName?: string;
  color?: string;
  isFeatured: boolean;
  sortOrder: number;
}

// Features:
// - Icon picker component
// - Color picker for tag color
// - Proficiency slider (1-100)
// - Category dropdown
```

**MessageCard** (Server Component)
```typescript
interface MessageCardProps {
  message: ContactMessage;
  onMarkRead?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

// Display contact message with actions
// Shows read/unread status
// Email and name as clickable links
```

#### Security Components

**SessionManager** (Client Component)
```typescript
interface SessionInfo {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivityAt: string;
  isCurrent: boolean;
}

// Features:
// - List all active sessions
// - Show device/browser info
// - Highlight current session
// - Terminate individual sessions
// - "Logout from all devices" button
```

**ActivityLogTable** (Server Component with pagination)
```typescript
interface ActivityLogEntry {
  id: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Features:
// - Filterable by event type
// - Searchable by description
// - Date range filter
// - Pagination (20 per page)
// - CSV export
```

---

### Backend API Structure

```
backend/src/
├── server.js                          # Express app setup
├── config/
│   ├── database.js                    # Supabase client (existing)
│   └── auth.js                        # Auth configuration (NEW)
├── middleware/
│   ├── errorHandler.js                # Error handling (existing)
│   ├── adminAuth.js                   # Session validation (NEW)
│   ├── csrfProtection.js              # CSRF validation (NEW)
│   └── rateLimiter.js                 # Enhanced rate limiting (NEW)
├── routes/
│   ├── admin/
│   │   ├── auth.js                    # Auth endpoints (NEW)
│   │   ├── profile.js                 # Profile management (NEW)
│   │   ├── projects.js                # Project CRUD (NEW)
│   │   ├── skills.js                  # Skills CRUD (NEW)
│   │   ├── experience.js              # Experience CRUD (NEW)
│   │   ├── education.js               # Education CRUD (NEW)
│   │   ├── certifications.js          # Certifications CRUD (NEW)
│   │   ├── messages.js                # Contact message management (NEW)
│   │   ├── activity.js                # Activity log (NEW)
│   │   └── backup.js                  # Export/import (NEW)
│   ├── profile.js                     # Public profile (existing)
│   ├── projects.js                    # Public projects (existing)
│   ├── skills.js                      # Public skills (existing)
│   └── ...                            # Other public routes (existing)
├── services/
│   ├── authService.js                 # Authentication logic (NEW)
│   ├── totpService.js                 # TOTP generation/verification (NEW)
│   ├── sessionService.js              # Session management (NEW)
│   ├── auditService.js                # Audit logging (NEW)
│   ├── uploadService.js               # File upload handling (NEW)
│   └── backupService.js               # Export/import logic (NEW)
└── utils/
    ├── validation.js                  # Validation schemas (NEW)
    ├── crypto.js                      # Encryption utilities (NEW)
    └── helpers.js                     # General helpers (NEW)
```

### API Endpoints

#### Authentication Endpoints

**POST /api/admin/auth/login**
```typescript
Request Body:
{
  username: string;
  password: string;
  csrfToken: string;
}

Response (200 OK):
{
  success: true;
  requiresTwoFactor: true;
  tempToken: string; // Short-lived token for 2FA step
}

Response (401 Unauthorized):
{
  success: false;
  error: "Invalid credentials"
}

Response (429 Too Many Requests):
{
  success: false;
  error: "Too many login attempts. Try again in 15 minutes."
}
```

**POST /api/admin/auth/verify-2fa**
```typescript
Request Body:
{
  tempToken: string;
  code: string; // 6-digit TOTP or backup code
  csrfToken: string;
}

Response (200 OK):
{
  success: true;
  user: {
    id: number;
    username: string;
    email: string;
  }
}
// Sets HTTP-only session cookie

Response (401 Unauthorized):
{
  success: false;
  error: "Invalid verification code",
  remainingAttempts: 2
}
```

**POST /api/admin/auth/logout**
```typescript
Request Headers:
Cookie: session_token=xxx
X-CSRF-Token: xxx

Response (200 OK):
{
  success: true;
  message: "Logged out successfully"
}
// Clears session cookie
```

**POST /api/admin/auth/logout-all**
```typescript
Request Headers:
Cookie: session_token=xxx
X-CSRF-Token: xxx

Response (200 OK):
{
  success: true;
  message: "All sessions terminated"
}
```

**GET /api/admin/auth/me**
```typescript
Request Headers:
Cookie: session_token=xxx

Response (200 OK):
{
  success: true;
  user: {
    id: number;
    username: string;
    email: string;
    totpEnabled: boolean;
    remainingBackupCodes: number;
  }
}
```

**GET /api/admin/auth/sessions**
```typescript
Response (200 OK):
{
  success: true;
  sessions: [
    {
      id: string;
      ipAddress: string;
      userAgent: string;
      createdAt: string;
      lastActivityAt: string;
      isCurrent: boolean;
    }
  ]
}
```

**DELETE /api/admin/auth/sessions/:sessionId**
```typescript
Response (200 OK):
{
  success: true;
  message: "Session terminated"
}
```

#### 2FA Setup Endpoints

**POST /api/admin/auth/2fa/setup**
```typescript
Request Headers:
Cookie: session_token=xxx
X-CSRF-Token: xxx

Response (200 OK):
{
  success: true;
  secret: string; // Base32 encoded secret
  qrCode: string; // Data URL for QR code
  manualEntryKey: string; // Human-readable secret
}
```

**POST /api/admin/auth/2fa/enable**
```typescript
Request Body:
{
  code: string; // Verification code
  csrfToken: string;
}

Response (200 OK):
{
  success: true;
  backupCodes: string[]; // 10 codes (shown only once)
}
```

**POST /api/admin/auth/2fa/disable**
```typescript
Request Body:
{
  password: string; // Require password to disable
  csrfToken: string;
}

Response (200 OK):
{
  success: true;
  message: "2FA disabled"
}
```

**POST /api/admin/auth/2fa/regenerate-backup-codes**
```typescript
Request Body:
{
  password: string;
  csrfToken: string;
}

Response (200 OK):
{
  success: true;
  backupCodes: string[]; // 10 new codes
}
```

#### Content Management Endpoints

**Projects**

```typescript
// List all projects (admin view with unpublished)
GET /api/admin/projects
Query: ?category=web&search=portfolio&page=1&limit=20

// Get single project
GET /api/admin/projects/:slug

// Create project
POST /api/admin/projects
Body: ProjectFormData (multipart/form-data for images)

// Update project
PUT /api/admin/projects/:slug
Body: Partial<ProjectFormData>

// Delete project
DELETE /api/admin/projects/:slug

// Reorder projects
PUT /api/admin/projects/reorder
Body: { projectIds: number[] }

// Upload project image
POST /api/admin/projects/:slug/images
Body: FormData with image file

// Delete project image
DELETE /api/admin/projects/:slug/images/:imageId
```

**Skills**

```typescript
GET /api/admin/skills
POST /api/admin/skills
PUT /api/admin/skills/:id
DELETE /api/admin/skills/:id
PUT /api/admin/skills/reorder
```

**Experience**

```typescript
GET /api/admin/experience
POST /api/admin/experience
PUT /api/admin/experience/:id
DELETE /api/admin/experience/:id
```

**Education**

```typescript
GET /api/admin/education
POST /api/admin/education
PUT /api/admin/education/:id
DELETE /api/admin/education/:id
```

**Certifications**

```typescript
GET /api/admin/certifications
POST /api/admin/certifications
PUT /api/admin/certifications/:id
DELETE /api/admin/certifications/:id
```

#### Contact Messages

```typescript
// List messages with filters
GET /api/admin/messages
Query: ?status=unread&search=john&page=1&limit=20&from=2024-01-01&to=2024-12-31

// Get single message (marks as read)
GET /api/admin/messages/:id

// Mark as read/unread
PATCH /api/admin/messages/:id/read
Body: { isRead: boolean }

// Archive message
PATCH /api/admin/messages/:id/archive

// Delete message
DELETE /api/admin/messages/:id

// Bulk operations
POST /api/admin/messages/bulk
Body: {
  action: 'read' | 'unread' | 'archive' | 'delete';
  messageIds: number[];
}

// Export to CSV
GET /api/admin/messages/export
Query: ?status=unread&from=2024-01-01
```

#### Activity Log

```typescript
GET /api/admin/activity
Query: ?eventType=login&entityType=project&page=1&limit=20&from=2024-01-01

GET /api/admin/activity/export
```

#### Profile Management

```typescript
GET /api/admin/profile
PUT /api/admin/profile
Body: ProfileFormData

POST /api/admin/profile/avatar
Body: FormData with image file

DELETE /api/admin/profile/avatar
```

#### Settings

```typescript
// Change password
POST /api/admin/settings/change-password
Body: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  csrfToken: string;
}

// Export all content
GET /api/admin/backup/export

// Import content
POST /api/admin/backup/import
Body: FormData with JSON file
```

---

## Data Models

### Database Schema

#### Admin Users Table

```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret_encrypted TEXT, -- Encrypted TOTP secret
  totp_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

**Notes:**
- `password_hash`: Bcrypt hash with cost factor 12
- `totp_secret_encrypted`: AES-256 encrypted TOTP secret (stored as base64)
- Only one admin user initially (can be extended for multi-admin)

#### Backup Codes Table

```sql
CREATE TABLE backup_codes (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  code_hash VARCHAR(255) NOT NULL, -- Bcrypt hash of the code
  used_at TIMESTAMPTZ, -- NULL if unused
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backup_codes_admin_user_id ON backup_codes(admin_user_id);
CREATE INDEX idx_backup_codes_used_at ON backup_codes(used_at);
```

**Notes:**
- Each admin user has 10 backup codes
- Codes are hashed before storage
- `used_at` is set when code is used for authentication
- Regenerating codes deletes old ones and creates new ones

#### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed session token
  ip_address VARCHAR(45) NOT NULL, -- IPv4 or IPv6
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_admin_user_id ON sessions(admin_user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Notes:**
- `token_hash`: SHA-256 hash of the session token (token stored in HTTP-only cookie)
- Session expires after 8 hours from creation or 30 minutes of inactivity
- `last_activity_at` updated on each authenticated request
- Maximum 3 concurrent sessions per user (oldest terminated when exceeded)

#### Login Attempts Table

```sql
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50), -- May be invalid username
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100), -- 'invalid_credentials', 'rate_limited', '2fa_failed', etc.
  totp_required BOOLEAN DEFAULT false,
  totp_success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX idx_login_attempts_username ON login_attempts(username);
```

**Notes:**
- Records both successful and failed login attempts
- Used for rate limiting and security monitoring
- `totp_required` indicates if 2FA was required
- `totp_success` indicates if 2FA verification succeeded (NULL if not required)

#### Activity Logs Table

```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'password_change', '2fa_enabled', etc.
  entity_type VARCHAR(50), -- 'project', 'skill', 'experience', 'message', etc. (NULL for non-entity events)
  entity_id VARCHAR(100), -- ID or slug of the entity
  description TEXT NOT NULL, -- Human-readable description
  metadata JSONB, -- Additional structured data (e.g., changed fields)
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_admin_user_id ON activity_logs(admin_user_id);
CREATE INDEX idx_activity_logs_event_type ON activity_logs(event_type);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

**Notes:**
- Comprehensive audit trail for all admin actions
- `metadata` stores additional context (e.g., `{"changedFields": ["title", "description"]}`)
- Retained for at least 90 days (can be extended)
- Used for security monitoring and compliance

#### Contact Messages Table (Modified)

```sql
-- Modify existing contact_messages table to add admin fields
ALTER TABLE contact_messages
  ADD COLUMN is_read BOOLEAN DEFAULT false,
  ADD COLUMN is_archived BOOLEAN DEFAULT false,
  ADD COLUMN read_at TIMESTAMPTZ,
  ADD COLUMN read_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL;

CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_is_archived ON contact_messages(is_archived);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
```

**Notes:**
- Extends existing `contact_messages` table
- `is_read`: Message has been viewed by admin
- `is_archived`: Message hidden from default view
- `read_by`: Which admin user read the message (for multi-admin support)

#### Existing Tables (Reference)

The following tables already exist and will be managed via admin portal:

- `profile`: Admin can update via profile management
- `projects`: Full CRUD via projects management
- `project_images`: Managed via project edit form
- `project_technologies`: Managed via project edit form
- `skills`: Full CRUD via skills management
- `experience`: Full CRUD via experience management
- `certifications`: Full CRUD via certifications management
- `testimonials`: Full CRUD via testimonials management (if needed)
- `blog_posts`: Full CRUD via blog management (if needed)

---

### TypeScript Interfaces

#### Authentication Types

```typescript
// Admin user
interface AdminUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  totpSecretEncrypted: string | null;
  totpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Session
interface Session {
  id: string;
  adminUserId: number;
  tokenHash: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

// Login attempt
interface LoginAttempt {
  id: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  totpRequired: boolean;
  totpSuccess?: boolean;
  createdAt: string;
}

// Activity log
interface ActivityLog {
  id: number;
  adminUserId: number;
  eventType: string;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Backup code
interface BackupCode {
  id: number;
  adminUserId: number;
  codeHash: string;
  usedAt?: string;
  createdAt: string;
}
```

#### Content Types

```typescript
// Project (admin view includes all fields)
interface Project {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  problem?: string;
  approach?: string;
  solution?: string;
  results?: string;
  learnings?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  status: string;
  role?: string;
  timeframe?: string;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  technologies?: Skill[]; // Associated skills
  images?: ProjectImage[];
}

interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

// Skill
interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
  color?: string;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string;
}

// Experience
interface Experience {
  id: number;
  type: 'work' | 'education';
  title: string;
  organization: string;
  organizationLogoUrl?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  sortOrder: number;
  createdAt: string;
}

// Certification
interface Certification {
  id: number;
  title: string;
  issuingOrg: string;
  orgLogoUrl?: string;
  badgeImageUrl?: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  category: string;
  sortOrder: number;
  createdAt: string;
}

// Contact message (with admin fields)
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  ipAddress?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  readAt?: string;
  readBy?: number;
}
```

---

## Error Handling

### Backend Error Handling

```typescript
// Error types
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

// Error response format
interface ErrorResponse {
  success: false;
  error: string;
  type: ErrorType;
  details?: any; // Validation errors, etc.
}

// Global error handler middleware
app.use((err, req, res, next) => {
  // Log error
  auditService.logError(err, req);
  
  // CSRF errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token',
      type: ErrorType.AUTHORIZATION_ERROR,
    });
  }
  
  // Validation errors (express-validator)
  if (err.array) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      type: ErrorType.VALIDATION_ERROR,
      details: err.array(),
    });
  }
  
  // Rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      type: ErrorType.RATE_LIMIT_ERROR,
    });
  }
  
  // Default server error
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message,
    type: ErrorType.SERVER_ERROR,
  });
});
```

### Frontend Error Handling

```typescript
// API client error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Session expired
      if (status === 401 && router.pathname.startsWith('/admin-xyz')) {
        toast.error('Session expired. Please log in again.');
        router.push('/admin-xyz/login');
        return Promise.reject(error);
      }
      
      // CSRF error
      if (status === 403 && data.type === 'AUTHORIZATION_ERROR') {
        toast.error('Security token expired. Please refresh the page.');
        return Promise.reject(error);
      }
      
      // Validation errors
      if (status === 400 && data.type === 'VALIDATION_ERROR') {
        // Form will display field-specific errors
        return Promise.reject(error);
      }
      
      // Rate limit
      if (status === 429) {
        toast.error('Too many requests. Please try again later.');
        return Promise.reject(error);
      }
      
      // Generic error
      toast.error(data.error || 'An error occurred');
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Form error handling with React Hook Form
const onSubmit = async (data) => {
  try {
    setLoading(true);
    await apiCall(data);
    toast.success('Operation successful');
    router.push('/admin-xyz/dashboard');
  } catch (error) {
    if (error.response?.status === 400) {
      // Map server validation errors to form fields
      const serverErrors = error.response.data.details;
      serverErrors.forEach((err) => {
        setError(err.path, { message: err.msg });
      });
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Testing Strategy

### Unit Tests

**Backend Services:**
- `authService.verifyPassword()`: Test bcrypt comparison
- `totpService.generateSecret()`: Test secret generation
- `totpService.verifyToken()`: Test TOTP verification with time windows
- `sessionService.createSession()`: Test session creation and token generation
- `sessionService.validateSession()`: Test session validation and expiration
- `auditService.logActivity()`: Test audit log creation

**Frontend Components:**
- `LoginForm`: Test validation, submission, error display
- `TwoFactorVerifyForm`: Test code input, validation
- `DataTable`: Test sorting, filtering, pagination
- `ProjectForm`: Test multi-step form, validation

### Integration Tests

**Authentication Flow:**
- Complete login flow (credentials → 2FA → dashboard)
- Failed login attempts and rate limiting
- Session creation and validation
- Logout and session termination

**Content Management:**
- Create, read, update, delete projects
- Upload images to Supabase Storage
- Associate technologies with projects
- Reorder items

**Contact Messages:**
- View messages and mark as read
- Filter and search messages
- Bulk operations

### Property-Based Tests

Property-based testing is NOT applicable for this feature. The admin portal involves:
- Infrastructure (authentication, session management)
- CRUD operations with external database
- UI interactions and form submissions
- File uploads to cloud storage

These are better tested with:
- Example-based unit tests for validation logic
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Manual testing for UI/UX

### Security Testing

- Test rate limiting enforcement
- Test CSRF protection
- Test session expiration and timeout
- Test SQL injection prevention (parameterized queries)
- Test XSS prevention (input sanitization)
- Penetration testing on authentication flow

---

## Deployment Considerations

### Environment Variables

**Backend (.env):**
```bash
# Existing
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourportfolio.com

# New for admin portal
ADMIN_ROUTE_PATH=admin-xyz # Configurable non-obvious route
SESSION_SECRET=xxx # For signing session cookies
CSRF_SECRET=xxx # For CSRF tokens
ENCRYPTION_KEY=xxx # AES-256 key for encrypting TOTP secrets (32 bytes base64)
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX=5 # Max login attempts
SESSION_EXPIRE_HOURS=8
SESSION_IDLE_MINUTES=30
MAX_CONCURRENT_SESSIONS=3
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
NEXT_PUBLIC_ADMIN_ROUTE=admin-xyz
```

### Database Migrations

Create migration script to add admin tables:

```sql
-- migrations/001_create_admin_tables.sql
-- Run this in Supabase SQL Editor

BEGIN;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret_encrypted TEXT,
  totp_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create backup_codes table
CREATE TABLE IF NOT EXISTS backup_codes (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  code_hash VARCHAR(255) NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  totp_required BOOLEAN DEFAULT false,
  totp_success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Modify contact_messages table
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS read_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_backup_codes_admin_user_id ON backup_codes(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_backup_codes_used_at ON backup_codes(used_at);
CREATE INDEX IF NOT EXISTS idx_sessions_admin_user_id ON sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username ON login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_user_id ON activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_archived ON contact_messages(is_archived);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

COMMIT;
```

### Initial Admin Setup Script

Create a CLI script for initial admin account setup:

```javascript
// scripts/create-admin.js
const bcrypt = require('bcrypt');
const { supabase } = require('../src/config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question) => new Promise((resolve) => {
  rl.question(question, resolve);
});

async function createAdmin() {
  console.log('=== Create Admin User ===\n');
  
  // Check if admin already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .limit(1)
    .single();
  
  if (existing) {
    console.log('❌ Admin user already exists. Use password reset if needed.');
    process.exit(1);
  }
  
  const username = await prompt('Username: ');
  const email = await prompt('Email: ');
  const password = await prompt('Password (min 12 chars): ');
  
  // Validate
  if (!username || username.length < 3) {
    console.log('❌ Username must be at least 3 characters');
    process.exit(1);
  }
  
  if (!email.includes('@')) {
    console.log('❌ Invalid email');
    process.exit(1);
  }
  
  if (password.length < 12) {
    console.log('❌ Password must be at least 12 characters');
    process.exit(1);
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Insert admin
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      username,
      email,
      password_hash: passwordHash,
      totp_enabled: false,
    })
    .select()
    .single();
  
  if (error) {
    console.log('❌ Error creating admin:', error.message);
    process.exit(1);
  }
  
  console.log('\n✅ Admin user created successfully!');
  console.log(`   ID: ${data.id}`);
  console.log(`   Username: ${data.username}`);
  console.log(`   Email: ${data.email}`);
  console.log('\n⚠️  Please log in and enable 2FA immediately.');
  
  rl.close();
  process.exit(0);
}

createAdmin();
```

Run with: `node scripts/create-admin.js`

### Vercel Deployment

**Frontend:**
- Deploy Next.js app to Vercel
- Set environment variables in Vercel dashboard
- Configure custom domain
- Enable automatic deployments from Git

**Backend:**
- Deploy Express app to Vercel as serverless functions (or separate hosting)
- Alternative: Deploy to Railway, Render, or Fly.io for long-running processes
- Set environment variables
- Configure CORS to allow frontend domain

**Supabase:**
- Database already hosted on Supabase
- Configure Supabase Storage bucket for file uploads
- Set up storage policies for authenticated uploads

### Security Checklist

- [ ] Admin route is non-obvious and not linked from public pages
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] HSTS header enabled
- [ ] CSRF protection enabled on all admin routes
- [ ] Rate limiting configured
- [ ] Session cookies are HTTP-only, Secure, SameSite=Strict
- [ ] Passwords hashed with bcrypt cost factor 12+
- [ ] TOTP secrets encrypted at rest
- [ ] Backup codes hashed before storage
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] File upload validation (type, size, content)
- [ ] Audit logging enabled
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Security headers configured (Helmet)
- [ ] 2FA enforced for all admins

---

## Future Enhancements

### Multi-Admin Support
- Add admin roles (super-admin, editor, viewer)
- Implement permission-based access control
- Admin management interface (create, edit, delete admins)
- Audit log per-admin filtering

### Content Scheduling
- Schedule projects to publish at specific dates
- Draft mode for projects and blog posts
- Preview unpublished content

### Media Library
- Centralized media management
- Image optimization and resizing
- Image search and filtering
- Bulk upload and delete

### Analytics Dashboard
- Page view statistics
- Contact form submission trends
- Project view counts
- Traffic sources

### Advanced Contact Management
- Email templates for responses
- Send replies directly from admin portal
- Contact categorization and tagging
- CRM integration

### Version Control for Content
- Track content changes over time
- Revert to previous versions
- Compare versions side-by-side
- Content approval workflow

### API Documentation
- Auto-generated API docs using Swagger/OpenAPI
- API key management for external integrations
- Webhook support for content updates

---

## Implementation Notes

### Development Workflow

1. **Phase 1: Database Setup**
   - Run migration script to create admin tables
   - Create initial admin user using setup script
   - Test database connections

2. **Phase 2: Backend Authentication**
   - Implement authentication services (password, TOTP, sessions)
   - Create auth endpoints (login, 2FA, logout)
   - Add authentication middleware
   - Test authentication flow

3. **Phase 3: Backend Content APIs**
   - Create admin CRUD endpoints for each entity
   - Add input validation
   - Implement audit logging
   - Test all endpoints

4. **Phase 4: Frontend Authentication**
   - Create login page and 2FA page
   - Implement session management
   - Add protected route handling
   - Test login flow

5. **Phase 5: Frontend Dashboard**
   - Create admin layout with sidebar
   - Build dashboard home page with metrics
   - Implement navigation

6. **Phase 6: Frontend Content Management**
   - Build forms for each entity (projects, skills, etc.)
   - Implement file uploads
   - Add list views with tables
   - Test CRUD operations

7. **Phase 7: Contact Messages**
   - Create message list view
   - Add filtering and search
   - Implement bulk operations
   - Test message management

8. **Phase 8: Activity Log**
   - Create activity log view
   - Add filtering and export
   - Test audit trail

9. **Phase 9: Settings**
   - Build settings pages (password, 2FA, sessions)
   - Implement backup/export functionality
   - Test settings operations

10. **Phase 10: Testing & Deployment**
    - Integration testing
    - Security testing
    - Performance optimization
    - Deploy to production

### Key Libraries to Install

**Backend:**
```bash
npm install otplib qrcode bcrypt cookie-parser csurf
npm install @types/bcrypt @types/cookie-parser --save-dev
```

**Frontend:**
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @tanstack/react-table date-fns
npm install recharts # For dashboard charts (optional)
```

### Code Organization Best Practices

- Use TypeScript for type safety
- Separate business logic from route handlers (services pattern)
- Use middleware for cross-cutting concerns (auth, validation, logging)
- Keep components small and focused (single responsibility)
- Use server components by default, client components only when needed
- Implement proper error boundaries
- Use environment variables for configuration
- Write comprehensive tests for critical paths

---

## Summary

This design document provides a comprehensive technical architecture for the Portfolio Admin Portal & Authentication System. The system implements:

- **Enterprise-grade security** with mandatory 2FA, session management, and comprehensive audit logging
- **Complete content management** for all portfolio entities with intuitive CRUD interfaces
- **Modern tech stack** leveraging Next.js 14, Express.js, and Supabase PostgreSQL
- **Scalable architecture** with clear separation between public and admin concerns
- **Robust error handling** and validation at every layer
- **Production-ready deployment** strategy with security best practices

The design balances security requirements with user experience, providing a powerful admin interface while maintaining the existing public portfolio functionality. The modular architecture allows for future enhancements while keeping the codebase maintainable and testable.
