'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import { getProfile } from '@/lib/api';
import Link from 'next/link';

interface Profile {
  years_experience: number;
  projects_shipped: number;
  happy_clients: number;
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(console.error);
  }, []);

  return (
    <div id="top">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Stats Strip - From API */}
        <section className="section border-t border-line bg-bg-panel/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {[
                { label: 'Years Experience', value: `${profile?.years_experience || 8}+` },
                { label: 'Projects Shipped', value: `${profile?.projects_shipped || 45}+` },
                { label: 'Happy Clients', value: `${profile?.happy_clients || 18}+` },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="heading-2 text-gradient mb-2">{stat.value}</div>
                  <div className="text-text-muted text-sm font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section border-t border-line bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-violet/5">
          <div className="container text-center">
            <p className="eyebrow mb-4">// ready to work together?</p>
            <h2 className="heading-2 mb-6">
              Let's Build Something <span className="text-gradient">Incredible</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
              I'm currently available for freelance projects and full-time opportunities. 
              Whether you need a complete application, performance optimization, or technical consulting,
              let's discuss how I can help bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Start a Project
              </Link>
              <a 
                href="/files/Jeff-CV.pdf" 
                download="Jeff-Developer-CV.pdf"
                className="btn-secondary"
              >
                Download CV
              </a>
            </div>
          </div>
        </section>

        {/* Navigation to other sections */}
        <section className="section">
          <div className="container text-center">
            <p className="eyebrow mb-4">// explore more</p>
            <h2 className="heading-2 mb-8">
              <span className="text-gradient">Navigate</span> My Portfolio
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { href: '/about', label: 'About Me' },
                { href: '/projects', label: 'Featured Projects' },
                { href: '/skills', label: 'Skills & Tech' },
                { href: '/experience', label: 'Experience' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card hover:border-neon-pink/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
