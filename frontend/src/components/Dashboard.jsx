import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import UXScoreGauge from './UXScoreGauge.jsx';
import AIPersonalityMessage from './AIPersonalityMessage.jsx';
import ShareableBadge from './ShareableBadge.jsx';
import QuickFilters from './QuickFilters.jsx';
import CompactModeToggle from './CompactModeToggle.jsx';

// KIRO-AI: Dashboard component with UX Score Gauge and comprehensive features
// Displays animated circular UX Score gauge (0-100) using SVG
// Color grading: 90-100 green (Excellent), 70-89 amber (Fair), <70 red (Critical)
// Uses Framer Motion for gauge animation (1.5s ease-out)
// Shows summary cards, category distribution, AI personality message
// Includes shareable badge, quick filters, and compact mode toggle

function Dashboard({ issues: issuesProp = [], report }) {
  // Prefer issues prop when provided, otherwise pull from report payload
  const resolvedIssues = useMemo(() => {
    if (issuesProp && issuesProp.length > 0) return issuesProp;
    if (report?.topIssues?.length > 0) return report.topIssues;
    if (report?.issues?.length > 0) return report.issues;
    return [];
  }, [issuesProp, report]);

  const [filteredIssues, setFilteredIssues] = useState(resolvedIssues);

  useEffect(() => {
    setFilteredIssues(resolvedIssues);
  }, [resolvedIssues]);
  const [isCompact, setIsCompact] = useState(false);

  // Calculate UX score from report or derive from issues
  const calculatedScore = calculateScore(resolvedIssues);
  const backendScore = report?.uxScore ?? report?.score;
  const noIssuesDetected = resolvedIssues.length === 0;
  const backendScoreMismatch =
    typeof backendScore === 'number' &&
    Math.abs(backendScore - calculatedScore) > 20;
  const uxScore = (noIssuesDetected || backendScoreMismatch)
    ? calculatedScore
    : (backendScore ?? calculatedScore);

  // Calculate statistics
  const stats = {
    critical: resolvedIssues.filter(i => {
      const severity = (i.severity || '').toLowerCase();
      return severity === 'high' || severity === 'critical';
    }).length,
    high: resolvedIssues.filter(i => (i.severity || '').toLowerCase() === 'high').length,
    medium: resolvedIssues.filter(i => {
      const severity = (i.severity || '').toLowerCase();
      return severity === 'medium' || severity === 'moderate';
    }).length,
    low: resolvedIssues.filter(i => {
      const severity = (i.severity || '').toLowerCase();
      return severity === 'low' || severity === 'minor';
    }).length,
  };

  // Calculate category distribution
  const categoryDistribution = resolvedIssues.reduce((acc, issue) => {
    const category = issue.category || issue.type || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryIcons = {
    latency: '⏱️',
    latence: '⏱️',
    Performance: '⚡',
    accessibility: '♿',
    accessibilité: '♿',
    Accessibility: '♿',
    contrast: '🎨',
    contraste: '🎨',
    Contrast: '🎨',
    'JS error': '🚨',
    'javascript_error': '🚨',
    'JavaScript Errors': '🚨',
    'erreur JS': '🚨',
    Other: '📋',
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ marginBottom: '32px' }}
    >
      {/* KIRO-AI: AI Personality Message */}
      <motion.div variants={itemVariants}>
        <AIPersonalityMessage 
          issues={resolvedIssues} 
          analysisModel={report.metadata?.analysisModel}
        />
      </motion.div>

      {/* KIRO-AI: Controls row - Compact mode toggle and filters */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <CompactModeToggle isCompact={isCompact} onToggle={() => setIsCompact(!isCompact)} />
      </motion.div>

      {/* KIRO-AI: Main dashboard grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* KIRO-AI: UX Score Gauge Card */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Overall UX Score
          </h3>
          <UXScoreGauge score={uxScore} />
        </motion.div>

        {/* KIRO-AI: Summary Cards - Total Issues */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: isCompact ? '20px' : '28px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Total Issues
          </div>
          <div
            style={{
              fontSize: isCompact ? '2.5rem' : '3rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '20px',
              lineHeight: 1,
            }}
          >
            {resolvedIssues.length}
          </div>

          {/* KIRO-AI: Breakdown by severity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#fef2f2',
                borderRadius: '10px',
                border: '1px solid #fecaca',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2em' }}>🔴</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
                  Critical
                </span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                {stats.critical}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#fffbeb',
                borderRadius: '10px',
                border: '1px solid #fde68a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2em' }}>🟡</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
                  Medium
                </span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                {stats.medium}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f0fdf4',
                borderRadius: '10px',
                border: '1px solid #bbf7d0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2em' }}>🟢</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>
                  Minor
                </span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                {stats.low}
              </span>
            </div>
          </div>
        </motion.div>

        {/* KIRO-AI: Category Distribution Card */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: isCompact ? '20px' : '28px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '16px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Category Distribution
          </div>

          {Object.keys(categoryDistribution).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(categoryDistribution).map(([category, count]) => (
                <div
                  key={category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3em' }}>
                      {categoryIcons[category] || '📋'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      {category}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#6b4eff',
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
              No categories detected
            </div>
          )}
        </motion.div>
      </div>

      {/* KIRO-AI: Quick Filters */}
      <motion.div variants={itemVariants}>
        <QuickFilters issues={resolvedIssues} onFilterChange={setFilteredIssues} />
      </motion.div>

      {/* KIRO-AI: Shareable Badge */}
      <motion.div variants={itemVariants}>
        <ShareableBadge score={uxScore} />
      </motion.div>

      {/* KIRO-AI: Analysis source badge with AI pulse animation */}
      {report && (
        <motion.div
          variants={itemVariants}
          className="ai-pulse"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#6b4eff',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginTop: '24px',
            boxShadow: '0 4px 12px rgba(107, 78, 255, 0.4)',
            cursor: 'help',
            transition: 'all 0.2s ease',
          }}
          title="Analyzed using Gemini 2.5 Flash AI model"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 78, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 78, 255, 0.4)';
          }}
        >
          <span style={{ fontSize: '1.2em' }}>
            🧠
          </span>
          <span>
            Analyzed by Gemini Flash
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function to calculate UX score if not provided
function calculateScore(issues) {
  if (!issues || issues.length === 0) return 100;
  
  const weights = {
    critical: 15,
    high: 15,
    medium: 5,
    low: 2,
  };

  const totalDeduction = issues.reduce((sum, issue) => {
    const severity = issue.severity || 'low';
    return sum + (weights[severity] || weights.low);
  }, 0);

  return Math.max(0, Math.min(100, 100 - totalDeduction));
}

export default Dashboard;
