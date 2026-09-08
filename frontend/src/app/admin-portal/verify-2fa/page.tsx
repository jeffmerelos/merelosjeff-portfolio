'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../styles/admin-cyberpunk.css';

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [code, setCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push('/admin-portal-7x9k/login');
    }
  }, [userId, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userId) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    try {
      let response;

      if (useBackupCode) {
        response = await adminApi.verifyBackupCode(userId, backupCode.trim().toUpperCase());
      } else {
        response = await adminApi.verify2FA(userId, code.trim());
      }

      if (!response.success) {
        setError(response.error || 'Verification failed');
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/admin-portal/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="absolute inset-0 scanline-effect opacity-30" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent animate-pulse" />
      
      {/* 2FA Card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Card className="backdrop-blur-sm" neonBorder glowColor="green">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-cyber-green flex items-center justify-center shadow-cyber-green">
              <svg className="w-8 h-8 text-cyber-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-cyber font-bold mb-2 neon-text-green">
              2FA VERIFICATION
            </h1>
            <p className="text-cyber-text-muted font-tech text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border-l-4 border-cyber-red bg-cyber-red/10 rounded animate-slide-in">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-cyber-red font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* 2FA Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {!useBackupCode ? (
              <div>
                <Input
                  name="code"
                  type="text"
                  label="Authenticator Code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                    setError('');
                  }}
                  required
                  disabled={loading}
                  className="text-center text-2xl font-mono tracking-widest"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <p className="mt-2 text-xs text-cyber-text-dim text-center font-tech">
                  CODE REFRESHES EVERY 30 SECONDS
                </p>
              </div>
            ) : (
              <Input
                name="backupCode"
                type="text"
                label="Backup Recovery Code"
                placeholder="XXXXXXXX"
                value={backupCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 8);
                  setBackupCode(value);
                  setError('');
                }}
                required
                disabled={loading}
                className="text-center text-xl font-mono tracking-widest"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                }
              />
            )}

            <Button
              type="submit"
              variant="green"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading || (!useBackupCode && code.length !== 6) || (useBackupCode && backupCode.length !== 8)}
            >
              {loading ? 'VERIFYING...' : 'VERIFY & ACCESS'}
            </Button>
          </form>

          {/* Toggle Backup Code */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode('');
                setBackupCode('');
                setError('');
              }}
              className="text-sm text-cyber-cyan hover:text-cyber-magenta transition-colors font-tech"
              disabled={loading}
            >
              {useBackupCode ? '← Use Authenticator Code' : 'Use Backup Recovery Code →'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-cyber-border">
            <div className="flex items-center justify-center gap-2 text-xs text-cyber-text-dim">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-tech">TOTP PROTECTED • TIME-BASED VERIFICATION</span>
            </div>
          </div>
        </Card>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/admin-portal-7x9k/login')}
            className="text-sm text-cyber-text-muted hover:text-cyber-cyan transition-colors font-tech"
            disabled={loading}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyber-green opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyber-green opacity-30" />
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cyber-black flex items-center justify-center">
      <div className="cyber-spinner w-12 h-12 border-4" />
    </div>}>
      <Verify2FAContent />
    </Suspense>
  );
}

