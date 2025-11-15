// KIRO-AI: Google Gemini API configuration for LLM-powered UX analysis
// Uses Gemini 2.0 Flash for fast and reliable analysis
export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  baseURL: "https://generativelanguage.googleapis.com/v1",
  timeout: 60000, // 60 seconds
  maxRetries: 2,
  retryDelay: 1000, // 1 second initial delay
  temperature: 0.3,
  maxTokens: 4000
};

// Validate required configuration
if (!geminiConfig.apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}
