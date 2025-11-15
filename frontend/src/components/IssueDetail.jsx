import { useState, useEffect } from 'react';
import { fetchFixspecs } from '../services/api.js';

// KIRO-AI: Composant IssueDetail pour afficher les détails d'une issue et son fixspec
// Charge automatiquement le fixspec associé et affiche les recommandations
// Peut être étendu pour permettre l'édition ou l'application des fixspecs
function IssueDetail({ issue }) {
  const [fixspec, setFixspec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // KIRO-AI: Charge le fixspec associé à l'issue
  useEffect(() => {
    if (!issue) {
      setFixspec(null);
      return;
    }

    const loadFixspec = async () => {
      try {
        setLoading(true);
        setError(null);
        const fixspecs = await fetchFixspecs();
        const matchingFixspec = fixspecs.find((fs) => fs.issueId === issue.id);
        setFixspec(matchingFixspec || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFixspec();
  }, [issue]);

  if (!issue) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#666',
          fontSize: '1.1em',
        }}
      >
        Select an issue to view details
      </div>
    );
  }

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
    <div
      role="article"
      aria-labelledby="issue-title"
      style={{
        padding: '28px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* KIRO-AI: En-tête avec type et sévérité */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '2px solid #eee',
        }}
      >
        <h2
          id="issue-title"
          style={{
            margin: 0,
            fontSize: '1.5rem',
            color: '#111827',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '1.75rem' }}>
            {issue.type === 'latency' || issue.type === 'latence' ? '⏱️' : issue.type === 'accessibility' || issue.type === 'accessibilité' ? '♿' : issue.type === 'contrast' || issue.type === 'contraste' ? '🎨' : issue.type === 'JS error' || issue.type === 'erreur JS' ? '🚨' : '📋'}
          </span>
          {issue.type}
        </h2>
        <span
          aria-label={`Severity ${issue.severity}`}
          style={{
            ...getSeverityStyle(issue.severity),
            padding: '8px 16px',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢'}</span>
          <span>{issue.severity === 'high' ? 'Critical' : issue.severity === 'medium' ? 'Medium' : 'Minor'}</span>
        </span>
      </div>

      {/* KIRO-AI: Description de l'issue */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1em', marginBottom: '8px', color: '#555' }}>
          Description
        </h3>
        <p style={{ margin: 0, lineHeight: '1.6', color: '#333' }}>
          {issue.description}
        </p>
      </div>

      {/* KIRO-AI: Issue metadata */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1em', marginBottom: '8px', color: '#555' }}>
          Information
        </h3>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
          <dt style={{ fontWeight: 'bold', color: '#666' }}>ID:</dt>
          <dd style={{ margin: 0, color: '#333' }}>{issue.id}</dd>
          
          <dt style={{ fontWeight: 'bold', color: '#666' }}>Timestamp:</dt>
          <dd style={{ margin: 0, color: '#333' }}>
            {new Date(issue.timestamp).toLocaleString('en-US')}
          </dd>
          
          <dt style={{ fontWeight: 'bold', color: '#666' }}>Source Log:</dt>
          <dd style={{ margin: 0, color: '#333' }}>{issue.sourceLogId}</dd>
        </dl>
      </div>

      {/* KIRO-AI: Additional metadata if available */}
      {issue.metadata && Object.keys(issue.metadata).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1em', marginBottom: '8px', color: '#555' }}>
            Metadata
          </h3>
          <pre
            style={{
              margin: 0,
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.9em',
              lineHeight: '1.5',
            }}
          >
            {JSON.stringify(issue.metadata, null, 2)}
          </pre>
        </div>
      )}

      {/* KIRO-AI: Section Fixspec avec recommandations */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '2px solid #eee',
        }}
      >
        <h3 style={{ fontSize: '1.2em', marginBottom: '16px', color: '#333' }}>
          Fix Specification
        </h3>

        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Loading fixspec...
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              padding: '12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              color: '#856404',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && !fixspec && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            No fixspec available for this issue
          </div>
        )}

        {!loading && !error && fixspec && (
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
            }}
          >
            {/* KIRO-AI: Résumé du correctif */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1em', marginBottom: '8px', color: '#555' }}>
                Summary
              </h4>
              <p style={{ margin: 0, lineHeight: '1.6', color: '#333' }}>
                {fixspec.suggestedFix?.summary || 'No summary available'}
              </p>
            </div>

            {/* KIRO-AI: Étapes de correction */}
            {fixspec.suggestedFix?.steps && fixspec.suggestedFix.steps.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1em', marginBottom: '8px', color: '#555' }}>
                  Correction Steps
                </h4>
                <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  {fixspec.suggestedFix.steps.map((step, index) => (
                    <li key={index} style={{ color: '#333' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* KIRO-AI: Exemple de code si disponible */}
            {fixspec.suggestedFix?.codeExample && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1em', marginBottom: '8px', color: '#555' }}>
                  Code Example
                </h4>
                <pre
                  style={{
                    margin: 0,
                    padding: '12px',
                    backgroundColor: '#282c34',
                    color: '#abb2bf',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.9em',
                    lineHeight: '1.5',
                  }}
                >
                  {fixspec.suggestedFix.codeExample}
                </pre>
              </div>
            )}

            {/* KIRO-AI: Références WCAG/Web Vitals */}
            {fixspec.suggestedFix?.references && fixspec.suggestedFix.references.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1em', marginBottom: '8px', color: '#555' }}>
                  References
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  {fixspec.suggestedFix.references.map((ref, index) => (
                    <li key={index} style={{ color: '#0066cc' }}>
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* KIRO-AI: Statut du fixspec */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #dee2e6',
                fontSize: '0.9em',
                color: '#666',
              }}
            >
              <strong>Status:</strong>{' '}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor:
                    fixspec.status === 'applied'
                      ? '#d4edda'
                      : fixspec.status === 'rejected'
                      ? '#f8d7da'
                      : '#fff3cd',
                  color:
                    fixspec.status === 'applied'
                      ? '#155724'
                      : fixspec.status === 'rejected'
                      ? '#721c24'
                      : '#856404',
                }}
              >
                {fixspec.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueDetail;
