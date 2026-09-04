const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { supabase } = require('../config/database');

const SALT_ROUNDS = 12;
const SESSION_DURATION_HOURS = 8;
const INACTIVITY_TIMEOUT_MINUTES = 30;
const MAX_CONCURRENT_SESSIONS = 3;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate a secure random token
   */
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash a token for storage
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Authenticate user with username and password (Step 1 of 2FA)
   */
  async authenticateCredentials(username, password, ipAddress, userAgent) {
    try {
      // Check for account lockout
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !user) {
        await this.logLoginAttempt(username, ipAddress, userAgent, false, 'invalid_credentials');
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if account is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const lockRemaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
        await this.logLoginAttempt(username, ipAddress, userAgent, false, 'account_locked');
        return { success: false, error: `Account locked. Try again in ${lockRemaining} minutes.` };
      }

      // Check if account is active
      if (!user.is_active) {
        await this.logLoginAttempt(username, ipAddress, userAgent, false, 'account_disabled');
        return { success: false, error: 'Account is disabled' };
      }

      // Verify password
      const passwordValid = await this.verifyPassword(password, user.password_hash);

      if (!passwordValid) {
        // Increment failed login count
        const newFailedCount = user.failed_login_count + 1;
        const updates = { failed_login_count: newFailedCount };

        // Lock account if max attempts exceeded
        if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
          updates.locked_until = lockUntil.toISOString();
        }

        await supabase
          .from('admin_users')
          .update(updates)
          .eq('id', user.id);

        await this.logLoginAttempt(username, ipAddress, userAgent, false, 'invalid_password');
        return { success: false, error: 'Invalid credentials' };
      }

      // Password is valid - reset failed login count and lockout
      await supabase
        .from('admin_users')
        .update({ 
          failed_login_count: 0, 
          locked_until: null 
        })
        .eq('id', user.id);

      // Log successful credential verification
      await this.logLoginAttempt(username, ipAddress, userAgent, true, null, true, null);

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          totp_enabled: user.totp_enabled
        },
        requiresTOTP: user.totp_enabled
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Create a new session for authenticated user
   */
  async createSession(userId, ipAddress, userAgent) {
    try {
      // Generate session token
      const token = this.generateToken();
      const tokenHash = this.hashToken(token);

      // Calculate expiration times
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

      // Check concurrent sessions and remove oldest if limit exceeded
      const { data: existingSessions } = await supabase
        .from('admin_sessions')
        .select('id, created_at')
        .eq('admin_user_id', userId)
        .order('created_at', { ascending: false });

      if (existingSessions && existingSessions.length >= MAX_CONCURRENT_SESSIONS) {
        const sessionsToRemove = existingSessions.slice(MAX_CONCURRENT_SESSIONS - 1);
        const idsToRemove = sessionsToRemove.map(s => s.id);
        await supabase
          .from('admin_sessions')
          .delete()
          .in('id', idsToRemove);
      }

      // Create new session
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: userId,
          token_hash: tokenHash,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Session creation error:', error);
        return { success: false, error: 'Failed to create session' };
      }

      // Update user's last login
      await supabase
        .from('admin_users')
        .update({
          last_login_at: new Date().toISOString(),
          last_login_ip: ipAddress
        })
        .eq('id', userId);

      return {
        success: true,
        token: token,
        sessionId: session.id,
        expiresAt: expiresAt
      };
    } catch (error) {
      console.error('Session creation error:', error);
      return { success: false, error: 'Failed to create session' };
    }
  }

  /**
   * Validate a session token
   */
  async validateSession(token) {
    try {
      const tokenHash = this.hashToken(token);

      const { data: session, error } = await supabase
        .from('admin_sessions')
        .select(`
          *,
          admin_users (
            id,
            username,
            email,
            is_active
          )
        `)
        .eq('token_hash', tokenHash)
        .single();

      if (error || !session) {
        return { valid: false, error: 'Invalid session' };
      }

      // Check if session expired
      if (new Date(session.expires_at) < new Date()) {
        await this.deleteSession(session.id);
        return { valid: false, error: 'Session expired' };
      }

      // Check inactivity timeout
      const lastActivity = new Date(session.last_activity_at);
      const now = new Date();
      const inactiveMinutes = (now - lastActivity) / 60000;

      if (inactiveMinutes > INACTIVITY_TIMEOUT_MINUTES) {
        await this.deleteSession(session.id);
        return { valid: false, error: 'Session expired due to inactivity' };
      }

      // Check if user is active
      if (!session.admin_users.is_active) {
        await this.deleteSession(session.id);
        return { valid: false, error: 'User account is disabled' };
      }

      // Update last activity
      await supabase
        .from('admin_sessions')
        .update({ last_activity_at: now.toISOString() })
        .eq('id', session.id);

      return {
        valid: true,
        session: {
          id: session.id,
          userId: session.admin_user_id,
          createdAt: session.created_at,
          expiresAt: session.expires_at
        },
        user: {
          id: session.admin_users.id,
          username: session.admin_users.username,
          email: session.admin_users.email
        }
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, error: 'Session validation failed' };
    }
  }

  /**
   * Delete a session (logout)
   */
  async deleteSession(sessionId) {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Session deletion error:', error);
        return { success: false, error: 'Failed to delete session' };
      }

      return { success: true };
    } catch (error) {
      console.error('Session deletion error:', error);
      return { success: false, error: 'Failed to delete session' };
    }
  }

  /**
   * Delete all sessions for a user (logout all devices)
   */
  async deleteAllUserSessions(userId) {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .delete()
        .eq('admin_user_id', userId);

      if (error) {
        console.error('Session deletion error:', error);
        return { success: false, error: 'Failed to delete sessions' };
      }

      return { success: true };
    } catch (error) {
      console.error('Session deletion error:', error);
      return { success: false, error: 'Failed to delete sessions' };
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId) {
    try {
      const { data: sessions, error } = await supabase
        .from('admin_sessions')
        .select('id, ip_address, user_agent, created_at, last_activity_at, expires_at')
        .eq('admin_user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return { success: false, error: 'Failed to fetch sessions' };
      }

      return { success: true, sessions: sessions || [] };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return { success: false, error: 'Failed to fetch sessions' };
    }
  }

  /**
   * Log a login attempt
   */
  async logLoginAttempt(username, ipAddress, userAgent, success, failureReason = null, totpRequired = false, totpSuccess = null) {
    try {
      await supabase
        .from('login_attempts')
        .insert({
          username,
          ip_address: ipAddress,
          user_agent: userAgent,
          success,
          failure_reason: failureReason,
          totp_required: totpRequired,
          totp_success: totpSuccess
        });
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  }

  /**
   * Get recent login attempts for a user
   */
  async getLoginAttempts(username, limit = 10) {
    try {
      const { data: attempts, error } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching login attempts:', error);
        return { success: false, error: 'Failed to fetch login attempts' };
      }

      return { success: true, attempts: attempts || [] };
    } catch (error) {
      console.error('Error fetching login attempts:', error);
      return { success: false, error: 'Failed to fetch login attempts' };
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const passwordValid = await this.verifyPassword(currentPassword, user.password_hash);
      if (!passwordValid) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Password update error:', updateError);
        return { success: false, error: 'Failed to update password' };
      }

      // Delete all sessions except current one (will be handled by caller)
      // This forces re-login on all other devices
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  async cleanupExpiredSessions() {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Session cleanup error:', error);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}

module.exports = new AuthService();
