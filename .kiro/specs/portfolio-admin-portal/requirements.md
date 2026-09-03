## Requirements Document: Portfolio Admin Portal & Authentication System

## Introduction

This document specifies the requirements for a secure administrative portal that enables the portfolio owner to authenticate, manage content, monitor contact submissions, and maintain the portfolio website. The system includes Two-Factor Authentication (TOTP), session management, content CRUD operations, contact message management, and comprehensive audit logging.

## Glossary

- **Admin_User**: The portfolio owner who has exclusive access to manage all website content
- **Admin_Portal**: The web application interface accessible only to authenticated administrators
- **Auth_Service**: The backend service responsible for authentication, session management, and security operations
- **Contact_Manager**: The subsystem that manages contact form submissions
- **Content_Manager**: The subsystem that handles CRUD operations for portfolio content (projects, skills, experience, etc.)
- **Dashboard**: The main landing page of the Admin Portal displaying overview metrics and navigation
- **TOTP_Service**: The Two-Factor Authentication service using Time-based One-Time Password algorithm
- **Audit_Logger**: The service that records all administrative actions and security events
- **Session_Manager**: The service that manages authenticated user sessions
- **Backup_Code**: A single-use recovery code for 2FA authentication when TOTP is unavailable
- **Portfolio_Database**: The Supabase PostgreSQL database storing all application data
- **Public_Portfolio**: The public-facing portfolio website accessible to all visitors
- **Admin_Route**: A non-obvious URL path that serves the admin portal
- **CSRF_Token**: Cross-Site Request Forgery token used to prevent unauthorized requests
- **Login_Attempt**: A record of an authentication attempt including timestamp, IP, success status
- **Activity_Log**: A timestamped record of administrative actions

## Requirements

### Requirement 1: Admin Authentication

**User Story:** As the Admin User, I want to securely log in to the Admin Portal with username/password and 2FA, so that only I can access and manage the portfolio content.

#### Acceptance Criteria

1. THE Admin_Portal SHALL be accessible only via a non-obvious Admin_Route (e.g., /admin-portal-xyz)
2. WHEN an Admin User submits valid credentials, THE Auth_Service SHALL verify the username and password against stored hashed values
3. WHEN an Admin User submits invalid credentials, THE Auth_Service SHALL reject the login attempt and increment the failed attempt counter
4. WHEN password verification succeeds, THE Auth_Service SHALL prompt for a TOTP code before granting access
5. WHEN an Admin User enters a valid 6-digit TOTP code, THE Auth_Service SHALL verify it against the stored secret using 30-second time windows
6. WHEN TOTP verification succeeds, THE Auth_Service SHALL create an authenticated session and redirect to the Dashboard
7. WHEN TOTP verification fails, THE Auth_Service SHALL reject the login and log the failed 2FA attempt
8. WHEN an Admin User enters a valid Backup Code, THE Auth_Service SHALL authenticate the user and invalidate that specific Backup Code
9. THE Auth_Service SHALL hash all passwords using bcrypt or Argon2 with appropriate cost factors
10. THE Auth_Service SHALL store TOTP secrets in encrypted form in the Portfolio Database
11. THE Auth_Service SHALL implement rate limiting of 5 failed login attempts per IP address within 15 minutes
12. WHEN rate limit is exceeded, THE Auth_Service SHALL block further authentication attempts for 15 minutes
13. THE Auth_Service SHALL log all login attempts with timestamp, IP address, user agent, and success status
14. THE Auth_Service SHALL use HTTP-only secure cookies for session tokens
15. THE Auth_Service SHALL include CSRF protection on all authenticated requests

### Requirement 2: Two-Factor Authentication Setup

**User Story:** As the Admin User, I want to configure Two-Factor Authentication using Google Authenticator or compatible apps, so that my account has an additional layer of security.

#### Acceptance Criteria

