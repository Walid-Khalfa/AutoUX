// KIRO-AI: Header moderne avec glassmorphism et animations
import Badge from './ui/Badge.jsx';

function ModernHeader() {
  return (
    <header className="modern-header" style={{
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--space-8) 0',
      marginBottom: 'var(--space-8)'
    }}>
      {/* KIRO-AI: Effet de particules en arrière-plan */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }} />

      <div className="container-responsive" style={{ position: 'relative', zIndex: 1 }}>
        {/* KIRO-AI: Logo et titre */}
        <div className="fade-in" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--border-radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2em',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            💡
          </div>
          
          <div>
            <h1 style={{ 
              margin: 0,
              fontSize: 'var(--font-size-4xl)', 
              color: 'white', 
              fontWeight: 'var(--font-weight-bold)',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              lineHeight: 'var(--line-height-tight)'
            }}>
              AutoUX
            </h1>
            <div style={{
              fontSize: 'var(--font-size-lg)',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              AI-Powered UX Analysis
            </div>
          </div>
        </div>

        {/* KIRO-AI: Description et badges */}
        <div className="slide-in" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-relaxed)',
            maxWidth: '600px'
          }}>
            Automatic log analysis to identify user experience issues with intelligent detection and AI-powered recommendations.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Badge 
              variant="glass" 
              size="md"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              🚀 Local • React + Express
            </Badge>
            
            <Badge 
              variant="glass" 
              size="md"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              🧠 Gemini Flash
            </Badge>
            
            <Badge 
              variant="glass" 
              size="md"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              ♿ WCAG AA
            </Badge>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </header>
  );
}

export default ModernHeader;