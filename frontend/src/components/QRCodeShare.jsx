import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * QRCodeShare Component
 * Generates QR code for sharing UX proof with score, hash, and verification URL
 * Includes download functionality and social share buttons
 */
export default function QRCodeShare({ report, hash, verificationUrl }) {
  const [showQR, setShowQR] = useState(false);

  if (!report) {
    return null;
  }

  // Construct the verification data
  const qrData = JSON.stringify({
    reportId: report.id,
    uxScore: report.uxScore,
    hash: hash || 'not-anchored',
    verificationUrl: verificationUrl || window.location.href,
    timestamp: report.timestamp,
  });

  // Generate shareable text
  const shareText = `🏅 AutoUX Report - UX Score: ${report.uxScore}/100\n🔐 Verified on-chain\n📊 ${report.metadata?.totalIssues || 0} issues detected\n\nView verification: ${verificationUrl || window.location.href}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Download as PNG
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `autoux-qr-${report.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl || window.location.href)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('✅ Verification details copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Verification details copied to clipboard!');
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('AutoUX Report - UX Analysis Results');
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">📱 Share UX Proof</h2>
          <p className="text-sm text-gray-600">
            Share your verified UX analysis results
          </p>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          aria-label={showQR ? 'Hide QR code' : 'Show QR code'}
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
      </div>

      {showQR && (
        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-md">
            <div className="mb-4">
              <QRCodeSVG
                id="qr-code-svg"
                value={qrData}
                size={256}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Scan to view verification details
            </p>
            <button
              onClick={downloadQRCode}
              className="w-full max-w-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              aria-label="Download QR code"
            >
              <span>💾</span>
              Download QR Code
            </button>
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-800 mb-4">Share on Social Media</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Twitter */}
              <button
                onClick={shareOnTwitter}
                className="px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareOnLinkedIn}
                className="px-4 py-3 bg-[#0077B5] hover:bg-[#006399] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>

              {/* Copy to Clipboard */}
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                aria-label="Copy to clipboard"
              >
                <span>📋</span>
                Copy Link
              </button>

              {/* Email */}
              <button
                onClick={shareViaEmail}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                aria-label="Share via email"
              >
                <span>✉️</span>
                Email
              </button>
            </div>
          </div>

          {/* Verification Details */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-800 mb-3">Verification Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Report ID:</span>
                <span className="font-mono text-gray-800">{report.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UX Score:</span>
                <span className="font-bold text-indigo-600">{report.uxScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Issues:</span>
                <span className="text-gray-800">{report.metadata?.totalIssues || 0}</span>
              </div>
              {hash && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Hash:</span>
                  <span className="font-mono text-xs text-gray-800 break-all max-w-[200px] text-right">
                    {hash.substring(0, 10)}...{hash.substring(hash.length - 8)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Timestamp:</span>
                <span className="text-gray-800 text-right">
                  {new Date(report.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">🔒 Privacy Note:</span> The QR code contains your report ID, UX score, and verification URL. 
              Only the hash is stored on-chain - your actual logs remain private.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
