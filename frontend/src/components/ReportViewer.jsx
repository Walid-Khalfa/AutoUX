import { useState, useMemo } from 'react';
import SeverityBadge from './SeverityBadge.jsx';

/**
 * ReportViewer Component
 * 
 * Displays AI-generated UX analysis report with:
 * - Issues list grouped by category
 * - Severity badges with colors and aria-labels
 * - Filtering by category, severity, type
 * - Search functionality for issue descriptions
 * - Expandable cards for issue details
 * - Metadata display
 * - Full keyboard navigation and accessibility
 * 
 * Requirements: 2.3, 2.4
 */
function ReportViewer({ report, markdown }) {
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'list'

  if (!report) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '1.1rem',
        }}
      >
        No report available. Upload a log file to get started.
      </div>
    );
  }

  const issues = report.issues || report.topIssues || [];

  if (issues.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          fontSize: '1.3rem',
          color: '#10b981',
          fontWeight: '600',
        }}
      >
        ✅ No issues detected - Your UX is excellent!
      </div>
    );
  }

  // Toggle issue expansion
  const toggleIssue = (issueId) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  // Filter and search issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search filter
      if (searchQuery && !issue.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && issue.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && issue.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [issues, searchQuery, selectedSeverity, selectedType, selectedCategory]);

  // Group issues by category
  const groupedIssues = useMemo(() => {
    const groups = {};
    filteredIssues.forEach((issue) => {
      const category = issue.category || issue.type || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(issue);
    });
    return groups;
  }, [filteredIssues]);

  // Get unique values for filters
  const severities = useMemo(() => {
    const set = new Set(issues.map((i) => i.severity).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [issues]);

  const types = useMemo(() => {
    const set = new Set(issues.map((i) => i.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [issues]);

  const categories = useMemo(() => {
    const set = new Set(issues.map((i) => i.category || i.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [issues]);

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      latency: '⏱️',
      latence: '⏱️',
      performance: '⚡',
      accessibility: '♿',
      'accessibilité': '♿',
      contrast: '🎨',
      contraste: '🎨',
      'javascript_error': '🚨',
      'JS error': '🚨',
      'erreur JS': '🚨',
      error: '❌',
      warning: '⚠️',
      other: '📋',
    };
    return icons[category?.toLowerCase()] || '📋';
  };

  // Render issue card
  const renderIssueCard = (issue) => {
    const isExpanded = expandedIssues.has(issue.id);

    return (
      <div
        key={issue.id}
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Issue header - clickable to expand */}
        <button
          onClick={() => toggleIssue(issue.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleIssue(issue.id);
            }
          }}
          aria-expanded={isExpanded}
          aria-controls={`issue-details-${issue.id}`}
          style={{
            width: '100%',
            padding: '16px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'left',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #3b82f6';
            e.currentTarget.style.outlineOffset = '-2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {getCategoryIcon(issue.category || issue.type)}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {issue.description}
              </h3>
            </div>
            {issue.metadata?.element && (
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {issue.metadata.element}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SeverityBadge severity={issue.severity} showLabel={true} />
            <span
              style={{
                fontSize: '1rem',
                color: '#9ca3af',
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </button>

        {/* Issue details - expandable */}
        {isExpanded && (
          <div
            id={`issue-details-${issue.id}`}
            role="region"
            aria-label={`Details for ${issue.description}`}
            style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}
          >
            {/* Issue metadata */}
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '12px 16px',
                marginBottom: '16px',
                fontSize: '0.875rem',
              }}
            >
              <dt style={{ fontWeight: '600', color: '#6b7280' }}>ID:</dt>
              <dd style={{ margin: 0, color: '#111827', fontFamily: 'monospace' }}>
                {issue.id}
              </dd>

              <dt style={{ fontWeight: '600', color: '#6b7280' }}>Type:</dt>
              <dd style={{ margin: 0, color: '#111827' }}>
                {issue.type}
              </dd>

              {issue.category && issue.category !== issue.type && (
                <>
                  <dt style={{ fontWeight: '600', color: '#6b7280' }}>Category:</dt>
                  <dd style={{ margin: 0, color: '#111827' }}>
                    {issue.category}
                  </dd>
                </>
              )}

              {issue.timestamp && (
                <>
                  <dt style={{ fontWeight: '600', color: '#6b7280' }}>Timestamp:</dt>
                  <dd style={{ margin: 0, color: '#111827' }}>
                    {new Date(issue.timestamp).toLocaleString('en-US')}
                  </dd>
                </>
              )}

              {issue.sourceLogId && (
                <>
                  <dt style={{ fontWeight: '600', color: '#6b7280' }}>Source Log:</dt>
                  <dd style={{ margin: 0, color: '#111827', fontFamily: 'monospace' }}>
                    {issue.sourceLogId}
                  </dd>
                </>
              )}
            </dl>

            {/* Additional metadata */}
            {issue.metadata && Object.keys(issue.metadata).length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Additional Details
                </h4>
                <div
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  {Object.entries(issue.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f3f4f6',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#6b7280' }}>
                        {key}:
                      </span>
                      <span
                        style={{
                          color: '#111827',
                          fontFamily: typeof value === 'string' ? 'inherit' : 'monospace',
                          maxWidth: '60%',
                          textAlign: 'right',
                          wordBreak: 'break-word',
                        }}
                      >
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      role="region"
      aria-label="UX Analysis Report"
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
          }}
        >
          UX Analysis Report
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
          {filteredIssues.length !== issues.length && ` (${issues.length} total)`}
        </p>
      </div>

      {/* Search and filters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Search input */}
        <div style={{ gridColumn: 'span 2' }}>
          <label
            htmlFor="search-issues"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Search Issues
          </label>
          <input
            id="search-issues"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by description..."
            aria-label="Search issues by description"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.outline = '2px solid rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.outline = 'none';
            }}
          />
        </div>

        {/* Severity filter */}
        <div>
          <label
            htmlFor="filter-severity"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Severity
          </label>
          <select
            id="filter-severity"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            aria-label="Filter by severity"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <div>
          <label
            htmlFor="filter-type"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Type
          </label>
          <select
            id="filter-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by type"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label
            htmlFor="filter-category"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Category
          </label>
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div>
          <label
            htmlFor="view-mode"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            View Mode
          </label>
          <select
            id="view-mode"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            aria-label="Select view mode"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="grouped">Grouped by Category</option>
            <option value="list">Flat List</option>
          </select>
        </div>
      </div>

      {/* Clear filters button */}
      {(searchQuery || selectedSeverity !== 'all' || selectedType !== 'all' || selectedCategory !== 'all') && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSeverity('all');
              setSelectedType('all');
              setSelectedCategory('all');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Issues display */}
      {filteredIssues.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '1.1rem',
          }}
        >
          No issues match your filters. Try adjusting your search criteria.
        </div>
      ) : viewMode === 'grouped' ? (
        // Grouped view
        <div>
          {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
            <div key={category} style={{ marginBottom: '32px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(category)}</span>
                <span>{category}</span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '4px 12px',
                    borderRadius: '12px',
                  }}
                >
                  {categoryIssues.length}
                </span>
              </h3>
              <div>{categoryIssues.map(renderIssueCard)}</div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div>{filteredIssues.map(renderIssueCard)}</div>
      )}
    </div>
  );
}

export default ReportViewer;
