'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface Technology {
  name: string;
  color: string;
}

interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  cover_image_url: string;
  category: string;
  is_featured: number;
  live_url: string;
  github_url: string;
  technologies: Technology[];
}

interface ProjectCardProps {
  project: Project;
  view?: 'grid' | 'list';
}

export default function ProjectCard({ project, view = 'grid' }: ProjectCardProps) {
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ x: 4 }}
        className="card flex items-center gap-6 hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300"
      >
        <div className="w-20 h-20 bg-bg-void rounded-lg flex-shrink-0 overflow-hidden">
          {project.cover_image_url ? (
            <img src={project.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-neon opacity-20" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-text-primary truncate">{project.title}</h3>
          <p className="text-text-muted text-sm truncate mt-1">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span key={tech.name} className="font-mono text-xs text-text-muted border border-line rounded px-2 py-0.5">
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} live site`} className="btn-icon w-9 h-9">
              <ExternalLink size={15} />
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`} className="btn-icon w-9 h-9">
              <Github size={15} />
            </a>
          )}
          <Link href={`/projects/${project.slug}`} className="btn-icon w-9 h-9" aria-label={`View ${project.title} case study`}>
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card group cursor-pointer hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300 overflow-hidden p-0"
    >
      {/* Cover image */}
      <Link href={`/projects/${project.slug}`} className="block relative overflow-hidden h-48" tabIndex={-1} aria-hidden="true">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={`${project.title} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-violet/20 flex items-center justify-center">
            <span className="font-display text-4xl font-bold text-gradient opacity-50">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="glass px-3 py-1 rounded-full text-xs font-mono text-neon-blue border border-neon-blue/30">
            {project.category}
          </span>
        </div>

        {/* Featured badge */}
        {project.is_featured === 1 && (
          <div className="absolute top-3 right-3">
            <span className="glass px-3 py-1 rounded-full text-xs font-mono text-neon-pink border border-neon-pink/30">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-neon-pink transition-colors mb-1">
            {project.title}
          </h3>
        </Link>
        <p className="text-text-muted text-sm line-clamp-2 leading-relaxed mb-4">
          {project.tagline}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 4).map((tech) => (
            <span key={tech.name} className="font-mono text-xs text-text-muted border border-line rounded px-2 py-0.5 hover:border-neon-violet hover:text-neon-violet transition-colors">
              {tech.name}
            </span>
          ))}
          {(project.technologies?.length || 0) > 4 && (
            <span className="font-mono text-xs text-text-muted">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 text-sm text-neon-blue hover:text-neon-pink transition-colors font-medium"
          >
            View Case Study <ArrowRight size={14} />
          </Link>

          <div className="flex items-center gap-2">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="text-text-muted hover:text-neon-pink transition-colors">
                <ExternalLink size={16} />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title} GitHub`}
                className="text-text-muted hover:text-neon-pink transition-colors">
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
