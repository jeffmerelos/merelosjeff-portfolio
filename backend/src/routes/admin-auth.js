const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const totpService = require('../services/totpService');
const auditService = require('../services/auditService');
const { authenticateAdmin, extractRequestInfo } = require('../middleware/auth');
const { 
  loginLimiter, 
  twoFactorLimiter, 
  passwordChangeLimiter,
  backupCodeLimiter
} = require('../middleware/rateLimiter');
const { 
  validateLogin, 
  validateTwoFactor, 
  validateBackupCode,
  validateChangePassword 
} = require('../middleware/validators');
const { csrfProtection, sendCsrfToken } = require('../middleware/csrf');

// Apply request info extraction to all routes
router.use(extractRequestInfo);

/**
 * GET /api/admin/auth/csrf
 * Get CSRF token for form submissions
 */
router.get('/csrf', sendCsrfToken, (req, res) => {
  res.json({
    success: true,
    csrfToken: res.locals.csrfToken
  });
});

/**
 * POST /api/admin/auth/login
 * Step 1: Authenticate with username and password
 */
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const { clientIp, userAgent } = req;

    // Authenticate credentials
    const result = await authService.authenticateCredentials(
      username,
      password,
      clientIp,
      userAgent
    );

    if (!result.success) {
      // Log failed attempt
      await auditService.logLogin(null, username, clientIp, userAgent, false);
      
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    // If 2FA is enabled, require TOTP verification
    if (result.requiresTOTP) {
      return res.json({
        success: true,
        requiresTOTP: true,
        userId: result.user.id,
        message: 'Please enter your 2FA code'
      });
    }

    // No 2FA required - create session immediately
    const sessionResult = await authService.createSession(
      result.user.id,
      clientIp,
      userAgent
    );

    if (!sessionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create session'
      });
    }

    // Set session cookie
    res.cookie('admin_session', sessionResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    // Log successful login
    await auditService.logLogin(result.user.id, username, clientIp, userAgent, true);

    res.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email
      },
      expiresAt: sessionResult.expiresAt
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * POST /api/admin/auth/verify-2fa
 * Step 2: Verify TOTP code
 */
router.post('/verify-2fa', twoFactorLimiter, validateTwoFactor, async (req, res) => {
  try {
    const { userId, code } = req.body;
    const { clientIp, userAgent } = req;

    // Verify TOTP code
    const result = await totpService.verifyTOTPCode(userId, code);

    if (!result.success) {
      // Log failed 2FA attempt
      await auditService.log2FAFailed(userId, 'user', clientIp, userAgent);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Create session
    const sessionResult = await authService.createSession(
      userId,
      clientIp,
      userAgent
    );

    if (!sessionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create session'
      });
    }

    // Set session cookie
    res.cookie('admin_session', sessionResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    // Get user info
    const { supabase } = require('../config/database');
    const { data: user } = await supabase
      .from('admin_users')
      .select('id, username, email')
      .eq('id', userId)
      .single();

    // Log successful login
    await auditService.logLogin(userId, user.username, clientIp, userAgent, true);

    res.json({
      success: true,
      user,
      expiresAt: sessionResult.expiresAt
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      error: '2FA verification failed'
    });
  }
});

/**
 * POST /api/admin/auth/verify-backup-code
 * Alternative Step 2: Verify backup code
 */
router.post('/verify-backup-code', twoFactorLimiter, validateBackupCode, async (req, res) => {
  try {
    const { userId, code } = req.body;
    const { clientIp, userAgent } = req;

    // Verify backup code
    const result = await totpService.verifyBackupCode(userId, code);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error || 'Invalid backup code'
      });
    }

    // Create session
    const sessionResult = await authService.createSession(
      userId,
      clientIp,
      userAgent
    );

    if (!sessionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create session'
      });
    }

    // Set session cookie
    res.cookie('admin_session', sessionResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    });

    // Get user info
    const { supabase } = require('../config/database');
    const { data: user } = await supabase
      .from('admin_users')
      .select('id, username, email')
      .eq('id', userId)
      .single();

    // Log backup code usage
    await auditService.logBackupCodeUsed(userId, user.username, clientIp, userAgent);
    await auditService.logLogin(userId, user.username, clientIp, userAgent, true);

    res.json({
      success: true,
      user,
      expiresAt: sessionResult.expiresAt,
      warning: 'Backup code used. Please regenerate your backup codes.'
    });
  } catch (error) {
    console.error('Backup code verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Backup code verification failed'
    });
  }
});

/**
 * POST /api/admin/auth/logout
 * Logout current session
 */
router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    const { session, user, clientIp, userAgent } = req;

    // Delete session
    await authService.deleteSession(session.id);

    // Clear cookie
    res.clearCookie('admin_session');

    // Log logout
    await auditService.logLogout(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

/**
 * POST /api/admin/auth/logout-all
 * Logout from all devices
 */
router.post('/logout-all', authenticateAdmin, csrfProtection, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;

    // Delete all sessions
    await authService.deleteAllUserSessions(user.id);

    // Clear cookie
    res.clearCookie('admin_session');

    // Log event
    await auditService.logAllSessionsTerminated(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout from all devices'
    });
  }
});

/**
 * GET /api/admin/auth/me
 * Get current authenticated user info
 */
