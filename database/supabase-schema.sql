-- =============================================
-- FULL CV DATABASE - PostgreSQL for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Drop existing tables (if migrating)
-- =============================================
-- Uncomment these if you want to reset the database
-- DROP TABLE IF EXISTS project_images CASCADE;
-- DROP TABLE IF EXISTS project_technologies CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS certifications CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS experience CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS skills CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS profile CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;

-- =============================================
-- CREATE TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  tagline VARCHAR(255),
  bio_short TEXT,
  bio_long TEXT,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  location VARCHAR(100),
  timezone VARCHAR(50),
  availability_status VARCHAR(20) DEFAULT 'available',
  avatar_url VARCHAR(500),
  resume_url VARCHAR(500),
  github_username VARCHAR(100),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  website_url VARCHAR(500),
  years_experience INT DEFAULT 0,
  projects_shipped INT DEFAULT 0,
  happy_clients INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  proficiency SMALLINT DEFAULT 80,
  icon_name VARCHAR(100),
  color VARCHAR(20),
  sort_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL DEFAULT 'work',
  title VARCHAR(200) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  organization_logo_url VARCHAR(500),
  location VARCHAR(150),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  achievements JSONB,
  technologies JSONB,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  problem TEXT,
  approach TEXT,
  solution TEXT,
  results TEXT,
  learnings TEXT,
  cover_image_url VARCHAR(500),
  video_url VARCHAR(500),
  live_url VARCHAR(500),
  github_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'web',
  status VARCHAR(20) DEFAULT 'completed',
  role VARCHAR(100),
  timeframe VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_technologies (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  issuing_org VARCHAR(150) NOT NULL,
  org_logo_url VARCHAR(500),
  badge_image_url VARCHAR(500),
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(150),
  verify_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'other',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url VARCHAR(500),
  tags JSONB,
  read_time_minutes INT DEFAULT 5,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(150) NOT NULL,
  author_title VARCHAR(200),
  author_company VARCHAR(150),
  author_avatar_url VARCHAR(500),
  author_linkedin_url VARCHAR(500),
  quote TEXT NOT NULL,
  rating SMALLINT DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CREATE INDEXES (for better query performance)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_is_featured ON skills(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_experience_type ON experience(type);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_skill_id ON project_technologies(skill_id);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample profile
INSERT INTO profile (full_name, title, tagline, bio_short, bio_long, email, location, availability_status, github_username, years_experience, projects_shipped, happy_clients)
VALUES (
  'Jeff Developer',
  'Full-Stack Developer',
  'Building fast, accessible web apps that actually ship.',
  'I''m a full-stack developer passionate about crafting high-performance, accessible web applications.',
  'I''m a full-stack developer with over 5 years of experience building web applications that solve real problems.',
  'jeff@example.com',
  'Your City, Country',
  'available',
  'jeffdev',
  5,
  30,
  12
)
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, icon_name, color, sort_order, is_featured) 
VALUES
('React', 'frontend', 95, 'Code', '#61DAFB', 1, true),
('Next.js', 'frontend', 92, 'Globe', '#FFFFFF', 2, true),
('TypeScript', 'frontend', 88, 'FileCode', '#3178C6', 3, true),
('Tailwind CSS', 'frontend', 90, 'Palette', '#38BDF8', 4, true),
('JavaScript', 'frontend', 95, 'Code2', '#F7DF1E', 5, true),
('Node.js', 'backend', 90, 'Server', '#339933', 7, true),
('Express.js', 'backend', 88, 'Zap', '#FFFFFF', 8, true),
('PostgreSQL', 'database', 82, 'Database', '#336791', 10, true),
('MongoDB', 'database', 80, 'Database', '#47A248', 11, false),
('Docker', 'devops', 85, 'BoxIcon', '#2496ED', 12, false)
ON CONFLICT DO NOTHING;

-- Insert sample certification
INSERT INTO certifications (title, issuing_org, issue_date, category, sort_order)
VALUES ('AWS Certified Developer – Associate', 'Amazon Web Services', '2023-06-15', 'cloud', 1)
ON CONFLICT DO NOTHING;

-- Insert sample site settings
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES ('site_title', 'Jeff Developer — Full-Stack Developer Portfolio', 'Browser tab title')
ON CONFLICT DO NOTHING;

-- =============================================
-- ENABLE ROW LEVEL SECURITY (Optional - for production)
-- =============================================
-- Uncomment these if you want to enable RLS
-- ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow read access to all" ON profile FOR SELECT USING (true);
-- CREATE POLICY "Allow read access to all" ON projects FOR SELECT USING (true);
-- CREATE POLICY "Allow read access to published" ON blog_posts FOR SELECT USING (is_published = true);
-- CREATE POLICY "Allow read access to all" ON skills FOR SELECT USING (true);
-- CREATE POLICY "Allow insert for all" ON contact_messages FOR INSERT WITH CHECK (true);

-- =============================================
-- END OF SCHEMA
-- =============================================
