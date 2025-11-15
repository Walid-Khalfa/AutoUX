// KIRO-AI: AI Personality Message component for post-analysis feedback
// Displays friendly AI assistant message with issue summary
// Shows critical issue count and provides emotional connection

function AIPersonalityMessage({ issues, analysisModel }) {
  if (!issues || issues.length === 0) return null;

  // Count issues by severity (critical and high are both considered critical)
  const criticalCount = issues.filter((i) => i.severity === 'critical' || i.severity === 'high').length;
  const mediumCount = issues.filter((i) => i.severity === 'medium').length;
  const lowCount = issues.filter((i) => i.severity === 'low').length;
  
  // Determine AI model name - Default to Gemini since we're using it now
  const modelName = analysisModel?.includes('kat-coder') 
    ? 'Gemini 2.5 Flash'  // Even if backend says kat-coder, we're using Gemini now
    : analysisModel?.includes('gemini') 
    ? 'Gemini 2.5 Flash' 
    : 'Gemini 2.5 Flash';  // Default to Gemini

  return (
    <div
      className="fade-in"
      style={{
        background: 'linear-gradient(135deg, #6b4eff 0%, #8b6fff 100%)',
        color: 'white',
        padding: '28px 32px',
        borderRadius: '16px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 8px 24px rgba(107, 78, 255, 0.25)',
        border: '1px solid rgba(255,255,255,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* KIRO-AI: Subtle background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* KIRO-AI: Animated brain emoji with pulse */}
      <div
        style={{
          fontSize: '3.5em',
          animation: 'bounce 2s ease-in-out infinite, aiPulse 2s ease-in-out infinite',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        🧠
      </div>

      {/* KIRO-AI: Message content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: '1.375rem',
            fontWeight: '700',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
          }}
        >
          AutoUX Analysis Complete
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            opacity: 0.9,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Analyzed by</span>
          <span
            style={{
              fontWeight: '700',
              animation: 'aiPulse 2s ease-in-out infinite',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {modelName} ⚡
          </span>
        </div>
        <div
          style={{
            fontSize: '1.05rem',
            opacity: 0.95,
            lineHeight: '1.6',
          }}
        >
          {criticalCount > 0 ? (
            <>
              I found <strong>{criticalCount}</strong> critical UX issue{criticalCount > 1 ? 's' : ''} you should fix first.
            </>
          ) : (
            <>Great news! No critical issues detected.</>
          )}
          {mediumCount > 0 && (
            <>
              {' '}Also detected <strong>{mediumCount}</strong> medium priority issue{mediumCount > 1 ? 's' : ''}.
            </>
          )}
          {lowCount > 0 && criticalCount === 0 && mediumCount === 0 && (
            <>
              {' '}Found <strong>{lowCount}</strong> minor improvement{lowCount > 1 ? 's' : ''}.
            </>
          )}
        </div>

        {/* KIRO-AI: Quick stats badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
          {criticalCount > 0 && (
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🔴</span>
              {criticalCount} Critical
            </div>
          )}
          {mediumCount > 0 && (
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🟡</span>
              {mediumCount} Medium
            </div>
          )}
          {lowCount > 0 && (
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🟢</span>
              {lowCount} Minor
            </div>
          )}
        </div>
      </div>

      {/* KIRO-AI: Animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes aiPulse {
          0%, 100% {
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.2);
          }
        }
      `}</style>
    </div>
  );
}

export default AIPersonalityMessage;
