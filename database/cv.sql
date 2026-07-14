-- ============================================================
-- Jeff Portfolio Database
-- Database: cv
-- Created for: Developer Portfolio / Online CV
-- ============================================================

CREATE DATABASE IF NOT EXISTS `cv` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cv`;

-- ============================================================
-- Table: profile
-- ============================================================
CREATE TABLE IF NOT EXISTS `profile` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `bio_short` TEXT DEFAULT NULL,
  `bio_long` LONGTEXT DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `location` VARCHAR(100) DEFAULT NULL,
  `timezone` VARCHAR(50) DEFAULT NULL,
  `availability_status` ENUM('available','busy','not_available') DEFAULT 'available',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `resume_url` VARCHAR(500) DEFAULT NULL,
  `github_username` VARCHAR(100) DEFAULT NULL,
  `linkedin_url` VARCHAR(500) DEFAULT NULL,
  `twitter_url` VARCHAR(500) DEFAULT NULL,
  `website_url` VARCHAR(500) DEFAULT NULL,
  `years_experience` INT DEFAULT 0,
  `projects_shipped` INT DEFAULT 0,
  `happy_clients` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('frontend','backend','devops','database','tools','mobile','soft_skills','other') NOT NULL,
  `proficiency` TINYINT UNSIGNED DEFAULT 80 COMMENT 'Percentage 0-100',
  `icon_name` VARCHAR(100) DEFAULT NULL COMMENT 'Lucide or custom icon name',
  `color` VARCHAR(20) DEFAULT NULL COMMENT 'Hex color for constellation graph',
  `sort_order` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `problem` LONGTEXT DEFAULT NULL COMMENT 'Problem statement for case study',
  `approach` LONGTEXT DEFAULT NULL COMMENT 'Approach taken',
  `solution` LONGTEXT DEFAULT NULL COMMENT 'Solution shipped',
  `results` TEXT DEFAULT NULL COMMENT 'Key metrics and outcomes',
  `learnings` TEXT DEFAULT NULL COMMENT 'Challenges and learnings',
  `cover_image_url` VARCHAR(500) DEFAULT NULL,
  `video_url` VARCHAR(500) DEFAULT NULL,
  `live_url` VARCHAR(500) DEFAULT NULL,
  `github_url` VARCHAR(500) DEFAULT NULL,
  `category` ENUM('web','mobile','open_source','design','fullstack','other') DEFAULT 'web',
  `status` ENUM('completed','in_progress','archived') DEFAULT 'completed',
  `role` VARCHAR(100) DEFAULT NULL,
  `timeframe` VARCHAR(100) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_pinned` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: project_technologies (many-to-many: project <-> skill)
-- ============================================================
CREATE TABLE IF NOT EXISTS `project_technologies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` INT UNSIGNED NOT NULL,
  `skill_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_skill` (`project_id`, `skill_id`),
  CONSTRAINT `fk_pt_project` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pt_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: project_images (gallery/screenshots per project)
