# Web3 Quick Reference

## Quick Start (5 Minutes)

```bash
# 1. Install dependencies
cd web3 && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your RPC_URL and PRIVATE_KEY

# 3. Compile contract
npm run compile

# 4. Deploy to Sepolia
npm run deploy:sepolia
# Copy the contract address from output

# 5. Configure frontend
# Add to frontend/.env:
VITE_REGISTRY_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# 6. Restart frontend
npm run dev
```

## Essential Commands

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia

# Verify on Etherscan
npm run verify

# Run tests (if implemented)
npm test
```

## Environment Variables

### web3/.env
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_KEY  # Optional
```

### frontend/.env
```env
VITE_REGISTRY_ADDRESS=0xYOUR_CONTRACT_ADDRESS
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

## Smart Contract Functions

```solidity
// Store hash on-chain (costs gas)
storeHash(string reportId, bytes32 contentHash)

// Verify hash (free, read-only)
verifyHash(string reportId, bytes32 contentHash) returns (bool)

// Get record details (free, read-only)
getRecord(string reportId) returns (bytes32, address, uint64)
```

## Frontend Usage

```javascript
import { sha256HexFromObject } from './web3/hashUtils';
import { ethers } from 'ethers';
import ABI from './web3/abiAutoUXRegistry.json';

// Compute hash
const hash = await sha256HexFromObject(report);

// Connect to contract
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(address, ABI, signer);

// Anchor hash
const tx = await contract.storeHash(reportId, hash);
await tx.wait();

// Verify hash
const isValid = await contract.verifyHash(reportId, hash);
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Insufficient funds" | Get Sepolia ETH from faucet |
| "Wrong network" | Switch MetaMask to Sepolia |
| "MetaMask not found" | Install MetaMask extension |
| "Contract not configured" | Set VITE_REGISTRY_ADDRESS in frontend/.env |
| "Invalid private key" | Export from MetaMask, starts with 0x |

## Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Alchemy**: https://www.alchemy.com/
- **Etherscan Sepolia**: https://sepolia.etherscan.io/
- **MetaMask**: https://metamask.io/

## Gas Costs (Sepolia Testnet)

- Deploy: ~1,200,000 gas (free with test ETH)
- Anchor: ~50,000 gas (free with test ETH)
- Verify: Free (read-only)

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use testnet for development
- [ ] Separate wallets for dev/prod
- [ ] Backup seed phrase securely
- [ ] Verify transactions before confirming

## Testing Flow

1. Upload logs → Generate report
2. Connect MetaMask wallet
3. Click "Anchor Hash" → Confirm transaction
4. Wait ~15 seconds for confirmation
5. Click "Verify Hash" → Should show verified ✅
6. Modify report locally
7. Click "Verify Hash" → Should show mismatch ⚠️

## Support

- **Full Setup Guide**: [WEB3_SETUP.md](../WEB3_SETUP.md)
- **Technical Docs**: [README.md](README.md)
- **Implementation Summary**: [WEB3_IMPLEMENTATION_SUMMARY.md](../WEB3_IMPLEMENTATION_SUMMARY.md)
