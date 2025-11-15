import { uid, latencyToSeverity } from "./util.js";
import { generateFixspec, saveFixspecOnce } from "./fixspecGenerator.js";

/**
 * Analyzes logs and detects UX issues
 * @param {Array<LogEntry>} logs - List of log entries to analyze
 * @returns {Promise<Array<Issue>>} List of detected UX issues
 */
// KIRO-AI: Main entry point for log analysis
// Applies all issue detectors and returns a consolidated list
// Automatically generates a fixspec for each detected issue
// Can be extended to add new detection types (SEO, security, etc.)
export const analyzeLogs = async (logs) => {
  const issues = [];

  for (const log of logs) {
    // KIRO-AI: Applique chaque détecteur spécialisé sur le log
    // Chaque détecteur retourne null si aucune issue n'est trouvée
    const latencyIssue = detectLatencyIssues(log);
    const accessibilityIssue = detectAccessibilityIssues(log);
    const contrastIssue = detectContrastIssues(log);
    const jsErrorIssue = detectJSErrors(log);

    // Add detected issues (filter out nulls)
    if (latencyIssue) issues.push(latencyIssue);
    if (accessibilityIssue) issues.push(accessibilityIssue);
    if (contrastIssue) issues.push(contrastIssue);
    if (jsErrorIssue) issues.push(jsErrorIssue);
  }

  // KIRO-AI: Generate and persist a fixspec for each detected issue
  // Idempotence is guaranteed by saveFixspecOnce() which only creates new fixspecs
  for (const issue of issues) {
    const fixspec = generateFixspec(issue);
    await saveFixspecOnce(fixspec);
  }

  return issues;
};

/**
 * Detects latency issues (response time > 3000ms)
 * @param {LogEntry} log - Log entry to analyze
 * @returns {Issue | null} Latency issue or null if no problem
 */
// KIRO-AI: Detects performance issues based on response time
// Threshold: >3000ms (based on Web Vitals recommendations for LCP)
// Severity calculated dynamically: high (>5000ms), medium (3000-5000ms), low (<3000ms)
export const detectLatencyIssues = (log) => {
  // Check if it's a performance log with responseTime
  if (log.type !== "performance" || !log.metadata?.responseTime) {
    return null;
  }

  const responseTime = log.metadata.responseTime;

  // KIRO-AI: Detection threshold at 3000ms (3 seconds)
  // Beyond this threshold, user experience is significantly degraded
  if (responseTime <= 3000) {
    return null;
  }

  return {
    id: uid("issue"),
    type: "latency",
    description: `High response time detected: ${responseTime}ms on ${log.metadata.endpoint || "unknown endpoint"}`,
    severity: latencyToSeverity(responseTime),
    timestamp: log.timestamp,
    sourceLogId: log.id,
    metadata: {
      responseTime,
      endpoint: log.metadata.endpoint,
      method: log.metadata.method,
      statusCode: log.metadata.statusCode,
    },
  };
};

/**
 * Detects accessibility issues (alt text, ARIA, keyboard)
 * @param {LogEntry} log - Log entry to analyze
 * @returns {Issue | null} Accessibility issue or null if no problem
 */
// KIRO-AI: Detects accessibility violations according to WCAG 2.2
// Covers: missing alt text (1.1.1), invalid ARIA (4.1.2), keyboard navigation (2.1.1)
// Severity based on WCAG level: A (high), AA (medium), AAA (low)
export const detectAccessibilityIssues = (log) => {
  // Check if it's an accessibility log
  if (log.type !== "accessibility") {
    return null;
  }

  const violation = log.metadata?.violation;
  let description = log.message;
  let severity = "medium"; // Default

  // KIRO-AI: Specific detection for missing alt text (WCAG 1.1.1 - Level A)
  if (violation === "missing-alt-text" || log.category === "images") {
    description = `Image missing alt attribute: ${log.metadata?.element || "unknown element"}`;
    severity = "high"; // Level A = critical
  }
  // KIRO-AI: Specific detection for invalid ARIA (WCAG 4.1.2 - Level A)
  else if (violation === "invalid-aria-attribute" || log.category === "aria") {
    description = `Invalid ARIA attribute on ${log.metadata?.element || "unknown element"}`;
    if (log.metadata?.attribute && log.metadata?.value) {
      description += `: ${log.metadata.attribute}="${log.metadata.value}"`;
    }
    severity = "high"; // Level A = critical
  }
  // KIRO-AI: Specific detection for keyboard navigation (WCAG 2.1.1 - Level A)
  else if (violation === "no-keyboard-access" || log.category === "keyboard") {
    description = `Interactive element not keyboard accessible: ${log.metadata?.element || "unknown element"}`;
    severity = "high"; // Level A = critical
  }
  // KIRO-AI: Adjust severity based on WCAG level if available
  else if (log.metadata?.wcagLevel) {
    severity = log.metadata.wcagLevel === "A" ? "high" : log.metadata.wcagLevel === "AA" ? "medium" : "low";
  }

  return {
    id: uid("issue"),
    type: "accessibility",
    description,
    severity,
    timestamp: log.timestamp,
    sourceLogId: log.id,
    metadata: {
      element: log.metadata?.element,
      page: log.metadata?.page,
      violation: log.metadata?.violation,
      wcagLevel: log.metadata?.wcagLevel,
      recommendation: log.metadata?.recommendation,
    },
  };
};

