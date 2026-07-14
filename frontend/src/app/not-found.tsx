import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <div id="top">
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-lg px-6">
          <div className="font-mono text-neon-pink text-sm mb-4">// signal lost</div>
          <h1 className="font-display font-bold text-8xl md:text-9xl text-gradient mb-4">404</h1>
          <h2 className="heading-3 text-text-primary mb-4">Connection Error</h2>
          <p className="text-text-muted leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="btn-primary">
              ▸ Back to Home
            </Link>
            <Link href="/projects" className="btn-secondary">
              View Projects
            </Link>
          </div>
          {/* Decorative glitch element */}
          <div className="mt-12 font-mono text-xs text-text-muted space-y-1" aria-hidden="true">
            <div className="text-neon-pink/60">ERR_ROUTE_NOT_FOUND</div>
            <div>$ whoami → still here, just lost</div>
          </div>
        </div>
      </main>
    </div>
  );
}
