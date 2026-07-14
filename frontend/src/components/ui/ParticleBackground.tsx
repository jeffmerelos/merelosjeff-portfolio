'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -999, y: -999 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Don't run on reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Don't run on touch devices
    if ('ontouchstart' in window) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;
    const NEON_PINK = '255, 27, 107';
    const NEON_VIOLET = '157, 78, 221';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        // Slight mouse attraction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00003;
          p.vy += dy * 0.00003;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NEON_PINK}, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            const color = i % 3 === 0 ? NEON_VIOLET : NEON_PINK;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden="true"
    />
  );
}
