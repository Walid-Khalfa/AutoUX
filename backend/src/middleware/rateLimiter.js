/**
 * Rate Limiting Middleware
 * Implements IP-based rate limiting to prevent API abuse
 */

import { createError } from "./errorHandler.js";

// KIRO-AI: In-memory store for rate limiting
// Maps IP addresses to request timestamps
// Format: { "ip_address": [timestamp1, timestamp2, ...] }
const requestStore = new Map();

// KIRO-AI: Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 10, // Maximum 10 requests per window
};

/**
 * Clean up old request timestamps outside the current window
 * @param {string} ip - Client IP address
 */
const cleanupOldRequests = (ip) => {
  const now = Date.now();
  const requests = requestStore.get(ip) || [];
  const validRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_CONFIG.windowMs
  );
  
  if (validRequests.length > 0) {
    requestStore.set(ip, validRequests);
  } else {
    requestStore.delete(ip);
  }
};

/**
 * Rate limiting middleware
 * Limits requests to 10 per minute per IP address
 */
export const rateLimiter = (req, res, next) => {
  // Get client IP address
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  
  // Clean up old requests for this IP
  cleanupOldRequests(ip);
  
  // Get current request count for this IP
  const requests = requestStore.get(ip) || [];
  
  // Check if rate limit exceeded
  if (requests.length >= RATE_LIMIT_CONFIG.maxRequests) {
    const oldestRequest = requests[0];
    const resetTime = new Date(oldestRequest + RATE_LIMIT_CONFIG.windowMs);
    
    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_CONFIG.maxRequests);
    res.setHeader("X-RateLimit-Remaining", 0);
    res.setHeader("X-RateLimit-Reset", resetTime.toISOString());
    
    // Return rate limit error
    return next(createError("RATE_LIMIT_EXCEEDED"));
  }
  
  // Add current request timestamp
  requests.push(Date.now());
  requestStore.set(ip, requests);
  
  // Add rate limit headers
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_CONFIG.maxRequests);
  res.setHeader("X-RateLimit-Remaining", RATE_LIMIT_CONFIG.maxRequests - requests.length);
  
  next();
};

/**
 * Periodic cleanup of expired entries from request store
 * Runs every 5 minutes to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of requestStore.entries()) {
    const validRequests = requests.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_CONFIG.windowMs
    );
    
    if (validRequests.length > 0) {
      requestStore.set(ip, validRequests);
    } else {
      requestStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // 5 minutes
