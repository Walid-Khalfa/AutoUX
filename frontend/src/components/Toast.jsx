import { useEffect, useRef } from 'react';

/**
 * Toast Notification Component
 * 
 * Displays transient notifications with auto-dismiss functionality
 * Features:
 * - Auto-dismisses after configurable duration (default 3s)
 * - Supports success/error/info/warning types
 * - Accessible with ARIA live regions
 * - Keyboard dismissible (Escape key)
 * - Focus management for screen readers
 * - Smooth animations with reduced motion support
 * 
 * Requirements: 6.5, 8.4
 */
function Toast({ message, type = 'success', onClose, duration = 3000, persistent = false }) {
  const toastRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Auto-dismiss after duration (unless persistent)
    if (!persistent && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration, persistent]);

  useEffect(() => {
    // Handle Escape key to dismiss toast
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Focus close button for keyboard accessibility (critical errors only)
    if (type === 'error' && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [type]);

  const styles = {
    success: { 
      bg: 'var(--color-success)', 
      icon: '✅',
      label: 'Success notification',
      ariaLive: 'polite',
      shadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
    },
    error: { 
      bg: 'var(--color-error)', 
      icon: '❌',
      label: 'Error notification',
      ariaLive: 'assertive',
      shadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
    },
    info: { 
      bg: 'var(--color-info)', 
      icon: 'ℹ️',
      label: 'Information notification',
      ariaLive: 'polite',
      shadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
    },
    warning: { 
      bg: 'var(--color-warning)', 
      icon: '⚠️',
      label: 'Warning notification',
      ariaLive: 'assertive',
      shadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
    },
  };

  const { bg, icon, label, ariaLive, shadow } = styles[type] || styles.success;

  return (
    <>
      <div
        ref={toastRef}
        role="alert"
        aria-live={ariaLive}
        aria-atomic="true"
        aria-label={label}
        className="toast-enter gpu-accelerated"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: bg,
          color: 'white',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: shadow,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 'var(--z-tooltip)',
          maxWidth: '400px',
          minWidth: '300px',
        }}
      >
        <span 
          style={{ fontSize: '1.5em', flexShrink: 0 }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span 
          style={{ fontWeight: '600', flex: 1, fontSize: '0.95rem' }}
          id="toast-message"
        >
          {message}
        </span>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close notification"
          aria-describedby="toast-message"
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'scale(1)';
          }}
          onFocus={(e) => {
            e.target.style.outline = '3px solid rgba(255,255,255,0.5)';
            e.target.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none';
          }}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          @keyframes slideInRight {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideOutRight {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          [role="alert"] {
            left: 16px !important;
            right: 16px !important;
            top: 16px !important;
            min-width: auto !important;
            max-width: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Toast;
