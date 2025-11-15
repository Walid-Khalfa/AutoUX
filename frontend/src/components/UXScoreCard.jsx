// KIRO-AI: Carte de score UX global avec jauge visuelle
// Calcule un score sur 100 basé sur la sévérité et le nombre d'issues
function UXScoreCard({ issues }) {
  
  // KIRO-AI: Calcul du score UX (100 = parfait, 0 = catastrophique)
  // Pénalités : -20 par critique, -10 par moyen, -5 par mineur
  const calculateScore = () => {
    if (!issues || issues.length === 0) return 100;
    
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'high') score -= 20;
      else if (issue.severity === 'medium') score -= 10;
      else if (issue.severity === 'low') score -= 5;
    });
    
    return Math.max(0, score);
  };

  const score = calculateScore();
  
  // KIRO-AI: Déterminer la couleur et le label selon le score
  const getScoreColor = () => {
    if (score >= 80) return { color: '#10b981', bg: '#d1fae5', label: 'Excellent' };
    if (score >= 60) return { color: '#f59e0b', bg: '#fef3c7', label: 'Good' };
    if (score >= 40) return { color: '#f97316', bg: '#ffedd5', label: 'Fair' };
    return { color: '#ef4444', bg: '#fee2e2', label: 'Critical' };
  };

  const { color, bg, label } = getScoreColor();
  
  // KIRO-AI: Calcul de l'angle pour le graphique circulaire (0-180°)
  const angle = (score / 100) * 180;

  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* KIRO-AI: Badge "Score UX" */}
      <div
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          backgroundColor: '#6b4eff',
          color: 'white',
          borderRadius: '20px',
          fontSize: '0.85em',
          fontWeight: '600',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        📊 Global UX Score
      </div>

      {/* KIRO-AI: Jauge semi-circulaire */}
      <div style={{ position: 'relative', margin: '0 auto 24px', width: '200px', height: '100px' }}>
        {/* Fond de la jauge */}
        <svg width="200" height="100" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Jauge colorée */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        
        {/* Score au centre */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            fontSize: '3em',
            fontWeight: '700',
            color: color,
          }}
        >
          {score}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.9em',
            color: '#666',
            fontWeight: '500',
          }}
        >
          / 100
        </div>
      </div>

      {/* KIRO-AI: Label de qualité */}
      <div
        style={{
          display: 'inline-block',
          padding: '8px 24px',
          backgroundColor: bg,
          color: color,
          borderRadius: '8px',
          fontSize: '1.1em',
          fontWeight: '600',
          marginBottom: '16px',
        }}
      >
        {label}
      </div>

      {/* KIRO-AI: Description */}
      <p
        style={{
          margin: '0',
          color: '#666',
          fontSize: '0.9em',
          lineHeight: '1.5',
        }}
      >
        User experience index calculated from {issues.length} detected issue{issues.length > 1 ? 's' : ''}
      </p>

      {/* KIRO-AI: Effet de brillance */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(107, 78, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default UXScoreCard;
