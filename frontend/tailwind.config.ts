import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon Cyber Theme - Base
        'bg-void': '#0A0A0F',
        'bg-panel': '#12121A',
        'neon-pink': '#FF1B6B',
        'neon-violet': '#9D4EDD',
        'neon-blue': '#4EA8FF',
        'text-primary': '#F5F5F7',
        'text-muted': '#9A9AA5',
        line: '#2A2A35',
        
        // Admin Portal Cyberpunk Theme
        cyber: {
          black: '#000000',
          'deep-black': '#0a0a0a',
          'dark-gray': '#111111',
          'darker-gray': '#1a1a1a',
          'card-bg': '#141418',
          'border': '#2a2a35',
          'border-bright': '#3a3a45',
          
          // Neon Accents
          cyan: {
            DEFAULT: '#00f0ff',
            bright: '#00d9ff',
            glow: 'rgba(0, 240, 255, 0.5)',
          },
          magenta: {
            DEFAULT: '#ff00ff',
            bright: '#ff006e',
            glow: 'rgba(255, 0, 255, 0.5)',
          },
          green: {
            DEFAULT: '#00ff41',
            bright: '#39ff14',
            glow: 'rgba(0, 255, 65, 0.5)',
          },
          yellow: {
            DEFAULT: '#ffff00',
            bright: '#ffd700',
            glow: 'rgba(255, 255, 0, 0.5)',
          },
          red: {
            DEFAULT: '#ff0040',
            bright: '#ff0055',
            glow: 'rgba(255, 0, 64, 0.5)',
          },
          
          // Text
          text: {
            primary: '#ffffff',
            secondary: '#e0ffff',
            muted: '#9a9aa5',
            dim: '#6a6a75',
          },
        },
      },
      fontFamily: {
        display: ['Chakra Petch', 'Rajdhani', 'sans-serif'],
        body: ['Inter', 'IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        // Admin specific
        cyber: ['Orbitron', 'Rajdhani', 'sans-serif'],
        tech: ['Share Tech Mono', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #FF1B6B, #9D4EDD)',
        'gradient-blue-violet': 'linear-gradient(135deg, #4EA8FF, #9D4EDD)',
        // Admin gradients
        'cyber-grid': 'linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
        'cyber-gradient-vertical': 'linear-gradient(180deg, #00f0ff 0%, #ff00ff 100%)',
        'neon-border': 'linear-gradient(90deg, #00f0ff, #ff00ff, #00ff41)',
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 27, 107, 0.3)',
        'neon-pink-lg': '0 0 40px rgba(255, 27, 107, 0.5)',
        'neon-violet': '0 0 20px rgba(157, 78, 221, 0.3)',
        'neon-blue': '0 0 20px rgba(78, 168, 255, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        // Admin neon glows
        'cyber-cyan': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
        'cyber-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.4)',
        'cyber-magenta': '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
        'cyber-green': '0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 255, 65, 0.3)',
        'cyber-red': '0 0 20px rgba(255, 0, 64, 0.5), 0 0 40px rgba(255, 0, 64, 0.3)',
        'cyber-card': '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 1px rgba(0, 240, 255, 0.5)',
        'cyber-input': 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 240, 255, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        // Admin animations
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'neon-flicker': 'neon-flicker 3s linear infinite',
        'grid-flow': 'grid-flow 20s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        // Admin keyframes
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.5)',
          },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '41%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45%': { opacity: '0.9' },
          '46%': { opacity: '1' },
        },
        'grid-flow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
