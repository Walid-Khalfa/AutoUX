import { useEffect, useRef } from 'react';

/**
 * SkipToContent Component
 * 
 * Provides a skip link for keyboard users to bypass navigation and jump to main content
 * Features:
 * - Hidden until focused (keyboard navigation)
 * - Smooth scroll to main content
 * - High contrast for visibility
 * - WCAG 2.2 compliant
 * 
 * Requirements: 6.5, 8.4
 */
function SkipToContent({ targetId = 'main-content' }) {
  const linkRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    
    const target = document.getElementById(targetId);
    if (target) {
      // Focus the target element
      target.focus();
      
      // Smooth scroll to target
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <>
      <a
        ref={linkRef}
        href={`#${targetId}`}
        onClick={handleClick}
        className="skip-to-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '8px',
          zIndex: 10001,
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.left = '16px';
          e.target.style.outline = '3px solid #93c5fd';
          e.target.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
          e.target.style.outline = 'none';
        }}
      >
        Skip to main content
      </a>
      <style>{`
        .skip-to-content:focus {
          left: 16px !important;
        }
      `}</style>
    </>
  );
}

export default SkipToContent;