1. WHEN an Admin User accesses 2FA setup for the first time, THE TOTP_Service SHALL generate a unique secret key
2. THE TOTP_Service SHALL generate a QR code encoding the secret in otpauth:// format compatible with Google Authenticator
3. THE Admin_Portal SHALL display both the QR code and the manual setup key as plaintext
4. WHEN an Admin User enters a TOTP code during setup, THE TOTP_Service SHALL verify the code matches the generated secret
5. WHEN TOTP verification succeeds during setup, THE TOTP_Service SHALL enable 2FA for the account and generate 10 Backup Codes
6. THE Admin_Portal SHALL display the Backup Codes once and prompt the Admin User to save them securely
7. THE TOTP_Service SHALL store the TOTP secret in encrypted form in the Portfolio Database
8. THE TOTP_Service SHALL accept codes from the current 30-second window and one window before/after for clock skew tolerance
9. WHEN 2FA is enabled, THE Auth_Service SHALL require TOTP verification on every login
10. THE Admin_Portal SHALL provide a secure process to disable and re-enable 2FA requiring password confirmation

### Requirement 3: Backup Codes and Recovery

**User Story:** As the Admin User, I want backup codes to access my account if I lose access to my authenticator app, so that I don't get permanently locked out.

#### Acceptance Criteria

1. WHEN 2FA is enabled, THE TOTP_Service SHALL generate exactly 10 unique Backup Codes
2. THE TOTP_Service SHALL hash each Backup Code before storing in the Portfolio Database
3. WHEN an Admin User uses a Backup Code for authentication, THE TOTP_Service SHALL mark that code as used
4. WHEN a Backup Code is used, THE TOTP_Service SHALL not accept it for future authentication attempts
5. THE Admin_Portal SHALL allow the Admin User to regenerate new Backup Codes requiring password confirmation
6. WHEN Backup Codes are regenerated, THE TOTP_Service SHALL invalidate all previous codes and generate 10 new ones
7. THE Admin_Portal SHALL display the count of remaining unused Backup Codes
8. WHEN fewer than 3 Backup Codes remain, THE Admin_Portal SHALL display a warning to regenerate codes
9. THE Admin_Portal SHALL provide a 2FA reset process requiring email verification and password reset
10. WHEN 2FA reset is initiated, THE Audit_Logger SHALL log the security event

### Requirement 4: Session Management

**User Story:** As the Admin User, I want my login sessions to be secure and manageable, so that I can control access to my account across devices.

#### Acceptance Criteria

1. WHEN an Admin User successfully authenticates, THE Session_Manager SHALL create a session with a unique token
2. THE Session_Manager SHALL store session tokens as HTTP-only, Secure, SameSite=Strict cookies
3. THE Session_Manager SHALL set session expiration to 8 hours from last activity
4. WHEN a session expires, THE Session_Manager SHALL invalidate the token and require re-authentication
5. WHEN an Admin User is inactive for 30 minutes, THE Session_Manager SHALL expire the session
6. THE Session_Manager SHALL store session metadata including creation time, last activity time, IP address, and user agent
7. THE Admin_Portal SHALL display all active sessions with device/browser information and last activity
8. WHEN an Admin User clicks "Log out", THE Session_Manager SHALL invalidate the current session token
9. WHEN an Admin User clicks "Log out from all devices", THE Session_Manager SHALL invalidate all session tokens for that account
10. THE Session_Manager SHALL limit concurrent sessions to 3 active sessions per Admin User
11. WHEN the session limit is exceeded, THE Session_Manager SHALL invalidate the oldest session
12. THE Session_Manager SHALL refresh session expiration on each authenticated request

### Requirement 5: Admin Dashboard

**User Story:** As the Admin User, I want a dashboard overview after logging in, so that I can quickly see key metrics and navigate to management sections.

#### Acceptance Criteria

1. WHEN an Admin User logs in successfully, THE Admin_Portal SHALL display the Dashboard
2. THE Dashboard SHALL display the total count of projects in the Portfolio Database
3. THE Dashboard SHALL display the total count of skills in the Portfolio Database
4. THE Dashboard SHALL display the count of unread contact messages
5. THE Dashboard SHALL display the count of contact messages received in the last 7 days
6. THE Dashboard SHALL display the 5 most recent login attempts with timestamps and status
7. THE Dashboard SHALL display the current session information including login time and IP address
8. THE Dashboard SHALL display the website status (online/offline) based on health check endpoint
9. THE Dashboard SHALL provide navigation links to Projects, Skills, Experience, Education, Certifications, Contact Messages, Settings, and Activity Log
10. THE Dashboard SHALL display the count of remaining unused Backup Codes
11. THE Dashboard SHALL refresh metrics automatically every 60 seconds
12. THE Dashboard SHALL be responsive and functional on desktop, tablet, and mobile screen sizes

