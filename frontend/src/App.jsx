import { useState, useEffect, lazy, Suspense } from 'react';
import { analyzeLog } from './services/api.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AnimatedHeader from './components/AnimatedHeader.jsx';
import Footer from './components/Footer.jsx';
import FileUploader from './components/FileUploader.jsx';
import Toast from './components/Toast.jsx';
import SkipToContent from './components/SkipToContent.jsx';
import Modal from './components/Modal.jsx';
import MobileUploadButton from './components/MobileUploadButton.jsx';
import './styles/accessibility.css';
import './styles/animations.css';
import './styles/mobile-responsive.css';

// Lazy load heavy components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const Recommendations = lazy(() => import('./components/Recommendations.jsx'));
const OnChainProof = lazy(() => import('./components/OnChainProof.jsx'));
const OnChainHistory = lazy(() => import('./components/OnChainHistory.jsx'));
const QRCodeShare = lazy(() => import('./components/QRCodeShare.jsx'));
const ReportViewer = lazy(() => import('./components/ReportViewer.jsx'));

// SessionStorage cache keys
const CACHE_KEY_REPORT = 'autoux_current_report';
const CACHE_KEY_MARKDOWN = 'autoux_current_markdown';

/**
 * AutoUX Application Root Component
 * 
 * Features:
 * - State management for report, loading, error, uploadProgress
 * - Animated gradient header with AI-Powered pulse indicator
 * - Conditional rendering: FileUploader OR Dashboard + Report sections
 * - sessionStorage caching for reports
 * - React Suspense and lazy loading for code splitting
 * - Footer with technologies, features, GitHub link, hackathon badge, Web3 info
 * - Responsive design for mobile devices
 * 
 * Requirements: 2.1, 2.5, 6.1, 6.2, 6.3, 6.4, 6.5
 */