-- ============================================================
CREATE TABLE IF NOT EXISTS `project_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pi_project` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: experience
-- ============================================================
CREATE TABLE IF NOT EXISTS `experience` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` ENUM('work','education') NOT NULL DEFAULT 'work',
  `title` VARCHAR(200) NOT NULL COMMENT 'Job title or degree',
  `organization` VARCHAR(200) NOT NULL COMMENT 'Company or school name',
  `organization_logo_url` VARCHAR(500) DEFAULT NULL,
  `location` VARCHAR(150) DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL COMMENT 'NULL = current',
  `is_current` TINYINT(1) DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `achievements` JSON DEFAULT NULL COMMENT 'Array of bullet achievement strings',
  `technologies` JSON DEFAULT NULL COMMENT 'Array of tech used',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_start_date` (`start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: certifications
-- ============================================================
CREATE TABLE IF NOT EXISTS `certifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `issuing_org` VARCHAR(150) NOT NULL,
  `org_logo_url` VARCHAR(500) DEFAULT NULL,
  `badge_image_url` VARCHAR(500) DEFAULT NULL,
  `issue_date` DATE NOT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `credential_id` VARCHAR(150) DEFAULT NULL,
  `verify_url` VARCHAR(500) DEFAULT NULL,
  `category` ENUM('cloud','web','database','devops','programming','design','other') DEFAULT 'other',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_name` VARCHAR(150) NOT NULL,
  `author_title` VARCHAR(200) DEFAULT NULL,
  `author_company` VARCHAR(150) DEFAULT NULL,
  `author_avatar_url` VARCHAR(500) DEFAULT NULL,
  `author_linkedin_url` VARCHAR(500) DEFAULT NULL,
  `quote` TEXT NOT NULL,
  `rating` TINYINT UNSIGNED DEFAULT 5,
  `is_featured` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `title` VARCHAR(300) NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL COMMENT 'MDX/HTML content',
  `cover_image_url` VARCHAR(500) DEFAULT NULL,
  `tags` JSON DEFAULT NULL COMMENT 'Array of tag strings',
  `read_time_minutes` INT DEFAULT 5,
  `is_published` TINYINT(1) DEFAULT 0,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_published` (`is_published`, `published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `status` ENUM('unread','read','replied','spam') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Profile
INSERT INTO `profile` (`full_name`, `title`, `tagline`, `bio_short`, `bio_long`, `email`, `location`, `timezone`, `availability_status`, `github_username`, `years_experience`, `projects_shipped`, `happy_clients`) VALUES
('Jeff Developer', 'Full-Stack Developer', 'Building fast, accessible web apps that actually ship.', 'I''m a full-stack developer passionate about crafting high-performance, accessible web applications. I thrive at the intersection of clean code and beautiful design.', 'I''m a full-stack developer with over 8 years of experience building web applications that solve real problems. My journey into development started with a curiosity about how the web works, and quickly grew into a passion for creating digital experiences that are not just functional, but delightful.\n\nI specialize in React/Next.js on the frontend and Node.js on the backend, with a strong eye for design and user experience. I believe great software is the result of clear thinking, good communication, and relentless iteration.\n\nWhen I''m not coding, I''m exploring new technologies, contributing to open source, or writing about my experiences in web development.', 'jeff@example.com', 'Your City, Country', 'UTC+0', 'available', 'jeffdev', 8, 45, 18);

-- Skills
INSERT INTO `skills` (`name`, `category`, `proficiency`, `icon_name`, `color`, `sort_order`, `is_featured`) VALUES
('React', 'frontend', 95, 'Code', '#61DAFB', 1, 1),
('Next.js', 'frontend', 92, 'Globe', '#FFFFFF', 2, 1),
('TypeScript', 'frontend', 88, 'FileCode', '#3178C6', 3, 1),
('Tailwind CSS', 'frontend', 90, 'Palette', '#38BDF8', 4, 1),
('JavaScript', 'frontend', 95, 'Code2', '#F7DF1E', 5, 1),
('HTML/CSS', 'frontend', 95, 'Layout', '#E34F26', 6, 0),
('Node.js', 'backend', 90, 'Server', '#339933', 7, 1),
('Express.js', 'backend', 88, 'Zap', '#FFFFFF', 8, 1),
('MySQL', 'database', 85, 'Database', '#4479A1', 9, 1),
('PostgreSQL', 'database', 82, 'Database', '#336791', 10, 0),
('MongoDB', 'database', 80, 'Database', '#47A248', 11, 0),
('Docker', 'devops', 78, 'Box', '#2496ED', 12, 1),
('Git', 'tools', 92, 'GitBranch', '#F05032', 13, 1),
('VS Code', 'tools', 95, 'Code', '#007ACC', 14, 0),
('Figma', 'tools', 75, 'Figma', '#F24E1E', 15, 0),
('React Native', 'mobile', 75, 'Smartphone', '#61DAFB', 16, 0),
('Flutter', 'mobile', 70, 'Smartphone', '#54C5F8', 17, 0),
('GraphQL', 'backend', 78, 'Share2', '#E10098', 18, 0),
('Redis', 'database', 72, 'Zap', '#DC382D', 19, 0),
('AWS', 'devops', 70, 'Cloud', '#FF9900', 20, 0);

-- Projects
INSERT INTO `projects` (`slug`, `title`, `tagline`, `description`, `problem`, `approach`, `solution`, `results`, `learnings`, `cover_image_url`, `live_url`, `github_url`, `category`, `status`, `role`, `timeframe`, `is_featured`, `is_pinned`, `sort_order`) VALUES
('project-alpha', 'Project Alpha', 'A full-stack task management platform with real-time collaboration.', 'A comprehensive task management application with real-time features, team collaboration, and advanced project tracking.', 'Teams were struggling with fragmented project management — using multiple tools that didn''t communicate, leading to missed deadlines and poor visibility.', 'I designed a unified platform using React for the frontend, Node.js for the API, and WebSockets for real-time updates. The focus was on performance and a clean, intuitive UI.', 'Delivered a full-stack platform with real-time collaboration, drag-and-drop task boards, team permissions, and email notifications. Reduced context-switching for teams significantly.', 'Adopted by 200+ users in first month. Reduced project management tool costs by 60% for pilot teams. 98% uptime over 6 months.', 'WebSocket state management at scale is complex — learned to use dedicated state machines. Real-time conflict resolution for collaborative editing requires careful planning.', '/images/projects/alpha-cover.jpg', 'https://example.com', 'https://github.com', 'fullstack', 'completed', 'Lead Developer', '3 months • 2024', 1, 1, 1),
('project-beta', 'Project Beta', 'E-commerce platform built with Next.js and Tailwind.', 'A modern e-commerce solution with dynamic product filtering, cart management, Stripe payments, and an admin dashboard.', 'The client needed to migrate from a legacy e-commerce platform to a modern stack without losing SEO rankings.', 'Used Next.js for SSR/SSG to maintain SEO, integrated Stripe for payments, and built a custom CMS-backed admin panel.', 'Migrated successfully with zero SEO regression. Launched new features: wishlist, product comparison, and a loyalty program.', 'SEO traffic maintained and grew 15% post-migration. Checkout conversion improved 22%. Page load time dropped from 4.2s to 1.1s.', 'SEO-preserving migrations require careful redirect mapping and crawl budget management. Next.js Image component dramatically helps Core Web Vitals.', '/images/projects/beta-cover.jpg', 'https://example.com', 'https://github.com', 'web', 'completed', 'Full-Stack Developer', '4 months • 2024', 1, 0, 2),
('project-gamma', 'Project Gamma', 'Cross-platform mobile app built with Flutter and Firebase.', 'A fitness tracking mobile application with workout planning, progress visualization, and social features.', 'Fitness enthusiasts were using 3–4 separate apps — one for tracking, one for planning, one for community — creating friction in their routine.', 'Built with Flutter for cross-platform reach (iOS + Android), Firebase for real-time data and auth, and custom chart visualizations.', 'Single unified fitness app with workout planner, progress charts, personal records tracking, and a community challenge feature.', '4.8/5 rating on App Store. 500+ downloads in first month. 65% daily active user retention.', 'Flutter is genuinely excellent for cross-platform — most platform-specific code was for native health APIs. Firebase Firestore requires careful data modeling for performance.', '/images/projects/gamma-cover.jpg', 'https://example.com', 'https://github.com', 'mobile', 'completed', 'Mobile Developer', '5 months • 2023', 1, 0, 3);

-- Experience
INSERT INTO `experience` (`type`, `title`, `organization`, `location`, `start_date`, `end_date`, `is_current`, `description`, `achievements`, `technologies`, `sort_order`) VALUES
('work', 'Senior Full-Stack Developer', 'Tech Company Inc.', 'Remote', '2023-01-01', NULL, 1, 'Leading frontend and backend development for a SaaS platform serving 50,000+ users. Responsible for architecture decisions, code reviews, and mentoring junior developers.', '["Reduced API response times by 40% through caching strategy redesign", "Led migration from CRA to Next.js, improving Core Web Vitals scores by 60%", "Mentored 3 junior developers, 2 of whom were promoted within 12 months", "Implemented CI/CD pipeline reducing deployment time from 45 to 8 minutes"]', '["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"]', 1),
('work', 'Full-Stack Developer', 'Digital Agency', 'Your City', '2021-03-01', '2022-12-31', 0, 'Built and maintained web applications for clients across e-commerce, healthcare, and fintech sectors. Delivered 8+ client projects over 2 years.', '["Delivered 8 client projects on time and within budget", "Built reusable component library that reduced new project setup time by 35%", "Introduced TypeScript to the team, eliminating class of runtime errors", "Improved Lighthouse scores to 95+ across all managed projects"]', '["React", "Vue.js", "Node.js", "MySQL", "MongoDB", "Tailwind CSS"]', 2),
('work', 'Junior Developer', 'Startup XYZ', 'Your City', '2020-06-01', '2021-02-28', 0, 'First professional role — built features for a B2B SaaS product and learned the fundamentals of production web development.', '["Built user authentication module used by 5,000+ users", "Reduced page load time on dashboard by 30% through code splitting", "Contributed 50+ pull requests across frontend and backend codebases"]', '["React", "Express.js", "MySQL", "CSS Modules"]', 3),
('education', 'B.Sc Computer Science', 'University of Technology', 'Your City', '2016-09-01', '2020-06-30', 0, 'Focused on software engineering, algorithms, and web technologies. Final year project: a machine learning-powered code review assistant.', '["First Class Honours", "Final year project awarded Best CS Project 2020", "President of the Web Development Society", "Dean''s List 2018, 2019, 2020"]', '["Python", "Java", "C++", "Data Structures", "Machine Learning"]', 4);

-- Certifications
INSERT INTO `certifications` (`title`, `issuing_org`, `issue_date`, `category`, `sort_order`) VALUES
('AWS Certified Developer – Associate', 'Amazon Web Services', '2023-06-15', 'cloud', 1),
('Meta Front-End Developer Certificate', 'Meta', '2022-11-20', 'web', 2),
('MongoDB Certified Developer', 'MongoDB University', '2022-08-10', 'database', 3),
('Google Professional Cloud Developer', 'Google Cloud', '2023-09-05', 'cloud', 4);

-- Testimonials
INSERT INTO `testimonials` (`author_name`, `author_title`, `author_company`, `quote`, `rating`, `is_featured`, `sort_order`) VALUES
('Sarah Johnson', 'CTO', 'TechStartup Ltd', 'Jeff delivered our platform on time and it exceeded our expectations. His attention to detail and ability to communicate complex technical concepts made him an invaluable partner.', 5, 1, 1),
('Michael Chen', 'Product Manager', 'Digital Agency', 'Working with Jeff was a pleasure. He not only built exactly what we needed but proactively suggested improvements that made the product significantly better. Highly recommended.', 5, 1, 2),
('Emma Williams', 'Founder', 'E-Commerce Brand', 'Jeff transformed our online store completely. Page speeds improved dramatically, conversions went up, and the codebase is so much cleaner. He''s a rare developer who cares about quality.', 5, 1, 3);

-- Site settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `description`) VALUES
('site_title', 'Jeff Developer — Full-Stack Developer Portfolio', 'Browser tab title'),
('site_description', 'Full-stack developer building fast, accessible web apps. Portfolio showcasing projects, skills, and experience.', 'Meta description for SEO'),
('site_keywords', 'full-stack developer, react, node.js, web development, portfolio', 'Meta keywords'),
('contact_email', 'jeff@example.com', 'Public contact email address'),
('calendly_url', '', 'Calendly booking URL (optional)'),
('github_username', 'jeffdev', 'GitHub username for API integration'),
('cv_download_url', '/files/jeff-cv.pdf', 'Path to downloadable CV PDF'),
('maintenance_mode', '0', 'Set to 1 to enable maintenance mode'),
('og_image_url', '/images/og-image.jpg', 'Open Graph social preview image');

-- ============================================================
-- Views for convenience
-- ============================================================

CREATE OR REPLACE VIEW `v_featured_projects` AS
SELECT 
  p.*,
  GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR ', ') AS tech_stack
FROM `projects` p
LEFT JOIN `project_technologies` pt ON p.id = pt.project_id
LEFT JOIN `skills` s ON pt.skill_id = s.id
WHERE p.is_featured = 1
GROUP BY p.id
ORDER BY p.sort_order;

CREATE OR REPLACE VIEW `v_timeline` AS
SELECT 
  id,
  type,
  title,
  organization,
  organization_logo_url,
  location,
  start_date,
  end_date,
  is_current,
  description,
  achievements,
  technologies,
  sort_order
FROM `experience`
ORDER BY start_date DESC;
