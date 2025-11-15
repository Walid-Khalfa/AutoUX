import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// KIRO-AI: Recommendations Component
// Displays AI-powered prioritized recommendations with WCAG 2.2 and Web Vitals references
// Features: Tab switcher (Markdown/JSON), collapsible sections, copy buttons, keyboard navigation
// Requirements: 3.1, 3.2, 3.3, 3.4, 3.5

// WCAG 2.2 reference links
const WCAG_LINKS = {
  '1.4.3': 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum',
  '1.1.1': 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content',
  '2.1.1': 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard',
  '4.1.2': 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value',
  '2.4.7': 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible',
  '3.3.1': 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification',
  '3.3.2': 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions',
};

// Web Vitals reference links
const WEB_VITALS_LINKS = {
  'LCP': 'https://web.dev/lcp/',
  'FID': 'https://web.dev/fid/',
  'CLS': 'https://web.dev/cls/',
  'INP': 'https://web.dev/inp/',
  'TTFB': 'https://web.dev/ttfb/',
};

function Recommendations({ recommendations = [], markdown = '' }) {
  const [activeTab, setActiveTab] = useState('visual'); // 'visual', 'markdown', 'json'
  const [expandedItems, setExpandedItems] = useState(new Set([0])); // First item expanded by default
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Handle no recommendations
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Toggle expanded state for a recommendation
  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Copy code example to clipboard
  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy all recommendations as Markdown
  const copyAsMarkdown = () => {
    const markdownText = markdown || generateMarkdown(recommendations);
    navigator.clipboard.writeText(markdownText);
    setCopiedIndex('markdown');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy all recommendations as JSON
  const copyAsJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(recommendations, null, 2));
    setCopiedIndex('json');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Generate markdown from recommendations
  const generateMarkdown = (recs) => {
    return `# 💡 AutoUX Recommendations\n\n${recs
      .map((rec, i) => {
        const title = rec.title || rec.summary || `Recommendation ${i + 1}`;
        const description = rec.description || rec.rationale || '';
        const why = rec.why || '';
        const refs = rec.references || [];
        
        return `## ${i + 1}. ${title}\n\n${description}\n\n${why ? `**Why this matters:** ${why}\n\n` : ''}${refs.length > 0 ? `**References:** ${refs.join(', ')}\n` : ''}`;
      })
      .join('\n')}`;
  };

  // Extract WCAG and Web Vitals references from a reference string
  const parseReference = (ref) => {
    // Check for WCAG patterns (e.g., "WCAG 1.4.3", "1.4.3")
    const wcagMatch = ref.match(/(\d+\.\d+\.\d+)/);
    if (wcagMatch && WCAG_LINKS[wcagMatch[1]]) {
      return { type: 'wcag', code: wcagMatch[1], url: WCAG_LINKS[wcagMatch[1]] };
    }
    
    // Check for Web Vitals patterns (e.g., "LCP", "Web Vitals: LCP")
    const vitalMatch = ref.match(/(LCP|FID|CLS|INP|TTFB)/i);
    if (vitalMatch) {
      const vital = vitalMatch[1].toUpperCase();
      if (WEB_VITALS_LINKS[vital]) {
        return { type: 'vital', code: vital, url: WEB_VITALS_LINKS[vital] };
      }
    }
    
    // Check if it's already a URL
    if (ref.startsWith('http')) {
      return { type: 'url', code: ref, url: ref };
    }
    
    return { type: 'text', code: ref, url: null };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        padding: '28px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        marginBottom: '32px',
        border: '2px solid #6b4eff',
      }}
    >
      {/* Header with AI icon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '2.5em',
              background: 'linear-gradient(135deg, #6b4eff 0%, #0073bb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-hidden="true"
          >
            🤖
          </div>
          <div>
            <h2
              style={{
                margin: '0 0 4px 0',
                fontSize: '1.5rem',
                color: '#111827',
                fontWeight: '700',
              }}
            >
              💡 AutoUX Recommends
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Priority actions generated by AI
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'visual'}
            aria-controls="recommendations-panel"
            onClick={() => setActiveTab('visual')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setActiveTab('markdown');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'visual' ? 'white' : 'transparent',
              color: activeTab === 'visual' ? '#6b4eff' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'visual' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📋 Visual
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'markdown'}
            aria-controls="recommendations-panel"
            onClick={() => setActiveTab('markdown')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActiveTab('visual');
              if (e.key === 'ArrowRight') setActiveTab('json');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'markdown' ? 'white' : 'transparent',
              color: activeTab === 'markdown' ? '#6b4eff' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'markdown' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📝 Markdown
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'json'}
            aria-controls="recommendations-panel"
            onClick={() => setActiveTab('json')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActiveTab('markdown');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'json' ? 'white' : 'transparent',
              color: activeTab === 'json' ? '#6b4eff' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'json' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {'{}'} JSON
          </button>
        </div>
      </div>

      {/* Tab panels */}
      <div
        id="recommendations-panel"
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
      >
        <AnimatePresence mode="wait">
          {/* Visual view - Prioritized list */}
          {activeTab === 'visual' && (
            <motion.div
              key="visual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {recommendations.map((rec, index) => {
                const isExpanded = expandedItems.has(index);
                const title = rec.title || rec.summary || `Recommendation ${index + 1}`;
                const description = rec.description || rec.rationale || '';
                const why = rec.why || '';
                const references = rec.references || [];
                const codeExample = rec.codeExample || rec.code;
                const priority = rec.priority || index + 1;

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${priority === 1 ? '#ef4444' : priority === 2 ? '#f59e0b' : '#6b4eff'}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Header - clickable to expand/collapse */}
                    <button
                      onClick={() => toggleExpanded(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExpanded(index);
                        }
                      }}
                      aria-expanded={isExpanded}
                      aria-controls={`recommendation-${index}`}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {/* Priority number */}
                      <div
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          backgroundColor: priority === 1 ? '#ef4444' : priority === 2 ? '#f59e0b' : '#6b4eff',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.95rem',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}
                      >
                        {priority}
                      </div>

                      {/* Title and expand icon */}
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: '0 0 4px 0',
                            fontSize: '1.1rem',
                            color: '#111827',
                            fontWeight: '600',
                            lineHeight: '1.4',
                          }}
                        >
                          {title}
                        </h3>
                        {!isExpanded && description && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              lineHeight: '1.5',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {description}
                          </p>
                        )}
                      </div>

                      {/* Expand/collapse icon */}
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: '#6b7280',
                          transition: 'transform 0.2s ease',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                        aria-hidden="true"
                      >
                        ▼
                      </div>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`recommendation-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ paddingTop: '16px', paddingLeft: '44px' }}>
                            {/* Description */}
                            {description && (
                              <p
                                style={{
                                  margin: '0 0 12px 0',
                                  fontSize: '0.95rem',
                                  color: '#374151',
                                  lineHeight: '1.6',
                                }}
                              >
                                {description}
                              </p>
                            )}

                            {/* Why this matters */}
                            {why && (
                              <div
                                style={{
                                  padding: '12px 16px',
                                  backgroundColor: '#fef3c7',
                                  borderRadius: '8px',
                                  marginBottom: '12px',
                                  borderLeft: '3px solid #f59e0b',
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    color: '#92400e',
                                    lineHeight: '1.5',
                                  }}
                                >
                                  <strong>💡 Why this matters:</strong> {why}
                                </p>
                              </div>
                            )}

                            {/* References - WCAG and Web Vitals */}
                            {references.length > 0 && (
                              <div style={{ marginBottom: '12px' }}>
                                <div
                                  style={{
                                    fontSize: '0.8rem',
                                    color: '#6b7280',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  📚 Standards References
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                  }}
                                >
                                  {references.map((ref, refIndex) => {
                                    const parsed = parseReference(ref);
                                    
                                    if (parsed.url) {
                                      return (
                                        <a
                                          key={refIndex}
                                          href={parsed.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            padding: '6px 12px',
                                            backgroundColor: parsed.type === 'wcag' ? '#dbeafe' : parsed.type === 'vital' ? '#dcfce7' : '#f3f4f6',
                                            color: parsed.type === 'wcag' ? '#1e40af' : parsed.type === 'vital' ? '#166534' : '#374151',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            border: `1px solid ${parsed.type === 'wcag' ? '#93c5fd' : parsed.type === 'vital' ? '#86efac' : '#d1d5db'}`,
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                          }}
                                        >
                                          {parsed.type === 'wcag' && `WCAG ${parsed.code}`}
                                          {parsed.type === 'vital' && `⚡ ${parsed.code}`}
                                          {parsed.type === 'url' && '🔗 Link'}
                                        </a>
                                      );
                                    }
                                    
                                    return (
                                      <span
                                        key={refIndex}
                                        style={{
                                          padding: '6px 12px',
                                          backgroundColor: '#f3f4f6',
                                          color: '#6b7280',
                                          borderRadius: '6px',
                                          fontSize: '0.8rem',
                                          fontWeight: '500',
                                          border: '1px solid #d1d5db',
                                        }}
                                      >
                                        {parsed.code}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Code example */}
                            {codeExample && (
                              <div style={{ marginTop: '12px' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '0.8rem',
                                      color: '#6b7280',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                    }}
                                  >
                                    💻 Code Example
                                  </div>
                                  <button
                                    onClick={() => copyCode(codeExample, index)}
                                    aria-label="Copy code example"
                                    style={{
                                      padding: '4px 12px',
                                      backgroundColor: copiedIndex === index ? '#10b981' : '#6b7280',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    {copiedIndex === index ? '✓ Copied' : '📋 Copy'}
                                  </button>
                                </div>
                                <pre
                                  style={{
                                    padding: '12px',
                                    backgroundColor: '#1f2937',
                                    color: '#f3f4f6',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    overflow: 'auto',
                                    margin: 0,
                                    lineHeight: '1.5',
                                  }}
                                >
                                  <code>{codeExample}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Markdown view */}
          {activeTab === 'markdown' && (
            <motion.div
              key="markdown"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '12px',
                }}
              >
                <button
                  onClick={copyAsMarkdown}
                  aria-label="Copy as Markdown"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: copiedIndex === 'markdown' ? '#10b981' : '#6b4eff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copiedIndex === 'markdown' ? '✓ Copied!' : '📋 Copy Markdown'}
                </button>
              </div>
              <pre
                style={{
                  padding: '20px',
                  backgroundColor: '#1f2937',
                  color: '#f3f4f6',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  margin: 0,
                  lineHeight: '1.6',
                  maxHeight: '600px',
                }}
              >
                <code>{markdown || generateMarkdown(recommendations)}</code>
              </pre>
            </motion.div>
          )}

          {/* JSON view */}
          {activeTab === 'json' && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '12px',
                }}
              >
                <button
                  onClick={copyAsJSON}
                  aria-label="Copy as JSON"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: copiedIndex === 'json' ? '#10b981' : '#6b4eff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copiedIndex === 'json' ? '✓ Copied!' : '📋 Copy JSON'}
                </button>
              </div>
              <pre
                style={{
                  padding: '20px',
                  backgroundColor: '#1f2937',
                  color: '#f3f4f6',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  margin: 0,
                  lineHeight: '1.6',
                  maxHeight: '600px',
                }}
              >
                <code>{JSON.stringify(recommendations, null, 2)}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Recommendations;
