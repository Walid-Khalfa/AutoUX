import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { detectLatencyIssues, detectAccessibilityIssues, detectContrastIssues, detectJSErrors } from '../issueAnalyzer.js';

describe('issueAnalyzer.js', () => {
  describe('detectLatencyIssues', () => {
    it('should detect latency issue with high severity for > 5000ms', () => {
      const log = {
        id: 'log-1',
        type: 'performance',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Slow response',
        metadata: {
          responseTime: 6000,
          endpoint: '/api/data',
          method: 'GET',
          statusCode: 200,
        },
      };

      const issue = detectLatencyIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.type).toBe('latency');
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('6000ms');
      expect(issue.metadata.responseTime).toBe(6000);
    });

    it('should detect latency issue with medium severity for 3000-5000ms', () => {
      const log = {
        id: 'log-2',
        type: 'performance',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Moderate response',
        metadata: {
          responseTime: 4000,
          endpoint: '/api/users',
        },
      };

      const issue = detectLatencyIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.severity).toBe('medium');
    });

    it('should not detect issue for latency <= 3000ms', () => {
      const log = {
        id: 'log-3',
        type: 'performance',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Fast response',
        metadata: {
          responseTime: 2000,
          endpoint: '/api/fast',
        },
      };

      const issue = detectLatencyIssues(log);
      expect(issue).toBeNull();
    });

    it('should not detect issue for non-performance logs', () => {
      const log = {
        id: 'log-4',
        type: 'error',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Error',
        metadata: {},
      };

      const issue = detectLatencyIssues(log);
      expect(issue).toBeNull();
    });
  });

  describe('detectAccessibilityIssues', () => {
    it('should detect missing alt text issue', () => {
      const log = {
        id: 'log-5',
        type: 'accessibility',
        category: 'images',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Missing alt text',
        metadata: {
          violation: 'missing-alt-text',
          element: 'img.hero',
          wcagLevel: 'A',
        },
      };

      const issue = detectAccessibilityIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.type).toBe('accessibility');
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('alt');
    });

    it('should detect invalid ARIA attribute issue', () => {
      const log = {
        id: 'log-6',
        type: 'accessibility',
        category: 'aria',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Invalid ARIA',
        metadata: {
          violation: 'invalid-aria-attribute',
          element: 'div.button',
          attribute: 'aria-pressed',
          value: 'maybe',
        },
      };

      const issue = detectAccessibilityIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('ARIA');
    });

    it('should detect keyboard access issue', () => {
      const log = {
        id: 'log-7',
        type: 'accessibility',
        category: 'keyboard',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'No keyboard access',
        metadata: {
          violation: 'no-keyboard-access',
          element: 'div.clickable',
        },
      };

      const issue = detectAccessibilityIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('keyboard');
    });

    it('should not detect issue for non-accessibility logs', () => {
      const log = {
        id: 'log-8',
        type: 'performance',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Performance log',
        metadata: {},
      };

      const issue = detectAccessibilityIssues(log);
      expect(issue).toBeNull();
    });
  });

  describe('detectContrastIssues', () => {
    it('should detect high severity contrast issue for ratio < 3:1', () => {
      const log = {
        id: 'log-9',
        type: 'ui',
        category: 'contrast',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Low contrast',
        metadata: {
          contrastRatio: 2.5,
          element: 'button.primary',
          foreground: '#999',
          background: '#fff',
        },
      };

      const issue = detectContrastIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.type).toBe('contrast');
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('2.50:1');
    });

    it('should detect medium severity contrast issue for ratio 3-4.5:1', () => {
      const log = {
        id: 'log-10',
        type: 'ui',
        category: 'contrast',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Moderate contrast',
        metadata: {
          contrastRatio: 4.0,
          element: 'p.text',
        },
      };

      const issue = detectContrastIssues(log);
      
      expect(issue).not.toBeNull();
      expect(issue.severity).toBe('medium');
    });

    it('should not detect issue for contrast >= 4.5:1', () => {
      const log = {
        id: 'log-11',
        type: 'ui',
        category: 'contrast',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Good contrast',
        metadata: {
          contrastRatio: 5.0,
          element: 'span.label',
        },
      };

      const issue = detectContrastIssues(log);
      expect(issue).toBeNull();
    });

    it('should not detect issue for non-contrast logs', () => {
      const log = {
        id: 'log-12',
        type: 'ui',
        category: 'layout',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Layout issue',
        metadata: {},
      };

      const issue = detectContrastIssues(log);
      expect(issue).toBeNull();
    });
  });

  describe('detectJSErrors', () => {
    it('should detect JavaScript error', () => {
      const log = {
        id: 'log-13',
        type: 'error',
        category: 'javascript',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'TypeError: Cannot read property',
        metadata: {
          errorMessage: 'Cannot read property "value" of undefined',
          component: 'UserProfile',
          file: 'UserProfile.jsx',
          line: 42,
          stackTrace: 'at UserProfile.render...',
        },
      };

      const issue = detectJSErrors(log);
      
      expect(issue).not.toBeNull();
      expect(issue.type).toBe('JS error');
      expect(issue.severity).toBe('high');
      expect(issue.description).toContain('UserProfile');
      expect(issue.description).toContain('UserProfile.jsx:42');
    });

    it('should not detect issue for non-error logs', () => {
      const log = {
        id: 'log-14',
        type: 'performance',
        category: 'javascript',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Performance metric',
        metadata: {},
      };

      const issue = detectJSErrors(log);
      expect(issue).toBeNull();
    });

    it('should not detect issue for non-javascript errors', () => {
      const log = {
        id: 'log-15',
        type: 'error',
        category: 'network',
        timestamp: '2025-11-12T10:00:00Z',
        message: 'Network error',
        metadata: {},
      };

      const issue = detectJSErrors(log);
      expect(issue).toBeNull();
    });
  });
});
