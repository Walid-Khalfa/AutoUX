import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { sha256HexFromObject, assertBytes32, abbreviateAddress, getEtherscanTxUrl, getEtherscanAddressUrl } from '../web3/hashUtils';
import ABI_REGISTRY from '../web3/abiAutoUXRegistry.json';

const REGISTRY_ADDRESS = import.meta.env.VITE_REGISTRY_ADDRESS;
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID);
const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME;

/**
 * OnChainProof Component
 * Handles Web3 wallet connection, hash anchoring, and verification on Sepolia testnet
 */
export default function OnChainProof({ report, onStatusChange, onWalletConnect, onHashComputed }) {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('disconnected'); // disconnected, connected, anchoring, anchored, verifying, verified, not-anchored, failed
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [computedHash, setComputedHash] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined');

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setStatus('disconnected');
      if (onWalletConnect) onWalletConnect(null);
    } else {
      setAccount(accounts[0]);
      setStatus('connected');
      if (onWalletConnect) onWalletConnect(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to use Web3 features.');
      return;
    }

    try {
      setError(null);
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      // Check if we're on the correct network
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== CHAIN_ID) {
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            setError(`Please add ${CHAIN_NAME} network to MetaMask`);
          } else {
            setError(`Please switch to ${CHAIN_NAME} network in MetaMask`);
          }
          return;
        }
      }

      setAccount(accounts[0]);
      setStatus('connected');
      if (onWalletConnect) onWalletConnect(accounts[0]);
      showToast('Wallet connected successfully', 'success');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
      setStatus('failed');
    }
  };

  const anchorHash = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!report || !report.id) {
      setError('No report available to anchor');
      return;
    }

    try {
      setError(null);
      setStatus('anchoring');
      showToast('Computing report hash...', 'info');

      // Compute SHA-256 hash of the report
      const hash = await sha256HexFromObject(report);
      assertBytes32(hash);
      setComputedHash(hash);
      
      // Pass hash to parent component
      if (onHashComputed) {
        onHashComputed(hash);
      }

      showToast('Sending transaction to Sepolia...', 'info');

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(REGISTRY_ADDRESS, ABI_REGISTRY, signer);

      // Call storeHash function
      const tx = await contract.storeHash(report.id, hash);
      setTxHash(tx.hash);
      
      showToast('Transaction submitted. Waiting for confirmation...', 'info');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setStatus('anchored');
        showToast('Hash anchored successfully on-chain!', 'success');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error anchoring hash:', err);
      
      let errorMessage = 'Failed to anchor hash';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStatus('failed');
      showToast(errorMessage, 'error');
    }
  };

  const verifyHash = async () => {
    if (!report || !report.id) {
      setError('No report available to verify');
      return;
    }

    try {
      setError(null);
      setStatus('verifying');
      showToast('Computing report hash...', 'info');

      // Compute SHA-256 hash of the report
      const hash = await sha256HexFromObject(report);
      assertBytes32(hash);
      setComputedHash(hash);
      
      // Pass hash to parent component
      if (onHashComputed) {
        onHashComputed(hash);
      }

      showToast('Checking on-chain record...', 'info');

      // Get provider (read-only, no signer needed)
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Create contract instance
      const contract = new ethers.Contract(REGISTRY_ADDRESS, ABI_REGISTRY, provider);

      // Call verifyHash function
      const isValid = await contract.verifyHash(report.id, hash);

      if (isValid) {
        setStatus('verified');
        showToast('Report verified on-chain!', 'success');
        
        // Optionally fetch the record details
        const record = await contract.getRecord(report.id);
        console.log('On-chain record:', {
          hash: record.contentHash,
          uploader: record.uploader,
          timestamp: new Date(Number(record.timestamp) * 1000).toISOString()
        });
      } else {
        setStatus('not-anchored');
        showToast('Report not found on-chain or hash mismatch', 'warning');
      }
    } catch (err) {
      console.error('Error verifying hash:', err);
      setError('Failed to verify hash. Please try again.');
      setStatus('failed');
      showToast('Verification failed', 'error');
    }
  };

  const retryLastAction = () => {
    setError(null);
    if (status === 'failed' && txHash) {
      // If we have a tx hash, we were anchoring
      anchorHash();
    } else if (status === 'failed') {
      // Otherwise we were verifying
      verifyHash();
    }
  };

  const showToast = (message, type = 'info') => {
    // This is a simple implementation. In production, use a toast library like react-hot-toast
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can dispatch a custom event here that App.jsx listens to
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
  };

  const getStatusBadge = () => {
    const badges = {
      disconnected: { text: 'Not Connected', color: 'bg-gray-500', icon: '🔌' },
      connected: { text: 'Connected', color: 'bg-blue-500', icon: '✓' },
      anchoring: { text: 'Anchoring...', color: 'bg-yellow-500', icon: '⏳' },
      anchored: { text: 'Anchored', color: 'bg-green-500', icon: '⚓' },
      verifying: { text: 'Verifying...', color: 'bg-yellow-500', icon: '🔍' },
      verified: { text: 'Verified on-chain', color: 'bg-green-500', icon: '✓' },
      'not-anchored': { text: 'Not anchored', color: 'bg-orange-500', icon: '⚠️' },
      failed: { text: 'Failed', color: 'bg-red-500', icon: '✗' }
    };

    const badge = badges[status] || badges.disconnected;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        <span>{badge.text}</span>
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-lg p-6 shadow-xl text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">🔐 On-Chain Proof</h2>
          <p className="text-purple-200 text-sm">
            Privacy-first: Only the hash is stored on-chain, your logs stay private
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {!isMetaMaskInstalled && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-sm">
            ⚠️ MetaMask not detected. Please install{' '}
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-purple-200"
            >
              MetaMask
            </a>
            {' '}to use Web3 features.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-sm">{error}</p>
          {status === 'failed' && (
            <button
              onClick={retryLastAction}
              className="mt-2 text-sm underline hover:text-purple-200"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Wallet Connection */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-semibold mb-2">1. Connect Wallet</h3>
          {!account ? (
            <button
              onClick={connectWallet}
              disabled={!isMetaMaskInstalled}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Connected: <span className="font-mono">{abbreviateAddress(account)}</span>
              </span>
              <button
                onClick={() => {
                  setAccount(null);
                  setStatus('disconnected');
                  if (onWalletConnect) onWalletConnect(null);
                }}
                className="text-sm text-purple-300 hover:text-white underline"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Anchor Hash */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-semibold mb-2">2. Anchor Hash</h3>
          <p className="text-sm text-purple-200 mb-3">
            Store a cryptographic hash of your report on Sepolia blockchain
          </p>
          <button
            onClick={anchorHash}
            disabled={!account || !report || status === 'anchoring'}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {status === 'anchoring' ? 'Anchoring...' : 'Anchor Hash'}
          </button>
          {txHash && (
            <a
              href={getEtherscanTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-sm text-purple-300 hover:text-white underline"
              title="View transaction on Etherscan"
            >
              View on Etherscan →
            </a>
          )}
        </div>

        {/* Verify Hash */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-semibold mb-2">3. Verify</h3>
          <p className="text-sm text-purple-200 mb-3">
            Check if this report's hash exists on-chain
          </p>
          <button
            onClick={verifyHash}
            disabled={!report || status === 'verifying'}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {status === 'verifying' ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Computed Hash Display */}
        {computedHash && (
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Report Hash</h3>
            <p className="text-xs font-mono break-all text-purple-200">
              {computedHash}
            </p>
          </div>
        )}

        {/* Contract Info */}
        <div className="text-xs text-purple-300 text-center pt-2 border-t border-purple-700">
          <p>
            Contract:{' '}
            <a
              href={getEtherscanAddressUrl(REGISTRY_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-white underline"
              title="View contract on Etherscan"
            >
              {abbreviateAddress(REGISTRY_ADDRESS, 8, 6)}
            </a>
          </p>
          <p className="mt-1">Network: {CHAIN_NAME} (Chain ID: {CHAIN_ID})</p>
        </div>
      </div>
    </div>
  );
}