### Requirement 6: Profile Management

**User Story:** As the Admin User, I want to update my profile information including name, about section, image, and social links, so that my portfolio displays current information.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide a Profile Management interface displaying current profile data from the Portfolio Database
2. WHEN an Admin User updates the name field, THE Content_Manager SHALL validate the length is between 1 and 150 characters
3. WHEN an Admin User updates the about section, THE Content_Manager SHALL validate the length is between 1 and 5000 characters
4. WHEN an Admin User uploads a profile image, THE Content_Manager SHALL validate the file is PNG, JPG, or WEBP format and under 5MB
5. WHEN a profile image upload succeeds, THE Content_Manager SHALL store the image in Supabase Storage and update the image URL
6. WHEN an Admin User updates contact information (email, phone), THE Content_Manager SHALL validate the formats
7. THE Admin_Portal SHALL provide fields for social links (GitHub, LinkedIn, Twitter, etc.) with URL validation
8. WHEN an Admin User saves profile changes, THE Content_Manager SHALL update the profile record in the Portfolio Database
9. WHEN profile update succeeds, THE Admin_Portal SHALL display a success notification
10. WHEN profile update fails, THE Admin_Portal SHALL display error details and retain the form data
11. THE Audit_Logger SHALL log all profile update actions with changed fields

### Requirement 7: Skills Management

**User Story:** As the Admin User, I want to add, edit, delete, and categorize skills with proficiency levels, so that my portfolio accurately represents my technical capabilities.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display all skills from the Portfolio Database grouped by category
2. WHEN an Admin User clicks "Add Skill", THE Admin_Portal SHALL display a form with fields for name, category, proficiency level, icon name, color, featured flag, and sort order
3. WHEN an Admin User submits a new skill, THE Content_Manager SHALL validate name length is between 1 and 100 characters
4. THE Content_Manager SHALL validate category is one of: frontend, backend, database, devops, design, other
5. THE Content_Manager SHALL validate proficiency level is between 1 and 100
6. WHEN skill validation succeeds, THE Content_Manager SHALL insert the skill record into the Portfolio Database
7. WHEN an Admin User clicks "Edit" on a skill, THE Admin_Portal SHALL load the skill data into an edit form
8. WHEN an Admin User saves skill changes, THE Content_Manager SHALL update the skill record in the Portfolio Database
9. WHEN an Admin User clicks "Delete" on a skill, THE Admin_Portal SHALL display a confirmation dialog
10. WHEN deletion is confirmed, THE Content_Manager SHALL remove the skill record from the Portfolio Database
11. THE Admin_Portal SHALL provide drag-and-drop reordering of skills within categories
12. WHEN skill order changes, THE Content_Manager SHALL update the sort_order values in the Portfolio Database
13. THE Audit_Logger SHALL log all skill CRUD operations with skill name and action type
14. THE Admin_Portal SHALL provide search and filter capabilities by category and featured status

### Requirement 8: Projects Management

**User Story:** As the Admin User, I want full CRUD operations on projects including images, tech stack, and metadata, so that I can showcase my work effectively.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display all projects from the Portfolio Database with thumbnails, title, category, and featured status
2. WHEN an Admin User clicks "Add Project", THE Admin_Portal SHALL display a form with fields for slug, title, tagline, description, problem, approach, solution, results, learnings, cover image, video URL, live URL, GitHub URL, category, status, role, timeframe, featured flag, pinned flag, and sort order
3. WHEN an Admin User submits a new project, THE Content_Manager SHALL validate slug is unique and URL-safe (lowercase, hyphens only)
4. THE Content_Manager SHALL validate title length is between 1 and 200 characters
5. THE Content_Manager SHALL validate description length is between 1 and 10000 characters
6. WHEN a cover image is uploaded, THE Content_Manager SHALL validate file format and size, store in Supabase Storage, and save the URL
7. THE Admin_Portal SHALL provide a multi-select interface to associate skills (technologies) with the project
8. WHEN project validation succeeds, THE Content_Manager SHALL insert the project and associated project_technologies records into the Portfolio Database
9. WHEN an Admin User clicks "Edit" on a project, THE Admin_Portal SHALL load all project data including associated technologies
10. WHEN an Admin User saves project changes, THE Content_Manager SHALL update the project record and associated technologies
11. THE Admin_Portal SHALL provide an interface to upload multiple project images with captions and sort order
12. WHEN an Admin User clicks "Delete" on a project, THE Admin_Portal SHALL display a confirmation dialog warning about permanent deletion
13. WHEN deletion is confirmed, THE Content_Manager SHALL remove the project, associated technologies, and images from the Portfolio Database
14. THE Admin_Portal SHALL provide drag-and-drop reordering of projects
15. WHEN project order changes, THE Content_Manager SHALL update sort_order values in the Portfolio Database
16. THE Audit_Logger SHALL log all project CRUD operations with project slug and action type
17. THE Admin_Portal SHALL provide search and filter by category, status, and featured flag

