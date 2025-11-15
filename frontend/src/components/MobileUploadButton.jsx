import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MobileUploadButton Component
 * 
 * Sticky button at bottom of screen for mobile devices
 * Provides easy access to upload functionality on small screens
 * 
 * Features:
 * - Fixed position at bottom center
 * - Touch-friendly size (min 56px height)
 * - Animated entrance/exit
 * - File format validation
 * - Only visible on mobile (< 768px)
 * 
 * Requirements: 6.4, 6.5
 */
function MobileUploadButton({ onUpload, visible = true, loading = false }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onUpload) {
      await onUpload(files[0]); // Upload first file
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.ndjson,.jsonl,.log,.csv,.xml,.html,.htm,.har,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="mobile-file-upload"
        disabled={loading}
        aria-label="Select log file to upload"
      />
      
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            disabled={loading}
            aria-label={loading ? 'Uploading...' : 'Upload log file'}
            className="mobile-upload-button"
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 32px',
              minHeight: '56px',
              background: loading 
                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.3s ease',
              zIndex: 999,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <motion.span
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              style={{ fontSize: '1.3em' }}
            >
              {loading ? '⏳' : '📤'}
            </motion.span>
            <span>{loading ? 'Uploading...' : 'Upload Logs'}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile-only styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-upload-button {
            display: flex !important;
          }
        }
        
        /* Touch-friendly tap target */
        @media (hover: none) and (pointer: coarse) {
          .mobile-upload-button {
            min-height: 56px !important;
            min-width: 56px !important;
          }
        }
      `}</style>
    </>
  );
}

export default MobileUploadButton;
