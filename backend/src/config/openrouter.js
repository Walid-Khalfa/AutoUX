// KIRO-AI: OpenRouter API configuration for LLM-powered UX analysis
// Uses KAT-Coder-Pro model for intelligent log analysis
export const openRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  model: process.env.OPENROUTER_MODEL || "kwaipilot/kat-coder-pro:free",
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  timeout: parseInt(process.env.OPENROUTER_TIMEOUT || "60000", 10), // 60 seconds
  maxRetries: parseInt(process.env.OPENROUTER_MAX_RETRIES || "2", 10),
  retryDelay: parseInt(process.env.OPENROUTER_RETRY_DELAY || "1000", 10) // 1 second initial delay
};

// Validate required configuration
if (!openRouterConfig.apiKey) {
  throw new Error("OPENROUTER_API_KEY environment variable is required");
}
