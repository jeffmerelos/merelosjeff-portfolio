const { doubleCsrf } = require('csrf-csrf');

// CSRF protection configuration
const {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'your-csrf-secret-change-this-in-production',
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => {
    // Check header first, then body
    return req.headers['x-csrf-token'] || req.body?.csrfToken;
  }
});

/**
 * Middleware to generate and send CSRF token
 */
function sendCsrfToken(req, res, next) {
  const token = generateToken(req, res);
  res.locals.csrfToken = token;
  next();
}

/**
 * Error handler for CSRF token validation failures
 */
function csrfErrorHandler(err, req, res, next) {
  if (err === invalidCsrfTokenError) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token'
    });
  }
  next(err);
}

module.exports = {
  csrfProtection: doubleCsrfProtection,
  sendCsrfToken,
  csrfErrorHandler,
  generateToken
};