### Requirement 9: Experience Management

**User Story:** As the Admin User, I want to manage my work experience entries with dates and responsibilities, so that my portfolio shows my professional history.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display all experience entries from the Portfolio Database in chronological order
2. WHEN an Admin User clicks "Add Experience", THE Admin_Portal SHALL display a form with fields for company, position, location, start date, end date, current flag, description, and achievements
3. WHEN an Admin User submits new experience, THE Content_Manager SHALL validate company name length is between 1 and 200 characters
4. THE Content_Manager SHALL validate position length is between 1 and 200 characters
5. THE Content_Manager SHALL validate start date is a valid date and not in the future
6. WHEN "current position" is checked, THE Content_Manager SHALL allow end date to be null
7. WHEN "current position" is unchecked, THE Content_Manager SHALL validate end date is after start date
8. WHEN validation succeeds, THE Content_Manager SHALL insert the experience record into the Portfolio Database
9. WHEN an Admin User clicks "Edit" on experience, THE Admin_Portal SHALL load the experience data into an edit form
10. WHEN an Admin User saves experience changes, THE Content_Manager SHALL update the experience record
11. WHEN an Admin User clicks "Delete" on experience, THE Admin_Portal SHALL display a confirmation dialog
12. WHEN deletion is confirmed, THE Content_Manager SHALL remove the experience record from the Portfolio Database
13. THE Audit_Logger SHALL log all experience CRUD operations with company name and action type

### Requirement 10: Education and Certifications Management

**User Story:** As the Admin User, I want to manage my education and certification records with supporting documents, so that my credentials are properly displayed.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide separate interfaces for Education and Certifications management
2. WHEN an Admin User clicks "Add Education", THE Admin_Portal SHALL display a form with fields for institution, degree, field of study, start date, end date, description, and logo image
3. WHEN an Admin User submits new education, THE Content_Manager SHALL validate institution name length is between 1 and 200 characters
4. THE Content_Manager SHALL validate degree and field of study lengths are between 1 and 200 characters
5. THE Content_Manager SHALL validate start date and end date chronology
6. WHEN validation succeeds, THE Content_Manager SHALL insert the education record into the Portfolio Database
7. WHEN an Admin User clicks "Add Certification", THE Admin_Portal SHALL display a form with fields for name, issuing organization, issue date, expiration date, credential ID, credential URL, and certificate image
8. WHEN an Admin User submits new certification, THE Content_Manager SHALL validate name and organization lengths are between 1 and 200 characters
9. WHEN a certificate image is uploaded, THE Content_Manager SHALL validate format and size, store in Supabase Storage, and save the URL
10. WHEN validation succeeds, THE Content_Manager SHALL insert the certification record into the Portfolio Database
11. THE Admin_Portal SHALL provide edit and delete operations for both education and certifications
12. WHEN deletion is confirmed, THE Content_Manager SHALL remove the record and associated images from storage
13. THE Audit_Logger SHALL log all education and certification CRUD operations

### Requirement 11: Contact Message Management

