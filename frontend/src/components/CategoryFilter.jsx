import { useState } from 'react';

// KIRO-AI: Composant CategoryFilter pour filtrer les issues par catégorie
// Affiche des boutons avec compteurs et état actif visuel
// Supporte la navigation clavier et l'accessibilité ARIA
function CategoryFilter({ issues, selectedCategory, onSelectCategory }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // KIRO-AI: Calculer le nombre d'issues par catégorie
  const categoryCounts = issues.reduce((acc, issue) => {
    const category = issue.type || 'autre';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // KIRO-AI: Liste des catégories avec icônes
  const categories = [
    { id: 'all', label: 'All', icon: '📊', color: '#6b4eff' },
    { id: 'latency', label: 'Latency', icon: '⏱️', color: '#0073bb' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿', color: '#10b981' },
    { id: 'contrast', label: 'Contrast', icon: '🎨', color: '#f59e0b' },
    { id: 'JS error', label: 'JS Error', icon: '🚨', color: '#dc2626' },
  ];

  // KIRO-AI: Obtenir le nombre d'issues pour une catégorie
  const getCount = (categoryId) => {
    if (categoryId === 'all') return issues.length;
    return categoryCounts[categoryId] || 0;
  };

  // KIRO-AI: Styles pour les boutons de filtre
  const getButtonStyle = (categoryId, isHovered) => {
    const isActive = selectedCategory === categoryId;
    const category = categories.find(c => c.id === categoryId);
    
    return {
      padding: '10px 20px',
      borderRadius: '8px',
      border: isActive ? `2px solid ${category.color}` : '2px solid #e5e7eb',
      backgroundColor: isActive ? `${category.color}15` : isHovered ? '#f9fafb' : 'white',
      color: isActive ? category.color : '#374151',
      fontWeight: isActive ? '600' : '500',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      outline: 'none',
      boxShadow: isActive ? `0 0 0 3px ${category.color}20` : 'none',
    };
  };

  return (
    <div
      role="toolbar"
      aria-label="Filter by category"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
    >
      {categories.map((category) => {
        const count = getCount(category.id);
        const isActive = selectedCategory === category.id;
        const isHovered = hoveredCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onFocus={() => setHoveredCategory(category.id)}
            onBlur={() => setHoveredCategory(null)}
            aria-pressed={isActive}
            aria-label={`${category.label} (${count} issue${count > 1 ? 's' : ''})`}
            style={getButtonStyle(category.id, isHovered)}
          >
            <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
            <span>{category.label}</span>
            <span
              style={{
                backgroundColor: isActive ? category.color : '#e5e7eb',
                color: isActive ? 'white' : '#6b7280',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                minWidth: '24px',
                textAlign: 'center',
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