function App() {
  // State management
  const [report, setReport] = useState(null);
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [modal, setModal] = useState(null);

  // Load cached report from sessionStorage on mount
  useEffect(() => {
    try {
      const cachedReport = sessionStorage.getItem(CACHE_KEY_REPORT);
      const cachedMarkdown = sessionStorage.getItem(CACHE_KEY_MARKDOWN);
      
      if (cachedReport) {
        setReport(JSON.parse(cachedReport));
        setMarkdown(cachedMarkdown);
        // Cached report loaded from sessionStorage
      }
    } catch (err) {
      console.warn('[App] Failed to load cached report:', err);
      // Clear corrupted cache
      sessionStorage.removeItem(CACHE_KEY_REPORT);
      sessionStorage.removeItem(CACHE_KEY_MARKDOWN);
    }
  }, []);

  /**
   * Handle file upload and analysis
   * @param {File} file - Log file to analyze
   */
  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Analyze log file with AI
      const result = await analyzeLog(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Cache report in sessionStorage
      if (result.report) {
        sessionStorage.setItem(CACHE_KEY_REPORT, JSON.stringify(result.report));
        if (result.markdown) {
          sessionStorage.setItem(CACHE_KEY_MARKDOWN, result.markdown);
        }
        // Report cached to sessionStorage
      }
      
      // Update state
      setReport(result.report);
      setMarkdown(result.markdown);
      setLoading(false);
      setUploadProgress(0);
      
      // Show success toast with animation
      showToast('✨ Analysis complete! Your UX report is ready.', 'success');
      
      // Scroll to dashboard
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 300);
      
    } catch (err) {
      console.error('[App] Upload error:', err);
      setError(err.message || 'Failed to analyze log file');
      setLoading(false);
      setUploadProgress(0);
      showToast(err.message || 'Analysis failed', 'error');
    }
  };

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, info)
   */
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  /**
   * Show modal dialog for critical errors
   * @param {string} title - Modal title
   * @param {string} message - Modal message
   * @param {string} type - Modal type (error, warning, info)
   * @param {Array} actions - Array of action buttons
   */
  const showModal = (title, message, type = 'error', actions = []) => {
    setModal({ title, message, type, actions });
  };

  /**
   * Clear current report and reset to upload state
   */
  const handleNewUpload = () => {
    setReport(null);
    setMarkdown(null);
    setError(null);
    sessionStorage.removeItem(CACHE_KEY_REPORT);
    sessionStorage.removeItem(CACHE_KEY_MARKDOWN);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      {/* Skip to content link for keyboard navigation */}
      <SkipToContent targetId="main-content" />

      <div 
        style={{ 
          minHeight: '100vh', 
          backgroundColor: '#f9fafb',
          background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Animated gradient header with AI-Powered pulse indicator */}
        <AnimatedHeader />

        {/* Main content area */}
        <main 
          id="main-content"
          tabIndex="-1"
          style={{ 
            flex: 1,
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 24px 64px',
            width: '100%'
          }}
        >
          {/* Conditional rendering: FileUploader OR Dashboard + Report sections */}
          {!report ? (
            // Upload state - show file uploader
            <FileUploader 
              onUpload={handleFileUpload}
              loading={loading}
              uploadProgress={uploadProgress}
            />
          ) : (
            // Report state - show dashboard and analysis
            <Suspense fallback={<LoadingFallback />}>
              <div style={{ marginTop: '32px' }}>
                {/* New upload button */}
                <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                  <button
                    onClick={handleNewUpload}
                    className="btn-animated hover-lift"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      transition: 'all var(--transition-base)',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary-hover)';
                      e.target.style.transform = 'translateY(-3px) translateZ(0)';
                      e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary)';
                      e.target.style.transform = 'translateY(0) translateZ(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                    }}
                    aria-label="Upload a new log file for analysis"
                  >
                    <span style={{ fontSize: '1.2em' }}>📤</span>
                    Upload New File
                  </button>
                </div>

                {/* Dashboard with UX score gauge */}
                <Dashboard report={report} />

                {/* Recommendations panel */}
                {report.recommendations && report.recommendations.length > 0 && (
                  <div style={{ marginTop: '32px' }}>
                    <Recommendations 
                      recommendations={report.recommendations}
                      markdown={markdown}
                    />
                  </div>
                )}

                {/* Web3 on-chain proof section */}
                <div style={{ marginTop: '32px' }}>
                  <OnChainProof 
                    report={report}
                    reportId={report.id || `autoux-${Date.now()}`}
                    onWalletConnect={setConnectedAddress}
                  />
                </div>

                {/* On-chain history */}
                {connectedAddress && (
                  <div style={{ marginTop: '24px' }}>
                    <OnChainHistory userAddress={connectedAddress} />
                  </div>
                )}

                {/* QR Code sharing */}
                <div style={{ marginTop: '24px' }}>
                  <QRCodeShare 
                    report={report}
                    verificationUrl={window.location.href}
                  />
                </div>

                {/* Report viewer with issues list */}
                <div style={{ marginTop: '32px' }}>
                  <ReportViewer report={report} markdown={markdown} />
                </div>
              </div>
            </Suspense>
          )}

          {/* Error display */}
          {error && (
            <div
              role="alert"
              style={{
                padding: '20px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                color: '#991b1b',
                marginTop: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}
        </main>

        {/* Footer with technologies, features, GitHub link, hackathon badge, Web3 info */}
        <Footer />

        {/* Toast notifications */}
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        {/* Modal dialogs for critical errors */}
        {modal && (
          <Modal
            isOpen={!!modal}
            onClose={() => setModal(null)}
            title={modal.title}
            message={modal.message}
            type={modal.type}
            actions={modal.actions}
          />
        )}

        {/* Mobile upload button - sticky at bottom on mobile */}
        <MobileUploadButton 
          onUpload={handleFileUpload}
          visible={!report}
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
}       

/**
 * Loading fallback component for Suspense
 */
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '64px 24px',
        minHeight: '400px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Loading...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;

// Global responsive styles
const globalStyles = `
  /* Responsive design for mobile devices */
  @media (max-width: 768px) {
    main {
      padding: 0 16px 48px !important;
    }
    
    /* Full-width upload cards on mobile */
    .upload-card {
      width: 90vw !important;
      max-width: 100% !important;
    }
    
    /* Stack dashboard cards vertically */
    .dashboard-grid {
      grid-template-columns: 1fr !important;
    }
    
    /* Adjust font sizes for mobile */
    h1 {
      font-size: 1.75rem !important;
    }
    
    h2 {
      font-size: 1.25rem !important;
    }
    
    /* Touch-friendly tap targets (min 44x44px) */
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  }
  
  @media (max-width: 480px) {
    main {
      padding: 0 12px 32px !important;
    }
    
    h1 {
      font-size: 1.5rem !important;
    }
  }
  
  /* Smooth transitions */
  * {
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

