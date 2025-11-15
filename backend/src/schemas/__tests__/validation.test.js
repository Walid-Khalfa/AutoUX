import { describe, it, expect } from '@jest/globals';
import { LogEntrySchema, IssueSchema, FixspecSchema, RecommendationSchema, AIReportSchema } from '../index.js';

describe('Zod Schema Validation', () => {
  describe('LogEntrySchema', () => {
    it('should validate valid log entry', () => {
      const validLog = {
        id: 'log-1',
        timestamp: '2025-11-12T10:00:00Z',
        type: 'performance',
        category: 'api',
        message: 'Slow response',
        metadata: {
          responseTime: 5000,
          endpoint: '/api/data',
        },
      };

      const result = LogEntrySchema.safeParse(validLog);
      expect(result.success).toBe(true);
    });

    it('should validate log entry without optional category', () => {
      const validLog = {
        id: 'log-2',
        timestamp: '2025-11-12T10:00:00Z',
        type: 'error',
        message: 'Error occurred',
        metadata: {},
      };

      const result = LogEntrySchema.safeParse(validLog);
      expect(result.success).toBe(true);
    });

    it('should reject log entry with invalid type', () => {
      const invalidLog = {
        id: 'log-3',
        timestamp: '2025-11-12T10:00:00Z',
        type: 'invalid-type',
        message: 'Test',
        metadata: {},
      };

      const result = LogEntrySchema.safeParse(invalidLog);
      expect(result.success).toBe(false);
    });

    it('should reject log entry missing required fields', () => {
      const invalidLog = {
        id: 'log-4',
        type: 'performance',
        // missing timestamp, message, metadata
      };

      const result = LogEntrySchema.safeParse(invalidLog);
      expect(result.success).toBe(false);
    });
  });

  describe('IssueSchema', () => {
    it('should validate valid issue', () => {
      const validIssue = {
        id: 'issue-1',
        type: 'latency',
        description: 'Slow response detected',
        severity: 'high',
        category: 'Performance',
        metadata: {
          responseTime: 6000,
        },
      };

      const result = IssueSchema.safeParse(validIssue);
      expect(result.success).toBe(true);
    });

    it('should validate all issue types', () => {
      const types = ['latency', 'accessibility', 'contrast', 'javascript_error', 'other'];
      
      types.forEach(type => {
        const issue = {
          id: `issue-${type}`,
          type,
          description: 'Test issue',
          severity: 'medium',
          category: 'Performance',
          metadata: {},
        };

        const result = IssueSchema.safeParse(issue);
        expect(result.success).toBe(true);
      });
    });

    it('should validate all severity levels', () => {
      const severities = ['critical', 'high', 'medium', 'low'];
      
      severities.forEach(severity => {
        const issue = {
          id: `issue-${severity}`,
          type: 'latency',
          description: 'Test issue',
          severity,
          category: 'Performance',
          metadata: {},
        };

        const result = IssueSchema.safeParse(issue);
        expect(result.success).toBe(true);
      });
    });

    it('should reject issue with invalid type', () => {
      const invalidIssue = {
        id: 'issue-2',
        type: 'invalid-type',
        description: 'Test',
        severity: 'high',
        category: 'Performance',
        metadata: {},
      };

      const result = IssueSchema.safeParse(invalidIssue);
      expect(result.success).toBe(false);
    });

    it('should reject issue with invalid severity', () => {
      const invalidIssue = {
        id: 'issue-3',
        type: 'latency',
        description: 'Test',
        severity: 'extreme',
        category: 'Performance',
        metadata: {},
      };

      const result = IssueSchema.safeParse(invalidIssue);
      expect(result.success).toBe(false);
    });
  });

  describe('FixspecSchema', () => {
    it('should validate valid fixspec', () => {
      const validFixspec = {
        issueId: 'issue-1',
        type: 'latency',
        description: 'Slow response',
        severity: 'high',
        suggestedFix: {
          summary: 'Optimize performance',
          steps: ['Step 1', 'Step 2'],
          codeExample: 'const x = 1;',
          references: ['WCAG 2.2'],
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'pending',
      };

      const result = FixspecSchema.safeParse(validFixspec);
      expect(result.success).toBe(true);
    });

    it('should validate fixspec without optional fields', () => {
      const validFixspec = {
        issueId: 'issue-2',
        type: 'contrast',
        description: 'Low contrast',
        severity: 'medium',
        suggestedFix: {
          summary: 'Improve contrast',
          steps: ['Adjust colors'],
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'applied',
      };

      const result = FixspecSchema.safeParse(validFixspec);
      expect(result.success).toBe(true);
    });

    it('should validate all status values', () => {
      const statuses = ['pending', 'applied', 'rejected'];
      
      statuses.forEach(status => {
        const fixspec = {
          issueId: `issue-${status}`,
          type: 'latency',
          description: 'Test',
          severity: 'low',
          suggestedFix: {
            summary: 'Fix it',
            steps: ['Step 1'],
          },
          timestamp: '2025-11-12T10:00:00Z',
          status,
        };

        const result = FixspecSchema.safeParse(fixspec);
        expect(result.success).toBe(true);
      });
    });

    it('should reject fixspec with invalid status', () => {
      const invalidFixspec = {
        issueId: 'issue-3',
        type: 'latency',
        description: 'Test',
        severity: 'high',
        suggestedFix: {
          summary: 'Fix it',
          steps: ['Step 1'],
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'completed',
      };

      const result = FixspecSchema.safeParse(invalidFixspec);
      expect(result.success).toBe(false);
    });

    it('should reject fixspec missing suggestedFix fields', () => {
      const invalidFixspec = {
        issueId: 'issue-4',
        type: 'latency',
        description: 'Test',
        severity: 'high',
        suggestedFix: {
          // missing summary and steps
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'pending',
      };

      const result = FixspecSchema.safeParse(invalidFixspec);
      expect(result.success).toBe(false);
    });
  });

  describe('RecommendationSchema', () => {
    it('should validate valid recommendation', () => {
      const validRecommendation = {
        priority: 1,
        title: 'Optimize API Response Times',
        description: 'Reduce server response time to under 2.5s',
        why: 'Slow API responses impact LCP and user experience',
        references: ['https://web.dev/lcp/', 'https://www.w3.org/WAI/WCAG22/'],
        codeExample: 'const optimized = true;',
        estimatedImpact: 'high',
      };

      const result = RecommendationSchema.safeParse(validRecommendation);
      expect(result.success).toBe(true);
    });

    it('should validate recommendation without optional fields', () => {
      const validRecommendation = {
        priority: 2,
        title: 'Fix Accessibility Issues',
        description: 'Add alt text to images',
        why: 'Screen readers need alt text',
        references: ['https://www.w3.org/WAI/WCAG22/Understanding/non-text-content'],
      };

      const result = RecommendationSchema.safeParse(validRecommendation);
      expect(result.success).toBe(true);
    });

    it('should validate all estimated impact levels', () => {
      const impacts = ['high', 'medium', 'low'];
      
      impacts.forEach(impact => {
        const recommendation = {
          priority: 1,
          title: 'Test',
          description: 'Test description',
          why: 'Test reason',
          references: [],
          estimatedImpact: impact,
        };

        const result = RecommendationSchema.safeParse(recommendation);
        expect(result.success).toBe(true);
      });
    });

    it('should reject recommendation with invalid priority', () => {
      const invalidRecommendation = {
        priority: -1,
        title: 'Test',
        description: 'Test',
        why: 'Test',
        references: [],
      };

      const result = RecommendationSchema.safeParse(invalidRecommendation);
      expect(result.success).toBe(false);
    });

    it('should reject recommendation missing required fields', () => {
      const invalidRecommendation = {
        priority: 1,
        title: 'Test',
        // missing description, why, references
      };

      const result = RecommendationSchema.safeParse(invalidRecommendation);
      expect(result.success).toBe(false);
    });
  });

  describe('AIReportSchema', () => {
    it('should validate valid AI report', () => {
      const validReport = {
        id: 'report-123',
        timestamp: '2025-11-14T10:00:00Z',
        uxScore: 75,
        issues: [
          {
            id: 'issue-1',
            type: 'latency',
            severity: 'high',
            description: 'Slow response',
            category: 'Performance',
            metadata: { responseTime: 5000 },
          },
        ],
        categories: {
          Performance: 1,
          Accessibility: 2,
        },
        recommendations: [
          {
            priority: 1,
            title: 'Optimize Performance',
            description: 'Reduce response time',
            why: 'Better UX',
            references: ['https://web.dev/lcp/'],
          },
        ],
        metadata: {
          totalIssues: 3,
          criticalCount: 1,
          highCount: 1,
          mediumCount: 1,
          lowCount: 0,
          analysisModel: 'kwaipilot/kat-coder-pro:free',
        },
      };

      const result = AIReportSchema.safeParse(validReport);
      expect(result.success).toBe(true);
    });

    it('should validate AI report without optional metadata', () => {
      const validReport = {
        id: 'report-456',
        timestamp: '2025-11-14T10:00:00Z',
        uxScore: 85,
        issues: [],
        categories: {},
        recommendations: [],
      };

      const result = AIReportSchema.safeParse(validReport);
      expect(result.success).toBe(true);
    });

    it('should reject report with invalid UX score', () => {
      const invalidReport = {
        id: 'report-789',
        timestamp: '2025-11-14T10:00:00Z',
        uxScore: 150, // Invalid: > 100
        issues: [],
        categories: {},
        recommendations: [],
      };

      const result = AIReportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should reject report with negative UX score', () => {
      const invalidReport = {
        id: 'report-999',
        timestamp: '2025-11-14T10:00:00Z',
        uxScore: -10, // Invalid: < 0
        issues: [],
        categories: {},
        recommendations: [],
      };

      const result = AIReportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should reject report with invalid issue structure', () => {
      const invalidReport = {
        id: 'report-111',
        timestamp: '2025-11-14T10:00:00Z',
        uxScore: 50,
        issues: [
          {
            id: 'issue-1',
            type: 'invalid-type', // Invalid type
            severity: 'high',
            description: 'Test',
            category: 'Test',
            metadata: {},
          },
        ],
        categories: {},
        recommendations: [],
      };

      const result = AIReportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });

    it('should reject report missing required fields', () => {
      const invalidReport = {
        id: 'report-222',
        // missing timestamp, uxScore, issues, categories, recommendations
      };

      const result = AIReportSchema.safeParse(invalidReport);
      expect(result.success).toBe(false);
    });
  });
});
