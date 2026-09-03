'use client';

import React, { useEffect, useRef } from 'react';

interface DataStreamProps {
  streamCount?: number;
  colors?: string[];
  speed?: number;
  characters?: string;
  className?: string;
}

export default function DataStream({
  streamCount = 15,
  colors = ['#00f0ff', '#ff00ff', '#00ff66'],
  speed = 2,
  characters = '01ABCDEF',
  className = '',
}: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas!.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Set up canvas
    const resizeCanvas = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Data stream class
    class DataStreamLine {
      x!: number;
      y!: number;
      speed!: number;
      color!: string;
      text!: string;
      opacity!: number;
      width!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = -50;
        this.speed = speed * (0.5 + Math.random() * 1.5);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 0.3 + Math.random() * 0.7;
        this.width = 100 + Math.random() * 200;
        this.generateText();
      }

      generateText() {
        const length = 8 + Math.floor(Math.random() * 12);
        this.text = '';
        for (let i = 0; i < length; i++) {
          this.text += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height + 50) {
          this.reset();
        }
      }

      draw() {
        // Draw main stream line
        ctx!.strokeStyle = this.color;
        ctx!.lineWidth = 2;
        ctx!.globalAlpha = this.opacity;
        
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y - this.width);
        ctx!.lineTo(this.x, this.y);
        ctx!.stroke();

        // Draw data text along the line
        ctx!.fillStyle = this.color;
        ctx!.font = '10px "Share Tech Mono", monospace';
        ctx!.globalAlpha = this.opacity * 0.8;
        
        const textY = this.y - this.width / 2;
        ctx!.save();
        ctx!.translate(this.x + 5, textY);
        ctx!.rotate(-Math.PI / 2);
        ctx!.fillText(this.text, 0, 0);
        ctx!.restore();

        // Draw stream head glow
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.opacity;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx!.fill();

        // Draw stream tail fade
        const gradient = ctx!.createLinearGradient(this.x, this.y - this.width, this.x, this.y);
        gradient.addColorStop(0, `${this.color}00`);
        gradient.addColorStop(1, this.color);
        
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = this.opacity * 0.5;
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y - this.width);
        ctx!.lineTo(this.x, this.y);
        ctx!.stroke();

        ctx!.globalAlpha = 1;
      }
    }

    // Create data streams
    const streams: DataStreamLine[] = [];
    for (let i = 0; i < streamCount; i++) {
      const stream = new DataStreamLine();
      stream.y = Math.random() * canvas!.height; // Start at random positions
      streams.push(stream);
    }

    // Animation loop
    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      streams.forEach((stream) => {
        stream.update();
        stream.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [streamCount, colors, speed, characters]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1, mixBlendMode: 'screen' }}
    />
  );
}
