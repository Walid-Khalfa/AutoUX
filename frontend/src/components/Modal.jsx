import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modal Dialog Component
 * 
 * Displays critical errors and important messages in a modal dialog
 * Features:
 * - Accessible modal with proper ARIA attributes
 * - Focus trap to keep keyboard navigation within modal
 * - Escape key to close
 * - Click outside to close (optional)
 * - Smooth animations with reduced motion support
 * - Keyboard navigation support
 * 
 * Requirements: 6.5, 8.4
 */
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'error',
  actions = [],
  closeOnOutsideClick = true,
  closeOnEscape = true
}) {
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus first focusable element in modal
      setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const typeStyles = {
    error: {
      icon: '❌',
      iconBg: '#fef2f2',
      iconColor: '#ef4444',
      titleColor: '#991b1b',
    },
    warning: {
      icon: '⚠️',
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      titleColor: '#92400e',
    },
    info: {
      icon: 'ℹ️',
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
      titleColor: '#1e40af',
    },
    success: {
      icon: '✅',
      iconBg: '#f0fdf4',
      iconColor: '#10b981',
      titleColor: '#065f46',
    },
  };

  const style = typeStyles[type] || typeStyles.error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#9ca3af',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#9ca3af';
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #93c5fd';
                e.target.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none';
              }}
            >
              ×
            </button>

            {/* Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: style.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '2rem',
              }}
              aria-hidden="true"
            >
              {style.icon}
            </div>

            {/* Title */}
            <h2
              id="modal-title"
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: style.titleColor,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {title}
            </h2>

            {/* Message */}
            <p
              id="modal-description"
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              {message}
            </p>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {actions.length > 0 ? (
                actions.map((action, index) => (
                  <button
                    key={index}
                    ref={index === 0 ? firstFocusableRef : index === actions.length - 1 ? lastFocusableRef : null}
                    onClick={action.onClick}
                    aria-label={action.ariaLabel || action.label}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: action.primary ? '#2563eb' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      minWidth: '100px',
                      minHeight: '44px',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = action.primary ? '#1d4ed8' : '#4b5563';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = action.primary ? '#2563eb' : '#6b7280';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = '3px solid #93c5fd';
                      e.target.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                      e.target.style.outline = 'none';
                    }}
                  >
                    {action.label}
                  </button>
                ))
              ) : (
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  aria-label="Close dialog"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    minWidth: '100px',
                    minHeight: '44px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1d4ed8';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = '3px solid #93c5fd';
                    e.target.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = 'none';
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
