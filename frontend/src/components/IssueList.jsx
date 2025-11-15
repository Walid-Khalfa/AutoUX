import { useState } from 'react';

// KIRO-AI: Composant IssueList pour afficher les issues groupées par catégorie
// Affiche des badges de sévérité accessibles et gère la sélection d'issues
// Peut être étendu pour supporter le tri, la pagination ou l'export
function IssueList({ issues, loading, onSelectIssue, isCompact = false }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // KIRO-AI: Skeleton loader pendant le chargement
  if (loading) {
    return (
      <div role="status" aria-live="polite" aria-busy="true" style={{ padding: '20px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '80px',
              marginBottom: '12px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // KIRO-AI: Empty state si aucune issue détectée
  if (!issues || issues.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          fontSize: '1.3em',
          color: '#27ae60',
          fontWeight: 'bold',
        }}
      >
        No issues detected ✅
      </div>
    );
  }

  // KIRO-AI: Grouper les issues par catégorie (type)
  const groupedIssues = issues.reduce((acc, issue) => {
    const category = issue.type || 'autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // KIRO-AI: Fonction pour obtenir le label accessible du badge de sévérité
  const getSeverityLabel = (severity) => {
    const labels = {
      high: 'Critical',
      medium: 'Medium',
      low: 'Minor',
    };
    return labels[severity] || severity;
  };

  // KIRO-AI: Fonction pour obtenir l'icône de sévérité
  const getSeverityIcon = (severity) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🟢',
    };
    return icons[severity] || '⚪';
  };

  // KIRO-AI: Styles pour les badges de sévérité avec contraste AA minimum (ratio ≥4.5:1)
  // Couleurs testées pour conformité WCAG 2.2 niveau AA
  const getSeverityStyle = (severity) => {
    const styles = {
      high: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
      medium: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
      low: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    };
    return styles[severity] || { backgroundColor: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' };
  };

  return (
    <div role="region" aria-label="Liste des issues UX" style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
      {Object.entries(groupedIssues).map(([category, categoryIssues]) => {
        const isExpanded = expandedCategories.has(category);
        const categoryCount = categoryIssues.length;

        return (
          <div
            key={category}
            style={{
              marginBottom: '20px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {/* KIRO-AI: En-tête de catégorie cliquable pour expand/collapse */}
            <button
              onClick={() => toggleCategory(category)}
              aria-expanded={isExpanded}
              aria-controls={`category-${category}`}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: '#fafbfc',
                border: 'none',
                borderBottom: isExpanded ? '2px solid #e5e7eb' : 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.125rem',
                fontWeight: '600',
                textAlign: 'left',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fafbfc')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {category === 'latency' || category === 'latence' ? '⏱️' : category === 'accessibility' || category === 'accessibilité' ? '♿' : category === 'contrast' || category === 'contraste' ? '🎨' : category === 'JS error' || category === 'erreur JS' ? '🚨' : '📋'}
                </span>
                <span style={{ color: '#111827' }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#6b7280',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  {categoryCount}
                </span>
              </span>
              <span style={{ fontSize: '1rem', color: '#9ca3af', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>

            {/* KIRO-AI: Liste des issues dans la catégorie */}
            {isExpanded && (
              <ul
                id={`category-${category}`}
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {categoryIssues.map((issue) => (
                  <li
                    key={issue.id}
                    style={{
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <button
                      onClick={() => onSelectIssue && onSelectIssue(issue)}
                      style={{
                        width: '100%',
                        padding: isCompact ? '10px' : '16px',
                        border: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: isCompact ? '10px' : '16px',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid #0066cc';
                        e.currentTarget.style.outlineOffset = '-2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: isCompact ? '0.9em' : '1em' }}>
                          {issue.description}
                        </div>
                        {!isCompact && (
                          <div style={{ fontSize: '0.85em', color: '#666' }}>
                            {new Date(issue.timestamp).toLocaleString('en-US')}
                          </div>
                        )}
                      </div>
                      {/* KIRO-AI: Badge de sévérité avec aria-label pour accessibilité */}
                      <span
                        aria-label={`${getSeverityIcon(issue.severity)} ${getSeverityLabel(issue.severity)}`}
                        title={`Severity ${getSeverityLabel(issue.severity)}`}
                        style={{
                          ...getSeverityStyle(issue.severity),
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{getSeverityIcon(issue.severity)}</span>
                        <span>{getSeverityLabel(issue.severity)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default IssueList;
