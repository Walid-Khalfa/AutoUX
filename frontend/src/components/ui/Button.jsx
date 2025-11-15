// KIRO-AI: Composant Button moderne avec variants et micro-interactions
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-family-sans)',
    fontWeight: 'var(--font-weight-medium)',
    borderRadius: 'var(--border-radius-lg)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-fast)',
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    userSelect: 'none',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
      ':hover': {
        backgroundColor: 'var(--color-primary-dark)',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      },
      ':active': {
        transform: 'translateY(0)',
        boxShadow: 'var(--shadow-sm)',
      }
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
      ':hover': {
        backgroundColor: 'var(--color-secondary-dark)',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      ':hover': {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        transform: 'translateY(-1px)',
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-gray-700)',
      ':hover': {
        backgroundColor: 'var(--color-gray-100)',
        transform: 'translateY(-1px)',
      }
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
      ':hover': {
        backgroundColor: '#dc2626',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      }
    }
  };

  const sizes = {
    sm: {
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--font-size-sm)',
      minHeight: '36px',
    },
    md: {
      padding: 'var(--space-3) var(--space-6)',
      fontSize: 'var(--font-size-base)',
      minHeight: '44px',
    },
    lg: {
      padding: 'var(--space-4) var(--space-8)',
      fontSize: 'var(--font-size-lg)',
      minHeight: '52px',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    const hoverStyles = variants[variant][':hover'];
    if (hoverStyles) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    e.currentTarget.style.backgroundColor = variants[variant].backgroundColor || 'transparent';
    e.currentTarget.style.color = variants[variant].color;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = variants[variant].boxShadow || 'none';
  };

  const handleMouseDown = (e) => {
    if (disabled || loading) return;
    const activeStyles = variants[variant][':active'];
    if (activeStyles) {
      Object.assign(e.currentTarget.style, activeStyles);
    }
  };

  const handleMouseUp = (e) => {
    if (disabled || loading) return;
    const hoverStyles = variants[variant][':hover'];
    if (hoverStyles) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  return (
    <button
      ref={ref}
      className={`button ${className}`}
      style={combinedStyles}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid var(--color-primary)';
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;