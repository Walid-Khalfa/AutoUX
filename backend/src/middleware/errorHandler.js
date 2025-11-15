/**
 * Error Handler Middleware
 * Centralized error handling with standardized error codes and responses
 */

// KIRO-AI: Define standard error codes for consistent error handling
export const ERROR_CODES = {
  FILE_TOO_LARGE: {
    code: "FILE_TOO_LARGE",
    status: 400,
    message: "File too large. Maximum file size is 10MB.",
  },
  UNSUPPORTED_FORMAT: {
    code: "UNSUPPORTED_FORMAT",
    status: 400,
    message: "File format not supported. Please upload a valid log file.",
  },
  PARSE_ERROR: {
    code: "PARSE_ERROR",
    status: 400,
    message: "Failed to parse log file. Please check the file format.",
  },
  LLM_API_ERROR: {
    code: "LLM_API_ERROR",
    status: 500,
    message: "AI analysis failed. Please try again later.",
  },
  LLM_TIMEOUT: {
    code: "LLM_TIMEOUT",
    status: 504,
    message: "AI analysis took too long. Please try with a smaller log file.",
  },
  RATE_LIMIT_EXCEEDED: {
    code: "RATE_LIMIT_EXCEEDED",
    status: 429,
    message: "Too many requests. Please try again in a few minutes.",
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    message: "Invalid request data.",
  },
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "An unexpected error occurred. Please try again.",
  },
  NO_FILE: {
    code: "NO_FILE",
    status: 400,
    message: "No file uploaded. Please provide a log file.",
  },
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    status: 404,
    message: "Route not found.",
  },
};

/**
 * Create a standardized error object
 * @param {string} errorCode - Error code from ERROR_CODES
 * @param {string} customMessage - Optional custom message to override default
 * @returns {Error} Error object with code, status, and message
 */
export const createError = (errorCode, customMessage = null) => {
  const errorConfig = ERROR_CODES[errorCode] || ERROR_CODES.INTERNAL_ERROR;
  const error = new Error(customMessage || errorConfig.message);
  error.code = errorConfig.code;
  error.status = errorConfig.status;
  return error;
};

/**
 * Global error handler middleware
 * Catches all errors and returns standardized JSON responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`[ERROR] ${new Date().toISOString()}:`, {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Handle multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const errorConfig = ERROR_CODES.FILE_TOO_LARGE;
    return res.status(errorConfig.status).json({
      error: {
        message: errorConfig.message,
        code: errorConfig.code,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Handle known error codes
  if (err.code && ERROR_CODES[err.code]) {
    const errorConfig = ERROR_CODES[err.code];
    return res.status(err.status || errorConfig.status).json({
      error: {
        message: err.message || errorConfig.message,
        code: err.code,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.errors,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Default to internal error
  const errorConfig = ERROR_CODES.INTERNAL_ERROR;
  res.status(err.status || errorConfig.status).json({
    error: {
      message: err.message || errorConfig.message,
      code: err.code || errorConfig.code,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * 404 Not Found handler
 * Returns standardized error for undefined routes
 */
export const notFoundHandler = (req, res) => {
  const errorConfig = ERROR_CODES.ROUTE_NOT_FOUND;
  res.status(errorConfig.status).json({
    error: {
      message: errorConfig.message,
      code: errorConfig.code,
      timestamp: new Date().toISOString(),
    },
  });
};
