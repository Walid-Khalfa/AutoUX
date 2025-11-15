// KIRO-AI: Filtres de catégorie modernes avec animations
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';

function ModernCategoryFilter({ issues, selectedCategory, onSelectCategory }) {
  // KIRO-AI: Calculer les statistiques par catégorie
  const categoryStats = issues.reduce((acc, issue) => {
    const category = issue.type || 'other';
    if (!acc[category]) {
      acc[category] = { total: 0, high: 0, medium: 0, low: 0 };
    }
    acc[category].total++;
    acc[category][issue.severity]++;
    return acc;
  }, {});

  const totalIssues = issues.length;

  // KIRO-AI: Configuration des catégories
  const categoryConfig = {
    all: { icon: '📊', label: 'All Issues', color: 'var(--color-gray-600)' },
    latency: { icon: '⏱️', label: 'Performance', color: 'var(--color-warning)' },
    accessibility: { icon: '♿', label: 'Accessibility', color: 'var(--color-info)' },
    contrast: { icon: '🎨', label: 'Contrast', color: 'var(--color-secondary)' },
    'JS error': { icon: '🚨', label: 'JavaScript', color: 'var(--color-error)' },
    other: { icon: '📋', label: 'Other', color: 'var(--color-gray-500)' }
  };

  const categories = [
    { key: 'all', count: totalIssues },
    ...Object.entries(categoryStats).map(([key, stats]) => ({
      key,
      count: stats.total,
      stats
    }))
  ];

  return (
    <div className="modern-category-filter fade-in" style={{
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 'var(--space-4)',
      backgroundColor: 'var(--color-surface-elevated)',
      borderRadius: 'var(--border-radius-xl)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {categories.map(({ key, count, stats }) => {
        const config = categoryConfig[key] || categoryConfig.other;
        const isActive = selectedCategory === key;
        
        return (
          <Button
            key={key}
            variant={isActive ? 'primary' : 'ghost'}
            size="md"
            onClick={() => onSelectCategory(key)}
            style={{
              position: 'relative',
              transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: isActive ? 'var(--shadow-md)' : 'none'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span style={{ fontSize: '1.2em' }}>{config.icon}</span>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 1
                }}>
                  {config.label}
                </div>
                
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  opacity: 0.8,
                  lineHeight: 1,
                  marginTop: '2px'
                }}>
                  {count} issue{count !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Badge de compteur */}
              <Badge
                variant={isActive ? 'glass' : 'default'}
                size="sm"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-gray-100)',
                  color: isActive ? 'white' : 'var(--color-gray-700)',
                  fontWeight: 'var(--font-weight-semibold)',
                  minWidth: '24px'
                }}
              >
                {count}
              </Badge>

              {/* Indicateurs de sévérité pour les catégories spécifiques */}
              {stats && (
                <div style={{
                  display: 'flex',
                  gap: '2px',
                  marginLeft: 'var(--space-1)'
                }}>
                  {stats.high > 0 && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-error)',
                      boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
                    }} />
                  )}
                  {stats.medium > 0 && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-warning)',
                      boxShadow: '0 0 4px rgba(245, 158, 11, 0.5)'
                    }} />
                  )}
                  {stats.low > 0 && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success)',
                      boxShadow: '0 0 4px rgba(16, 185, 129, 0.5)'
                    }} />
                  )}
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export default ModernCategoryFilter;