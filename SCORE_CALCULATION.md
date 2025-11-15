# 📊 UX Score Calculation

## Overview

The UX Score is a dynamic metric calculated based on the number and severity of detected issues. It ranges from 0 to 100, where 100 represents a perfect UX with no issues.

## Calculation Formula

```
Starting Score: 100

For each issue:
- High/Critical severity: -15 points
- Medium/Moderate severity: -8 points
- Low/Minor severity: -3 points

Final Score: max(0, min(100, calculated_score))
```

## Score Ratings

| Score Range | Rating | Color | Emoji | Description |
|-------------|--------|-------|-------|-------------|
| 90-100 | Excellent | Green | 🎉 | Outstanding UX, minimal issues |
| 75-89 | Good | Light Green | ✅ | Good UX, minor improvements needed |
| 60-74 | Fair | Orange | ⚠️ | Acceptable UX, several issues to address |
| 40-59 | Poor | Dark Orange | 🔴 | Poor UX, significant issues present |
| 0-39 | Critical | Red | 🚨 | Critical UX problems, immediate action required |

## Examples

### Example 1: Perfect Score
```
Issues: []
Score: 100
Rating: Excellent 🎉
```

### Example 2: Minor Issues
```
Issues: [
  { severity: "low" },
  { severity: "low" },
  { severity: "low" }
]
Calculation: 100 - (3 × 3) = 91
Score: 91
Rating: Excellent 🎉
```

### Example 3: Mixed Severity
```
Issues: [
  { severity: "high" },
  { severity: "medium" },
  { severity: "medium" },
  { severity: "low" }
]
Calculation: 100 - 15 - 8 - 8 - 3 = 66
Score: 66
Rating: Fair ⚠️
```

### Example 4: Critical Issues
```
Issues: [
  { severity: "high" },
  { severity: "high" },
  { severity: "high" },
  { severity: "high" },
  { severity: "high" }
]
Calculation: 100 - (5 × 15) = 25
Score: 25
Rating: Critical 🚨
```

### Example 5: Many Issues
```
Issues: [
  { severity: "high" } × 10
]
Calculation: 100 - (10 × 15) = -50 → capped at 0
Score: 0
Rating: Critical 🚨
```

## Implementation

### Backend

The score is calculated in `backend/src/services/scoreCalculator.js`:

```javascript
export function calculateUXScore(issues) {
  if (!issues || issues.length === 0) {
    return 100;
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
        score -= 5;
    }
  });

  return Math.max(0, Math.min(100, score));
}
```

### Frontend

The score is displayed in multiple components:
- `UXScoreGauge.jsx` - Visual gauge with color coding
- `ShareableBadge.jsx` - Shareable score badge
- `SummarySidebar.jsx` - Summary with score
- `Dashboard.jsx` - Main dashboard display

## Dynamic Behavior

The score is **recalculated for each analysis**:

1. User uploads logs
2. Backend analyzes logs (LLM or local)
3. Issues are detected with severity levels
4. Score is calculated based on issues
5. Score is included in the report
6. Frontend displays the dynamic score

## Testing

Test files in `test-data/` demonstrate different scores:

| File | Issues | Expected Score Range |
|------|--------|---------------------|
| 1-logs-complet.json | 7 mixed | ~40-60 (Fair/Poor) |
| 2-logs-latence.json | 4 high/medium | ~50-70 (Fair) |
| 3-logs-a11y.json | 6 medium/low | ~60-75 (Fair/Good) |
| 4-logs-contrast-js.json | 4 medium | ~65-75 (Fair/Good) |
| 5-logs-invalids.json | 4 mixed | ~60-75 (Fair/Good) |
| 6-logs-clean.json | 0 | 100 (Excellent) |

## Benefits

1. **Dynamic**: Score changes based on actual issues
2. **Intuitive**: Higher score = better UX
3. **Actionable**: Clear rating helps prioritize fixes
4. **Transparent**: Formula is simple and understandable
5. **Motivating**: Users can track improvements

## Future Enhancements

Potential improvements to the scoring system:

- [ ] Weight by issue type (accessibility > latency)
- [ ] Consider issue frequency
- [ ] Factor in WCAG compliance level
- [ ] Add bonus points for best practices
- [ ] Historical score tracking
- [ ] Comparative scoring (vs. industry average)

---

**Note**: The score is calculated server-side to ensure consistency and prevent manipulation.
