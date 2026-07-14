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
        // Neon Cyber Theme
        'bg-void': '#0A0A0F',
        'bg-panel': '#12121A',
        'neon-pink': '#FF1B6B',
        'neon-violet': '#9D4EDD',
        'neon-blue': '#4EA8FF',
        'text-primary': '#F5F5F7',
        'text-muted': '#9A9AA5',
        line: '#2A2A35',
      },
      fontFamily: {
        display: ['Chakra Petch', 'Rajdhani', 'sans-serif'],
        body: ['Inter', 'IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #FF1B6B, #9D4EDD)',
        'gradient-blue-violet': 'linear-gradient(135deg, #4EA8FF, #9D4EDD)',
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 27, 107, 0.3)',
        'neon-pink-lg': '0 0 40px rgba(255, 27, 107, 0.5)',
        'neon-violet': '0 0 20px rgba(157, 78, 221, 0.3)',
        'neon-blue': '0 0 20px rgba(78, 168, 255, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 0.3s ease-in-out',
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
