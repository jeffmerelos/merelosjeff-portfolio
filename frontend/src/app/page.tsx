'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Stats Strip */}
        <section className="section border-t border-line bg-bg-panel/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {[
                { label: 'Years Experience', value: '5+' },
                { label: 'Projects Shipped', value: '30+' },
                { label: 'Happy Clients', value: '12+' },
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
