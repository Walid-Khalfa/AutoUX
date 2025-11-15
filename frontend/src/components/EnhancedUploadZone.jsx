import { useState, useRef } from 'react';

// KIRO-AI: Enhanced upload zone with improved hover states and micro-interactions
// Features: animated icon float, smooth border transitions, progress indication
// Implements dashed → solid blue + glow on hover/drag

function EnhancedUploadZone({ onReport, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // KIRO-AI: Supported file formats
  const SUPPORTED_FORMATS = [
    '.json', '.ndjson', '.jsonl', '.log', '.csv',
    '.xml', '.html', '.htm', '.har', '.txt'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    // Starting upload of files
    setSelectedFiles(files);
    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // KIRO-AI: Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { uploadLogs } = await import('../services/api.js');
      const report = await uploadLogs(files);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onReport(report);
        setSelectedFiles([]);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
    } catch (error) {
      console.error('[KIRO-AI UploadZone] Upload failed:', error);
      onError(error.message);
      setSelectedFiles([]);
      setUploadProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      style={{
        padding: '48px 40px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: isDragging ? '3px solid #2563eb' : '2px dashed #d1d5db',
        marginBottom: '32px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDragging
          ? '0 0 0 4px rgba(37, 99, 235, 0.1), 0 8px 24px rgba(37, 99, 235, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isAnalyzing && fileInputRef.current?.click()}
    >
      {/* KIRO-AI: Background gradient on drag */}
      {isDragging && (
        <div
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

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* KIRO-AI: Animated upload icon with float effect */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '20px',
            color: isDragging ? '#2563eb' : isAnalyzing ? '#8b5cf6' : '#6b7280',
            transition: 'all 0.3s ease',
            animation: isDragging || isAnalyzing ? 'iconFloat 2s ease-in-out infinite' : 'none',
            display: 'inline-block',
          }}
        >
          {isAnalyzing ? '🧠' : isDragging ? '⚡' : '📁'}
        </div>

        {/* KIRO-AI: Title and description */}
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.5rem',
            color: '#111827',
            fontWeight: '700',
          }}
        >
          {isAnalyzing ? 'Analyzing with AI...' : isDragging ? 'Drop to analyze ⚡' : 'Upload Logs'}
        </h3>

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
          {isAnalyzing
            ? `Analyzing ${selectedFiles.length} file(s) with Gemini Flash...`
            : 'Drop your application logs here — AutoUX will analyze them using advanced AI.'
          }
        </p>

        {/* KIRO-AI: Progress bar during upload */}
        {isAnalyzing && (
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              margin: '0 auto 24px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}

        {/* KIRO-AI: Upload button */}
        {!isAnalyzing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={SUPPORTED_FORMATS.join(',')}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-upload-enhanced"
            />
            <button
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                e.target.style.borderColor = '#1d4ed8';
                const icon = e.target.querySelector('.upload-icon');
                if (icon) icon.style.transform = 'rotate(15deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                e.target.style.borderColor = 'transparent';
                const icon = e.target.querySelector('.upload-icon');
                if (icon) icon.style.transform = 'rotate(0deg)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <span className="upload-icon" style={{ fontSize: '1.2em', transition: 'transform 0.3s ease' }}>📤</span>
              Select Files
            </button>
          </>
        )}

        {/* KIRO-AI: Supported formats with file type icons */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: '📄', label: 'CSV' },
            { icon: '📋', label: 'JSON' },
            { icon: '📊', label: 'XML' },
            { icon: '🌐', label: 'HTML' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: '1.2em' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* KIRO-AI: Helper text */}
        <p
          style={{
            marginTop: '20px',
            fontSize: '0.875rem',
            color: '#9ca3af',
            fontStyle: 'italic',
          }}
        >
          Start by uploading logs ↑
        </p>
      </div>

      {/* KIRO-AI: Animations */}
      <style>{`
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}

export default EnhancedUploadZone;
