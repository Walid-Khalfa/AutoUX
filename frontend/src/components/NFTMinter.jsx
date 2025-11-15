import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { sha256HexFromObject, assertBytes32, abbreviateAddress } from '../web3/hashUtils';
import { generateNFTMetadata, getOpenSeaUrl } from '../web3/ipfs';
import ABI_NFT from '../web3/abiNFTBadge.json';

const NFT_ADDRESS = import.meta.env.VITE_NFT_ADDRESS;
const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME;

/**
 * NFTMinter Component
 * Handles minting of UX Badge NFTs with metadata
 */
export default function NFTMinter({ report, account, onMintSuccess }) {
  const [status, setStatus] = useState('idle'); // idle, minting, minted, failed
  const [error, setError] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [reportHash, setReportHash] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined');
  }, []);

  const mintNFT = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (!report || !report.id) {
      setError('No report available to mint');
      showToast('No report available to mint', 'error');
      return;
    }

    try {
      setError(null);
      setStatus('minting');
      showToast('Preparing NFT metadata...', 'info');

      // Compute SHA-256 hash of the report
      const hash = await sha256HexFromObject(report);
      assertBytes32(hash);
      setReportHash(hash);

      // Generate NFT metadata
      const uxScore = report.uxScore || 0;
      const metadata = generateNFTMetadata(report, uxScore, hash);

      // For this implementation, we'll create a data URI for the metadata
      // In production, you would upload to IPFS first
      const metadataJSON = JSON.stringify(metadata);
      const metadataURI = `data:application/json;base64,${btoa(metadataJSON)}`;

      showToast('Sending mint transaction...', 'info');

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(NFT_ADDRESS, ABI_NFT, signer);

      // Call mint function
      // mint(address to, uint256 uxScore, bytes32 reportHash, string reportId, string tokenURI_)
      const tx = await contract.mint(
        account,
        uxScore,
        hash,
        report.id,
        metadataURI
      );
      
      setTxHash(tx.hash);
      showToast('Transaction submitted. Waiting for confirmation...', 'info');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Extract token ID from BadgeMinted event
        const mintEvent = receipt.logs.find(log => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'BadgeMinted';
          } catch {
            return false;
          }
        });

        if (mintEvent) {
          const parsedEvent = contract.interface.parseLog(mintEvent);
          const mintedTokenId = parsedEvent.args.tokenId;
          setTokenId(Number(mintedTokenId));
        }

        setStatus('minted');
        showToast('NFT Badge minted successfully!', 'success');
        
        if (onMintSuccess) {
          onMintSuccess({ tokenId: Number(mintEvent?.args?.tokenId), txHash: tx.hash });
        }
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error minting NFT:', err);
      
      let errorMessage = 'Failed to mint NFT';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas';
      } else if (err.message && err.message.includes('already minted')) {
        errorMessage = 'An NFT for this report has already been minted';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStatus('failed');
      showToast(errorMessage, 'error');
    }
  };

  const retryMint = () => {
    setError(null);
    setStatus('idle');
    mintNFT();
  };

  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
  };

  const getStatusBadge = () => {
    const badges = {
      idle: { text: 'Ready to Mint', color: 'bg-blue-500', icon: '🎨' },
      minting: { text: 'Minting...', color: 'bg-yellow-500', icon: '⏳' },
      minted: { text: 'Minted', color: 'bg-green-500', icon: '✓' },
      failed: { text: 'Failed', color: 'bg-red-500', icon: '✗' }
    };

    const badge = badges[status] || badges.idle;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        <span>{badge.text}</span>
      </span>
    );
  };

  const getScoreTier = () => {
    const score = report?.uxScore || 0;
    if (score >= 90) return { tier: 'Excellent', emoji: '🟢', color: 'text-green-400' };
    if (score >= 70) return { tier: 'Fair', emoji: '🟠', color: 'text-amber-400' };
    return { tier: 'Critical', emoji: '🔴', color: 'text-red-400' };
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg p-6 shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-4">🎨 Mint UX Badge NFT</h2>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
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
            {' '}to mint NFTs.
          </p>
        </div>
      </div>
    );
  }

  const scoreTier = getScoreTier();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg p-6 shadow-xl text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">🎨 Mint UX Badge NFT</h2>
          <p className="text-purple-200 text-sm">
            Create an NFT badge to showcase your UX quality achievement
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-sm">{error}</p>
          {status === 'failed' && (
            <button
              onClick={retryMint}
              className="mt-2 text-sm underline hover:text-purple-200"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {!account && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
          <p className="text-sm">
            ⚠️ Please connect your wallet in the "On-Chain Proof" section above to mint NFTs.
          </p>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          {/* Badge Preview */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Badge Preview</h3>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-center">
              <div className="text-6xl mb-2">{scoreTier.emoji}</div>
              <div className={`text-4xl font-bold mb-2 ${scoreTier.color}`}>
                {report.uxScore}/100
              </div>
              <div className="text-lg font-semibold mb-1">
                AutoUX Badge - {scoreTier.tier}
              </div>
              <div className="text-sm text-purple-200">
                Report ID: {abbreviateAddress(report.id, 8, 6)}
              </div>
            </div>
          </div>

          {/* Badge Details */}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Badge Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-300">UX Score:</span>
                <span className="font-mono">{report.uxScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Tier:</span>
                <span>{scoreTier.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Total Issues:</span>
                <span>{report.metadata?.totalIssues || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Critical Issues:</span>
                <span>{report.metadata?.criticalCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Analysis Date:</span>
                <span>{new Date(report.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Mint Button */}
          <div className="bg-white/10 rounded-lg p-4">
            <button
              onClick={mintNFT}
              disabled={!account || status === 'minting' || status === 'minted'}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {status === 'minting' && '⏳ Minting NFT...'}
              {status === 'minted' && '✓ NFT Minted!'}
              {status === 'idle' && '🎨 Mint UX Badge NFT'}
              {status === 'failed' && '🔄 Retry Minting'}
            </button>
            
            {status === 'minting' && (
              <p className="text-xs text-purple-300 text-center mt-2">
                Please confirm the transaction in MetaMask
              </p>
            )}
          </div>

          {/* Minted NFT Info */}
          {status === 'minted' && tokenId !== null && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>✓</span>
                <span>NFT Minted Successfully!</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-300">Token ID: </span>
                  <span className="font-mono">#{tokenId}</span>
                </div>
                {txHash && (
                  <div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-white underline"
                    >
                      View Transaction on Etherscan →
                    </a>
                  </div>
                )}
                <div>
                  <a
                    href={getOpenSeaUrl(NFT_ADDRESS, tokenId, 'sepolia')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-white underline"
                  >
                    View on OpenSea Testnet →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="text-xs text-purple-300 text-center pt-2 border-t border-purple-700">
            <p>
              💡 Your NFT badge will be visible on OpenSea testnet and can be transferred or traded.
            </p>
            <p className="mt-1">
              Network: {CHAIN_NAME} | Contract: {abbreviateAddress(NFT_ADDRESS, 8, 6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
