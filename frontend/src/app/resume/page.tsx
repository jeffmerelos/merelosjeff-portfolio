'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProfile, getExperience, getSkills } from '@/lib/api';
import { Download, Printer } from 'lucide-react';

export default function ResumePage() {
  const [profile, setProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile(),
      getExperience({ type: 'all' }),
      getSkills()
    ])
      .then(([profileData, experienceData, skillsData]) => {
        setProfile(profileData);
        setExperience(experienceData);
        setSkills(skillsData.featured || skillsData.slice(0, 10));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div id="top">
        <Navbar />
        <main className="pt-24">
          <div className="container">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-bg-panel rounded w-1/3"></div>
              <div className="h-96 bg-bg-panel rounded"></div>
            </div>
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
        <section className="section">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow mb-2">// curriculum vitae</p>
                <h1 className="heading-2">
                  My <span className="text-gradient">Résumé</span>
                </h1>
              </div>
              <div className="flex gap-3">
                <a href="/files/Jeff-CV.pdf" download="Jeff-Developer-CV.pdf" className="btn-primary">
                  <Download size={18} /> Download PDF
                </a>
                <button onClick={() => window.print()} className="btn-secondary">
                  <Printer size={18} /> Print
                </button>
              </div>
            </div>

            {/* Resume preview — styled version */}
            <div className="card max-w-4xl mx-auto print:shadow-none print:border-none" id="resume-content">
              {/* Header */}
              <div className="border-b border-line pb-6 mb-6">
                <h2 className="heading-2">{profile?.full_name || 'Jeff Developer'}</h2>
                <p className="text-neon-pink font-mono text-sm mt-1">{profile?.title || 'Full-Stack Developer'}</p>
                <div className="flex flex-wrap gap-4 mt-3 font-mono text-xs text-text-muted">
                  <span>{profile?.email || 'jeff@example.com'}</span>
                  <span>{profile?.location || 'Your City, Country'}</span>
                  {profile?.github_username && (
                    <a href={`https://github.com/${profile.github_username}`} className="link">
                      github.com/{profile.github_username}
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} className="link">LinkedIn Profile</a>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="eyebrow mb-2">Summary</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {profile?.bio_short || 'Full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Next.js, and Node.js. Passionate about performance, accessibility, and clean code.'}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="eyebrow mb-4">Experience</h3>
                <div className="space-y-4">
                  {experience.slice(0, 4).map((job) => (
                    <div key={job.id} className="border-l-2 border-neon-pink/30 pl-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <h4 className="font-display font-bold text-text-primary">{job.title}</h4>
                        <span className="font-mono text-xs text-text-muted">
                          {new Date(job.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} – 
                          {job.end_date ? new Date(job.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                        </span>
                      </div>
                      <p className="text-neon-violet text-sm font-medium">{job.organization} · {job.location}</p>
                      {job.achievements && Array.isArray(job.achievements) && job.achievements.length > 0 && (
                        <ul className="mt-2 text-xs text-text-muted space-y-1">
                          {job.achievements.slice(0, 2).map((achievement: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-neon-pink mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="eyebrow mb-4">Education</h3>
                <div className="space-y-4">
                  {experience.filter(exp => exp.type === 'education').slice(0, 2).map((edu) => (
                    <div key={edu.id} className="border-l-2 border-neon-violet/30 pl-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <h4 className="font-display font-bold text-text-primary">{edu.title}</h4>
                        <span className="font-mono text-xs text-text-muted">
                          {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' })} – 
                          {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'}
                        </span>
                      </div>
                      <p className="text-neon-violet text-sm font-medium">{edu.organization}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="eyebrow mb-4">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="font-mono text-xs border border-line rounded px-2 py-1 text-text-muted">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
