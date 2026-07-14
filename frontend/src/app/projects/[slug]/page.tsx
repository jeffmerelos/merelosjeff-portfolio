import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProject } from '@/lib/api';
import { ExternalLink, Github, ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const project = await getProject(params.slug);
    return {
      title: `${project.title} — Jeff Developer`,
      description: project.tagline || project.description,
    };
  } catch {
    return { title: 'Project — Jeff Developer' };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  let project: any = null;

  try {
    project = await getProject(params.slug);
  } catch {
    return (
      <div id="top">
        <Navbar />
        <main className="pt-32 section">
          <div className="container text-center">
            <h1 className="heading-2 text-text-muted">Project Not Found</h1>
            <Link href="/projects" className="btn-primary mt-8 inline-flex">
              <ArrowLeft size={18} /> Back to Projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        {/* Hero banner */}
        <section className="relative h-72 md:h-96 bg-bg-panel overflow-hidden">
          {project.cover_image_url ? (
            <img src={project.cover_image_url} alt={`${project.title} cover`} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-violet/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/50 to-transparent" />

          <div className="absolute bottom-8 left-0 right-0">
            <div className="container">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="eyebrow block mb-2">{project.category}</span>
                  <h1 className="heading-2 text-text-primary">{project.title}</h1>
                  <p className="text-text-muted mt-2 max-w-xl">{project.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      <ExternalLink size={16} /> Live Site
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      <Github size={16} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meta strip */}
        <div className="border-b border-line bg-bg-panel/50">
          <div className="container py-4 flex flex-wrap gap-6">
            {project.role && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <User size={14} className="text-neon-violet" />
                <span><strong className="text-text-primary">Role:</strong> {project.role}</span>
              </div>
            )}
            {project.timeframe && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Clock size={14} className="text-neon-blue" />
                <span><strong className="text-text-primary">Timeframe:</strong> {project.timeframe}</span>
              </div>
            )}
          </div>
        </div>

        <div className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Narrative */}
              {project.problem && (
                <div>
                  <h2 className="heading-3 mb-4 text-neon-pink">The Problem</h2>
                  <p className="text-text-muted leading-relaxed">{project.problem}</p>
                </div>
              )}
              {project.approach && (
                <div>
                  <h2 className="heading-3 mb-4 text-neon-violet">The Approach</h2>
                  <p className="text-text-muted leading-relaxed">{project.approach}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h2 className="heading-3 mb-4 text-neon-blue">The Solution</h2>
                  <p className="text-text-muted leading-relaxed">{project.solution}</p>
                </div>
              )}
              {project.results && (
                <div className="card border-neon-pink/30">
                  <h2 className="heading-3 mb-4 text-text-primary">Results &amp; Metrics</h2>
                  <p className="text-text-muted leading-relaxed">{project.results}</p>
                </div>
              )}
              {project.learnings && (
                <div>
                  <h2 className="heading-3 mb-4 text-text-primary">Challenges &amp; Learnings</h2>
                  <p className="text-text-muted leading-relaxed">{project.learnings}</p>
                </div>
              )}
            </div>

            {/* Sidebar: tech stack */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech: any) => (
                    <span key={tech.name} className="px-3 py-1.5 bg-bg-void border border-line rounded-full text-xs font-mono text-text-primary hover:border-neon-blue hover:text-neon-blue transition-colors">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prev/Next navigation */}
        <nav className="border-t border-line" aria-label="Project navigation">
          <div className="container py-8 flex items-center justify-between gap-4">
            {project.prev ? (
              <Link href={`/projects/${project.prev.slug}`} className="flex items-center gap-2 text-text-muted hover:text-neon-pink transition-colors">
                <ArrowLeft size={18} />
                <div>
                  <p className="font-mono text-xs">Previous</p>
                  <p className="font-display font-bold">{project.prev.title}</p>
                </div>
              </Link>
            ) : <div />}

            <Link href="/projects" className="btn-secondary text-sm py-2">
              All Projects
            </Link>

            {project.next ? (
              <Link href={`/projects/${project.next.slug}`} className="flex items-center gap-2 text-text-muted hover:text-neon-pink transition-colors text-right">
                <div>
                  <p className="font-mono text-xs">Next</p>
                  <p className="font-display font-bold">{project.next.title}</p>
                </div>
                <ArrowRight size={18} />
              </Link>
            ) : <div />}
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
