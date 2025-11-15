/**
 * Analyze Route - POST /api/analyze
 * Handles multi-format log file upload and AI-powered UX analysis
 */

import express from "express";
import multer from "multer";
import { parse } from "../services/fileParser.js";
import { analyzeWithAI } from "../services/aiAnalyzer.js";
import { generateReport } from "../services/reportGenerator.js";
import { createError } from "../middleware/errorHandler.js";
import { AIReportSchema } from "../schemas/index.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types
    const allowedMimeTypes = [
      "application/json",
      "text/plain",
      "text/csv",
      "application/xml",
      "text/xml",
      "text/html",
      "application/html",
      "application/har+json",
      "application/octet-stream", // For files without proper MIME type
    ];

    // Also check file extension
    const allowedExtensions = [
      ".json",
      ".ndjson",
      ".jsonl",
      ".csv",
      ".xml",
      ".html",
      ".htm",
      ".har",
      ".txt",
      ".log",
    ];

    const fileExtension = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
    const mimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    const extensionAllowed = fileExtension && allowedExtensions.includes(fileExtension);

    if (mimeTypeAllowed || extensionAllowed) {
      cb(null, true);
    } else {
      const error = createError(
        "UNSUPPORTED_FORMAT",
        `File type not supported. Allowed formats: ${allowedExtensions.join(", ")}`
      );
      cb(error);
    }
  },
});

/**
 * POST /api/analyze
 * Upload log file and receive AI-generated UX analysis
 */
router.post("/analyze", upload.single("file"), async (req, res, next) => {
  try {
    // Validate file upload
    if (!req.file) {
      throw createError("NO_FILE");
    }

    const { buffer, originalname } = req.file;

    logger.info(`Processing file: ${originalname}`, { size: buffer.length });

    // Step 1: Parse the file
    let parsedLogs;
    try {
      parsedLogs = parse(buffer, originalname);
      logger.info(`Parsed ${parsedLogs.length} log entries`);
    } catch (error) {
      logger.error(`Parse error`, { error: error.message });
      throw createError("PARSE_ERROR", `Failed to parse log file: ${error.message}`);
    }

    // Step 2: Analyze with AI (Gemini or OpenRouter)
    let aiResponse;
    try {
      aiResponse = await analyzeWithAI(parsedLogs);
      logger.info(`AI analysis complete`, { uxScore: aiResponse.uxScore, issues: aiResponse.issues?.length });
    } catch (error) {
      logger.error(`AI analysis error`, { error: error.message });

      // Handle specific AI errors
      if (error.message.includes("RATE_LIMIT_EXCEEDED")) {
        throw createError("RATE_LIMIT_EXCEEDED");
      }

      if (error.message.includes("TIMEOUT")) {
        throw createError("LLM_TIMEOUT");
      }

      if (error.message.includes("INVALID_RESPONSE")) {
        throw createError("LLM_API_ERROR", "AI service returned an invalid response. Please try again.");
      }

      // Generic AI error
      throw createError("LLM_API_ERROR");
    }

    // Step 3: Generate report with metadata and Markdown
    const { report, markdown } = generateReport(aiResponse);
    logger.info(`Report generated`, { reportId: report.id });

    // Step 4: Validate report structure
    try {
      AIReportSchema.parse(report);
    } catch (validationError) {
      logger.error(`Report validation failed`, { error: validationError });
      throw createError("LLM_API_ERROR", "AI service returned invalid report structure.");
    }

    // Step 5: Return JSON + Markdown
    res.json({
      report,
      markdown,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
});

export default router;
