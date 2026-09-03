const authService = require('../services/authService');
const auditService = require('../services/auditService');

/**
 * Middleware to authenticate admin requests
 * Validates session token from cookies
 */
async function authenticateAdmin(req, res, next) {
  try {
    // Get token from cookie
    const token = req.cookies?.admin_session;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Validate session
    const result = await authService.validateSession(token);

    if (!result.valid) {
      // Clear invalid cookie
      res.clearCookie('admin_session');
      
      return res.status(401).json({
        success: false,
        error: result.error || 'Invalid or expired session'
      });
    }

    // Attach user and session info to request
    req.user = result.user;
    req.session = result.session;

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Middleware to extract IP address and user agent
 */
function extractRequestInfo(req, res, next) {
  // Get IP address (handle proxies)
  req.clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                 req.headers['x-real-ip'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress;

  // Get user agent
  req.userAgent = req.headers['user-agent'] || 'Unknown';

  next();
}

/**
 * Optional authentication - attaches user if authenticated but doesn't block
 */
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.admin_session;

    if (token) {
      const result = await authService.validateSession(token);
      if (result.valid) {
        req.user = result.user;
        req.session = result.session;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
}

module.exports = {
  authenticateAdmin,
  extractRequestInfo,
  optionalAuth
};
