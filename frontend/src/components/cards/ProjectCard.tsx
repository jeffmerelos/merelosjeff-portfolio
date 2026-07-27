'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
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
  live_url?: string;
  github_url?: string;
  technologies?: Technology[];
}

interface ProjectCardProps {
  project: Project;
  view: 'grid' | 'list';
}

export default function ProjectCard({ project, view }: ProjectCardProps) {
  if (view === 'list') {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div className="card hover:border-neon-pink/50 transition-all cursor-pointer">
          <div className="flex gap-4">
            {project.cover_image_url && (
              <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={project.cover_image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="heading-3">{project.title}</h3>
                  <p className="text-sm text-text-muted font-mono mb-2">{project.category}</p>
                </div>
                {project.is_featured === 1 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-pink/10 text-neon-pink">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-text-muted text-sm mb-3">{project.tagline}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech.name}
                      className="text-xs px-2 py-1 rounded-full border border-line text-text-muted"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-xs text-text-muted">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="card group hover:border-neon-pink/50 transition-all cursor-pointer h-full flex flex-col">
        {/* Cover Image */}
        {project.cover_image_url && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-bg-input">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Featured Badge */}
        {project.is_featured === 1 && (
          <div className="mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-neon-pink/10 text-neon-pink font-mono">
              Featured
            </span>
          </div>
        )}

        {/* Category */}
        <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-2">
          {project.category}
        </p>

        {/* Title */}
        <h3 className="heading-3 mb-2 group-hover:text-neon-pink transition-colors">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-text-muted mb-4 flex-grow">{project.tagline}</p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.name}
                className="text-xs px-2 py-1 rounded-full border border-line text-text-muted"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-text-muted px-2 py-1">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 pt-4 border-t border-line">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-colors text-sm"
            >
              <ExternalLink size={14} />
              Live
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-colors text-sm"
            >
              <Github size={14} />
              Code
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
