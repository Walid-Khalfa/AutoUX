// KIRO-AI: Shareable Badge component for social sharing
// Displays "My App scored X/100 on AutoUX AI" with share button
// Allows users to copy badge text or share on social media

function ShareableBadge({ score = 75 }) {
  const handleShare = async () => {
    const badgeText = `🏅 My App scored ${score}/100 on AutoUX AI - Automated UX Analysis powered by Gemini Flash`;
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AutoUX Score',
          text: badgeText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or error - fall through to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(badgeText);
      alert('✅ Badge text copied to clipboard!');
    } catch (err) {
      // Final fallback - show text in prompt
      prompt('Copy this badge text:', badgeText);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟠';
    return '🔴';
  };

  return (
    <div
      className="fade-in"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      {/* KIRO-AI: Badge content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <div
          style={{
            fontSize: '3em',
            animation: 'bounce 2s ease-in-out infinite',
          }}
        >
          🏅
        </div>
        <div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '4px',
            }}
          >
            My App scored{' '}
            <span
              style={{
                color: getScoreColor(score),
                fontSize: '1.5rem',
              }}
            >
              {getScoreEmoji(score)} {score}/100
            </span>
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            on AutoUX AI - Powered by Gemini Flash
          </div>
        </div>
      </div>

      {/* KIRO-AI: Share button */}
      <button
        onClick={handleShare}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #6b4eff 0%, #8b6fff 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(107, 78, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.02)';
          e.target.style.boxShadow = '0 6px 20px rgba(107, 78, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(107, 78, 255, 0.3)';
        }}
        aria-label="Share your AutoUX score"
      >
        <span style={{ fontSize: '1.2em' }}>📤</span>
        Share Score
      </button>

      {/* KIRO-AI: Animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}

export default ShareableBadge;
