# Implementation Plan - AutoUX (Web3 + AI Upgrade)

- [x] 1. Project Cleanup and Refactoring





  - Remove all mock data files (demo_fix.json, sample logs, sample issues, sample fixspecs)
  - Translate all French text to English throughout the codebase
  - Clean and reorganize folder structure (backend, frontend, web3 workspaces)
  - Update package.json root with workspaces configuration for backend, frontend, and web3
  - Ensure consistent code formatting and naming conventions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 2. Backend: Multi-Format File Parser




  - Create backend/src/services/fileParser.js with format detection and parsing
  - Implement detectFormat(buffer, filename) to identify file type from content and extension
  - Implement parseJSON() for standard JSON arrays
  - Implement parseNDJSON() for newline-delimited JSON
  - Implement parseCSV() with header detection
  - Implement parseXML() for XML log structures
  - Implement parseHTML() to extract log data from HTML tables
  - Implement parseHAR() for HTTP Archive format
  - Implement parsePlainText() for unstructured text logs
  - Add comprehensive error handling for each parser
  - _Requirements: 1.1, 1.2_

- [x] 3. Backend: OpenRouter LLM Integration





  - Create backend/src/config/openrouter.js with API configuration
  - Set OpenRouter API key: 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
  - Set model: kwaipilot/kat-coder-pro:free
  - Create backend/src/services/llmAnalyzer.js with OpenAI client setup
  - Implement buildPrompt() to construct analysis prompt with UX detection instructions
  - Implement analyzeWithLLM() to send logs to OpenRouter and receive structured JSON response
  - Implement parseResponse() to validate and structure LLM output
  - Add timeout handling (60s) and retry logic for API failures
  - Include WCAG 2.2 and Web Vitals references in prompt instructions
  - _Requirements: 1.3, 1.4, 1.5, 3.1, 3.2, 3.3_

- [x] 4. Backend: Report Generator and API Routes







  - Create backend/src/services/reportGenerator.js for report formatting
  - Implement generateReport() to add metadata (ID, timestamp, version)
  - Implement generateMarkdown() to convert AI report to Markdown format
  - Create backend/src/routes/analyze.js with POST /api/analyze endpoint
  - Configure multer for multipart file upload (max 10MB)
  - Implement file validation (size, MIME type)
  - Wire up flow: upload → parse → LLM analyze → generate report → return JSON + Markdown
  - Add structured error responses with user-friendly messages
  - Update backend/src/server.js to mount analyze routes
  - _Requirements: 1.5, 3.4, 3.5_


- [x] 5. Backend: Schema Validation and Error Handling




  - Update backend/src/schemas/index.js with AIReportSchema, IssueSchema, RecommendationSchema
  - Implement Zod validation for all API inputs and outputs
  - Create global error middleware in server.js
  - Define error codes: FILE_TOO_LARGE, UNSUPPORTED_FORMAT, PARSE_ERROR, LLM_API_ERROR, LLM_TIMEOUT, RATE_LIMIT_EXCEEDED
  - Implement rate limiting middleware (10 requests/minute per IP)
  - Add security headers: X-Content-Type-Options, X-Frame-Options, CSP
  - Configure CORS for http://localhost:5173 origin
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Web3: Smart Contract Development





  - Create web3/ directory with Hardhat initialization
  - Install dependencies: hardhat, @nomicfoundation/hardhat-toolbox, ethers
  - Create web3/hardhat.config.js with Sepolia network configuration
  - Create web3/.env with PRIVATE_KEY and ALCHEMY_SEPOLIA_RPC
  - Create web3/contracts/AutoUXRegistry.sol with storeHash, verifyHash, getRecord functions
  - Create web3/scripts/deploy.js for contract deployment
  - Compile contract: npx hardhat compile
  - Deploy to Sepolia testnet and save contract address
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 7. Web3: NFT Badge Contract (Optional Feature)





  - Create web3/contracts/UXBadgeNFT.sol as ERC-721 contract
  - Implement mint() function with metadata (score, hash, timestamp)
  - Implement tokenURI() to return IPFS metadata URL
  - Add access control (only report owner can mint)
  - Deploy NFT contract to Sepolia
  - _Requirements: 5.2_

- [x] 8. Frontend: Project Setup and Configuration




  - Update frontend/package.json with dependencies: react, react-dom, vite, ethers, framer-motion
  - Create frontend/.env with all required environment variables
  - Configure Vite with React plugin and environment variable handling
  - Set up Tailwind CSS or styled-components for styling
  - _Requirements: 6.1, 6.2_