/**
 * Detects contrast issues (ratio < 4.5:1)
 * @param {LogEntry} log - Log entry to analyze
 * @returns {Issue | null} Contrast issue or null if no problem
 */
// KIRO-AI: Detects contrast violations according to WCAG 2.2 - 1.4.3 (Level AA)
// Threshold: ratio < 4.5:1 for normal text, < 3:1 for large text
// Severity: high (<3:1), medium (3-4.5:1), low (>4.5:1 but flagged)
export const detectContrastIssues = (log) => {
  // Check if it's a contrast log
  if (log.type !== "ui" || log.category !== "contrast" || !log.metadata?.contrastRatio) {
    return null;
  }

  const contrastRatio = log.metadata.contrastRatio;

  // KIRO-AI: WCAG AA threshold for normal text: 4.5:1
  // Below this ratio, text may be difficult to read for visually impaired users
  if (contrastRatio >= 4.5) {
    return null;
  }

  // KIRO-AI: Determine severity based on contrast ratio
  // - high: <3:1 (critical failure, even for large text)
  // - medium: 3-4.5:1 (AA failure for normal text)
  let severity = "medium";
  if (contrastRatio < 3) {
    severity = "high";
  }

  return {
    id: uid("issue"),
    type: "contrast",
    description: `Insufficient contrast (${contrastRatio.toFixed(2)}:1) on ${log.metadata?.element || "unknown element"}`,
    severity,
    timestamp: log.timestamp,
    sourceLogId: log.id,
    metadata: {
      element: log.metadata.element,
      contrastRatio,
      foreground: log.metadata.foreground,
      background: log.metadata.background,
      wcagLevel: log.metadata.wcagLevel,
      requiredRatio: log.metadata.requiredRatio || 4.5,
    },
  };
};

/**
 * Detects JavaScript errors
 * @param {LogEntry} log - Log entry to analyze
 * @returns {Issue | null} JS error issue or null if no problem
 */
// KIRO-AI: Detects JavaScript errors that impact user experience
// Criteria: type="error" AND category="javascript"
// Severity: high (error blocks UI), medium (recoverable error), low (warning)
export const detectJSErrors = (log) => {
  // KIRO-AI: Check strict criteria for a JavaScript error
  // type="error" indicates a system error, category="javascript" specifies the origin
  if (log.type !== "error" || log.category !== "javascript") {
    return null;
  }

  const errorMessage = log.metadata?.errorMessage || log.message;
  const component = log.metadata?.component;
  const file = log.metadata?.file;
  const line = log.metadata?.line;

  // KIRO-AI: Build a detailed description with context
  let description = `JavaScript Error: ${errorMessage}`;
  if (component) {
    description += ` in component ${component}`;
  }
  if (file && line) {
    description += ` (${file}:${line})`;
  }

  // KIRO-AI: All unhandled JS errors are considered critical
  // They can block the interface or cause unpredictable behavior
  const severity = "high";

  return {
    id: uid("issue"),
    type: "JS error",
    description,
    severity,
    timestamp: log.timestamp,
    sourceLogId: log.id,
    metadata: {
      errorMessage,
      stackTrace: log.metadata?.stackTrace,
      component: log.metadata?.component,
      file: log.metadata?.file,
      line: log.metadata?.line,
    },
  };
};
