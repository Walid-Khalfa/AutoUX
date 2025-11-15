import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IssueList from '../IssueList.jsx';

describe('IssueList Component', () => {
  const mockIssues = [
    {
      id: 'issue-1',
      type: 'latence',
      description: 'Slow API response',
      severity: 'high',
      timestamp: '2025-11-12T10:00:00Z',
      sourceLogId: 'log-1',
      metadata: {},
    },
    {
      id: 'issue-2',
      type: 'latence',
      description: 'Another slow response',
      severity: 'medium',
      timestamp: '2025-11-12T10:05:00Z',
      sourceLogId: 'log-2',
      metadata: {},
    },
    {
      id: 'issue-3',
      type: 'accessibilité',
      description: 'Missing alt text',
      severity: 'high',
      timestamp: '2025-11-12T10:10:00Z',
      sourceLogId: 'log-3',
      metadata: {},
    },
  ];

  it('should render loading skeleton when loading', () => {
    render(<IssueList issues={[]} loading={true} onSelectIssue={vi.fn()} />);
    
    expect(screen.getByRole('status', { busy: true })).toBeInTheDocument();
  });

  it('should render empty state when no issues', () => {
    render(<IssueList issues={[]} loading={false} onSelectIssue={vi.fn()} />);
    
    expect(screen.getByText(/No issues detected|No issues/i)).toBeInTheDocument();
    expect(screen.getByText(/✅/)).toBeInTheDocument();
  });

  it('should group issues by category', () => {
    render(<IssueList issues={mockIssues} loading={false} onSelectIssue={vi.fn()} />);
    
    // Should show category headers
    expect(screen.getByText(/Latence/i)).toBeInTheDocument();
    expect(screen.getByText(/Accessibilité/i)).toBeInTheDocument();
    
    // Should show counts (displayed as badges, not in parentheses)
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 latence issues
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 accessibilité issue
  });

  it('should expand/collapse categories on click', () => {
    render(<IssueList issues={mockIssues} loading={false} onSelectIssue={vi.fn()} />);
    
    const latenceButton = screen.getByRole('button', { name: /Latence/i });
    
    // Initially collapsed
    expect(latenceButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to expand
    fireEvent.click(latenceButton);
    expect(latenceButton).toHaveAttribute('aria-expanded', 'true');
    
    // Should show issues
    expect(screen.getByText('Slow API response')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(latenceButton);
    expect(latenceButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should display severity badges with correct aria-labels', () => {
    render(<IssueList issues={mockIssues} loading={false} onSelectIssue={vi.fn()} />);
    
    // Expand category to see badges
    const latenceButton = screen.getByRole('button', { name: /Latence/i });
    fireEvent.click(latenceButton);
    
    // Check for severity badges - they use English text now
    const badges = screen.getAllByText(/Critical|High|Medium/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should call onSelectIssue when issue is clicked', () => {
    const onSelectIssue = vi.fn();
    render(<IssueList issues={mockIssues} loading={false} onSelectIssue={onSelectIssue} />);
    
    // Expand category
    const latenceButton = screen.getByRole('button', { name: /Latence/i });
    fireEvent.click(latenceButton);
    
    // Click on an issue
    const issueButton = screen.getByText('Slow API response').closest('button');
    fireEvent.click(issueButton);
    
    expect(onSelectIssue).toHaveBeenCalledWith(mockIssues[0]);
  });

  it('should be keyboard accessible', () => {
    const onSelectIssue = vi.fn();
    render(<IssueList issues={mockIssues} loading={false} onSelectIssue={onSelectIssue} />);
    
    // Expand category
    const latenceButton = screen.getByRole('button', { name: /Latence/i });
    fireEvent.click(latenceButton);
    
    // Get issue button
    const issueButton = screen.getByText('Slow API response').closest('button');
    
    // Focus should add outline
    fireEvent.focus(issueButton);
    expect(issueButton).toHaveStyle({ outline: '2px solid #0066cc' });
    
    // Blur should remove outline
    fireEvent.blur(issueButton);
    expect(issueButton).toHaveStyle({ outline: 'none' });
  });
});
