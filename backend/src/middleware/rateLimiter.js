const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login attempts
 * 5 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP address as key
  keyGenerator: (req) => {
    return req.clientIp || req.ip;
  }
});

/**
 * Rate limiter for 2FA verification
 * 3 attempts per 5 minutes per IP
 */
const twoFactorLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: {
    success: false,
    error: 'Too many 2FA attempts. Please try again in 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.clientIp || req.ip;
  }
});

/**
 * Rate limiter for general admin API requests
 * 100 requests per minute per session
 */
const adminApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use session ID if available, otherwise IP
    return req.session?.id || req.clientIp || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for successful health checks
    return req.path === '/api/admin/health';
  }
});

/**
 * Rate limiter for password change
 * 3 attempts per hour
 */
const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many password change attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.clientIp || req.ip;
  }
});

/**
 * Rate limiter for backup code generation
 * 2 attempts per hour
 */
const backupCodeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  message: {
    success: false,
    error: 'Too many backup code generation attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.clientIp || req.ip;
  }
});

module.exports = {
  loginLimiter,
  twoFactorLimiter,
  adminApiLimiter,
  passwordChangeLimiter,
  backupCodeLimiter
};
