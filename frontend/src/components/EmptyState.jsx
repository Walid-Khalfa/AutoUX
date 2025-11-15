// KIRO-AI: Modern empty state with emotional design and clear CTA
// Replaces simple "No Report Available" with engaging illustration and helpful guidance
// Includes file type badges and arrow pointing to upload zone

function EmptyState() {
  return (
    <div
      className="fade-in"
      style={{
        padding: '80px 40px',
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '2px dashed #d1d5db',
        textAlign: 'center',
        marginBottom: '32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* KIRO-AI: Animated illustration */}
      <div
        style={{
          fontSize: '6em',
          marginBottom: '28px',
          animation: 'float 3s ease-in-out infinite',
          display: 'inline-block',
        }}
      >
        🔍
      </div>

      {/* KIRO-AI: Friendly title */}
      <h2
        style={{
          fontSize: '2rem',
          color: '#111827',
          marginBottom: '16px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
        }}
      >
        No analysis yet
      </h2>

      {/* KIRO-AI: Helpful description */}
      <p
        style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.7',
          maxWidth: '600px',
          margin: '0 auto 32px',
        }}
      >
        Upload logs to get instant AI-powered UX insights: latency, accessibility, and JS errors.
      </p>

      {/* KIRO-AI: File type badges */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {[
          { icon: '📄', label: 'CSV', color: '#10b981' },
          { icon: '📋', label: 'JSON', color: '#3b82f6' },
          { icon: '📊', label: 'XML', color: '#f59e0b' },
          { icon: '🌐', label: 'HTML', color: '#8b5cf6' },
          { icon: '📝', label: 'LOG', color: '#6b7280' },
        ].map(({ icon, label, color }) => (
          <div
            key={label}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = color;
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 4px 12px ${color}20`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '1.3em' }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* KIRO-AI: Arrow pointing up with animation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#9ca3af',
          fontSize: '0.95rem',
          fontWeight: '500',
          animation: 'bounce 2s ease-in-out infinite',
        }}
      >
        <span>Start by uploading logs</span>
        <span style={{ fontSize: '1.5em' }}>↑</span>
      </div>

      {/* KIRO-AI: Additional helpful info */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          borderRadius: '12px',
          border: '1px solid #bfdbfe',
          maxWidth: '500px',
          margin: '32px auto 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.5em', flexShrink: 0 }}>💡</span>
          <div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '4px',
              }}
            >
              Pro Tip
            </div>
            <div style={{ fontSize: '0.875rem', color: '#3b82f6', lineHeight: '1.5' }}>
              AutoUX uses Gemini Flash AI to analyze your logs and provide intelligent recommendations for improving user experience.
            </div>
          </div>
        </div>
      </div>

      {/* KIRO-AI: Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;
