// KIRO-AI: Badge de sévérité amélioré avec icônes et tooltips
// Rend la gravité plus explicite visuellement
function SeverityBadge({ severity, showLabel = true }) {

  const severityConfig = {
    high: {
      icon: '🔴',
      label: 'Critical',
      color: '#ef4444',
      bg: '#fee2e2',
      tooltip: 'High user impact - Immediate action required',
    },
    medium: {
      icon: '🟠',
      label: 'Medium',
      color: '#f97316',
      bg: '#ffedd5',
      tooltip: 'Moderate impact - Fix quickly',
    },
    low: {
      icon: '🟢',
      label: 'Minor',
      color: '#10b981',
      bg: '#d1fae5',
      tooltip: 'Low impact - Improvement recommended',
    },
  };

  const config = severityConfig[severity] || severityConfig.low;

  return (
    <div
      title={config.tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: showLabel ? '6px 12px' : '4px 8px',
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: '6px',
        fontSize: '0.85em',
        fontWeight: '600',
        cursor: 'help',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ fontSize: '1.2em' }}>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export default SeverityBadge;
