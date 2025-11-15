import 'dotenv/config';
import express from "express";
import cors from "cors";
import { serverConfig } from "./config/server.js";
import issuesRouter from "./routes/issues.js";
import uploadRouter from "./routes/upload.js";
import analyzeRouter from "./routes/analyze.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import { logger } from "./utils/logger.js";

// KIRO-AI: Initialize Express application with security middleware
// This is the main entry point for the AutoUX backend service
const app = express();

// KIRO-AI: Configure CORS to allow requests from the frontend origin
// Uses environment variable CORS_ORIGIN for flexibility (dev/prod)
app.use(cors({
  origin: process.env.CORS_ORIGIN || serverConfig.cors.origin || "http://localhost:5173",
  credentials: true,
}));

// KIRO-AI: Parse JSON request bodies
app.use(express.json());

// KIRO-AI: Apply security headers to all responses
// Includes X-Content-Type-Options, X-Frame-Options, CSP, and more
app.use(securityHeaders);

// KIRO-AI: Apply rate limiting to prevent API abuse
// Limits requests to 10 per minute per IP address
app.use(rateLimiter);

// KIRO-AI: Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// KIRO-AI: Mount API routes for issues and fixspecs
// All routes are prefixed with /api for clear API versioning
// Routes: GET /api/issues, GET /api/issues/:id, GET /api/fixspecs
app.use("/api", issuesRouter);

// KIRO-AI: Mount upload route for multi-format log analysis
// Route: POST /api/upload (with LLM analysis + fallback)
app.use(uploadRouter);

// KIRO-AI: Mount analyze route for AI-powered UX analysis
// Route: POST /api/analyze (multi-format file upload → parse → LLM analyze → report)
app.use("/api", analyzeRouter);

// KIRO-AI: 404 handler for undefined routes
app.use(notFoundHandler);

// KIRO-AI: Global error handler for uncaught errors
// This ensures all errors are returned in a consistent format
app.use(errorHandler);

// KIRO-AI: Start the server and listen on configured port
const PORT = serverConfig.port;
app.listen(PORT, () => {
  logger.info(`AutoUX Backend server started`, {
    port: PORT,
    url: `http://localhost:${PORT}`,
    healthCheck: `http://localhost:${PORT}/health`,
    corsOrigin: serverConfig.cors.origin,
    rateLimit: "10 requests/minute per IP",
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

export default app;
