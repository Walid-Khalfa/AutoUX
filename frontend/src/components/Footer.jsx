// KIRO-AI: Footer attractif avec logo et branding
// Design moderne avec gradient et informations sur le projet
function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Web3 configuration
  const registryAddress = import.meta.env.VITE_REGISTRY_ADDRESS;
  const etherscanUrl = import.meta.env.VITE_ETHERSCAN_URL || 'https://sepolia.etherscan.io';
  const chainName = import.meta.env.VITE_CHAIN_NAME || 'Sepolia';

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #0073bb 0%, #6b4eff 100%)',
        color: 'white',
        marginTop: '80px',
        padding: '48px 24px 24px',
        borderTop: '4px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* KIRO-AI: Section principale avec logo et description */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
            marginBottom: '40px',
          }}
        >
          {/* Colonne 1: Logo et description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/Autoux.jpg"
                alt="AutoUX Logo"
                style={{ height: '48px' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>AutoUX</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>AI-Powered UX Analysis</p>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9 }}>
              Automatic log analysis to identify user experience issues using advanced AI technology.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                title="Powered by Google Gemini 2.5 Flash - Advanced AI for intelligent UX analysis"
                className="ai-pulse"
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'help',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🤖 Gemini 2.5 Flash
              </span>
              <span
                title="Google AI - Fast and reliable multimodal AI model"
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'help',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ⚡ Google AI
              </span>
            </div>
          </div>

          {/* Colonne 2: Technologies */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600' }}>Technologies</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2' }}>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }} 
                title="Built with React 18 + Vite for blazing fast development and HMR"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                ⚛️ React 18 + Vite
              </li>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }} 
                title="Express.js backend for robust API and log analysis"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🚀 Express.js Backend
              </li>
              <li 
                className="ai-pulse"
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }} 
                title="AI-powered analysis using Google Gemini 2.5 Flash"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🧠 AI Analysis (Gemini)
              </li>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }} 
                title="Real-time visual analytics dashboard with animated gauges"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📊 Real-time Dashboard
              </li>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }} 
                title="WCAG 2.2 Level AA compliant for accessibility"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                ♿ WCAG AA Compliant
              </li>
            </ul>
          </div>

          {/* Colonne 3: Features */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2' }}>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }}
                title="Support for JSON, NDJSON, CSV, XML, HTML, HAR, TXT, and LOG formats"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📁 Multi-format Upload
              </li>
              <li 
                className="ai-pulse"
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }}
                title="AI-powered detection of latency, accessibility, contrast, and JS errors"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🔍 Smart Issue Detection
              </li>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }}
                title="Interactive dashboard with UX score gauge and category breakdown"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📈 Visual Analytics
              </li>
              <li 
                className="ai-pulse"
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }}
                title="Prioritized recommendations with WCAG and Web Vitals references"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                💡 AI Recommendations
              </li>
              <li 
                style={{ 
                  opacity: 0.9, 
                  transition: 'all 0.2s ease',
                  cursor: 'help',
                  padding: '4px 0'
                }}
                title="Export analysis reports in JSON and Markdown formats"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📥 Export Reports
              </li>
            </ul>
          </div>

          {/* Colonne 4: About & Web3 */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600' }}>About</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>
              Built with ❤️ for the AWS Hackathon with Kiro AI
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseOver={(e) => (e.target.style.opacity = '1')}
                onMouseOut={(e) => (e.target.style.opacity = '0.9')}
              >
                🔗 GitHub Repository
              </a>
              <a
                href="https://ai.google.dev/gemini-api"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseOver={(e) => (e.target.style.opacity = '1')}
                onMouseOut={(e) => (e.target.style.opacity = '0.9')}
              >
                🤖 Powered by Google Gemini
              </a>
            </div>
            
            {/* KIRO-AI: Web3 Section */}
            {registryAddress && (
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '6px' }}>
                  🔗 Web3 Enabled
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.5', marginBottom: '8px' }}>
                  On-chain proof via AutoUXRegistry ({chainName} testnet)
                </div>
                <a
                  href={`${etherscanUrl}/address/${registryAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontSize: '0.75rem',
                    opacity: 0.9,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = '1')}
                  onMouseOut={(e) => (e.target.style.opacity = '0.9')}
                >
                  View Contract on Etherscan →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* KIRO-AI: Séparateur */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '32px 0',
          }}
        />

        {/* KIRO-AI: Copyright et crédits */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          <div>
            © {currentYear} AutoUX. All rights reserved. | Made with 🚀 and ☕
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span title="Runs entirely on your machine">Local • React + Express</span>
            <span>•</span>
            <span title="Your data never leaves your computer">Privacy First</span>
            <span>•</span>
            <span title="Built for AWS Hackathon with Kiro AI">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
