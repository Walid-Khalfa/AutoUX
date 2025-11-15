// KIRO-AI: Compact Mode Toggle component
// Allows users to switch between dense and pretty card views
// Improves information density for power users

function CompactModeToggle({ isCompact, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isCompact}
      aria-label={`Switch to ${isCompact ? 'pretty' : 'compact'} view`}
      style={{
        padding: '10px 20px',
        background: isCompact ? 'linear-gradient(135deg, #6b4eff 0%, #8b6fff 100%)' : 'white',
        color: isCompact ? 'white' : '#374151',
        border: isCompact ? 'none' : '2px solid #e5e7eb',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: isCompact ? '0 4px 12px rgba(107, 78, 255, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = isCompact
          ? '0 6px 20px rgba(107, 78, 255, 0.4)'
          : '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = isCompact
          ? '0 4px 12px rgba(107, 78, 255, 0.3)'
          : '0 2px 8px rgba(0,0,0,0.08)';
      }}
      title={`Switch to ${isCompact ? 'pretty' : 'compact'} view`}
    >
      <span style={{ fontSize: '1.2em' }}>{isCompact ? '📋' : '🎨'}</span>
      <span>{isCompact ? 'Compact' : 'Pretty'} View</span>
    </button>
  );
}

export default CompactModeToggle;
