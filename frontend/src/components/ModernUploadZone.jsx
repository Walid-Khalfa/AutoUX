// KIRO-AI: Zone d'upload moderne avec drag & drop et animations
import { useState, useRef } from 'react';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';

function ModernUploadZone({ onReport, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      onReport(result);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const supportedFormats = ['JSON', 'NDJSON', 'CSV', 'XML', 'HTML', 'HAR', 'TXT', 'LOG'];

  return (
    <Card 
      size="xl" 
      className="fade-in"
      style={{
        marginBottom: 'var(--space-8)',
        border: isDragging ? '2px solid var(--color-primary)' : '2px dashed var(--color-border)',
        backgroundColor: isDragging ? 'var(--color-gray-50)' : 'var(--color-surface-elevated)',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Effet de fond animé */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDragging ? 
          'radial-gradient(circle at center, rgba(0,115,187,0.1) 0%, transparent 70%)' :
          'transparent',
        transition: 'all var(--transition-normal)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {!isUploading ? (
          <>
            {/* Icône principale */}
            <div style={{
              fontSize: '4em',
              marginBottom: 'var(--space-4)',
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform var(--transition-fast)'
            }}>
              {isDragging ? '📤' : '📁'}
            </div>

            {/* Titre et description */}
            <h3 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-2)'
            }}>
              {isDragging ? 'Drop files here' : 'Upload Log Files'}
            </h3>

            <p style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-gray-600)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--line-height-relaxed)'
            }}>
              {isDragging ? 
                'Release to start AI analysis' : 
                'Drag & drop your log files or click to browse'
              }
            </p>

            {/* Boutons d'action */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="primary"
                size="lg"
                icon="📁"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon="🧠"
              >
                AI Analysis Ready
              </Button>
            </div>

            {/* Formats supportés */}
            <div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-gray-600)',
                marginBottom: 'var(--space-3)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Supported formats:
              </div>
              
              <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {supportedFormats.map(format => (
                  <Badge key={format} variant="default" size="sm">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* État de chargement */
          <div className="scale-in">
            <div style={{
              fontSize: '3em',
              marginBottom: 'var(--space-4)',
              animation: 'bounce 1s ease-in-out infinite'
            }}>
              🚀
            </div>

            <h3 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-4)'
            }}>
              Analyzing with Gemini Flash...
            </h3>

            {/* Barre de progression */}
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '8px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: 'var(--border-radius-full)',
              margin: '0 auto var(--space-4)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                borderRadius: 'var(--border-radius-full)',
                transition: 'width var(--transition-fast)'
              }} />
            </div>

            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-gray-600)'
            }}>
              {uploadProgress}% complete
            </p>
          </div>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".json,.ndjson,.csv,.xml,.html,.har,.txt,.log"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Card>
  );
}

export default ModernUploadZone;