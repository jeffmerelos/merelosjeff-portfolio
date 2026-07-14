import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const SOCIAL_LINKS = [
  { href: 'https://github.com/jeffdev', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com/in/jeffdev', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com/jeffdev', label: 'Twitter/X', icon: Twitter },
  { href: 'mailto:merelosjeft@gmail.com', label: 'Email', icon: Mail },
];

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-panel/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display font-bold text-xl text-text-primary hover:text-neon-pink transition-colors">
              ◆ JEFF<span className="text-gradient">.</span>DEV
            </Link>
            <p className="mt-3 text-text-muted text-sm leading-relaxed max-w-xs">
              Junior Software developer building fast, accessible web apps. Available for new projects.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="btn-icon w-9 h-9"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted hover:text-neon-pink transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">
              Get in Touch
            </h3>
            <a
              href="mailto: merelosjeft@gmail.com"
              className="text-sm text-text-muted hover:text-neon-blue transition-colors block mb-2"
            >
              merelosjeft@gmail.com
            </a>
            <p className="text-sm text-text-muted">Gaway-gaway 1, Uling City of Naga, Cebu, Philippines</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="status-dot" aria-hidden="true" />
              <span className="font-mono text-xs text-neon-blue">Available for Tech Work</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-line">
          <p className="text-xs text-text-muted font-mono">
            © {new Date().getFullYear()} Jeff Developer. All rights reserved❤️
          </p>
          <a
            href="#top"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-neon-pink transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
