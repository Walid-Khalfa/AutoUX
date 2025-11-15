import ReportViewer from './ReportViewer.jsx';

/**
 * Example usage of ReportViewer component
 * 
 * This demonstrates how to integrate the ReportViewer into your application.
 * The ReportViewer provides a comprehensive view of UX analysis reports with:
 * - Issues grouped by category
 * - Advanced filtering (severity, type, category)
 * - Search functionality
 * - Expandable issue details
 * - Full keyboard accessibility
 */

function ReportViewerExample() {
  // Example report data structure
  const exampleReport = {
    id: 'report-123',
    timestamp: '2025-11-14T10:00:00Z',
    uxScore: 75,
    issues: [
      {
        id: 'issue-1',
        type: 'latency',
        category: 'Performance',
        severity: 'high',
        description: 'API response time exceeds 5000ms',
        timestamp: '2025-11-14T09:55:00Z',
        sourceLogId: 'log-001',
        metadata: {
          responseTime: 5200,
          endpoint: '/api/users',
          webVitalsMetric: 'LCP'
        }
      },
      {
        id: 'issue-2',
        type: 'accessibility',
        category: 'Accessibility',
        severity: 'critical',
        description: 'Image missing alt text',
        timestamp: '2025-11-14T09:56:00Z',
        sourceLogId: 'log-002',
        metadata: {
          element: '<img src="logo.png">',
          wcagCriteria: ['1.1.1']
        }
      },
      {
        id: 'issue-3',
        type: 'contrast',
        category: 'Accessibility',
        severity: 'medium',
        description: 'Text contrast ratio below 4.5:1',
        timestamp: '2025-11-14T09:57:00Z',
        sourceLogId: 'log-003',
        metadata: {
          contrastRatio: 3.2,
          element: '.button-text',
          wcagCriteria: ['1.4.3']
        }
      }
    ],
    recommendations: [
      {
        priority: 1,
        title: 'Optimize API Response Times',
        description: 'Reduce server response time to under 2.5s',
        why: 'Slow API responses impact LCP and user experience',
        references: ['https://web.dev/lcp/']
      }
    ]
  };

  const exampleMarkdown = `# AutoUX Analysis Report

**Generated:** 2025-11-14T10:00:00Z
**UX Score:** 75/100 🟠

## Summary
- Total Issues: 3
- Critical: 1 | High: 1 | Medium: 1 | Low: 0

## Issues by Category
### Performance
- API response time exceeds 5000ms (High)

### Accessibility
- Image missing alt text (Critical)
- Text contrast ratio below 4.5:1 (Medium)
`;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px' }}>ReportViewer Component Example</h1>
      
      <ReportViewer 
        report={exampleReport} 
        markdown={exampleMarkdown}
      />
    </div>
  );
}

export default ReportViewerExample;
