import { z } from "zod";

// KIRO-AI: Zod schemas for runtime validation of logs, issues, and fixspecs
// These schemas ensure data integrity throughout the analysis pipeline and provide
// type-safe validation with detailed error messages for debugging

// KIRO-AI: LogEntrySchema validates incoming log entries from data/logs.json
// Supports multiple log types (performance, accessibility, error, ui) with flexible metadata
export const LogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(["performance", "accessibility", "error", "ui"]),
  category: z.string().optional(),
  message: z.string(),
  metadata: z.record(z.any()),
});

// KIRO-AI: IssueSchema validates detected UX issues in AI reports
// Updated to support AI-powered analysis with enhanced issue types and severity levels
export const IssueSchema = z.object({
  id: z.string(),
  type: z.enum(["latency", "accessibility", "contrast", "javascript_error", "other"]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  description: z.string(),
  category: z.string(),
  metadata: z.record(z.any()),
});

// KIRO-AI: RecommendationSchema validates AI-generated recommendations
// Ensures recommendations include priority, impact assessment, and standards references
export const RecommendationSchema = z.object({
  priority: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  why: z.string(),
  references: z.array(z.string()),
  codeExample: z.string().optional(),
  estimatedImpact: z.enum(["high", "medium", "low"]).optional(),
});

// KIRO-AI: AIReportSchema validates complete AI analysis reports
// Enforces structure for UX score, issues array, categories, and recommendations
export const AIReportSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  uxScore: z.number().min(0).max(100),
  issues: z.array(IssueSchema),
  categories: z.record(z.number()),
  recommendations: z.array(RecommendationSchema),
  metadata: z.object({
    totalIssues: z.number(),
    criticalCount: z.number(),
    highCount: z.number(),
    mediumCount: z.number(),
    lowCount: z.number(),
    analysisModel: z.string(),
  }).optional(),
});

// KIRO-AI: FixspecSchema validates generated fix specifications
// Ensures all fixspecs have actionable recommendations with optional code examples and references
export const FixspecSchema = z.object({
  issueId: z.string(),
  type: z.string(),
  description: z.string(),
  severity: z.string(),
  suggestedFix: z.object({
    summary: z.string(),
    steps: z.array(z.string()),
    codeExample: z.string().optional(),
    references: z.array(z.string()).optional(),
  }),
  timestamp: z.string(),
  status: z.enum(["pending", "applied", "rejected"]),
});

// KIRO-AI: Export schemas for use in services and routes
// These can be used with .parse() for strict validation or .safeParse() for error handling
export default {
  LogEntrySchema,
  IssueSchema,
  RecommendationSchema,
  AIReportSchema,
  FixspecSchema,
};
