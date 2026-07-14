import type { Metadata } from 'next';
import { Chakra_Petch, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const chakraPetch = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Jeff - Software Developer Portfolio',
  description: 'Junior software developer building fast, accessible web apps. Portfolio showcasing projects, skills, and experience.',
  keywords: ['junior software developer', 'react', 'node.js', 'web development', 'portfolio'],
  authors: [{ name: 'Jeff Developer' }],
  icons: {
    icon: '/images/logo-jeff.png',
    shortcut: '/images/logo-jeff.png',
    apple: '/images/logo-jeff.png',
  },
  openGraph: {
    title: 'Jefferson Bacaro Merelos  — Junior Software Developer Portfolio',
    description: 'Junior software developer building fast, accessible web apps. Portfolio showcasing projects, skills, and experience.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Jeff Developer Portfolio',
    images: [{ url: '/images/logo-jeff.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jefferson Bacaro Merelos  — Junior Software Developer Portfolio',
    description: 'Junior software developer building fast, accessible web apps. Portfolio showcasing projects, skills, and experience.',
    images: ['/images/logo-jeff.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${chakraPetch.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12121A',
                color: '#F5F5F7',
                border: '1px solid #2A2A35',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#4EA8FF', secondary: '#F5F5F7' } },
              error: { iconTheme: { primary: '#FF1B6B', secondary: '#F5F5F7' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
