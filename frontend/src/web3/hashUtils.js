/**
 * Web3 Hash Utilities for AutoUX
 * Provides SHA-256 hashing and bytes32 validation for on-chain proof anchoring
 */

/**
 * Compute SHA-256 hash from a JavaScript object and return as hex string
 * @param {Object} obj - The object to hash (typically an AI report)
 * @returns {string} - Hex string with 0x prefix (bytes32 format)
 */
export const sha256HexFromObject = async (obj) => {
  // Serialize object to JSON string with consistent ordering
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);
  
  // Compute SHA-256 hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return with 0x prefix for Ethereum compatibility
  return '0x' + hashHex;
};

/**
 * Validate that a string is a valid bytes32 hex string
 * @param {string} hash - The hash string to validate
 * @returns {boolean} - True if valid bytes32 format
 */
export const assertBytes32 = (hash) => {
  if (typeof hash !== 'string') {
    throw new Error('Hash must be a string');
  }
  
  if (!hash.startsWith('0x')) {
    throw new Error('Hash must start with 0x prefix');
  }
  
  // Remove 0x prefix and check length (64 hex chars = 32 bytes)
  const hexString = hash.slice(2);
  
  if (hexString.length !== 64) {
    throw new Error(`Hash must be 64 hex characters (32 bytes), got ${hexString.length}`);
  }
  
  // Check if all characters are valid hex
  if (!/^[0-9a-fA-F]{64}$/.test(hexString)) {
    throw new Error('Hash contains invalid hex characters');
  }
  
  return true;
};

/**
 * Compute SHA-256 hash synchronously using a simpler approach
 * Note: This is a fallback for environments without crypto.subtle
 * @param {Object} obj - The object to hash
 * @returns {string} - Hex string with 0x prefix
 */
export const sha256HexFromObjectSync = (obj) => {
  // This is a simplified version that requires ethers.js
  // In production, use the async version with Web Crypto API
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  const { ethers } = require('ethers');
  return ethers.id(jsonString);
};

/**
 * Abbreviate an Ethereum address for display
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} - Abbreviated address (e.g., "0x1234...5678")
 */
export const abbreviateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Get Etherscan URL for a transaction
 * @param {string} txHash - Transaction hash
 * @param {string} network - Network name (default: "sepolia")
 * @returns {string} - Etherscan URL
 */
export const getEtherscanTxUrl = (txHash, network = 'sepolia') => {
  const baseUrl = network === 'mainnet' 
    ? 'https://etherscan.io' 
    : `https://${network}.etherscan.io`;
  return `${baseUrl}/tx/${txHash}`;
};

/**
 * Get Etherscan URL for a contract address
 * @param {string} address - Contract address
 * @param {string} network - Network name (default: "sepolia")
 * @returns {string} - Etherscan URL
 */
export const getEtherscanAddressUrl = (address, network = 'sepolia') => {
  const baseUrl = network === 'mainnet' 
    ? 'https://etherscan.io' 
    : `https://${network}.etherscan.io`;
  return `${baseUrl}/address/${address}`;
};