**User Story:** As the Admin User, I want to view, filter, and manage contact form submissions, so that I can respond to inquiries effectively.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display all contact messages from the Portfolio Database in reverse chronological order
2. THE Contact_Manager SHALL display message metadata including sender name, email, subject, submission date, and read status
3. WHEN an Admin User clicks on a message, THE Admin_Portal SHALL display the full message content and mark it as read
4. WHEN a message is marked as read, THE Contact_Manager SHALL update the is_read flag in the Portfolio Database
5. THE Admin_Portal SHALL provide filter options for read/unread, archived, and date range
6. THE Admin_Portal SHALL provide a search function to search by name, email, subject, or message content
7. WHEN an Admin User clicks "Archive", THE Contact_Manager SHALL set the archived flag and remove from default view
8. WHEN an Admin User clicks "Delete", THE Admin_Portal SHALL display a confirmation dialog
9. WHEN deletion is confirmed, THE Contact_Manager SHALL remove the message record from the Portfolio Database
10. THE Admin_Portal SHALL display a badge count of unread messages in the navigation
11. THE Admin_Portal SHALL support bulk actions: mark as read, mark as unread, archive, delete
12. THE Admin_Portal SHALL provide an "Export to CSV" function for selected messages
13. THE Contact_Manager SHALL implement pagination displaying 20 messages per page
14. THE Audit_Logger SHALL log message view, archive, and delete actions

### Requirement 12: Activity Log and Audit Trail

**User Story:** As the Admin User, I want to view a comprehensive log of all administrative actions, so that I can monitor account activity and detect unauthorized access.

#### Acceptance Criteria

1. THE Audit_Logger SHALL record all login attempts with timestamp, IP address, user agent, and success/failure status
2. THE Audit_Logger SHALL record all logout events with timestamp
3. THE Audit_Logger SHALL record all 2FA verification attempts with success/failure status
4. THE Audit_Logger SHALL record all content creation events with entity type, entity ID, and timestamp
5. THE Audit_Logger SHALL record all content update events with entity type, entity ID, changed fields, and timestamp
6. THE Audit_Logger SHALL record all content deletion events with entity type, entity ID, and timestamp
7. THE Audit_Logger SHALL record password change events with timestamp
8. THE Audit_Logger SHALL record 2FA configuration changes (enabled, disabled, codes regenerated) with timestamp
9. THE Audit_Logger SHALL record session termination events including "logout all devices"
10. THE Audit_Logger SHALL record backup code usage with which code was used and timestamp
11. THE Admin_Portal SHALL display the Activity Log in reverse chronological order with pagination
12. THE Admin_Portal SHALL provide filtering by event type, date range, and entity type
13. THE Admin_Portal SHALL provide search functionality on the Activity Log
14. THE Admin_Portal SHALL retain Activity Log records for at least 90 days
15. THE Activity_Log SHALL display each event with timestamp, event type, description, IP address, and user agent

### Requirement 13: Password Management

**User Story:** As the Admin User, I want to change my password securely, so that I can maintain account security.

#### Acceptance Criteria

1. THE Admin_Portal SHALL provide a "Change Password" interface in the settings section
2. WHEN an Admin User accesses password change, THE Admin_Portal SHALL require the current password for verification
3. THE Admin_Portal SHALL require the new password to be at least 12 characters long
4. THE Admin_Portal SHALL require the new password to contain at least one uppercase letter, one lowercase letter, one number, and one special character
5. THE Admin_Portal SHALL require password confirmation by entering the new password twice
6. WHEN passwords do not match, THE Admin_Portal SHALL display an error and prevent submission
7. WHEN the current password is incorrect, THE Auth_Service SHALL reject the change and display an error
8. WHEN password requirements are not met, THE Admin_Portal SHALL display specific requirement failures
9. WHEN all validations pass, THE Auth_Service SHALL hash the new password using bcrypt or Argon2 and update the Portfolio Database
10. WHEN password change succeeds, THE Auth_Service SHALL invalidate all existing sessions except the current one
11. THE Auth_Service SHALL send a password change notification email to the Admin User
12. THE Audit_Logger SHALL log the password change event with timestamp and IP address

### Requirement 14: Security Monitoring and Alerts

**User Story:** As the Admin User, I want to be alerted to suspicious activity, so that I can respond to potential security threats.

#### Acceptance Criteria

