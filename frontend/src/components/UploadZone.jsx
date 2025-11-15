import { useState, useRef } from 'react';

// KIRO-AI: Multi-format log file upload component
// Supports drag & drop and manual selection
// Displays analysis state and handles errors

function UploadZone({ onReport, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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

    console.log('[KIRO-AI UploadZone] Starting upload of', files.length, 'file(s)');
    console.log('[KIRO-AI UploadZone] Files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    setSelectedFiles(files);
    setIsAnalyzing(true);

    try {
      // KIRO-AI: Import dynamique pour éviter les dépendances circulaires
      const { uploadLogs } = await import('../services/api.js');
      console.log('[KIRO-AI UploadZone] Calling uploadLogs...');
      
      const report = await uploadLogs(files);
      console.log('[KIRO-AI UploadZone] Upload successful, report received:', report);
      
      onReport(report);
      setSelectedFiles([]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('[KIRO-AI UploadZone] Upload failed:', error);
      onError(error.message);
      setSelectedFiles([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '2px dashed ' + (isDragging ? '#0073bb' : '#ddd'),
        marginBottom: '24px',
        transition: 'all 0.3s ease',
        boxShadow: isDragging ? '0 4px 12px rgba(0, 115, 187, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ textAlign: 'center' }}>
        {/* KIRO-AI: Icône d'upload */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: isDragging ? '#0073bb' : '#666',
            transition: 'color 0.3s ease',
          }}
        >
          📁
        </div>

        {/* KIRO-AI: Titre et description */}
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.3em',
            color: '#333',
            fontWeight: 'bold',
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Upload Logs'}
        </h3>
        
        <p
          style={{
            margin: '0 0 20px 0',
            color: '#666',
            fontSize: '0.95em',
          }}
        >
          {isAnalyzing 
            ? `Analyzing ${selectedFiles.length} file(s) with Gemini Flash...`
            : 'Drag & drop your files or click to select'
          }
        </p>

        {/* KIRO-AI: Bouton de sélection */}
        {!isAnalyzing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={SUPPORTED_FORMATS.join(',')}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#0073bb',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                border: 'none',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#005a94';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 115, 187, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0073bb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Select Files
            </label>
          </>
        )}

        {/* KIRO-AI: Loader during analysis */}
        {isAnalyzing && (
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0073bb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}

        {/* KIRO-AI: Formats supportés */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            fontSize: '0.85em',
            color: '#666',
          }}
        >
          <strong>Supported formats:</strong> JSON, NDJSON, CSV, XML, HTML, HAR, TXT, LOG
        </div>
      </div>

      {/* KIRO-AI: Animation CSS pour le loader */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default UploadZone;
