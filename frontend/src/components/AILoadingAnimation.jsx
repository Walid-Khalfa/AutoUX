import { useEffect, useState } from 'react';

// KIRO-AI: AI loading animation with "sonar radar" effect
// Displays analysis steps in real-time to highlight the AI process
function AILoadingAnimation() {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: '📄', text: 'Reading logs...', duration: 1000 },
    { icon: '🤖', text: 'AI Analysis with Gemini Flash...', duration: 2000 },
    { icon: '🔍', text: 'Detecting UX issues...', duration: 1500 },
    { icon: '📊', text: 'Generating report...', duration: 1000 },
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, steps[step].duration);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div
      style={{
        padding: '48px 32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        textAlign: 'center',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* KIRO-AI: Effet de pulse en arrière-plan */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(107, 78, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* KIRO-AI: Icône principale avec rotation */}
      <div
        style={{
          fontSize: '64px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
          animation: 'rotate 3s linear infinite',
        }}
      >
        🤖
      </div>

      {/* KIRO-AI: Étapes de progression */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {steps.map((s, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '8px',
              backgroundColor: index === step ? 'rgba(107, 78, 255, 0.1)' : 'transparent',
              opacity: index <= step ? 1 : 0.3,
              transition: 'all 0.3s ease',
              fontSize: '1.1em',
              fontWeight: index === step ? '600' : '400',
            }}
          >
            <span style={{ fontSize: '1.5em' }}>{s.icon}</span>
            <span style={{ color: index === step ? '#6b4eff' : '#666' }}>
              {s.text}
            </span>
            {index === step && (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid #6b4eff',
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            )}
            {index < step && (
              <span style={{ color: '#10b981', fontSize: '1.2em' }}>✓</span>
            )}
          </div>
        ))}
      </div>

      {/* KIRO-AI: Barre de progression globale */}
      <div
        style={{
          marginTop: '24px',
          height: '6px',
          backgroundColor: '#e5e7eb',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #6b4eff 0%, #0073bb 100%)',
            borderRadius: '3px',
            width: `${((step + 1) / steps.length) * 100}%`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* KIRO-AI: Animations CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AILoadingAnimation;
