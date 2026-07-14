'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/cards/ProjectCard';
import { getProjects } from '@/lib/api';
import { Search, Grid3X3, List } from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORIES = ['All', 'Web', 'Mobile', 'Fullstack', 'Open Source'];

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
  technologies: Array<{ name: string; color: string }>;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = projects;

    if (activeCategory !== 'All') {
      result = result.filter((p) =>
        p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.tagline?.toLowerCase().includes(term) ||
          p.technologies?.some((t) => t.name.toLowerCase().includes(term))
      );
    }

    setFiltered(result);
  }, [search, activeCategory, projects]);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="section pb-8">
          <div className="container">
            <p className="eyebrow mb-4">// my work</p>
            <h1 className="heading-1 mb-4">
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed">
              A collection of things I&apos;ve built — from full-stack web apps to mobile experiences.
              Each project represents a real problem solved with thoughtful engineering.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 border-y border-line bg-bg-void/90 backdrop-blur-md py-4">
          <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    'px-4 py-1.5 rounded-full text-sm font-mono border transition-all',
                    activeCategory === cat
                      ? 'border-neon-pink text-neon-pink bg-neon-pink/10'
                      : 'border-line text-text-muted hover:border-neon-pink hover:text-neon-pink'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + view toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-9 py-2 text-sm w-48"
                  aria-label="Search projects"
                />
              </div>
              <div className="flex border border-line rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={clsx('p-2', view === 'grid' ? 'bg-neon-pink text-white' : 'text-text-muted hover:text-text-primary')}
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={clsx('p-2', view === 'list' ? 'bg-neon-pink text-white' : 'text-text-muted hover:text-text-primary')}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="section">
          <div className="container">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-64 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted font-mono">// No projects found matching your criteria</p>
              </div>
            ) : (
              <div className={clsx(
                view === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              )}>
                {filtered.map((project) => (
                  <ProjectCard key={project.id} project={project} view={view} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
