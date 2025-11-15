// KIRO-AI: Composant Card moderne avec variants et animations
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'md',
  hover = false,
  glass = false,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = {
    borderRadius: 'var(--border-radius-xl)',
    border: '1px solid var(--color-border)',
    transition: 'all var(--transition-normal)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    default: {
      backgroundColor: 'var(--color-surface-elevated)',
      boxShadow: 'var(--shadow-sm)',
    },
    elevated: {
      backgroundColor: 'var(--color-surface-elevated)',
      boxShadow: 'var(--shadow-lg)',
    },
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      border: '1px solid var(--color-primary-dark)',
      boxShadow: 'var(--shadow-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
      border: '1px solid var(--color-secondary-dark)',
      boxShadow: 'var(--shadow-secondary)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: 'var(--shadow-lg)',
    }
  };

  const sizes = {
    sm: { padding: 'var(--space-4)' },
    md: { padding: 'var(--space-6)' },
    lg: { padding: 'var(--space-8)' },
    xl: { padding: 'var(--space-10)' },
  };

  const hoverStyles = hover ? {
    cursor: 'pointer',
    transform: 'translateY(0)',
  } : {};

  const glassStyles = glass ? variants.glass : {};

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...glassStyles,
    ...hoverStyles,
  };

  return (
    <div
      ref={ref}
      className={`card ${className}`}
      style={combinedStyles}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = combinedStyles.boxShadow;
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;