// KIRO-AI: LLM-powered UX analysis service using OpenRouter API
// Analyzes logs to detect latency, accessibility, contrast, and JavaScript errors
import OpenAI from "openai";
import { openRouterConfig } from "../config/openrouter.js";
import { logger } from "../utils/logger.js";
import { calculateUXScore } from "./scoreCalculator.js";

// Initialize OpenAI client with OpenRouter configuration
const client = new OpenAI({
  baseURL: openRouterConfig.baseURL,
  apiKey: openRouterConfig.apiKey,
  timeout: openRouterConfig.timeout,
});

/**
 * Build analysis prompt with UX detection instructions
 * @param {Array<Object>} logs - Parsed log entries
 * @returns {string} Formatted prompt for LLM
 */
export const buildPrompt = (logs) => {
  const logSample = logs.slice(0, 100); // Limit to first 100 entries to avoid token limits
  const logText = JSON.stringify(logSample, null, 2);

  return `You are an expert UX analyzer. Analyze the following logs and identify UX issues.

**Detection Criteria:**
- **Latency Issues**: Response times > 3000ms (affects Web Vitals LCP - Largest Contentful Paint)
- **Accessibility Issues**: Missing alt text, insufficient ARIA labels, keyboard navigation problems (WCAG 2.2 criteria: 1.1.1, 2.1.1, 4.1.2)
- **Contrast Issues**: Color contrast ratios < 4.5:1 for normal text, < 3:1 for large text (WCAG 2.2 criterion 1.4.3)
- **JavaScript Errors**: Uncaught exceptions, console errors, failed API calls

**Standards References:**
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/
  - 1.1.1 Non-text Content (alt text)
  - 1.4.3 Contrast (Minimum)
  - 2.1.1 Keyboard (navigation)
  - 4.1.2 Name, Role, Value (ARIA)
- Web Vitals: https://web.dev/vitals/
  - LCP (Largest Contentful Paint): < 2.5s good, > 4s poor
  - FID (First Input Delay): < 100ms good, > 300ms poor
  - CLS (Cumulative Layout Shift): < 0.1 good, > 0.25 poor

**Log Data:**
\`\`\`json
${logText}
\`\`\`

**Important:** Focus on accurately detecting and categorizing issues. The UX score will be calculated automatically based on the issues you identify.

**Output Format (JSON only):**
{
  "uxScore": 0,
  "issues": [
    {
      "id": "<unique-id>",
      "type": "<latency|accessibility|contrast|javascript_error|other>",
      "severity": "<critical|high|medium|low>",
      "description": "<clear description>",
      "category": "<Performance|Accessibility|JavaScript Errors|Visual Design|Other>",
      "metadata": {
        "responseTime": <number if latency>,
        "element": "<element if accessibility>",
        "errorMessage": "<message if JS error>",
        "contrastRatio": <number if contrast>,
        "wcagCriteria": ["<criteria>"],
        "webVitalsMetric": "<LCP|FID|CLS if performance>"
      }
    }
  ],
  "categories": {
    "<category-name>": <count>
  },
  "recommendations": [
    {
      "priority": <number>,
      "title": "<recommendation title>",
      "description": "<detailed description>",
      "why": "<explanation of impact>",
      "references": ["<WCAG or Web Vitals URL>"],
      "estimatedImpact": "<high|medium|low>"
    }
  ]
}

Provide ONLY valid JSON output. No markdown, no explanations, just the JSON object.`;
};

/**
 * Parse and validate LLM response
 * @param {string} response - Raw LLM response
 * @returns {Object} Structured AI report
 */
export const parseResponse = (response) => {
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanResponse);

    // Validate required fields
    if (typeof parsed.uxScore !== "number" || parsed.uxScore < 0 || parsed.uxScore > 100) {
      throw new Error("Invalid uxScore: must be a number between 0 and 100");
    }

    if (!Array.isArray(parsed.issues)) {
      throw new Error("Invalid issues: must be an array");
    }

    if (!Array.isArray(parsed.recommendations)) {
      throw new Error("Invalid recommendations: must be an array");
    }

    if (typeof parsed.categories !== "object" || parsed.categories === null) {
      throw new Error("Invalid categories: must be an object");
    }

    // ALWAYS recalculate UX score to ensure accuracy
    // The LLM sometimes generates incorrect scores, so we always use our deterministic calculation
    const llmScore = parsed.uxScore;
    const calculatedScore = calculateUXScore(parsed.issues);
    
    // Log if there's a discrepancy
    if (Math.abs(calculatedScore - llmScore) > 5) {
      logger.info(`Score correction: LLM=${llmScore}, Calculated=${calculatedScore}, Issues=${parsed.issues.length}`);
    }
    
    // Always use the calculated score for consistency
    parsed.uxScore = calculatedScore;

    // Add metadata
    const metadata = {
      totalIssues: parsed.issues.length,
      criticalCount: parsed.issues.filter(i => i.severity === "critical").length,
      highCount: parsed.issues.filter(i => i.severity === "high").length,
      mediumCount: parsed.issues.filter(i => i.severity === "medium").length,
      lowCount: parsed.issues.filter(i => i.severity === "low").length,
      analysisModel: openRouterConfig.model,
      llmGeneratedScore: llmScore,
      finalScore: calculatedScore,
    };

    return {
      ...parsed,
      metadata,
    };
  } catch (error) {
    logger.error("Failed to parse LLM response", { error: error.message });
    throw new Error(`INVALID_RESPONSE: ${error.message}`);
  }
};

/**
 * Analyze logs with LLM and return structured report
 * @param {Array<Object>} logs - Parsed log entries
 * @returns {Promise<Object>} AI report with issues and recommendations
 */
export const analyzeWithLLM = async (logs) => {
  if (!logs || logs.length === 0) {
    throw new Error("No logs provided for analysis");
  }

  const prompt = buildPrompt(logs);
  let lastError = null;

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt <= openRouterConfig.maxRetries; attempt++) {
    try {
      logger.info(`LLM analysis attempt ${attempt + 1}/${openRouterConfig.maxRetries + 1}`);

      const completion = await client.chat.completions.create({
        model: openRouterConfig.model,
        messages: [
          {
            role: "system",
            content: "You are an expert UX analyzer. Analyze logs and provide structured JSON output with issues, categories, severities, recommendations, and a UX score (0-100). Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("Empty response from LLM");
      }

      return parseResponse(responseContent);
    } catch (error) {
      lastError = error;
      logger.error(`LLM analysis attempt ${attempt + 1} failed`, { error: error.message });

      // Handle specific error types
      if (error.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED: Too many requests to OpenRouter API");
      }

      if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
        if (attempt === openRouterConfig.maxRetries) {
          throw new Error("LLM_TIMEOUT: Analysis exceeded 60s timeout after retries");
        }
      }

      // Don't retry on invalid response errors
      if (error.message.startsWith("INVALID_RESPONSE")) {
        throw error;
      }

      // Exponential backoff before retry
      if (attempt < openRouterConfig.maxRetries) {
        const delay = openRouterConfig.retryDelay * Math.pow(2, attempt);
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  throw new Error(`LLM_API_ERROR: ${lastError?.message || "Unknown error after retries"}`);
};
