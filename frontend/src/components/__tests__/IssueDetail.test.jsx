import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import IssueDetail from '../IssueDetail.jsx';
import * as api from '../../services/api.js';

vi.mock('../../services/api.js');

describe('IssueDetail Component', () => {
  const mockIssue = {
    id: 'issue-1',
    type: 'latence',
    description: 'Slow API response detected',
    severity: 'high',
    timestamp: '2025-11-12T10:00:00Z',
    sourceLogId: 'log-1',
    metadata: {
      responseTime: 6000,
      endpoint: '/api/data',
    },
  };

  const mockFixspec = {
    issueId: 'issue-1',
    type: 'latence',
    description: 'Slow API response',
    severity: 'high',
    suggestedFix: {
      summary: 'Optimize API performance',
      steps: ['Add caching', 'Optimize queries', 'Use CDN'],
      codeExample: 'const cache = new Cache();',
      references: ['Web Vitals – LCP < 2.5s'],
    },
    timestamp: '2025-11-12T10:00:00Z',
    status: 'pending',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render placeholder when no issue selected', () => {
    render(<IssueDetail issue={null} />);
    
    expect(screen.getByText(/Select an issue|No issue selected/i)).toBeInTheDocument();
  });

  it('should render issue details', () => {
    api.fetchFixspecs.mockResolvedValue([mockFixspec]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    expect(screen.getByText('latence')).toBeInTheDocument();
    expect(screen.getByText('Slow API response detected')).toBeInTheDocument();
    expect(screen.getByLabelText(/Severity high|high/i)).toBeInTheDocument();
  });

  it('should display issue metadata', () => {
    api.fetchFixspecs.mockResolvedValue([mockFixspec]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    expect(screen.getByText('issue-1')).toBeInTheDocument();
    expect(screen.getByText('log-1')).toBeInTheDocument();
    expect(screen.getByText(/"responseTime": 6000/)).toBeInTheDocument();
  });

  it('should load and display fixspec', async () => {
    api.fetchFixspecs.mockResolvedValue([mockFixspec]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    await waitFor(() => {
      expect(screen.getByText('Optimize API performance')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Add caching')).toBeInTheDocument();
    expect(screen.getByText('Optimize queries')).toBeInTheDocument();
    expect(screen.getByText('Use CDN')).toBeInTheDocument();
    expect(screen.getByText('const cache = new Cache();')).toBeInTheDocument();
    expect(screen.getByText(/Web Vitals – LCP/)).toBeInTheDocument();
  });

  it('should show loading state while fetching fixspec', () => {
    api.fetchFixspecs.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<IssueDetail issue={mockIssue} />);
    
    expect(screen.getByText(/Loading fixspec|Loading/i)).toBeInTheDocument();
  });

  it('should show error message when fixspec fetch fails', async () => {
    api.fetchFixspecs.mockRejectedValue(new Error('Network error'));
    
    render(<IssueDetail issue={mockIssue} />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('should show message when no fixspec available', async () => {
    api.fetchFixspecs.mockResolvedValue([]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    await waitFor(() => {
      expect(screen.getByText(/No fixspec available|No fixspec/i)).toBeInTheDocument();
    });
  });

  it('should display fixspec status', async () => {
    api.fetchFixspecs.mockResolvedValue([mockFixspec]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('should render severity badge with correct styling', () => {
    api.fetchFixspecs.mockResolvedValue([mockFixspec]);
    
    render(<IssueDetail issue={mockIssue} />);
    
    const badge = screen.getByLabelText(/Severity high|high/i);
    expect(badge).toBeDefined();
  });
});
