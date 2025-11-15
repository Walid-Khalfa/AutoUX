/**
 * Security Headers Middleware
 * Adds security-related HTTP headers to all responses
 */

/**
 * Security headers middleware
 * Applies security headers to protect against common vulnerabilities
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Prevent clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");
  
  // Content Security Policy
  // Restricts resource loading to prevent XSS attacks
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com https://openrouter.ai"
  );
  
  // Enable XSS protection in older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy - only send origin for cross-origin requests
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions policy - disable unnecessary browser features
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  
  // Strict Transport Security (HSTS) - Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }
  
  // Prevent information disclosure
  res.removeHeader("X-Powered-By");
  
  next();
};
