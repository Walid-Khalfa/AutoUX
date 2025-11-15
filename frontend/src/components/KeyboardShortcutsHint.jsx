import { useState } from 'react';

// KIRO-AI: Keyboard Shortcuts Hint component
// Displays available keyboard shortcuts in a modal
// Improves accessibility and power user experience

function KeyboardShortcutsHint() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'U', description: 'Upload logs' },
    { key: 'F', description: 'Focus filters' },
    { key: 'C', description: 'Toggle compact mode' },
    { key: 'D', description: 'Download report' },
    { key: 'Esc', description: 'Close details/modal' },
    { key: '?', description: 'Show shortcuts' },
  ];

  return (
    <>
      {/* KIRO-AI: Floating hint button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (Press ?)"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6b4eff 0%, #8b6fff 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          fontWeight: '700',
          boxShadow: '0 4px 16px rgba(107, 78, 255, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 24px rgba(107, 78, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 16px rgba(107, 78, 255, 0.4)';
        }}
      >
        ⌨️
      </button>

      {/* KIRO-AI: Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* KIRO-AI: Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                }}
              >
                ⌨️ Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close shortcuts"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#111827')}
                onMouseLeave={(e) => (e.target.style.color = '#6b7280')}
              >
                ✕
              </button>
            </div>

            {/* KIRO-AI: Shortcuts list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.95rem',
                      color: '#374151',
                      fontWeight: '500',
                    }}
                  >
                    {shortcut.description}
                  </span>
                  <kbd
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#6b4eff',
                      fontFamily: 'monospace',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* KIRO-AI: Footer note */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                fontSize: '0.875rem',
                color: '#1e40af',
                lineHeight: '1.5',
              }}
            >
              💡 <strong>Tip:</strong> Press <kbd style={{ padding: '2px 6px', background: 'white', borderRadius: '4px', fontWeight: '700' }}>?</kbd> anytime to show this dialog.
            </div>
          </div>
        </div>
      )}

      {/* KIRO-AI: Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default KeyboardShortcutsHint;
