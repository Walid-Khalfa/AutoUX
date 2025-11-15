import { describe, it, expect } from '@jest/globals';
import { addMetadata, generateMarkdown, generateReport } from '../reportGenerator.js';

describe('reportGenerator Service', () => {
  describe('addMetadata', () => {
    it('should add id, timestamp, and version to report', () => {
      const aiResponse = {
        uxScore: 75,
        issues: [],
        categories: {},
        recommendations: []
      };
      
      const result = addMetadata(aiResponse);
      
      expect(result.id).toMatch(/^report-/);
      expect(result.timestamp).toBeDefined();
      expect(result.version).toBe('1.0.0');
      expect(result.uxScore).toBe(75);
    });

    it('should preserve original response data', () => {
      const aiResponse = {
        uxScore: 80,
        issues: [{ id: 'test' }],
        categories: { Performance: 1 },
        recommendations: [{ priority: 1 }]
      };
      
      const result = addMetadata(aiResponse);
      
      expect(result.uxScore).toBe(80);
      expect(result.issues).toEqual([{ id: 'test' }]);
      expect(result.categories).toEqual({ Performance: 1 });
      expect(result.recommendations).toEqual([{ priority: 1 }]);
    });

    it('should generate valid ISO timestamp', () => {
      const aiResponse = { uxScore: 75, issues: [], categories: {}, recommendations: [] };
      const result = addMetadata(aiResponse);
      
      const timestamp = new Date(result.timestamp);
      expect(timestamp.toISOString()).toBe(result.timestamp);
    });
  });

  describe('generateMarkdown', () => {
    it('should generate markdown with header and score', () => {
      const report = {
        id: 'report-123',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 85,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: {
          totalIssues: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          analysisModel: 'test-model'
        }
      };
      
      const markdown = generateMarkdown(report);
      
      expect(markdown).toContain('# AutoUX Analysis Report');
      expect(markdown).toContain('**UX Score:** 85/100');
      expect(markdown).toContain('**Report ID:** report-123');
    });

    it('should include score emoji based on score', () => {
      const highScore = {
        id: 'test',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 95,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: { totalIssues: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, analysisModel: 'test' }
      };
      
      const mediumScore = { ...highScore, uxScore: 75 };
      const lowScore = { ...highScore, uxScore: 50 };
      
      expect(generateMarkdown(highScore)).toContain('🟢 Excellent');
      expect(generateMarkdown(mediumScore)).toContain('🟠 Fair');
      expect(generateMarkdown(lowScore)).toContain('🔴 Critical');
    });

    it('should include summary with issue counts', () => {
      const report = {
        id: 'test',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 70,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: {
          totalIssues: 10,
          criticalCount: 2,
          highCount: 3,
          mediumCount: 4,
          lowCount: 1,
          analysisModel: 'test-model'
        }
      };
      
      const markdown = generateMarkdown(report);
      
      expect(markdown).toContain('**Total Issues:** 10');
      expect(markdown).toContain('**Critical:** 2');
      expect(markdown).toContain('**High:** 3');
      expect(markdown).toContain('**Medium:** 4');
      expect(markdown).toContain('**Low:** 1');
    });

    it('should group issues by category', () => {
      const report = {
        id: 'test',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 70,
        issues: [
          {
            id: 'issue-1',
            severity: 'high',
            description: 'Performance issue',
            category: 'Performance',
            metadata: { responseTime: 5000 }
          },
          {
            id: 'issue-2',
            severity: 'medium',
            description: 'Accessibility issue',
            category: 'Accessibility',
            metadata: { wcagCriteria: ['1.1.1'] }
          }
        ],
        categories: { Performance: 1, Accessibility: 1 },
        recommendations: [],
        metadata: { totalIssues: 2, criticalCount: 0, highCount: 1, mediumCount: 1, lowCount: 0, analysisModel: 'test' }
      };
      
      const markdown = generateMarkdown(report);
      
      expect(markdown).toContain('### Performance (1 issue)');
      expect(markdown).toContain('### Accessibility (1 issue)');
      expect(markdown).toContain('Performance issue');
      expect(markdown).toContain('Accessibility issue');
      expect(markdown).toContain('Response Time: 5000ms');
      expect(markdown).toContain('WCAG Criteria: 1.1.1');
    });

    it('should include recommendations section', () => {
      const report = {
        id: 'test',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 70,
        issues: [],
        categories: {},
        recommendations: [
          {
            priority: 1,
            title: 'Optimize Performance',
            description: 'Reduce response times',
            why: 'Better user experience',
            references: ['https://web.dev/lcp/'],
            estimatedImpact: 'high'
          }
        ],
        metadata: { totalIssues: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, analysisModel: 'test' }
      };
      
      const markdown = generateMarkdown(report);
      
      expect(markdown).toContain('## Recommendations');
      expect(markdown).toContain('### 1. Optimize Performance');
      expect(markdown).toContain('**Description:** Reduce response times');
      expect(markdown).toContain('**Why this matters:** Better user experience');
      expect(markdown).toContain('https://web.dev/lcp/');
      expect(markdown).toContain('**Estimated Impact:** high');
    });

    it('should include standards references', () => {
      const report = {
        id: 'test',
        timestamp: '2025-11-13T10:00:00Z',
        uxScore: 70,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: { totalIssues: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, analysisModel: 'test' }
      };
      
      const markdown = generateMarkdown(report);
      
      expect(markdown).toContain('## Standards References');
      expect(markdown).toContain('WCAG 2.2');
      expect(markdown).toContain('Web Vitals');
      expect(markdown).toContain('LCP');
      expect(markdown).toContain('1.1.1');
    });
  });

  describe('generateReport', () => {
    it('should return both report and markdown', () => {
      const aiResponse = {
        uxScore: 75,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: {
          totalIssues: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          analysisModel: 'test-model'
        }
      };
      
      const result = generateReport(aiResponse);
      
      expect(result.report).toBeDefined();
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
    });

    it('should add metadata to report', () => {
      const aiResponse = {
        uxScore: 80,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: {
          totalIssues: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          analysisModel: 'test-model'
        }
      };
      
      const result = generateReport(aiResponse);
      
      expect(result.report.id).toBeDefined();
      expect(result.report.timestamp).toBeDefined();
      expect(result.report.version).toBe('1.0.0');
    });

    it('should generate valid markdown from report', () => {
      const aiResponse = {
        uxScore: 85,
        issues: [
          {
            id: 'issue-1',
            severity: 'high',
            description: 'Test issue',
            category: 'Performance',
            metadata: {}
          }
        ],
        categories: { Performance: 1 },
        recommendations: [],
        metadata: {
          totalIssues: 1,
          criticalCount: 0,
          highCount: 1,
          mediumCount: 0,
          lowCount: 0,
          analysisModel: 'test-model'
        }
      };
      
      const result = generateReport(aiResponse);
      
      expect(result.markdown).toContain('# AutoUX Analysis Report');
      expect(result.markdown).toContain('85/100');
      expect(result.markdown).toContain('Test issue');
    });
  });
});