router.get('/me', authenticateAdmin, async (req, res) => {
  try {
    const { user, session } = req;

    // Get full user details
    const { supabase } = require('../config/database');
    const { data: userData, error } = await supabase
      .from('admin_users')
      .select('id, username, email, totp_enabled, last_login_at, last_login_ip')
      .eq('id', user.id)
      .single();

    if (error || !userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get remaining backup codes count
    const backupCodesResult = await totpService.getRemainingBackupCodesCount(user.id);

    res.json({
      success: true,
      user: userData,
      session: {
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      },
      backupCodesRemaining: backupCodesResult.success ? backupCodesResult.count : 0
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user info'
    });
  }
});

/**
 * GET /api/admin/auth/sessions
 * Get all active sessions for current user
 */
router.get('/sessions', authenticateAdmin, async (req, res) => {
  try {
    const { user } = req;

    const result = await authService.getUserSessions(user.id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      sessions: result.sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sessions'
    });
  }
});

/**
 * DELETE /api/admin/auth/sessions/:sessionId
 * Terminate a specific session
 */
router.delete('/sessions/:sessionId', authenticateAdmin, csrfProtection, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { user, clientIp, userAgent } = req;

    // Verify session belongs to user
    const { supabase } = require('../config/database');
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('admin_user_id')
      .eq('id', sessionId)
      .single();

    if (!session || session.admin_user_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Delete session
    await authService.deleteSession(sessionId);

    // Log event
    await auditService.logSessionTerminated(user.id, user.username, sessionId, clientIp, userAgent);

    res.json({
      success: true,
      message: 'Session terminated'
    });
  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to terminate session'
    });
  }
});

/**
 * GET /api/admin/auth/login-attempts
 * Get recent login attempts for current user
 */
router.get('/login-attempts', authenticateAdmin, async (req, res) => {
  try {
    const { user } = req;
    const limit = parseInt(req.query.limit) || 10;

    const result = await authService.getLoginAttempts(user.username, limit);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      attempts: result.attempts
    });
  } catch (error) {
    console.error('Get login attempts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get login attempts'
    });
  }
});

/**
 * POST /api/admin/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticateAdmin, csrfProtection, passwordChangeLimiter, validateChangePassword, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { user, session, clientIp, userAgent } = req;

    // Change password
    const result = await authService.changePassword(
      user.id,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    // Delete all other sessions (keep current)
    const { supabase } = require('../config/database');
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('admin_user_id', user.id)
      .neq('id', session.id);

    // Log event
    await auditService.logPasswordChanged(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      message: 'Password changed successfully. All other sessions have been logged out.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
});

/**
 * POST /api/admin/auth/2fa/setup
 * Initialize 2FA setup
 */
router.post('/2fa/setup', authenticateAdmin, csrfProtection, async (req, res) => {
  try {
    const { user } = req;

    // Generate TOTP secret
    const result = await totpService.generateTOTPSecret(user.id, user.username);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    // Generate QR code
    const qrResult = await totpService.generateQRCode(result.otpauthUrl);

    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        error: qrResult.error
      });
    }

    res.json({
      success: true,
      secret: result.secret,
      qrCode: qrResult.qrCode
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to setup 2FA'
    });
  }
});

/**
 * POST /api/admin/auth/2fa/enable
 * Enable 2FA after verifying TOTP code
 */
router.post('/2fa/enable', authenticateAdmin, csrfProtection, validateTwoFactor, async (req, res) => {
  try {
    const { code } = req.body;
    const { user, clientIp, userAgent } = req;

    // Verify TOTP code
    const verifyResult = await totpService.verifyTOTPCode(user.id, code);

    if (!verifyResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Enable TOTP
    const enableResult = await totpService.enableTOTP(user.id);

    if (!enableResult.success) {
      return res.status(500).json({
        success: false,
        error: enableResult.error
      });
    }

    // Generate backup codes
    const backupCodesResult = await totpService.generateBackupCodes(user.id);

    if (!backupCodesResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate backup codes'
      });
    }

    // Log event
    await auditService.log2FAEnabled(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes: backupCodesResult.codes
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enable 2FA'
    });
  }
});

/**
 * POST /api/admin/auth/2fa/disable
 * Disable 2FA
 */
router.post('/2fa/disable', authenticateAdmin, csrfProtection, passwordChangeLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    const { user, clientIp, userAgent } = req;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password required to disable 2FA'
      });
    }

    // Verify password
    const { supabase } = require('../config/database');
    const { data: userData } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    const passwordValid = await authService.verifyPassword(password, userData.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password'
      });
    }

    // Disable TOTP
    const result = await totpService.disableTOTP(user.id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    // Log event
    await auditService.log2FADisabled(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disable 2FA'
    });
  }
});

/**
 * POST /api/admin/auth/2fa/regenerate-backup-codes
 * Regenerate backup codes
 */
router.post('/2fa/regenerate-backup-codes', authenticateAdmin, csrfProtection, backupCodeLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    const { user, clientIp, userAgent } = req;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password required to regenerate backup codes'
      });
    }

    // Verify password
    const { supabase } = require('../config/database');
    const { data: userData } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    const passwordValid = await authService.verifyPassword(password, userData.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password'
      });
    }

    // Generate new backup codes
    const result = await totpService.generateBackupCodes(user.id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    // Log event
    await auditService.logBackupCodesGenerated(user.id, user.username, clientIp, userAgent);

    res.json({
      success: true,
      backupCodes: result.codes
    });
  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate backup codes'
    });
  }
});

/**
 * GET /api/admin/auth/health
 * Health check endpoint with version info
 */
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    version: '1.0.3',
    buildTime: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    tables: {
      sessions: 'admin_sessions',
      users: 'admin_users'
    }
  });
});

module.exports = router;
