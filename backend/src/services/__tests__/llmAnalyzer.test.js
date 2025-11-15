import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { buildPrompt, parseResponse, analyzeWithLLM } from '../llmAnalyzer.js';

// Mock OpenAI client
jest.unstable_mockModule('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

describe('llmAnalyzer Service', () => {
  describe('buildPrompt', () => {
    it('should build prompt with log data', () => {
      const logs = [
        { id: 1, type: 'error', message: 'Test error' },
        { id: 2, type: 'warning', message: 'Test warning' }
      ];
      
      const prompt = buildPrompt(logs);
      
      expect(prompt).toContain('UX analyzer');
      expect(prompt).toContain('Latency Issues');
      expect(prompt).toContain('Accessibility Issues');
      expect(prompt).toContain('WCAG 2.2');
      expect(prompt).toContain('Web Vitals');
      expect(prompt).toContain(JSON.stringify(logs, null, 2));
    });

    it('should limit logs to first 100 entries', () => {
      const logs = Array.from({ length: 150 }, (_, i) => ({ id: i }));
      const prompt = buildPrompt(logs);
      
      const logSample = logs.slice(0, 100);
      expect(prompt).toContain(JSON.stringify(logSample, null, 2));
    });

    it('should include detection criteria in prompt', () => {
      const logs = [{ test: 'data' }];
      const prompt = buildPrompt(logs);
      
      expect(prompt).toContain('Response times > 3000ms');
      expect(prompt).toContain('contrast ratios < 4.5:1');
      expect(prompt).toContain('1.1.1');
      expect(prompt).toContain('LCP');
    });
  });

  describe('parseResponse', () => {
    it('should parse valid LLM response', () => {
      const response = JSON.stringify({
        uxScore: 75,
        issues: [
          {
            id: 'issue-1',
            type: 'latency',
            severity: 'high',
            description: 'Slow response',
            category: 'Performance',
            metadata: { responseTime: 5000 }
          }
        ],
        categories: { Performance: 1 },
        recommendations: [
          {
            priority: 1,
            title: 'Optimize performance',
            description: 'Reduce response time',
            why: 'Better UX',
            references: ['https://web.dev/lcp/'],
            estimatedImpact: 'high'
          }
        ]
      });
      
      const result = parseResponse(response);
      
      expect(result.uxScore).toBe(75);
      expect(result.issues).toHaveLength(1);
      expect(result.recommendations).toHaveLength(1);
      expect(result.metadata.totalIssues).toBe(1);
      expect(result.metadata.highCount).toBe(1);
    });

    it('should remove markdown code blocks from response', () => {
      const response = '```json\n{"uxScore": 80, "issues": [], "categories": {}, "recommendations": []}\n```';
      const result = parseResponse(response);
      
      expect(result.uxScore).toBe(80);
      expect(result.metadata).toBeDefined();
    });

    it('should throw error for invalid uxScore', () => {
      const response = JSON.stringify({
        uxScore: 150,
        issues: [],
        categories: {},
        recommendations: []
      });
      
      expect(() => parseResponse(response)).toThrow('Invalid uxScore');
    });

    it('should throw error for missing issues array', () => {
      const response = JSON.stringify({
        uxScore: 75,
        categories: {},
        recommendations: []
      });
      
      expect(() => parseResponse(response)).toThrow('Invalid issues');
    });

    it('should calculate metadata correctly', () => {
      const response = JSON.stringify({
        uxScore: 60,
        issues: [
          { severity: 'critical' },
          { severity: 'high' },
          { severity: 'high' },
          { severity: 'medium' },
          { severity: 'low' }
        ],
        categories: {},
        recommendations: []
      });
      
      const result = parseResponse(response);
      
      expect(result.metadata.totalIssues).toBe(5);
      expect(result.metadata.criticalCount).toBe(1);
      expect(result.metadata.highCount).toBe(2);
      expect(result.metadata.mediumCount).toBe(1);
      expect(result.metadata.lowCount).toBe(1);
    });
  });

  describe('analyzeWithLLM', () => {
    it('should throw error for empty logs', async () => {
      await expect(analyzeWithLLM([])).rejects.toThrow('No logs provided');
    });

    it('should throw error for null logs', async () => {
      await expect(analyzeWithLLM(null)).rejects.toThrow('No logs provided');
    });

    // Note: Full integration tests with OpenAI API mocking are complex with Jest ESM
    // These tests validate the core logic. API integration is tested in E2E tests.
  });
});
