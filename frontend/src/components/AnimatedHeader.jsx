// KIRO-AI: Enhanced header with animated gradient and AI pulse indicator
// Implements subtle gradient shift animation (10-15s loop) for visual appeal
// Adds glowing AI pulse indicator to show intelligence/activity

function AnimatedHeader() {
  // Check if Web3 is enabled
  const isWeb3Enabled = import.meta.env.VITE_REGISTRY_ADDRESS && import.meta.env.VITE_REGISTRY_ADDRESS !== '';
  return (
    <>
      <header
        style={{
          background: 'linear-gradient(120deg, #0052ff, #7a37ff, #00b3ff)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 10s ease infinite, diagonalShimmer 10s linear infinite',
          padding: '32px 24px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* KIRO-AI: Subtle particle effect overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* KIRO-AI: Logo section */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
            <img
              src="/Autoux.jpg"
              alt="AutoUX Logo"
              style={{ height: '56px' }}
            />
          </div>

          {/* KIRO-AI: Title with reduced vertical padding */}
          <h1
            style={{
              margin: '0 0 12px 0',
              fontSize: '2.5rem',
              color: 'white',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            AutoUX – AI-Powered UX Analysis
          </h1>

          {/* KIRO-AI: Subtitle with AI pulse indicator */}
          <p
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.95)',
              fontSize: '1.125rem',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span>Automatic log analysis to identify user experience issues.</span>
            <span style={{ opacity: 0.7 }}>(Local • React + Express)</span>
            {/* KIRO-AI: Glowing AI pulse indicator */}
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'aiPulse 2s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
              }}
              aria-label="AI Active"
              title="AI Analysis Active"
            />
            {/* KIRO-AI: Web3 Enabled Badge */}
            {isWeb3Enabled && (
              <span
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Web3 on-chain verification enabled"
              >
                🔗 Web3 Enabled
              </span>
            )}
          </p>
        </div>
      </header>

      {/* KIRO-AI: Keyframe animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes diagonalShimmer {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }

        @keyframes aiPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
            box-shadow: 0 0 16px rgba(16, 185, 129, 1);
          }
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}

export default AnimatedHeader;
