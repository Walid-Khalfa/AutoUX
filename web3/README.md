# AutoUX Web3 Integration

## Overview

The AutoUX Web3 integration provides **on-chain proof of integrity** for AI-generated reports using blockchain technology. This ensures that reports can be verified as authentic and unmodified without compromising user privacy.

## Architecture

### Smart Contracts

#### 1. AutoUXRegistry

The `AutoUXRegistry` smart contract is deployed on Ethereum Sepolia testnet and provides three main functions:

1. **storeHash(reportId, contentHash)** - Store a SHA-256 hash of a report on-chain
2. **verifyHash(reportId, contentHash)** - Verify if a hash matches the stored value
3. **getRecord(reportId)** - Retrieve the stored record (hash, uploader, timestamp)

#### 2. UXBadgeNFT (Optional)

The `UXBadgeNFT` contract is an ERC-721 NFT that allows users to mint badges for their verified UX reports:

1. **mint(to, uxScore, reportHash, reportId, tokenURI)** - Mint a new badge NFT
2. **getBadgeMetadata(tokenId)** - Get badge metadata (score, hash, timestamp)
3. **getTokenIdByHash(reportHash)** - Check if a badge exists for a report
4. **getTokensByOwner(owner)** - Get all badges owned by an address

See [NFT_DEPLOYMENT.md](./NFT_DEPLOYMENT.md) for detailed NFT documentation.

### Key Features

- **Privacy-First**: Only SHA-256 hashes are stored on-chain, never raw logs or sensitive data
- **Immutable Proof**: Once anchored, the hash cannot be altered
- **Public Verification**: Anyone can verify a report's authenticity
- **Audit Trail**: Records include uploader address and timestamp

### Data Structure

```solidity
struct Record {
    bytes32 contentHash;   // SHA-256 hash of report JSON
    address uploader;      // Wallet address that anchored the hash
    uint64 timestamp;      // Block timestamp
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH (get from faucet)

### 1. Install Dependencies

```bash
cd web3
npm install
```

### 2. Configure Environment

Create a `.env` file in the `web3/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Get from Alchemy (https://www.alchemy.com/) or Infura (https://infura.io/)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (NEVER commit this!)
# Export from MetaMask: Account Details > Export Private Key
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Optional: For contract verification on Etherscan
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

⚠️ **Security Warning**: Never commit your `.env` file or share your private key!

### 3. Get Testnet ETH

You need Sepolia ETH to deploy the contract and pay for gas:

1. Visit a Sepolia faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
2. Enter your wallet address
3. Wait for the transaction to confirm (~15 seconds)

### 4. Compile the Contract

```bash
npm run compile
```

This generates the contract artifacts in `artifacts/`.

### 5. Deploy to Sepolia

Deploy the main registry contract:

```bash
npm run deploy:sepolia
```

Expected output:
```
🚀 Deploying AutoUXRegistry to Sepolia...
📝 Deploying contract...
✅ AutoUXRegistry deployed to: 0x1234567890abcdef...

📋 Next steps:
1. Copy the contract address above
2. Update frontend/.env with:
   VITE_REGISTRY_ADDRESS=0x1234567890abcdef...
```

(Optional) Deploy the NFT badge contract:

```bash
npm run deploy:nft
```

Expected output:
```
🚀 Deploying UXBadgeNFT to Sepolia...
✅ UXBadgeNFT deployed to: 0xabcdef1234567890...
```

### 6. Configure Frontend

Update `frontend/.env` with the deployed contract addresses:

```env
VITE_REGISTRY_ADDRESS=0x1234567890abcdef...
VITE_NFT_ADDRESS=0xabcdef1234567890...
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

### 7. (Optional) Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

This makes the contract source code publicly viewable on Etherscan.

## Usage

### Frontend Integration

Once configured, users can:

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Anchor Hash**: Click "📌 Anchor Hash" to store the report hash on-chain
   - MetaMask will prompt for transaction approval
   - Gas cost: ~50,000 gas (~$0.10 on Sepolia)
3. **Verify Hash**: Click "🔍 Verify Hash" to check if the report is authentic
   - No transaction required (read-only)
   - Returns ✅ if hash matches, ⚠️ if not found or modified

### How It Works

```
1. User uploads logs → AI generates report
2. Frontend computes SHA-256(report.json) → 0xabc123...
3. User clicks "Anchor Hash"
4. Smart contract stores: reportId → { hash: 0xabc123..., uploader: 0x..., timestamp: 1234567890 }
5. Later, anyone can verify by computing SHA-256(report.json) and comparing
```

### Privacy Guarantees

- ✅ Only the hash is stored on-chain (32 bytes)
- ✅ Original logs never leave the user's machine
- ✅ Report content is not stored on-chain
- ✅ Hash cannot be reversed to reveal data

## Hardhat Commands

```bash
# Compile contracts
npm run compile

# Deploy AutoUXRegistry to Sepolia
npm run deploy:sepolia

# Deploy UXBadgeNFT to Sepolia
npm run deploy:nft

# Run tests (if implemented)
npm test

# Verify contract on Etherscan
npm run verify
```

## Contract Details

- **Solidity Version**: 0.8.20
- **License**: MIT
- **Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **Gas Optimization**: Enabled (200 runs)

## Troubleshooting

### "Insufficient funds for gas"

- Get more Sepolia ETH from a faucet
- Check your wallet balance: https://sepolia.etherscan.io/

### "Transaction rejected by user"

- You declined the MetaMask transaction
- Try again and click "Confirm"

### "Wrong network"

- MetaMask is not on Sepolia
- Switch network in MetaMask: Networks > Sepolia

### "Contract not configured"

- `VITE_REGISTRY_ADDRESS` is not set in `frontend/.env`
- Deploy the contract first and copy the address

### "MetaMask not found"

- Install MetaMask: https://metamask.io/
- Refresh the page after installation

## Security Best Practices

1. **Never commit private keys**: Use `.env` and add to `.gitignore`
2. **Use testnet first**: Test thoroughly before mainnet deployment
3. **Validate inputs**: Frontend validates bytes32 format before sending
4. **Handle errors gracefully**: All errors are caught and displayed to user
5. **Gas estimation**: Show estimated cost before transaction (optional)

## Future Enhancements

- [ ] Support multiple networks (Polygon, Arbitrum)
- [ ] Batch hash anchoring for multiple reports
- [ ] IPFS integration for decentralized report storage
- [ ] Gas optimization (use CREATE2 for deterministic addresses)
- [ ] Upgradeable contract pattern (proxy)

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

## License

MIT
