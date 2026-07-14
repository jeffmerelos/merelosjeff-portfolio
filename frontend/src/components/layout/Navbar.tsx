'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-line/50 py-3'
            : 'bg-transparent border-b border-transparent py-5'
        )}
      >
        <nav className="container flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2" aria-label="Jeff Developer — Home">
            <span className="font-display font-bold text-xl text-text-primary group-hover:text-neon-pink transition-colors">
              ◆ JEFF<span className="text-gradient">.</span>DEV
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'font-body text-sm font-medium transition-colors duration-200 hover:text-neon-pink',
                    pathname === link.href ? 'text-neon-pink' : 'text-text-muted'
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="/files/Jeff-CV.pdf"
              download="Jeff-Developer-CV.pdf"
              className="hidden md:inline-flex btn-secondary text-sm py-2 px-4"
              aria-label="Download Resume PDF"
            >
              <Download size={15} />
              Resume
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden btn-icon w-10 h-10"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg-void/95 backdrop-blur-xl pt-24"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="container flex-1 flex flex-col justify-center">
              <ul className="space-y-6" role="list">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={clsx(
                        'heading-3 block hover:text-neon-pink transition-colors',
                        pathname === link.href ? 'text-neon-pink' : 'text-text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="/files/Jeff-CV.pdf"
                download="Jeff-Developer-CV.pdf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="btn-primary mt-12 w-fit"
              >
                <Download size={18} />
                Download Resume
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
