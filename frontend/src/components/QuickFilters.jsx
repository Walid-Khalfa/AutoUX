import { useState } from 'react';

// KIRO-AI: Quick Filters component for advanced filtering
// Allows filtering by severity, type, and timestamp
// Provides quick access to common filter combinations

function QuickFilters({ issues, onFilterChange }) {
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const handleSeverityFilter = (severity) => {
    setActiveSeverity(severity);
    applyFilters(severity, activeType, sortBy);
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    applyFilters(activeSeverity, type, sortBy);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    applyFilters(activeSeverity, activeType, sort);
  };

  const applyFilters = (severity, type, sort) => {
    let filtered = [...issues];

    // Filter by severity
    if (severity !== 'all') {
      filtered = filtered.filter((issue) => issue.severity === severity);
    }

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter((issue) => issue.type === type);
    }

    // Sort
    if (sort === 'timestamp') {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sort === 'severity') {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }

    onFilterChange(filtered);
  };

  const severityFilters = [
    { id: 'all', label: 'All', icon: '📊', color: '#6b7280' },
    { id: 'high', label: 'Critical', icon: '🔴', color: '#ef4444' },
    { id: 'medium', label: 'Medium', icon: '🟡', color: '#f59e0b' },
    { id: 'low', label: 'Minor', icon: '🟢', color: '#10b981' },
  ];

  const sortOptions = [
    { id: 'timestamp', label: 'Recent First', icon: '🕐' },
    { id: 'severity', label: 'By Severity', icon: '⚠️' },
  ];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* KIRO-AI: Header */}
      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#6b7280',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Quick Filters
      </div>

      {/* KIRO-AI: Severity filters */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '8px',
            fontWeight: '600',
          }}
        >
          Severity
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {severityFilters.map((filter) => {
            const isActive = activeSeverity === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => handleSeverityFilter(filter.id)}
                aria-pressed={isActive}
                style={{
                  padding: '8px 16px',
                  background: isActive ? `${filter.color}15` : '#f9fafb',
                  color: isActive ? filter.color : '#6b7280',
                  border: isActive ? `2px solid ${filter.color}` : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KIRO-AI: Sort options */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '8px',
            fontWeight: '600',
          }}
        >
          Sort By
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sortOptions.map((option) => {
            const isActive = sortBy === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSort(option.id)}
                aria-pressed={isActive}
                style={{
                  padding: '8px 16px',
                  background: isActive ? '#6b4eff15' : '#f9fafb',
                  color: isActive ? '#6b4eff' : '#6b7280',
                  border: isActive ? '2px solid #6b4eff' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickFilters;
