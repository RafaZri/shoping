// Security Configuration
export const securityConfig = {
  // Rate limiting settings
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  },
  
  // CORS settings
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ],
  },
  
  // API security
  api: {
    maxQueryLength: 100,
    maxProductsPerRequest: 20,
    timeoutMs: 30000,
  },
  
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'https://upload.wikimedia.org',
      'https://images-na.ssl-images-amazon.com',
      'https://m.media-amazon.com',
      'https://static.nike.com'
    ],
    'connect-src': [
      "'self'",
      'https://api.groq.com',
      'https://www.google-analytics.com'
    ],
  },
  
  // Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
};

// Input validation functions
export const validateInput = {
  query: (query) => {
    if (!query || typeof query !== 'string') return false;
    if (query.length > securityConfig.api.maxQueryLength) return false;
    if (query.includes('<script>') || query.includes('javascript:')) return false;
    return true;
  },
  
  product: (product) => {
    if (!product || typeof product !== 'object') return false;
    const requiredFields = ['title', 'price', 'url'];
    return requiredFields.every(field => product.hasOwnProperty(field));
  },
  
  sanitizeHtml: (str) => {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
};

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map();

export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const { maxRequests, windowMs } = securityConfig.rateLimit;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userData = rateLimitStore.get(identifier);
  if (now > userData.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userData.count >= maxRequests) {
    return false;
  }
  
  userData.count++;
  return true;
}; 