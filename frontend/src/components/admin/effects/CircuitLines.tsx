'use client';

import React, { useEffect, useRef } from 'react';

interface CircuitLinesProps {
  lineCount?: number;
  colors?: string[];
  speed?: number;
  className?: string;
}

export default function CircuitLines({
  lineCount = 20,
  colors = ['#00f0ff', '#ff00ff', '#00ff66', '#ffff00'],
  speed = 1,
  className = '',
}: CircuitLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Set up canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Circuit line class
    class CircuitLine {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      color: string;
      progress: number;
      segments: { x: number; y: number }[];
      direction: 'horizontal' | 'vertical';

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.progress = 0;
        this.direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        this.generatePath();
      }

      generatePath() {
        this.segments = [{ x: this.x, y: this.y }];
        
        const segmentCount = 3 + Math.floor(Math.random() * 4);
        let currentX = this.x;
        let currentY = this.y;

        for (let i = 0; i < segmentCount; i++) {
          if (this.direction === 'horizontal') {
            currentX += (Math.random() - 0.5) * 200;
            currentY += Math.random() > 0.7 ? (Math.random() - 0.5) * 100 : 0;
          } else {
            currentY += (Math.random() - 0.5) * 200;
            currentX += Math.random() > 0.7 ? (Math.random() - 0.5) * 100 : 0;
          }
          
          currentX = Math.max(0, Math.min(canvas.width, currentX));
          currentY = Math.max(0, Math.min(canvas.height, currentY));
          
          this.segments.push({ x: currentX, y: currentY });
        }
      }

      update() {
        this.progress += speed * 0.01;
        if (this.progress >= 1) {
          this.reset();
        }
      }

      draw() {
        if (this.segments.length < 2) return;

        const segmentProgress = this.progress * (this.segments.length - 1);
        const currentSegment = Math.floor(segmentProgress);
        const segmentFraction = segmentProgress - currentSegment;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();

        // Draw completed segments
        for (let i = 0; i < currentSegment && i < this.segments.length - 1; i++) {
          if (i === 0) {
            ctx.moveTo(this.segments[i].x, this.segments[i].y);
          }
          ctx.lineTo(this.segments[i + 1].x, this.segments[i + 1].y);
        }

        // Draw current segment in progress
        if (currentSegment < this.segments.length - 1) {
          const start = this.segments[currentSegment];
          const end = this.segments[currentSegment + 1];
          const currentX = start.x + (end.x - start.x) * segmentFraction;
          const currentY = start.y + (end.y - start.y) * segmentFraction;
          
          if (currentSegment === 0) {
            ctx.moveTo(start.x, start.y);
          }
          ctx.lineTo(currentX, currentY);
        }

        ctx.stroke();

        // Draw circuit nodes
        for (let i = 0; i <= currentSegment && i < this.segments.length; i++) {
          ctx.fillStyle = this.color;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(this.segments[i].x, this.segments[i].y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }
    }

    // Create circuit lines
    const lines: CircuitLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push(new CircuitLine());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        line.update();
        line.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineCount, colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1, mixBlendMode: 'screen' }}
    />
  );
}