'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSkills } from '@/lib/api';
import { motion } from 'framer-motion';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  tools: 'Tools',
  mobile: 'Mobile',
  soft_skills: 'Soft Skills',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#4EA8FF',
  backend: '#FF1B6B',
  database: '#9D4EDD',
  devops: '#FFB800',
  tools: '#00FFAB',
  mobile: '#FF6B6B',
};

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
  color: string;
}

export default function SkillsPage() {
  const [grouped, setGrouped] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(({ grouped }) => setGrouped(grouped || {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        <section className="section">
          <div className="container">
            <p className="eyebrow mb-4">// tech stack</p>
            <h1 className="heading-1 mb-4">
              Skills &amp; <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed mb-12">
              Technologies I work with daily and tools I&apos;ve used across production projects.
              Proficiency bars reflect real-world experience, not just familiarity.
            </p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(grouped).map(([category, skills]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card"
                  >
                    <h2 className="font-display font-bold text-lg mb-5 uppercase" style={{ color: CATEGORY_COLORS[category] || '#9A9AA5' }}>
                      {CATEGORY_LABELS[category] || category}
                    </h2>

                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-text-primary">{skill.name}</span>
                            <span className="font-mono text-xs text-text-muted">{skill.proficiency}%</span>
                          </div>
                          <div className="h-1.5 bg-bg-void rounded-full overflow-hidden" role="progressbar"
                            aria-valuenow={skill.proficiency} aria-valuemin={0} aria-valuemax={100}
                            aria-label={`${skill.name} proficiency: ${skill.proficiency}%`}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${skill.color || '#FF1B6B'}, #9D4EDD)` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
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