- [x] 9. Frontend: Web3 Utilities





  - Create frontend/src/web3/hashUtils.js with sha256HexFromObject and assertBytes32 functions
  - Extract contract ABI from compiled artifacts
  - Create frontend/src/web3/abiAutoUXRegistry.json with contract ABI
  - Create frontend/src/web3/abiNFTBadge.json with NFT contract ABI (if implementing NFT feature)
  - Create frontend/src/web3/ipfs.js with IPFS upload utilities (optional)
  - _Requirements: 4.2, 5.2_

- [x] 10. Frontend: API Service





  - Create frontend/src/services/api.js with analyzeLog(file) function
  - Implement retry logic with exponential backoff (max 2 retries)
  - Implement timeout handling (60s)
  - Add error parsing and user-friendly error messages
  - Implement sessionStorage caching for AI reports
  - Add request/response interceptors for logging
  - _Requirements: 6.3_

- [x] 11. Frontend: FileUploader Component





  - Create frontend/src/components/FileUploader.jsx
  - Implement drag-and-drop zone with hover animations
  - Add click-to-browse file picker
  - Display supported formats badge
  - Implement file size validation (max 10MB) with user feedback
  - Add upload progress bar with percentage
  - Implement debounced upload (300ms)
  - Create modern empty state with 3D-style illustration
  - Make responsive: full-width (90vw) on mobile
  - _Requirements: 2.1, 2.2, 6.4_

- [x] 12. Frontend: Dashboard Component with UX Score Gauge





  - Create frontend/src/components/Dashboard.jsx
  - Implement animated circular UX Score gauge (0-100) using SVG or Canvas
  - Add color grading with emojis (90-100 green, 70-89 amber, <70 red)
  - Use Framer Motion for gauge animation (1.5s ease-out)
  - Display summary cards: total issues, breakdown by severity
  - Show category distribution with icons
  - Add AI personality message
  - Create shareable badge with share button
  - Implement quick filters: severity, type, timestamp
  - Add compact mode toggle for dense vs card view
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 13. Frontend: Recommendations Component




  - Create frontend/src/components/Recommendations.jsx
  - Display "AutoUX Recommends" header with AI icon
  - Show prioritized list with visual hierarchy
  - Display title, description, "why this matters" explanation
  - Add WCAG 2.2 references as clickable links
  - Add Web Vitals references as clickable links
  - Implement tab switcher: Markdown view / JSON view
  - Add collapsible sections for each recommendation
  - Include copy button for code examples
  - Ensure keyboard navigation support
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 14. Frontend: OnChainProof Component

  - Create frontend/src/components/OnChainProof.jsx
  - Design purple gradient background card with "Privacy-first" message
  - Implement Connect Wallet button with MetaMask detection
  - Display connected address in abbreviated format
  - Create "Anchor Hash" button with SHA-256 computation and contract call
  - Create "Verify" button with hash verification
  - Implement status badges (Connected, Anchoring, Verified, Not anchored, Failed)
  - Add toast notifications for all Web3 actions
  - Implement loading states for pending transactions
  - Add retry logic for failed transactions
  - Include "View on Etherscan" link with tooltip
  - Display privacy note about on-chain hash storage
  - Handle errors: no MetaMask, rejected TX, insufficient gas, network errors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 15. Frontend: OnChainHistory Component





  - Create frontend/src/components/OnChainHistory.jsx
  - Add section title: "Your On-Chain Anchors"
  - Implement event fetching from Sepolia using ethers.js
  - Display table/cards with Report ID, UX Score, Hash, Date/Time, TX link
  - Add empty state message
  - Implement pagination if > 10 records
  - Add refresh button to fetch latest events
  - _Requirements: 5.1_

- [ ] 16. Frontend: NFTMinter Component (Optional)




  - Create frontend/src/components/NFTMinter.jsx
  - Add "Mint UX Badge NFT" button
  - Implement NFT minting flow with IPFS metadata upload
  - Display NFT token ID and OpenSea testnet link
  - Show minting status and loading states
  - Handle errors gracefully
  - _Requirements: 5.2_

- [x] 17. Frontend: QRCodeShare Component (Optional)






  - Create frontend/src/components/QRCodeShare.jsx
  - Add "Share UX Proof" section
  - Generate QR code containing score, hash, and verification URL
  - Use qrcode.react or similar library
  - Add download QR code button
  - Include social share buttons
  - _Requirements: 5.3_

