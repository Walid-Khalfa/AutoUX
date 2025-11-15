/**
 * IPFS Upload Utilities for AutoUX NFT Metadata
 * Optional feature for storing NFT metadata on IPFS
 */

/**
 * Upload JSON metadata to IPFS using a public gateway
 * Note: This is a simplified implementation. For production, consider using:
 * - Pinata (https://pinata.cloud)
 * - NFT.Storage (https://nft.storage)
 * - Web3.Storage (https://web3.storage)
 * 
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} - IPFS hash (CID)
 */
export const uploadToIPFS = async (metadata) => {
  // This is a placeholder implementation
  // In production, you would use a service like Pinata or NFT.Storage
  
  throw new Error('IPFS upload not implemented. Please configure an IPFS service (Pinata, NFT.Storage, etc.)');
  
  // Example implementation with Pinata:
  /*
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `AutoUX-Report-${metadata.reportId}`
      }
    })
  });
  
  const data = await response.json();
  return data.IpfsHash; // Returns CID
  */
};

/**
 * Generate NFT metadata JSON for AutoUX badge
 * @param {Object} report - AI report object
 * @param {number} uxScore - UX score (0-100)
 * @param {string} reportHash - SHA-256 hash of the report
 * @returns {Object} - NFT metadata in OpenSea format
 */
export const generateNFTMetadata = (report, uxScore, reportHash) => {
  // Determine badge tier based on score
  let tier, color, emoji;
  if (uxScore >= 90) {
    tier = 'Excellent';
    color = '#10b981'; // Green
    emoji = '🟢';
  } else if (uxScore >= 70) {
    tier = 'Fair';
    color = '#f59e0b'; // Amber
    emoji = '🟠';
  } else {
    tier = 'Critical';
    color = '#ef4444'; // Red
    emoji = '🔴';
  }
  
  return {
    name: `AutoUX Badge - ${tier}`,
    description: `This NFT certifies that the application achieved a UX score of ${uxScore}/100 on AutoUX AI analysis. The report hash ${reportHash} is anchored on-chain for verification.`,
    image: `https://via.placeholder.com/500/${color.slice(1)}/ffffff?text=${emoji}+${uxScore}`, // Placeholder image
    external_url: `https://autoux.app/report/${report.id}`, // Your app URL
    attributes: [
      {
        trait_type: 'UX Score',
        value: uxScore,
        max_value: 100
      },
      {
        trait_type: 'Tier',
        value: tier
      },
      {
        trait_type: 'Total Issues',
        value: report.metadata?.totalIssues || 0
      },
      {
        trait_type: 'Critical Issues',
        value: report.metadata?.criticalCount || 0
      },
      {
        trait_type: 'Report Hash',
        value: reportHash
      },
      {
        trait_type: 'Analysis Date',
        display_type: 'date',
        value: Math.floor(new Date(report.timestamp).getTime() / 1000)
      }
    ]
  };
};

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS content identifier
 * @param {string} gateway - IPFS gateway URL (default: public gateway)
 * @returns {string} - Full IPFS URL
 */
export const getIPFSUrl = (cid, gateway = 'https://ipfs.io/ipfs/') => {
  return `${gateway}${cid}`;
};

/**
 * Get OpenSea testnet URL for an NFT
 * @param {string} contractAddress - NFT contract address
 * @param {number} tokenId - Token ID
 * @param {string} network - Network name (default: "sepolia")
 * @returns {string} - OpenSea URL
 */
export const getOpenSeaUrl = (contractAddress, tokenId, network = 'sepolia') => {
  const baseUrl = network === 'mainnet' 
    ? 'https://opensea.io' 
    : 'https://testnets.opensea.io';
  return `${baseUrl}/assets/${network}/${contractAddress}/${tokenId}`;
};