1. WHEN 5 consecutive failed login attempts occur from the same IP address, THE Auth_Service SHALL block that IP for 15 minutes
2. WHEN 3 failed 2FA attempts occur in succession, THE Auth_Service SHALL require a 5-minute cooldown before next attempt
3. WHEN a successful login occurs from a new IP address, THE Auth_Service SHALL log the event with "new location" flag
4. WHEN a successful login occurs from a new device/browser, THE Auth_Service SHALL log the event with "new device" flag
5. THE Admin_Portal SHALL display a warning indicator when unrecognized login patterns are detected
6. WHEN the Backup Code count drops below 3, THE Admin_Portal SHALL display a persistent warning in the Dashboard
7. WHEN suspicious activity is detected (multiple failed attempts, new locations), THE Auth_Service SHALL send an email alert to the Admin User
8. THE Admin_Portal SHALL display the last successful login timestamp and location on each login
9. THE Auth_Service SHALL implement rate limiting of 100 API requests per minute per session
10. WHEN rate limit is exceeded, THE Auth_Service SHALL return HTTP 429 and log the event

### Requirement 15: Admin Portal UI/UX with Cyberpunk Theme

**User Story:** As the Admin User, I want an intuitive, responsive admin interface with a Cyberpunk aesthetic, so that I can manage content efficiently across devices while experiencing an immersive futuristic design.

#### Acceptance Criteria

1. THE Admin_Portal SHALL use a sidebar navigation layout with collapsible menu on mobile devices
2. THE Admin_Portal SHALL display consistent page headers with breadcrumb navigation
3. THE Admin_Portal SHALL use data tables with sortable columns, search, and pagination for list views
4. THE Admin_Portal SHALL display confirmation dialogs for all destructive actions (delete, logout all)
5. THE Admin_Portal SHALL display toast notifications for success, error, and warning messages
6. THE Admin_Portal SHALL implement client-side form validation with real-time error display
7. THE Admin_Portal SHALL display loading spinners during asynchronous operations
8. THE Admin_Portal SHALL use consistent color coding: neon cyan/magenta for primary actions, neon red for destructive actions, neon green for success states
9. THE Admin_Portal SHALL be fully functional on screen widths from 320px (mobile) to 4K desktop
10. THE Admin_Portal SHALL implement keyboard navigation for all interactive elements
11. THE Admin_Portal SHALL maintain visual separation from the Public Portfolio using distinct Cyberpunk styling and branding
12. THE Admin_Portal SHALL persist the theme preference in browser storage

#### Cyberpunk Design System Acceptance Criteria

