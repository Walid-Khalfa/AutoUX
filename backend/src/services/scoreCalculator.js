// KIRO-AI: Service de calcul du score UX
// Calcule un score de 0 à 100 basé sur le nombre et la sévérité des issues

/**
 * Calculate UX score based on detected issues
 * Formula: Start at 100, subtract points based on severity
 * - High severity: -15 points each
 * - Medium severity: -8 points each
 * - Low severity: -3 points each
 * Minimum score: 0
 * 
 * @param {Array} issues - Array of detected issues
 * @returns {number} Score from 0 to 100
 */
export function calculateUXScore(issues) {
  if (!issues || issues.length === 0) {
    return 100; // Perfect score if no issues
  }

  let score = 100;
  
  issues.forEach(issue => {
    const severity = issue.severity?.toLowerCase() || 'low';
    
    switch (severity) {
      case 'high':
      case 'critical':
        score -= 15;
        break;
      case 'medium':
      case 'moderate':
        score -= 8;
        break;
      case 'low':
      case 'minor':
        score -= 3;
        break;
      default:
        score -= 5; // Default penalty
    }
  });

  // Ensure score stays between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get score rating based on value
 * @param {number} score - Score from 0 to 100
 * @returns {Object} Rating with label and color
 */
export function getScoreRating(score) {
  if (score >= 90) {
    return { label: 'Excellent', color: 'green', emoji: '🎉' };
  } else if (score >= 75) {
    return { label: 'Good', color: 'lightgreen', emoji: '✅' };
  } else if (score >= 60) {
    return { label: 'Fair', color: 'orange', emoji: '⚠️' };
  } else if (score >= 40) {
    return { label: 'Poor', color: 'darkorange', emoji: '🔴' };
  } else {
    return { label: 'Critical', color: 'red', emoji: '🚨' };
  }
}

export default { calculateUXScore, getScoreRating };
