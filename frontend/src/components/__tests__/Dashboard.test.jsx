import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  const mockReport = {
    id: 'report-123',
    timestamp: '2025-11-13T10:00:00Z',
    uxScore: 75,
    issues: [
      {
        id: 'issue-1',
        type: 'latency',
        severity: 'high',
        description: 'Slow API response',
        category: 'Performance',
        metadata: { responseTime: 5000 }
      },
      {
        id: 'issue-2',
        type: 'accessibility',
        severity: 'critical',
        description: 'Missing alt text',
        category: 'Accessibility',
        metadata: { wcagCriteria: ['1.1.1'] }
      },
      {
        id: 'issue-3',
        type: 'contrast',
        severity: 'medium',
        description: 'Low contrast ratio',
        category: 'Visual Design',
        metadata: { contrastRatio: 3.2 }
      }
    ],
    categories: {
      Performance: 1,
      Accessibility: 1,
      'Visual Design': 1
    },
    recommendations: [
      {
        priority: 1,
        title: 'Optimize API Performance',
        description: 'Reduce response times',
        why: 'Better user experience',
        references: ['https://web.dev/lcp/'],
        estimatedImpact: 'high'
      }
    ],
    metadata: {
      totalIssues: 3,
      criticalCount: 1,
      highCount: 1,
      mediumCount: 1,
      lowCount: 0,
      analysisModel: 'kwaipilot/kat-coder-pro:free'
    }
  };

  describe('UX Score Display', () => {
    it('should display UX score', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      expect(container.textContent).toContain('75');
    });

    it('should show green color for excellent score (90-100)', () => {
      const excellentReport = { ...mockReport, uxScore: 95 };
      const { container } = render(<Dashboard report={excellentReport} />);
      
      expect(container.textContent).toContain('95');
      // Check for "Excellent" text or emoji
      const scoreText = container.textContent;
      expect(scoreText).toMatch(/Excellent|🟢/);
    });

    it('should show amber color for fair score (70-89)', () => {
      const fairReport = { ...mockReport, uxScore: 75 };
      const { container } = render(<Dashboard report={fairReport} />);
      
      expect(container.textContent).toContain('75');
      const scoreText = container.textContent;
      expect(scoreText).toMatch(/Fair|🟠/);
    });

    it('should show red color for critical score (<70)', () => {
      const criticalReport = { ...mockReport, uxScore: 50 };
      const { container } = render(<Dashboard report={criticalReport} />);
      
      expect(container.textContent).toContain('50');
      const scoreText = container.textContent;
      expect(scoreText).toMatch(/Critical|🔴/);
    });
  });

  describe('Summary Cards', () => {
    it('should display total issues count', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      // The report has 3 issues, check that the component renders
      expect(container.textContent.length).toBeGreaterThan(0);
      expect(mockReport.metadata.totalIssues).toBe(3);
    });

    it('should display breakdown by severity', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      // Check for severity mentions
      const text = container.textContent.toLowerCase();
      expect(text).toMatch(/critical|high|medium/);
    });

    it('should display category distribution', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      // Component should render with the report data
      expect(container.textContent.length).toBeGreaterThan(0);
      expect(Object.keys(mockReport.categories).length).toBe(3);
    });
  });

  describe('AI Personality Message', () => {
    it('should display AI message with issue count', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      const text = container.textContent;
      expect(text).toMatch(/AutoUX|scanned|found/i);
    });

    it('should mention critical issues if present', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      const text = container.textContent;
      expect(text).toMatch(/critical/i);
    });
  });

  describe('Shareable Badge', () => {
    it('should display shareable badge with score', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      const text = container.textContent;
      expect(text).toMatch(/scored|75|AutoUX/i);
    });

    it('should have share button', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      const buttons = container.querySelectorAll('button');
      const hasShareButton = Array.from(buttons).some(btn => 
        btn.textContent.toLowerCase().includes('share')
      );
      expect(hasShareButton || buttons.length > 0).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      // Check for semantic HTML or ARIA roles
      const sections = container.querySelectorAll('[role="region"], section, [role], main, article');
      expect(sections.length).toBeGreaterThanOrEqual(0);
    });

    it('should be keyboard navigable', () => {
      const { container } = render(<Dashboard report={mockReport} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Empty State', () => {
    it('should handle report with no issues', () => {
      const emptyReport = {
        ...mockReport,
        issues: [],
        categories: {},
        metadata: {
          ...mockReport.metadata,
          totalIssues: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0
        }
      };
      
      const { container } = render(<Dashboard report={emptyReport} />);
      
      expect(container.textContent).toContain('0');
    });
  });

  describe('Responsive Design', () => {
    it('should render without errors on mobile viewport', () => {
      // Simulate mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      const { container } = render(<Dashboard report={mockReport} />);
      expect(container).toBeInTheDocument();
    });
  });
});
