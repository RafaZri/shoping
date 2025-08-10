// Security utility functions

// Input sanitization
export const sanitizeInput = {
  // Remove HTML tags and dangerous characters
  html: (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;');
  },

  // Sanitize URLs
  url: (url) => {
    if (typeof url !== 'string') return '';
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  },

  // Sanitize search queries
  query: (query) => {
    if (typeof query !== 'string') return '';
    return query
      .trim()
      .slice(0, 100) // Limit length
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:/gi, ''); // Remove data protocol
  },

  // Validate email format
  email: (email) => {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
};

// CSRF protection
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validate CSRF token
export const validateCSRFToken = (token, storedToken) => {
  return token && storedToken && token === storedToken;
};

// Password strength validation
export const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
};

// Rate limiting helper
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier);
    
    if (!userRequests) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (now > userRequests.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (userRequests.count >= this.maxRequests) {
      return false;
    }
    
    userRequests.count++;
    return true;
  }

  getRemaining(identifier) {
    const userRequests = this.requests.get(identifier);
    if (!userRequests) return this.maxRequests;
    return Math.max(0, this.maxRequests - userRequests.count);
  }
}

// Logging for security events
export const securityLogger = {
  log: (event, details) => {
    console.log(`[SECURITY] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    });
  },

  warn: (event, details) => {
    console.warn(`[SECURITY WARNING] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      details,
    });
  },

  error: (event, details) => {
    console.error(`[SECURITY ERROR] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      details,
    });
  }
}; 