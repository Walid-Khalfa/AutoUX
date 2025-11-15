import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FileUploader Component
 * 
 * Modern file upload component with drag-and-drop, animations, and validation
 * Features:
 * - Drag-and-drop zone with hover animations (dashed → solid blue + glow)
 * - Click-to-browse file picker
 * - File size validation (max 10MB) with user feedback
 * - Upload progress bar with percentage
 * - Debounced upload (300ms) to prevent multiple simultaneous uploads
 * - Modern empty state with 3D-style illustration
 * - Responsive: full-width (90vw) on mobile
 * 
 * @param {Function} onUpload - Callback function when file is uploaded (file: File) => Promise<void>
 * @param {Function} onError - Callback function when error occurs (error: string) => void
 * @param {boolean} loading - Loading state from parent
 * @param {number} uploadProgress - Upload progress from parent (0-100)
 */
function FileUploader({ onUpload, onError, loading = false, uploadProgress: externalProgress = 0 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Use external progress if provided, otherwise use internal state
  const uploadProgress = externalProgress;

  // Supported file formats
  const SUPPORTED_FORMATS = [
    { ext: '.json', label: 'JSON', icon: '📋' },
    { ext: '.ndjson', label: 'NDJSON', icon: '📋' },
    { ext: '.jsonl', label: 'JSONL', icon: '📋' },
    { ext: '.csv', label: 'CSV', icon: '📄' },
    { ext: '.xml', label: 'XML', icon: '📊' },
    { ext: '.html', label: 'HTML', icon: '🌐' },
    { ext: '.htm', label: 'HTM', icon: '🌐' },
    { ext: '.har', label: 'HAR', icon: '🔍' },
    { ext: '.txt', label: 'TXT', icon: '📝' },
    { ext: '.log', label: 'LOG', icon: '📝' },
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  /**
   * Validate file size and format
   * @param {File} file - File to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setValidationError(`File "${file.name}" is too large (${sizeMB}MB). Maximum size is 10MB.`);
      return false;
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const isValidFormat = SUPPORTED_FORMATS.some(format => fileName.endsWith(format.ext));
    
    if (!isValidFormat) {
      setValidationError(`File "${file.name}" has an unsupported format. Please upload JSON, NDJSON, CSV, XML, HTML, HAR, TXT, or LOG files.`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  /**
   * Handle file upload with debouncing
   * @param {File} file - File to upload
   */
  const handleFileUpload = useCallback(async (file) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce upload by 300ms
    debounceTimerRef.current = setTimeout(async () => {
      if (!validateFile(file)) {
        if (onError) {
          onError(validationError);
        }
        return;
      }

      try {
        // Call parent upload handler (parent manages progress)
        await onUpload(file);

        // Reset file input after successful upload
        setTimeout(() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 500);
      } catch (error) {
        if (onError) {
          onError(error.message || 'Upload failed. Please try again.');
        }
      }
    }, 300); // 300ms debounce
  }, [onUpload, onError, validationError]);

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]); // Upload first file only
    }
  };

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]); // Upload first file only
    }
  };

  /**
   * Handle click on drop zone
   */
  const handleClick = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isUploading = loading || uploadProgress > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="file-uploader-container"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto 32px',
      }}
    >
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        animate={{
          borderColor: isDragging ? '#2563eb' : '#d1d5db',
          borderWidth: isDragging ? '3px' : '2px',
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          padding: '48px 40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          borderStyle: 'dashed',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isDragging
            ? '0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 24px rgba(37, 99, 235, 0.2)'
            : '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Background gradient on drag */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Animated Icon */}
          <motion.div
            animate={{
              y: isDragging || isUploading ? [-8, 0, -8] : 0,
              rotate: isDragging ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              fontSize: '64px',
              marginBottom: '20px',
              color: isDragging ? '#2563eb' : isUploading ? '#8b5cf6' : '#6b7280',
              display: 'inline-block',
            }}
          >
            {isUploading ? '🧠' : isDragging ? '⚡' : '📁'}
          </motion.div>

          {/* Title */}
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '1.5rem',
              color: '#111827',
              fontWeight: '700',
            }}
          >
            {isUploading ? 'Analyzing with AI...' : isDragging ? 'Drop to analyze ⚡' : 'Upload Logs'}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: '0 0 24px 0',
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.6',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {isUploading
              ? 'Analyzing your logs with Gemini Flash AI...'
              : 'Drag & drop your log file here or click to browse'
            }
          </p>

          {/* Progress Bar */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto 24px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <p
                  style={{
                    marginTop: '8px',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  {uploadProgress}% complete
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Button */}
          {!isUploading && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '1.2em' }}>📤</span>
              Select Files
            </motion.button>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_FORMATS.map(f => f.ext).join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={isUploading}
          />

          {/* Supported Formats Badge */}
          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {SUPPORTED_FORMATS.slice(0, 8).map(({ label, icon }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: '1em' }}>{icon}</span>
                {label}
              </motion.div>
            ))}
          </div>

          {/* Helper Text */}
          <p
            style={{
              marginTop: '20px',
              fontSize: '0.875rem',
              color: '#9ca3af',
              fontStyle: 'italic',
            }}
          >
            Maximum file size: 10MB
          </p>
        </div>
      </motion.div>

      {/* Validation Error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '1.2em' }}>⚠️</span>
            {validationError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .file-uploader-container {
            width: 90vw !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default FileUploader;
