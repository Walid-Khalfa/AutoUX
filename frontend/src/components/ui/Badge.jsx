// KIRO-AI: Composant Badge moderne avec variants et animations
import { forwardRef } from 'react';

const Badge = forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  pulse = false,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    fontFamily: 'var(--font-family-sans)',
    fontWeight: 'var(--font-weight-medium)',
    borderRadius: 'var(--border-radius-full)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    transition: 'all var(--transition-fast)',
    position: 'relative',
  };

  const variants = {
    default: {
      backgroundColor: 'var(--color-gray-100)',
      color: 'var(--color-gray-700)',
      border: '1px solid var(--color-gray-200)',
    },
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca',
    },
    info: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #93c5fd',
    },
    // Variants pour sévérité
    high: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca',
    },
    medium: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
    },
    low: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    }
  };

  const sizes = {
    sm: {
      padding: 'var(--space-1) var(--space-2)',
      fontSize: 'var(--font-size-xs)',
    },
    md: {
      padding: 'var(--space-1) var(--space-3)',
      fontSize: 'var(--font-size-sm)',
    },
    lg: {
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--font-size-base)',
    }
  };

  const pulseAnimation = pulse ? {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  } : {};

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...pulseAnimation,
  };

  return (
    <span
      ref={ref}
      className={`badge ${className}`}
      style={combinedStyles}
      {...props}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '1em' }}>
          {icon}
        </span>
      )}
      {children}
      
      {pulse && (
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;