# UXBadgeNFT Deployment Guide

## Overview

The UXBadgeNFT contract is an ERC-721 NFT that allows users to mint badges representing their AutoUX analysis reports. Each badge contains metadata including the UX score, report hash, and timestamp.

## Contract Details

- **Contract Name**: UXBadgeNFT
- **Token Name**: AutoUX Badge
- **Token Symbol**: UXBADGE
- **Standard**: ERC-721 (NFT)
- **Network**: Sepolia Testnet
- **Contract Address**: `0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857`

## Features

### Core Functionality

1. **Mint NFT Badges**: Users can mint NFT badges for their verified UX reports
2. **Metadata Storage**: Each badge stores:
   - UX Score (0-100)
   - Report Hash (SHA-256)
   - Timestamp
   - Report ID
3. **Access Control**: Only the report owner can mint badges for their reports
4. **Duplicate Prevention**: Each report hash can only be minted once
5. **IPFS Integration**: Token URIs point to IPFS metadata

### Smart Contract Functions

#### Public Functions

- `mint(address to, uint256 uxScore, bytes32 reportHash, string reportId, string tokenURI_)` - Mint a new badge
- `getBadgeMetadata(uint256 tokenId)` - Get metadata for a specific badge
- `getTokenIdByHash(bytes32 reportHash)` - Check if a badge exists for a report hash
- `getTokensByOwner(address owner)` - Get all badges owned by an address
- `totalSupply()` - Get total number of minted badges
- `tokenURI(uint256 tokenId)` - Get IPFS metadata URI for a badge

#### Events

- `BadgeMinted(uint256 tokenId, address owner, uint256 uxScore, bytes32 reportHash, string reportId, uint64 timestamp)`

## Deployment

### Prerequisites

1. Node.js and npm installed
2. Hardhat configured
3. Sepolia testnet RPC URL (from Alchemy or Infura)
4. Private key with Sepolia ETH for gas fees
5. Environment variables configured in `web3/.env`

### Deploy to Sepolia

```bash
cd web3
npm run deploy:nft
```

### Verify on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia 0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857
```

## Frontend Integration

### Environment Variables

Add to `frontend/.env`:

```
VITE_NFT_ADDRESS=0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857
```

### ABI File

The contract ABI is available at:
```
frontend/src/web3/abiNFTBadge.json
```

### Usage Example

```javascript
import { ethers } from 'ethers';
import NFT_ABI from '../web3/abiNFTBadge.json';

const NFT_ADDRESS = import.meta.env.VITE_NFT_ADDRESS;

// Connect to contract
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

// Mint a badge
const tx = await nftContract.mint(
  userAddress,
  uxScore,
  reportHash,
  reportId,
  ipfsTokenURI
);
await tx.wait();

// Get badge metadata
const [score, hash, timestamp, reportId] = await nftContract.getBadgeMetadata(tokenId);

// Check if badge exists for a report
const tokenId = await nftContract.getTokenIdByHash(reportHash);

// Get all badges owned by user
const tokenIds = await nftContract.getTokensByOwner(userAddress);
```

## IPFS Metadata Format

The token URI should point to IPFS metadata in the following format:

```json
{
  "name": "AutoUX Badge #1",
  "description": "UX Analysis Badge - Score: 85/100",
  "image": "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "attributes": [
    {
      "trait_type": "UX Score",
      "value": 85
    },
    {
      "trait_type": "Report Hash",
      "value": "0x1234567890abcdef..."
    },
    {
      "trait_type": "Timestamp",
      "display_type": "date",
      "value": 1699876543
    },
    {
      "trait_type": "Report ID",
      "value": "report-abc123"
    }
  ]
}
```

## View on OpenSea

Once minted, badges can be viewed on OpenSea Testnet:

```
https://testnets.opensea.io/assets/sepolia/0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857/{tokenId}
```

## Security Considerations

1. **Access Control**: Only the report owner (msg.sender) can mint badges for themselves
2. **Duplicate Prevention**: Each report hash can only be minted once
3. **Validation**: All inputs are validated (score range, non-zero hash, non-empty strings)
4. **Privacy**: Only the hash is stored on-chain, not the actual report data
5. **Ownership**: Standard ERC-721 ownership and transfer mechanisms apply

## Gas Costs (Approximate)

- **Deployment**: ~2,500,000 gas
- **Mint**: ~150,000 gas per badge
- **View Functions**: Free (read-only)

## Testing

Run contract tests:

```bash
cd web3
npm test
```

## Links

- **Etherscan**: https://sepolia.etherscan.io/address/0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857
- **OpenSea Testnet**: https://testnets.opensea.io/assets/sepolia/0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857/1
- **Sepolia Faucet**: https://sepoliafaucet.com/

## Support

For issues or questions:
1. Check the contract on Etherscan
2. Review transaction logs for error messages
3. Ensure wallet is connected to Sepolia testnet
4. Verify sufficient ETH for gas fees
