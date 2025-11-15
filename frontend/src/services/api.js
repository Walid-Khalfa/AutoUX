/**
 * AutoUX API Service
 * Handles communication with the backend for log analysis
 * Features:
 * - Retry logic with exponential backoff (max 2 retries)
 * - 60s timeout for LLM analysis
 * - sessionStorage caching for AI reports
 * - Request/response interceptors for logging
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const ANALYSIS_TIMEOUT = 60000; // 60 seconds for LLM analysis
const MAX_RETRIES = 2;
const CACHE_KEY_PREFIX = 'autoux_report_';

import { logger } from '../utils/logger.js';

// Request/Response Interceptors for logging
const requestInterceptor = (url, options) => {
  logger.debug('API Request', {
    url,
    method: options.method || 'GET',
    timestamp: new Date().toISOString(),
  });
  return { url, options };
};

const responseInterceptor = (response, startTime) => {
  const duration = Date.now() - startTime;
  logger.debug('API Response', {
    status: response.status,
    statusText: response.statusText,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  });
  return response;
};

const errorInterceptor = (error, startTime) => {
  const duration = Date.now() - startTime;
  logger.error('API Error', {
    error: error.message,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  });
  throw error;
};

/**
 * Fetch with timeout support
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options = {}, timeout = ANALYSIS_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - analysis took longer than 60 seconds');
    }
    throw error;
  }
};

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
const getBackoffDelay = (attempt) => {
  // Exponential backoff: 1s, 2s, 4s...
  return Math.min(1000 * Math.pow(2, attempt), 8000);
};

/**
 * Fetch with retry logic and exponential backoff
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<Response>}
 */
const fetchWithRetry = async (url, options = {}, maxRetries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const { url: interceptedUrl, options: interceptedOptions } = requestInterceptor(url, options);
      
      const response = await fetchWithTimeout(interceptedUrl, interceptedOptions, ANALYSIS_TIMEOUT);
      
      responseInterceptor(response, startTime);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Retry on server errors (5xx) if retries remaining
      if (response.status >= 500 && attempt < maxRetries) {
        const delay = getBackoffDelay(attempt);
        logger.warn(`Server error ${response.status}, retrying in ${delay}ms...`, { attempt: attempt + 1, maxRetries });
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Retry on network errors if retries remaining
      if (attempt < maxRetries && (error.message.includes('fetch') || error.message.includes('network'))) {
        const delay = getBackoffDelay(attempt);
        logger.warn(`Network error, retrying in ${delay}ms...`, { attempt: attempt + 1, maxRetries });
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Don't retry on timeout errors
      if (error.message.includes('timeout')) {
        errorInterceptor(error, Date.now());
        throw error;
      }
      
      errorInterceptor(error, Date.now());
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Parse error response and return user-friendly message
 * @param {Response} response - Fetch response
 * @returns {Promise<string>} User-friendly error message
 */
const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    if (data.error?.message) {
      return data.error.message;
    }
    if (data.error?.code) {
      return getErrorMessageByCode(data.error.code);
    }
  } catch (e) {
    // Failed to parse JSON error
  }
  
  // Default error messages by status code
  switch (response.status) {
    case 400:
      return 'Invalid file format or request. Please check your file and try again.';
    case 413:
      return 'File too large. Maximum file size is 10MB.';
    case 415:
      return 'Unsupported file format. Please upload JSON, NDJSON, CSV, XML, HTML, HAR, TXT, or LOG files.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `Request failed with status ${response.status}`;
  }
};

/**
 * Get user-friendly error message by error code
 * @param {string} code - Error code from backend
 * @returns {string} User-friendly error message
 */
const getErrorMessageByCode = (code) => {
  const errorMessages = {
    FILE_TOO_LARGE: 'File exceeds 10MB limit. Please upload a smaller file.',
    UNSUPPORTED_FORMAT: 'File format not supported. Please upload JSON, NDJSON, CSV, XML, HTML, HAR, TXT, or LOG files.',
    PARSE_ERROR: 'Failed to parse log file. Please check the file format and try again.',
    LLM_API_ERROR: 'AI analysis service error. Please try again later.',
    LLM_TIMEOUT: 'AI analysis took too long. Please try with a smaller file.',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait a moment and try again.',
    INVALID_RESPONSE: 'Invalid response from AI service. Please try again.',
  };
  
  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
};

/**
 * Generate cache key for a file
 * @param {File} file - File object
 * @returns {string} Cache key
 */
const getCacheKey = (file) => {
  // Use file name, size, and last modified as cache key
  return `${CACHE_KEY_PREFIX}${file.name}_${file.size}_${file.lastModified}`;
};

/**
 * Get cached report from sessionStorage
 * @param {string} cacheKey - Cache key
 * @returns {object|null} Cached report or null
 */
const getCachedReport = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      logger.debug('API Cache hit', { cacheKey });
      return data;
    }
  } catch (error) {
    logger.warn('Failed to read cache', { error: error.message });
  }
  return null;
};

/**
 * Save report to sessionStorage cache
 * @param {string} cacheKey - Cache key
 * @param {object} data - Report data to cache
 */
const setCachedReport = (cacheKey, data) => {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    logger.debug('Cached report', { cacheKey });
  } catch (error) {
    logger.warn('Failed to cache report', { error: error.message });
  }
};

/**
 * Analyze log file with AI
 * Main API function for uploading and analyzing log files
 * 
 * @param {File} file - Log file to analyze
 * @returns {Promise<{report: object, markdown: string}>} AI analysis report
 * @throws {Error} User-friendly error message
 */
export const analyzeLog = async (file) => {
  // Check cache first
  const cacheKey = getCacheKey(file);
  const cachedReport = getCachedReport(cacheKey);
  if (cachedReport) {
    return cachedReport;
  }
  
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Make request with retry logic
    const response = await fetchWithRetry(
      `${API_BASE_URL}/analyze`,
      {
        method: 'POST',
        body: formData,
      },
      MAX_RETRIES
    );
    
    // Handle error responses
    if (!response.ok) {
      const errorMessage = await parseErrorMessage(response);
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    const data = await response.json();
    
    // Validate response structure
    if (!data.report) {
      throw new Error('Invalid response from server: missing report data');
    }
    
    // Cache the result
    setCachedReport(cacheKey, data);
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check that the backend is running on http://localhost:3001');
    }
    
    // Re-throw with original message if already user-friendly
    throw error;
  }
};

/**
 * Fetch fixspecs (stub implementation)
 * TODO: Implement proper fixspecs endpoint when backend is ready
 * @returns {Promise<Array>} Array of fixspecs
 */
export const fetchFixspecs = async () => {
  // Stub implementation - returns empty array
  // This should be implemented when the backend /api/fixspecs endpoint is ready
  logger.warn('fetchFixspecs is not yet implemented - returning empty array');
  return [];
};

/**
 * Fetch issues (legacy function for compatibility)
 * @returns {Promise<Array>} Array of issues
 */
export const fetchIssues = async () => {
  logger.warn('fetchIssues is deprecated - use analyzeLog instead');
  return [];
};

/**
 * Upload logs (wrapper for analyzeLog)
 * @param {FileList|Array<File>} files - Files to upload
 * @returns {Promise<object>} Analysis report
 */
export const uploadLogs = async (files) => {
  const file = files[0] || files;
  return await analyzeLog(file);
};
