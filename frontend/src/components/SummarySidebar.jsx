import UXScoreGauge from './UXScoreGauge.jsx';

// KIRO-AI: Summary sidebar with UX score gauge and issue breakdown
// Displays total issues, severity distribution, and category breakdown
// Sticky positioning for easy reference while scrolling

function SummarySidebar({ issues, score }) {
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  const severityCounts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  const severityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };

  const categoryIcons = {
    latency: '⏱️',
    latence: '⏱️',
    accessibility: '♿',
    accessibilité: '♿',
    contrast: '🎨',
    contraste: '🎨',
    'JS error': '🚨',
    'javascript_error': '🚨',
    'erreur JS': '🚨',
  };

  return (
    <div
      className="fade-in"
      style={{
        position: 'sticky',
        top: '24px',
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        minWidth: '300px',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* KIRO-AI: Header */}
      <h3
        style={{
          fontSize: '1.5rem',
          marginBottom: '24px',
          fontWeight: '700',
          color: '#111827',
          letterSpacing: '-0.02em',
        }}
      >
        Summary
      </h3>

      {/* KIRO-AI: UX Score Gauge */}
      <UXScoreGauge score={score} />

      {/* KIRO-AI: Total Issues */}
      <div
        style={{
          marginTop: '28px',
          paddingTop: '28px',
          borderTop: '2px solid #f3f4f6',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Total Issues
        </div>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#111827',
            lineHeight: 1,
          }}
        >
          {issues.length}
        </div>
      </div>

      {/* KIRO-AI: By Severity */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '2px solid #f3f4f6',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '16px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          By Severity
        </div>
        {Object.entries(severityCounts).map(([severity, count]) => (
          <div
            key={severity}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '10px 14px',
              background: '#f9fafb',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: severityColors[severity],
                  boxShadow: `0 0 8px ${severityColors[severity]}40`,
                }}
              />
              <span
                style={{
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem',
                }}
              >
                {severity}
              </span>
            </div>
            <span
              style={{
                fontWeight: '700',
                color: severityColors[severity],
                fontSize: '1.25rem',
              }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* KIRO-AI: By Category */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '2px solid #f3f4f6',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '16px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          By Category
        </div>
        {Object.entries(categoryCounts).map(([type, count]) => (
          <div
            key={type}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '10px 14px',
              background: '#f9fafb',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3em' }}>
                {categoryIcons[type] || '📋'}
              </span>
              <span
                style={{
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem',
                }}
              >
                {type}
              </span>
            </div>
            <span
              style={{
                fontWeight: '700',
                color: '#6b4eff',
                fontSize: '1.25rem',
              }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummarySidebar;