13. THE Admin_Portal SHALL implement a dark-themed color palette with neon accent colors:
    - Background: Deep blacks (#000000, #0a0a0a) and dark grays (#111111, #1a1a1a)
    - Primary accent: Neon cyan (#00f0ff, #00d9ff)
    - Secondary accent: Neon magenta (#ff00ff, #ff006e)
    - Success: Neon green (#00ff41, #39ff14)
    - Warning: Neon yellow (#ffff00, #ffd700)
    - Danger: Neon red (#ff0040, #ff0055)
    - Text: Bright white (#ffffff) and cyan tints (#e0ffff)
14. THE Admin_Portal SHALL use glowing neon effects on interactive elements:
    - Buttons with neon border glow on hover (box-shadow with color spread)
    - Input fields with animated neon underline on focus
    - Cards with subtle neon border glow
    - Navigation items with neon highlight on active/hover states
15. THE Admin_Portal SHALL implement cyberpunk-inspired typography:
    - Headings: Monospace or tech-inspired fonts (e.g., "Orbitron", "Rajdhani", "Share Tech Mono")
    - Body text: Clean sans-serif with excellent readability (e.g., "Inter", "Space Grotesk")
    - Code/data displays: Monospace fonts (e.g., "Fira Code", "JetBrains Mono")
16. THE Admin_Portal SHALL display subtle animated background effects:
    - Digital grid pattern with moving lines
    - Scanline effect overlay for CRT monitor aesthetic
    - Particle effects or glowing dots in background
    - Animated glitch effects on page transitions (subtle, non-disruptive)
17. THE Admin_Portal SHALL implement neon-styled UI components:
    - Cards with dark background, neon borders, and inner glow
    - Buttons with neon outline and fill animation on hover
    - Progress bars with neon gradient fills
    - Toggle switches with neon glow states
    - Checkboxes and radios with neon check marks
18. THE Admin_Portal SHALL use cyberpunk-themed iconography:
    - Geometric, angular icons with neon coloring
    - Circuit board patterns for decorative elements
    - Hexagonal shapes and futuristic geometric patterns
    - Glitch-style dividers and section separators
19. THE Admin_Portal SHALL implement data visualization with cyberpunk aesthetics:
    - Dashboard metrics cards with neon borders and holographic effects
    - Charts and graphs with neon line colors and glow effects
    - Tables with alternating row highlighting using dark gray and subtle neon
    - Status indicators with pulsing neon glow animation
20. THE Admin_Portal SHALL display loading states with cyberpunk animation:
    - Spinning neon rings or hexagons
    - Digital/binary code rain effect (Matrix-style)
    - Glitching text or hologram loading animations
    - Neon progress bars with animated gradient shifts
21. THE Admin_Portal SHALL implement smooth micro-interactions:
    - Button press effects with neon pulse
    - Card hover elevations with increased glow
    - Menu transitions with slide and fade effects
    - Form field focus with expanding neon underline animation
22. THE Admin_Portal SHALL use cyberpunk-inspired form elements:
    - Input fields with neon bottom border and dark background
    - Dropdowns with neon highlight on selected option
    - File upload areas with dashed neon border
    - Rich text editors with neon toolbar buttons
23. THE Admin_Portal SHALL implement accessibility while maintaining cyberpunk aesthetic:
    - Sufficient contrast ratios (neon on dark meets WCAG AA standards)
    - Focus indicators with visible neon outline
    - Reduced motion option to disable animations
    - Screen reader compatible with proper ARIA labels
24. THE Admin_Portal SHALL display notifications with cyberpunk styling:
    - Toast messages with dark background and neon left border
    - Success toasts with green neon glow
    - Error toasts with red neon glow
    - Slide-in animation from top-right corner
25. THE Admin_Portal SHALL implement responsive cyberpunk design:
    - Mobile: Simplified neon effects for performance
    - Tablet: Full neon effects with optimized animations
    - Desktop: Enhanced neon effects, particles, and background animations
    - 4K: High-resolution textures and enhanced glow effects

### Requirement 16: API Security and Backend Protection

**User Story:** As the Admin User, I want the backend API to be secure, so that only authenticated requests can modify data.

#### Acceptance Criteria

1. THE Auth_Service SHALL require valid session tokens on all admin API endpoints
2. THE Auth_Service SHALL validate CSRF tokens on all state-changing requests (POST, PUT, DELETE)
3. WHEN a session token is invalid or expired, THE Auth_Service SHALL return HTTP 401 Unauthorized
4. WHEN a CSRF token is missing or invalid, THE Auth_Service SHALL return HTTP 403 Forbidden
5. THE Auth_Service SHALL implement rate limiting of 100 requests per minute per IP address on admin endpoints
6. THE Auth_Service SHALL validate all input data against defined schemas before processing
7. WHEN input validation fails, THE Auth_Service SHALL return HTTP 400 with specific error details
8. THE Auth_Service SHALL sanitize all user input to prevent SQL injection and XSS attacks
9. THE Auth_Service SHALL use parameterized queries for all database operations
10. THE Auth_Service SHALL implement Content Security Policy headers on all admin responses
11. THE Auth_Service SHALL set secure HTTP headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
12. THE Auth_Service SHALL log all failed authorization attempts with request details

### Requirement 17: Database Schema for Admin Features

**User Story:** As a system administrator, I want proper database schema to support all admin features, so that data is stored securely and efficiently.

#### Acceptance Criteria

1. THE Portfolio_Database SHALL include an admin_users table with columns: id, username, email, password_hash, totp_secret_encrypted, totp_enabled, created_at, updated_at
2. THE Portfolio_Database SHALL include a backup_codes table with columns: id, admin_user_id, code_hash, used_at, created_at
3. THE Portfolio_Database SHALL include a sessions table with columns: id, admin_user_id, token_hash, ip_address, user_agent, created_at, last_activity_at, expires_at
4. THE Portfolio_Database SHALL include a login_attempts table with columns: id, username, ip_address, user_agent, success, failure_reason, totp_required, totp_success, created_at
5. THE Portfolio_Database SHALL include an activity_logs table with columns: id, admin_user_id, event_type, entity_type, entity_id, description, metadata, ip_address, user_agent, created_at
6. THE Portfolio_Database SHALL include a contact_messages table with columns: id, name, email, subject, message, is_read, is_archived, submitted_at, read_at
7. THE Portfolio_Database SHALL create indexes on frequently queried columns: sessions.token_hash, login_attempts.created_at, activity_logs.created_at, contact_messages.submitted_at
8. THE Portfolio_Database SHALL enforce foreign key constraints on all relationship columns
9. THE Portfolio_Database SHALL use timestamptz (timestamp with timezone) for all datetime columns
10. THE Portfolio_Database SHALL set appropriate NOT NULL constraints on required fields

### Requirement 18: Backup and Data Protection

**User Story:** As the Admin User, I want automated backups and data protection, so that I can recover from data loss or security incidents.

#### Acceptance Criteria

1. THE Portfolio_Database SHALL be configured with automated daily backups retained for 30 days
2. THE Admin_Portal SHALL provide an "Export All Content" function that generates a JSON backup of all portfolio data
3. WHEN export is requested, THE Content_Manager SHALL generate a downloadable JSON file containing all projects, skills, experience, education, and certifications
4. THE Admin_Portal SHALL provide an "Import Content" function that restores data from a JSON backup file
5. WHEN import is requested, THE Admin_Portal SHALL display a warning about overwriting existing data
6. THE Content_Manager SHALL validate the JSON structure before importing data
7. WHEN import validation fails, THE Admin_Portal SHALL display specific error details without modifying data
8. THE Supabase Storage SHALL be configured with versioning enabled for uploaded images
9. THE Admin_Portal SHALL provide a "Download Database Backup" function accessible only to authenticated admins
10. THE Audit_Logger SHALL log all backup and restore operations with timestamp and admin user

### Requirement 19: Initial Admin Setup

**User Story:** As a system administrator, I want a secure initial setup process, so that the admin account can be created safely.

#### Acceptance Criteria

1. WHEN the Portfolio_Database contains zero admin_users records, THE Auth_Service SHALL enable initial setup mode
2. THE Admin_Portal SHALL provide a one-time setup route accessible only when no admin accounts exist
3. THE initial setup form SHALL require username, email, and password meeting security requirements
4. WHEN initial setup is submitted, THE Auth_Service SHALL create the first admin_user record
5. WHEN the first admin account is created, THE Auth_Service SHALL immediately require 2FA setup before dashboard access
6. WHEN initial setup completes, THE Auth_Service SHALL disable the setup route permanently
7. THE Audit_Logger SHALL log the initial admin account creation with timestamp
8. THE initial setup route SHALL be protected by environment-specific secret or temporarily enabled flag
9. WHEN multiple admin accounts are supported in the future, THE Admin_Portal SHALL provide an "Add Admin" interface requiring existing admin authentication
10. THE initial setup SHALL not be accessible from the Public Portfolio interface

### Requirement 20: Public Portfolio Integration

**User Story:** As a portfolio visitor, I want the public portfolio to remain fully functional and unaffected by admin features, so that my browsing experience is seamless.

#### Acceptance Criteria

1. THE Admin_Portal SHALL be completely separate from the Public_Portfolio with no shared UI components
2. THE Public_Portfolio SHALL not expose any links, routes, or references to the Admin_Portal
3. WHEN an unauthenticated user accesses an Admin_Route, THE Auth_Service SHALL redirect to the login page
4. THE Public_Portfolio SHALL continue to function normally when an admin is logged in
5. WHEN content is updated via the Admin_Portal, THE Public_Portfolio SHALL reflect changes immediately without caching delays
6. THE Public_Portfolio API endpoints (/api/profile, /api/projects, etc.) SHALL remain public and read-only
7. THE Auth_Service SHALL not apply admin authentication requirements to public API endpoints
8. THE Admin_Portal SHALL not interfere with public contact form submissions
9. WHEN the Admin_Portal is under maintenance, THE Public_Portfolio SHALL remain operational
10. THE frontend build process SHALL separate admin assets from public assets for optimal loading performance

