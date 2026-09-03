'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge, Toggle } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [totpForm, setTotpForm] = useState({
    token: '',
  });

  useEffect(() => {
    loadUserData();
    loadSessions();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await adminApi.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await adminApi.getSessions();
      if (response.success) {
        setSessions(response.data || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showToast({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    try {
      const response = await adminApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );

      if (response.success) {
        showToast({ message: 'Password changed successfully', type: 'success' });
        setPasswordModalOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast({ message: response.error || 'Failed to change password', type: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast({ message: 'Failed to change password', type: 'error' });
    }
  };

  const handleSetup2FA = async () => {
    try {
      const response = await adminApi.setup2FA();
      if (response.success && response.data) {
        setQrCode(response.data.qrCode);
        setTwoFactorModalOpen(true);
      } else {
        showToast({ message: 'Failed to setup 2FA', type: 'error' });
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      showToast({ message: 'Failed to setup 2FA', type: 'error' });
    }
  };

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await adminApi.enable2FA(totpForm.token);
      if (response.success && response.data) {
        setBackupCodes(response.data.backupCodes || []);
        showToast({ message: '2FA enabled successfully', type: 'success' });
        setTotpForm({ token: '' });
        loadUserData();
      } else {
        showToast({ message: response.error || 'Failed to enable 2FA', type: 'error' });
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      showToast({ message: 'Failed to enable 2FA', type: 'error' });
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Enter your current password to disable 2FA:');
    if (!password) {
      return;
    }

    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      const response = await adminApi.disable2FA(password);
      if (response.success) {
        showToast({ message: '2FA disabled successfully', type: 'success' });
        loadUserData();
      } else {
        showToast({ message: response.error || 'Failed to disable 2FA', type: 'error' });
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      showToast({ message: 'Failed to disable 2FA', type: 'error' });
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const password = prompt('Enter your current password to regenerate backup codes:');
    if (!password) {
      return;
    }

    if (!confirm('This will invalidate your current backup codes. Continue?')) {
      return;
    }

    try {
      const response = await adminApi.regenerateBackupCodes(password);
      if (response.success && response.data) {
        setBackupCodes(response.data.backupCodes || []);
        showToast({ message: 'Backup codes regenerated', type: 'success' });
      } else {
        showToast({ message: 'Failed to regenerate backup codes', type: 'error' });
      }
    } catch (error) {
      console.error('Error regenerating backup codes:', error);
      showToast({ message: 'Failed to regenerate backup codes', type: 'error' });
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) {
      return;
    }

    try {
      const response = await adminApi.terminateSession(sessionId);
      if (response.success) {
        showToast({ message: 'Session terminated', type: 'success' });
        loadSessions();
      } else {
        showToast({ message: 'Failed to terminate session', type: 'error' });
      }
    } catch (error) {
      console.error('Error terminating session:', error);
      showToast({ message: 'Failed to terminate session', type: 'error' });
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('This will log you out from all devices. Continue?')) {
      return;
    }

    try {
      const response = await adminApi.logoutAll();
      if (response.success) {
        window.location.href = '/admin-portal-7x9k/login';
      } else {
        showToast({ message: 'Failed to logout from all devices', type: 'error' });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({ message: 'Failed to logout from all devices', type: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Account Settings */}
      <Card title="Account Settings" neonBorder glowColor="cyan">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-cyber text-cyber-cyan mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-tech text-cyber-text-dim mb-1">Username</label>
                <p className="text-cyber-text font-tech">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-tech text-cyber-text-dim mb-1">Account Created</label>
                <p className="text-cyber-text font-tech">{formatDate(user?.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-cyber-border">
            <h3 className="text-lg font-cyber text-cyber-magenta mb-4">Password</h3>
            <p className="text-sm text-cyber-text-muted mb-4 font-tech">
              Change your password to keep your account secure
            </p>
            <Button variant="cyan" onClick={() => setPasswordModalOpen(true)}>
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card title="Two-Factor Authentication (2FA)" neonBorder glowColor="green">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-cyber-darker border border-cyber-border rounded-lg">
            <div className="flex-1">
              <h3 className="text-lg font-cyber text-cyber-text mb-1">TOTP Authentication</h3>
              <p className="text-sm text-cyber-text-muted font-tech">
                {user?.totp_enabled
                  ? 'Two-factor authentication is currently enabled'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.totp_enabled ? (
                <Badge variant="success">Enabled</Badge>
              ) : (
                <Badge variant="warning">Disabled</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.totp_enabled ? (
              <>
                <Button variant="yellow" onClick={handleRegenerateBackupCodes}>
                  Regenerate Backup Codes
                </Button>
                <Button variant="red" onClick={handleDisable2FA}>
                  Disable 2FA
                </Button>
              </>
            ) : (
              <Button variant="green" onClick={handleSetup2FA}>
                Enable 2FA
              </Button>
            )}
          </div>

          {backupCodes.length > 0 && (
            <div className="p-4 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-lg">
              <h4 className="text-sm font-cyber text-cyber-yellow mb-3">
                Save Your Backup Codes
              </h4>
              <p className="text-xs text-cyber-text-muted mb-3 font-tech">
                Store these codes in a safe place. Each code can only be used once.
              </p>
              <div className="grid grid-cols-2 gap-2 p-3 bg-cyber-black rounded font-mono text-sm">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="text-cyber-cyan">
                    {code}
                  </div>
                ))}
              </div>
              <Button
                variant="yellow"
                size="sm"
                className="mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                  showToast({ message: 'Backup codes copied to clipboard', type: 'success' });
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Active Sessions */}
      <Card title="Active Sessions" neonBorder glowColor="magenta">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-cyber-text-muted font-tech">
              {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
            </p>
            <Button variant="red" size="sm" onClick={handleLogoutAll}>
              Logout All Sessions
            </Button>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 text-cyber-text-dim font-tech">
              <p>No active sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-magenta transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-cyber text-cyber-text">
                          {session.is_current ? 'Current Session' : 'Other Session'}
                        </h4>
                        {session.is_current && <Badge variant="success">Active</Badge>}
                      </div>
                      <div className="space-y-1 text-sm text-cyber-text-muted font-tech">
                        <p>IP Address: {session.ip_address || 'Unknown'}</p>
                        <p>User Agent: {session.user_agent || 'Unknown'}</p>
                        <p>Created: {formatDate(session.created_at)}</p>
                        <p>Last Active: {formatDate(session.last_activity)}</p>
                        <p>Expires: {formatDate(session.expires_at)}</p>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button
                        variant="red"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />

          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
            helperText="Minimum 8 characters"
          />

          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />

          <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
            <Button type="submit" variant="cyan" fullWidth>
              Change Password
            </Button>
            <Button
              type="button"
              variant="red"
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        isOpen={twoFactorModalOpen}
        onClose={() => {
          setTwoFactorModalOpen(false);
          setQrCode('');
          setTotpForm({ token: '' });
          setBackupCodes([]);
        }}
        title="Enable Two-Factor Authentication"
        size="md"
      >
        <div className="space-y-4">
          {!backupCodes.length ? (
            <>
              <div className="text-center">
                <p className="text-sm text-cyber-text-muted mb-4 font-tech">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                {qrCode && (
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
                  </div>
                )}
              </div>

              <form onSubmit={handleEnable2FA} className="space-y-4">
                <Input
                  type="text"
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={totpForm.token}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setTotpForm({ token: value });
                  }}
                  required
                  className="text-center text-2xl font-mono tracking-widest"
                />

                <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
                  <Button type="submit" variant="green" fullWidth disabled={totpForm.token.length !== 6}>
                    Verify & Enable
                  </Button>
                  <Button
                    type="button"
                    variant="red"
                    onClick={() => {
                      setTwoFactorModalOpen(false);
                      setQrCode('');
                      setTotpForm({ token: '' });
                    }}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-green/20 border-2 border-cyber-green flex items-center justify-center">
                <svg className="w-8 h-8 text-cyber-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-cyber text-cyber-green mb-2">2FA Enabled!</h3>
              <p className="text-sm text-cyber-text-muted mb-4 font-tech">
                Your account is now protected with two-factor authentication.
              </p>
              <Button
                variant="cyan"
                onClick={() => {
                  setTwoFactorModalOpen(false);
                  setQrCode('');
                  setTotpForm({ token: '' });
                  setBackupCodes([]);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

