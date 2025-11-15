import { Component } from 'react';

/**
 * ErrorBoundary Component
 * 
 * Catches React errors and displays a user-friendly fallback UI
 * Features:
 * - Accessible error display with ARIA attributes
 * - Retry functionality to recover from errors
 * - Technical details in collapsible section
 * - Keyboard navigation support
 * - Focus management for better UX
 * 
 * Requirements: 6.5, 8.4
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
    this.retryButtonRef = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging and monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Optional: Send to error monitoring service (e.g., Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Focus retry button when error occurs for keyboard accessibility
    if (!prevState.hasError && this.state.hasError && this.retryButtonRef) {
      this.retryButtonRef.focus();
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
    
    // Optional: Notify parent component
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleKeyDown = (e) => {
    // Allow Enter or Space to trigger retry
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: '16px',
            margin: '32px auto',
            maxWidth: '600px',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)',
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              animation: 'shake 0.5s ease-in-out',
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>

          {/* Error Title */}
          <h2 
            id="error-title"
            style={{ 
              color: '#991b1b', 
              marginBottom: '16px',
              fontSize: '1.75rem',
              fontWeight: '700',
            }}
          >
            Something went wrong
          </h2>

          {/* Error Description */}
          <p 
            id="error-description"
            style={{ 
              color: '#6b7280', 
              marginBottom: '32px',
              fontSize: '1rem',
              lineHeight: '1.6',
            }}
          >
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>

          {/* Technical Details (Collapsible) */}
          {this.state.error && (
            <details 
              style={{ 
                marginBottom: '32px', 
                textAlign: 'left',
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <summary 
                style={{ 
                  cursor: 'pointer', 
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  userSelect: 'none',
                  outline: 'none',
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                  }
                }}
              >
                Technical Details
              </summary>
              <div style={{ marginTop: '16px' }}>
                <pre
                  style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    maxHeight: '200px',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Retry Button */}
            <button
              ref={(el) => (this.retryButtonRef = el)}
              onClick={this.handleReset}
              onKeyDown={this.handleKeyDown}
              aria-label="Retry and dismiss error"
              style={{
                padding: '14px 32px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                minWidth: '120px',
                minHeight: '44px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #93c5fd';
                e.target.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none';
              }}
            >
              🔄 Try Again
            </button>

            {/* Reload Page Button */}
            <button
              onClick={() => window.location.reload()}
              aria-label="Reload page"
              style={{
                padding: '14px 32px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
                minWidth: '120px',
                minHeight: '44px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4b5563';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6b7280';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.3)';
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #d1d5db';
                e.target.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none';
              }}
            >
              🔃 Reload Page
            </button>
          </div>

          {/* Support Link */}
          <p style={{ marginTop: '24px', fontSize: '0.875rem', color: '#9ca3af' }}>
            Need help?{' '}
            <a
              href="https://github.com/yourusername/autoux/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2563eb',
                textDecoration: 'underline',
                fontWeight: '600',
              }}
              onFocus={(e) => {
                e.target.style.outline = '3px solid #93c5fd';
                e.target.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none';
              }}
            >
              Report this issue
            </a>
          </p>

          {/* Shake Animation */}
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-10px); }
              75% { transform: translateX(10px); }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
