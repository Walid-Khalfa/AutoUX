// KIRO-AI: AI Analyzer service - Unified interface for multiple AI providers
// Supports both Gemini and OpenRouter with automatic fallback
import { analyzeWithGemini } from "./geminiAnalyzer.js";
import { analyzeWithLLM } from "./llmAnalyzer.js";
import { logger } from "../utils/logger.js";

const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";

/**
 * Analyze logs with AI (automatically selects provider)
 * @param {Array<Object>} logs - Parsed log entries
 * @returns {Promise<Object>} AI report with issues and recommendations
 */
export const analyzeWithAI = async (logs) => {
  logger.info(`Using AI provider: ${AI_PROVIDER}`);

  try {
    if (AI_PROVIDER === "gemini") {
      return await analyzeWithGemini(logs);
    } else if (AI_PROVIDER === "openrouter") {
      return await analyzeWithLLM(logs);
    } else {
      throw new Error(`Unknown AI provider: ${AI_PROVIDER}`);
    }
  } catch (error) {
    logger.error(`AI analysis failed with ${AI_PROVIDER}`, { error: error.message });
    
    // Fallback to alternative provider if primary fails
    if (AI_PROVIDER === "gemini" && process.env.OPENROUTER_API_KEY) {
      logger.info("Falling back to OpenRouter...");
      return await analyzeWithLLM(logs);
    } else if (AI_PROVIDER === "openrouter" && process.env.GEMINI_API_KEY) {
      logger.info("Falling back to Gemini...");
      return await analyzeWithGemini(logs);
    }
    
    // No fallback available, throw original error
    throw error;
  }
};

export default { analyzeWithAI };
