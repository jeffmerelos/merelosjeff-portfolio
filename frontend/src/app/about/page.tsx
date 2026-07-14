'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProfile, getSkills } from '@/lib/api';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Clock, Award, Users, Code } from 'lucide-react';

interface Profile {
  id: number;
  full_name: string;
  title: string;
  tagline: string;
  bio_short: string;
  bio_long: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  availability_status: 'available' | 'busy' | 'not_available';
  avatar_url: string;
  resume_url: string;
  github_username: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  years_experience: number;
  projects_shipped: number;
  happy_clients: number;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
  color: string;
  is_featured: boolean;
}

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getSkills()])
      .then(([profileData, skillsData]) => {
        setProfile(profileData);
        setSkills(skillsData.skills || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div id="top">
        <Navbar />
        <main className="pt-24">
          <section className="section">
            <div className="container">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-bg-panel rounded w-1/3"></div>
                <div className="h-64 bg-bg-panel rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-bg-panel rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div id="top">
        <Navbar />
        <main className="pt-24">
          <section className="section">
            <div className="container text-center">
              <p className="font-mono text-text-muted">// Profile data not found</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const availabilityColors = {
    available: 'text-green-400',
    busy: 'text-yellow-400',
    not_available: 'text-red-400'
  };

  const availabilityLabels = {
    available: 'Available for work',
    busy: 'Currently busy',
    not_available: 'Not available'
  };

  const featuredSkills = skills.filter(skill => skill.is_featured);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <p className="eyebrow mb-4">// about me</p>
              <h1 className="heading-1 mb-6">
                Hi, I'm <span className="text-gradient">{profile.full_name.split(' ')[0]}</span>
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Avatar & Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-1"
                >
                  <div className="card text-center mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet flex items-center justify-center text-2xl font-display font-bold">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        profile.full_name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <h2 className="font-display font-bold text-lg mb-1">{profile.full_name}</h2>
                    <p className="text-neon-violet text-sm mb-3">{profile.title}</p>
                    
                    <div className={`flex items-center justify-center gap-2 mb-4 ${availabilityColors[profile.availability_status]}`}>
                      <div className="status-dot"></div>
                      <span className="font-mono text-xs">{availabilityLabels[profile.availability_status]}</span>
                    </div>

                    <div className="space-y-2 text-sm text-text-muted">
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.timezone && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{profile.timezone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <a href={`mailto:${profile.email}`} className="link">{profile.email}</a>
                      </div>
                    </div>

                    {profile.resume_url && (
                      <a href={profile.resume_url} download className="btn-primary w-full mt-4">
                        <Download size={16} /> Download CV
                      </a>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="card">
                    <h3 className="eyebrow mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted text-sm">Experience</span>
                        <span className="font-mono text-neon-pink">{profile.years_experience}+ years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted text-sm">Projects</span>
                        <span className="font-mono text-neon-violet">{profile.projects_shipped}+ shipped</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted text-sm">Clients</span>
                        <span className="font-mono text-neon-blue">{profile.happy_clients}+ happy</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bio Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <div className="card mb-6">
                    <h3 className="eyebrow mb-4">My Story</h3>
                    <div className="prose prose-invert max-w-none">
                      {profile.bio_long.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-text-muted leading-relaxed mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Featured Skills */}
                  {featuredSkills.length > 0 && (
                    <div className="card">
                      <h3 className="eyebrow mb-4">Core Technologies</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {featuredSkills.map((skill, i) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.05) }}
                            className="text-center p-3 rounded-lg border border-line hover:border-neon-pink/50 transition-colors"
                          >
                            <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                              <Code size={20} style={{ color: skill.color || '#9D4EDD' }} />
                            </div>
                            <div className="font-mono text-xs font-bold mb-1">{skill.name}</div>
                            <div className="text-text-muted text-xs">{skill.proficiency}%</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-bg-panel/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="heading-2 mb-4">
                Let's Build Something <span className="text-gradient">Amazing</span>
              </h2>
              <p className="text-text-muted leading-relaxed mb-8">
                {profile.tagline || "I'm always excited to work on new projects and solve interesting problems."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/contact" className="btn-primary">
                  <Mail size={18} /> Get In Touch
                </a>
                <a href="/projects" className="btn-secondary">
                  <Code size={18} /> View My Work
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}