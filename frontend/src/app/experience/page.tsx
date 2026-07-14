'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getExperience } from '@/lib/api';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Download } from 'lucide-react';
import { clsx } from 'clsx';

interface Experience {
  id: number;
  type: 'work' | 'education';
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: number;
  description: string;
  achievements: string[];
  technologies: string[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'work' | 'education'>('all');

  useEffect(() => {
    getExperience()
      .then(setExperience)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? experience : experience.filter((e) => e.type === filter);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        <section className="section">
          <div className="container">
            <p className="eyebrow mb-4">// career journey</p>
            <h1 className="heading-1 mb-4">
              My <span className="text-gradient">Experience</span>
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed mb-10">
              A timeline of roles, companies, and education that shaped how I think about building software.
            </p>

            {/* Filter */}
            <div className="flex gap-3 mb-12" role="group" aria-label="Filter by type">
              {(['all', 'work', 'education'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-mono border transition-all capitalize',
                    filter === f
                      ? 'border-neon-pink text-neon-pink bg-neon-pink/10'
                      : 'border-line text-text-muted hover:border-neon-pink hover:text-neon-pink'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Timeline */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-line hidden md:block" aria-hidden="true" />

                <div className="space-y-8">
                  {filtered.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="md:pl-16 relative"
                    >
                      {/* Timeline node */}
                      <div className={clsx(
                        'absolute left-3.5 top-6 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center',
                        item.type === 'work' ? 'border-neon-pink bg-bg-void' : 'border-neon-violet bg-bg-void'
                      )} aria-hidden="true">
                        <div className={clsx(
                          'w-2 h-2 rounded-full',
                          item.type === 'work' ? 'bg-neon-pink' : 'bg-neon-violet'
                        )} />
                      </div>

                      <div className={clsx(
                        'card hover:border-neon-pink hover:shadow-neon-pink transition-all duration-300',
                        item.is_current ? 'border-neon-pink/40' : ''
                      )}>
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {item.type === 'work'
                                ? <Briefcase size={14} className="text-neon-pink" aria-hidden="true" />
                                : <GraduationCap size={14} className="text-neon-violet" aria-hidden="true" />
                              }
                              <span className={clsx(
                                'font-mono text-xs uppercase tracking-wider',
                                item.type === 'work' ? 'text-neon-pink' : 'text-neon-violet'
                              )}>
                                {item.type}
                              </span>
                              {item.is_current === 1 && (
                                <span className="font-mono text-xs text-neon-blue border border-neon-blue/30 px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <h2 className="font-display font-bold text-xl text-text-primary">{item.title}</h2>
                            <p className="text-text-muted font-medium">{item.organization}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm text-text-muted">
                              {formatDate(item.start_date)} — {item.is_current ? 'Present' : item.end_date ? formatDate(item.end_date) : ''}
                            </p>
                            {item.location && (
                              <p className="font-mono text-xs text-text-muted mt-1">{item.location}</p>
                            )}
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-text-muted text-sm leading-relaxed mb-4">{item.description}</p>
                        )}

                        {item.achievements?.length > 0 && (
                          <ul className="space-y-1 mb-4" aria-label="Achievements">
                            {item.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <span className="text-neon-pink mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                                {ach}
                              </li>
                            ))}
                          </ul>
                        )}

                        {item.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                            {item.technologies.map((tech) => (
                              <span key={tech} className="font-mono text-xs border border-line text-text-muted rounded px-2 py-0.5">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume CTA */}
            <div className="mt-16 text-center">
              <a href="/files/jeff-cv.pdf" download className="btn-primary">
                <Download size={18} /> Download Full Résumé
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