- [x] 18. Frontend: ReportViewer Component





  - Create frontend/src/components/ReportViewer.jsx
  - Display issues list grouped by category
  - Show severity badges with colors and aria-labels
  - Implement filtering by category, severity, type
  - Add search functionality for issue descriptions
  - Display issue details in expandable cards
  - Include metadata display
  - Ensure keyboard navigation and accessibility
  - _Requirements: 2.3, 2.4_

- [x] 19. Frontend: App Component and Layout




  - Update frontend/src/App.jsx as root component
  - Implement state management for report, loading, error, uploadProgress
  - Create animated gradient header with "AI-Powered" pulse indicator
  - Conditionally render FileUploader or Dashboard + Report sections
  - Implement sessionStorage caching for reports
  - Add React Suspense and lazy loading for code splitting
  - Create footer with technologies, features, GitHub link, hackathon badge, Web3 info
  - Ensure responsive design for mobile devices
  - _Requirements: 2.1, 2.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 20. Frontend: Error Handling and Accessibility







  - Create frontend/src/components/ErrorBoundary.jsx for React error catching
  - Implement toast notification system for transient errors
  - Add modal dialogs for critical errors
  - Ensure all interactive elements have aria-labels
  - Verify keyboard navigation for all components
  - Test color contrast (AA standard minimum)
  - Add focus indicators for all focusable elements
  - Implement skip-to-content link
  - Test with screen reader
  - _Requirements: 6.5, 8.4_

- [ ] 21. UI/UX Polish and Animations









  - Add animated gradient to header (10s diagonal shimmer)
  - Implement pulse animation on "AI-Powered" indicator
  - Add hover animations on upload button
  - Implement fade transitions between states
  - Add toast notification for successful analysis
  - Add pulse animation on AI model mention
  - Implement semantic color system (primary, accent, success, error)
  - Add tooltips on footer badges
  - Ensure smooth animations (60fps) using CSS transforms and Framer Motion
  - _Requirements: 2.2, 2.5_

- [ ] 22. Mobile Responsiveness







  - Ensure upload card is full-width (90vw) on mobile
  - Implement collapsible/swipeable footer tabs on mobile
  - Add sticky "Upload" button at bottom on mobile
  - Test on various screen sizes (320px, 375px, 768px, 1024px, 1440px)
  - Ensure touch-friendly tap targets (min 44x44px)
  - Optimize font sizes for mobile readability
  - Test landscape orientation
  - _Requirements: 6.4, 6.5_

- [ ] 23. Documentation and README






  - Update README.md with complete project overview
  - Add installation instructions
  - Document how to start development server
  - Explain environment variable configuration
  - Add Web3 setup instructions (MetaMask, Sepolia testnet, faucet)
  - Document smart contract deployment process
  - Add API documentation for POST /api/analyze endpoint
  - Include screenshots of key features
  - Add troubleshooting section
  - Document supported log formats with examples
  - Add "Built for AWS Hackathon with Kiro AI" section
  - _Requirements: 7.5_

- [ ] 24. Testing and Quality Assurance







  - Write backend unit tests for fileParser (all formats)
  - Write backend unit tests for llmAnalyzer (mock OpenRouter API)
  - Write backend unit tests for reportGenerator
  - Write backend integration tests for POST /api/analyze flow
  - Write frontend component tests for Dashboard, FileUploader, OnChainProof
  - Write frontend tests for Web3 utilities
  - Write smart contract tests for AutoUXRegistry
  - Run accessibility tests with axe-core
  - Test keyboard navigation throughout the app
  - Test with screen reader
  - Perform manual E2E testing (upload, analyze, connect wallet, anchor, verify, history)
  - Test error scenarios (invalid file, LLM timeout, rejected TX)
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on mobile devices (iOS, Android)
  - _Requirements: All requirements validation_

- [x] 25. Final Cleanup and Deployment Preparation






  - Remove all console.log statements (replace with proper logging)
  - Ensure no hardcoded values (use environment variables)
  - Verify all API keys are in .env files (not committed)
  - Add .env.example files with placeholder values
  - Run linter and fix all warnings
  - Optimize bundle size
  - Add production build scripts
  - Test production build locally
  - Prepare deployment documentation
  - Create demo video or GIF for README
  - Prepare hackathon presentation materials
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
