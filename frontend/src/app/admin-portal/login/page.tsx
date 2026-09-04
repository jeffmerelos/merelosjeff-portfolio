'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Loading } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../styles/admin-cyberpunk.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📤 Sending direct POST request...');
      
      // Direct fetch - bypass api-client to ensure POST method
      const response = await fetch('https://merelosjeff-portfolio-backend.vercel.app/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
        credentials: 'include',
      });

      console.log('📨 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!data.success) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Check if 2FA is required
      if (data.requiresTOTP) {
        // Redirect to 2FA verification page
        router.push(`/admin-portal/verify-2fa?userId=${data.userId}`);
      } else {
        // Login successful, redirect to dashboard
        router.push('/admin-portal/dashboard');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="absolute inset-0 scanline-effect opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-pulse" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-magenta to-transparent animate-pulse" />
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-cyber-cyan rounded-full animate-float shadow-cyber-cyan" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-cyber-magenta rounded-full animate-float animation-delay-1000 shadow-cyber-magenta" />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyber-green rounded-full animate-float animation-delay-2000 shadow-cyber-green" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Card className="backdrop-blur-sm" neonBorder glowColor="cyan">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cyber font-bold mb-2 neon-text-cyan animate-neon-flicker">
              ADMIN ACCESS
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-green" />
            <p className="text-cyber-text-muted mt-4 font-tech text-sm">
              SECURE AUTHENTICATION REQUIRED
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border-l-4 border-cyber-red bg-cyber-red/10 rounded animate-slide-in">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-cyber-red font-medium">{error}</p>
                </div>
              </div>
            )}

            <Input
              name="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? 'AUTHENTICATING...' : 'INITIATE LOGIN'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-cyber-border">
            <div className="flex items-center justify-center gap-2 text-xs text-cyber-text-dim">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-tech">ENCRYPTED CONNECTION • 2FA PROTECTED</span>
            </div>
          </div>
        </Card>

        {/* Warning Text */}
        <p className="text-center mt-6 text-xs text-cyber-text-dim font-tech">
          UNAUTHORIZED ACCESS ATTEMPT WILL BE LOGGED AND REPORTED
        </p>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyber-cyan opacity-30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyber-magenta opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyber-green opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyber-cyan opacity-30" />
    </div>
  );
}

