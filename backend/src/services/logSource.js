import fs from "node:fs";
import { LOGS_PATH } from "../config/paths.js";
import { LogEntrySchema } from "../schemas/index.js";
import { z } from "zod";

// KIRO-AI: Cache object stores parsed logs and file modification time (mtime)
// This enables hot-reload by detecting when logs.json changes on disk
// The cache is invalidated automatically when mtime differs or forceRefresh is requested
let cache = {
  data: [],
  mtime: 0,
};

/**
 * KIRO-AI: readLogs() implements intelligent caching with hot-reload support
 * 
 * The function checks the file's modification time (mtime) and only re-reads
 * the file when it has changed, providing efficient hot-reload capability.
 * 
 * @param {boolean} forceRefresh - If true, bypasses cache and forces a fresh read
 * @returns {Array} Array of validated log entries
 * @throws {Error} If logs file is not found or validation fails
 * 
 * Cache invalidation triggers:
 * - File modification detected (mtime changed)
 * - forceRefresh parameter is true
 * - Cache is empty (first read)
 */
export const readLogs = (forceRefresh = false) => {
  try {
    // KIRO-AI: Check if logs file exists before attempting to read
    if (!fs.existsSync(LOGS_PATH)) {
      throw new Error(`LOGS_NOT_FOUND: File not found at ${LOGS_PATH}`);
    }

    // KIRO-AI: Get file stats to check modification time for hot-reload detection
    const stat = fs.statSync(LOGS_PATH);
    const currentMtime = stat.mtimeMs;

    // KIRO-AI: Cache invalidation logic - reload if file changed or force refresh requested
    const shouldReload = forceRefresh || currentMtime !== cache.mtime || cache.data.length === 0;

    if (shouldReload) {
      console.log(`[KIRO-AI] 🔄 Reloading logs from disk (mtime: ${currentMtime}, force: ${forceRefresh})`);
      
      // KIRO-AI: Read and parse the JSON file
      const rawData = fs.readFileSync(LOGS_PATH, "utf-8");
      const parsedData = JSON.parse(rawData);

      // KIRO-AI: Validate logs array structure
      if (!Array.isArray(parsedData)) {
        throw new Error("INVALID_LOG_FORMAT: Expected logs.json to contain an array");
      }

      // KIRO-AI: Validate each log entry against LogEntrySchema using Zod
      // This ensures data integrity and catches malformed entries early
      const validatedLogs = parsedData.map((entry, index) => {
        try {
          return LogEntrySchema.parse(entry);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error(`[KIRO-AI] ❌ Validation failed for log entry at index ${index}:`, validationError.errors);
            throw new Error(`INVALID_LOG_FORMAT: Log entry at index ${index} failed validation`);
          }
          throw validationError;
        }
      });

      // KIRO-AI: Update cache with validated data and new mtime
      cache.data = validatedLogs;
      cache.mtime = currentMtime;

      console.log(`[KIRO-AI] ✅ Successfully loaded ${validatedLogs.length} log entries`);
    } else {
      console.log(`[KIRO-AI] 📦 Using cached logs (${cache.data.length} entries)`);
    }

    return cache.data;
  } catch (error) {
    // KIRO-AI: Enhanced error handling with context for debugging
    if (error.code === "ENOENT") {
      throw new Error(`LOGS_NOT_FOUND: ${LOGS_PATH}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`INVALID_LOG_FORMAT: JSON parsing failed - ${error.message}`);
    }
    throw error;
  }
};

// KIRO-AI: Export cache for testing purposes (allows inspection of cache state)
export const getCache = () => ({ ...cache });

// KIRO-AI: Reset cache utility for testing or manual cache invalidation
export const resetCache = () => {
  cache = { data: [], mtime: 0 };
  console.log("[KIRO-AI] 🔄 Cache manually reset");
};
