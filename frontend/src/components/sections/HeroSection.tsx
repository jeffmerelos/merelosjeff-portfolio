'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import { Download, ChevronDown } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-bg-void pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Animated background */}
      <ParticleBackground />

      {/* Scanline effect */}
      <div className="scanline" aria-hidden="true" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            {/* Status dot */}
            <motion.div variants={item} className="flex items-center gap-2 mb-6">
              <span className="status-dot" aria-hidden="true" />
              <span className="font-mono text-sm text-neon-blue">// available for work</span>
            </motion.div>

            {/* Glitch headline */}
            <motion.h1
              id="hero-heading"
              variants={item}
              className="heading-1 mb-4 glitch-text"
            >
              <span className="block text-text-primary">JEFFERSON BACARO MERELOS</span>
              <span className="block text-gradient">SOFTWARE DEVELOPER</span>
            </motion.h1>

            {/* Typing effect subtitle */}
            <motion.div variants={item} className="mb-6 h-8">
              <span className="font-mono text-lg text-text-muted">
                <TypeAnimation
                  sequence={[
                    'Junior Software Developer',
                    2000,
                    'React & Next.js Especialist',
                    2000,
                    'Node.js Specialist',
                    2000,
                    'UI/UX Enthusiast',
                    2000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                />
              </span>
            </motion.div>

            {/* Value proposition */}
            <motion.p
              variants={item}
              className="text-text-muted text-lg leading-relaxed mb-8 max-w-lg"
            >
              Building fast, accessible web applications that solve real problems.
              From pixel-perfect UIs to scalable APIs — I ship software that works.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary">
                ▸ View Projects
              </Link>
              <a href="/files/Jeff-CV.pdf" download="Jeff-Developer-CV.pdf" className="btn-secondary">
                <Download size={18} />
                Download CV
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Avatar / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Avatar placeholder with neon rim-light */}
            <div className="relative w-80 h-80">
              {/* Neon rim-light rings */}
              <div className="absolute inset-0 rounded-full border-2 border-neon-pink/30 animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full border border-neon-violet/20" />

              {/* Avatar */}
              <div className="absolute inset-2 rounded-full bg-bg-panel border border-neon-pink/50 overflow-hidden shadow-neon-pink-lg flex items-center justify-center">
                {/* Replace with actual <Image /> of your avatar */}
                <span className="font-display text-7xl font-bold text-gradient select-none" aria-label="JD initials">
                  JD
                </span>
              </div>

              {/* Floating tech badges */}
              {[
                { label: 'React', pos: '-top-4 -left-4', color: 'border-neon-blue' },
                { label: 'Node.js', pos: '-top-4 -right-4', color: 'border-neon-violet' },
                { label: 'MySQL', pos: '-bottom-4 -left-8', color: 'border-neon-pink' },
                { label: 'Next.js', pos: '-bottom-4 -right-4', color: 'border-neon-blue' },
              ].map(({ label, pos, color }) => (
                <div
                  key={label}
                  className={`absolute ${pos} glass px-3 py-1.5 rounded-full border ${color} text-xs font-mono text-text-primary animate-float`}
                  style={{ animationDelay: `${Math.random() * 2}s` }}
                >
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="font-mono text-xs text-text-muted">scroll</span>
          <ChevronDown size={16} className="text-neon-pink animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
