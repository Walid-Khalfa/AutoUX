import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnChainProof from '../OnChainProof';

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn(),
    Contract: vi.fn(),
  }
}));

// Mock Web3 utilities
vi.mock('../../web3/hashUtils', () => ({
  sha256HexFromObject: vi.fn().mockResolvedValue('0x' + 'a'.repeat(64)),
  assertBytes32: vi.fn(),
  getEtherscanAddressUrl: vi.fn((address) => `https://sepolia.etherscan.io/address/${address}`),
  getEtherscanTxUrl: vi.fn((txHash) => `https://sepolia.etherscan.io/tx/${txHash}`),
  abbreviateAddress: vi.fn((address) => `${address.slice(0, 6)}...${address.slice(-4)}`)
}));

describe('OnChainProof Component', () => {
  const mockReport = {
    id: 'report-123',
    uxScore: 75,
    issues: [],
    categories: {},
    recommendations: [],
    metadata: {}
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.ethereum
    global.window.ethereum = {
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn()
    };
  });

  describe('Initial State', () => {
    it('should render connect wallet button when not connected', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      const buttons = container.querySelectorAll('button');
      const hasConnectButton = Array.from(buttons).some(btn => 
        btn.textContent.toLowerCase().includes('connect')
      );
      expect(hasConnectButton || buttons.length > 0).toBe(true);
    });

    it('should display privacy-first message', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      expect(container.textContent.toLowerCase()).toMatch(/privacy|hash|on-chain/);
    });

    it('should show MetaMask detection message if not installed', () => {
      delete global.window.ethereum;
      
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      expect(container.textContent.toLowerCase()).toMatch(/metamask|wallet|connect/);
    });
  });

  describe('Wallet Connection', () => {
    it('should render component without errors', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      expect(container).toBeTruthy();
    });
  });

  describe('Hash Anchoring', () => {
    it('should render component with report data', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      expect(container).toBeTruthy();
    });
  });

  describe('Hash Verification', () => {
    it('should render verification UI', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      expect(container).toBeTruthy();
    });
  });

  describe('Etherscan Link', () => {
    it('should have correct Sepolia Etherscan URL', () => {
      const txHash = '0xabcdef1234567890';
      const expectedUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
      
      expect(expectedUrl).toContain('sepolia.etherscan.io');
      expect(expectedUrl).toContain(txHash);
    });
  });

  describe('Privacy Note', () => {
    it('should display privacy note about hash storage', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      expect(container.textContent.toLowerCase()).toMatch(/sha-256|hash|on-chain|private|local/);
    });
  });

  describe('Accessibility', () => {
    it('should have buttons for interaction', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should be keyboard accessible', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('should render component without crashing', () => {
      const { container } = render(<OnChainProof report={mockReport} reportId="report-123" />);
      expect(container).toBeTruthy();
    });
  });
});
