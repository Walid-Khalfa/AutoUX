# AutoUXRegistry Deployment Information

## Contract Details

- **Contract Name**: AutoUXRegistry
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Deployed Address**: `0x77b0ea1456EAD5d3F0898Dd5e5Cf26531f0DAfdf`
- **Compiler Version**: Solidity 0.8.20
- **Optimization**: Enabled (200 runs)

## Deployment Date

Previously deployed and verified on Sepolia testnet.

## Contract Functions

### Write Functions
- `storeHash(string reportId, bytes32 contentHash)` - Store a content hash for a report ID
  - Emits: `HashStored` event
  - Requirements: contentHash != 0, reportId not empty

### Read Functions
- `verifyHash(string reportId, bytes32 contentHash)` - Verify if a hash matches the stored value
  - Returns: `bool` (true if match and exists)
  
- `getRecord(string reportId)` - Get the full record for a report ID
  - Returns: `(bytes32 contentHash, address uploader, uint64 timestamp)`

## Events
- `HashStored(string indexed reportId, bytes32 indexed contentHash, address indexed uploader, uint64 timestamp)`

## Etherscan Links

- **Contract**: https://sepolia.etherscan.io/address/0x77b0ea1456EAD5d3F0898Dd5e5Cf26531f0DAfdf
- **Network Explorer**: https://sepolia.etherscan.io

## Environment Configuration

### Backend (.env)
Not required - backend doesn't interact with blockchain directly.

### Frontend (.env)
```env
VITE_REGISTRY_ADDRESS=0x77b0ea1456EAD5d3F0898Dd5e5Cf26531f0DAfdf
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

### Web3 (.env)
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

## Redeployment Instructions

If you need to redeploy the contract:

1. Ensure you have Sepolia testnet ETH in your wallet
2. Configure your `.env` file with valid credentials
3. Run the deployment script:
   ```bash
   cd web3
   npm run deploy:sepolia
   ```
4. Copy the new contract address from the output
5. Update `frontend/.env` with the new `VITE_REGISTRY_ADDRESS`
6. Restart the frontend application

## Verification on Etherscan

To verify the contract source code on Etherscan:

```bash
npx hardhat verify --network sepolia 0x77b0ea1456EAD5d3F0898Dd5e5Cf26531f0DAfdf
```

Note: Requires `ETHERSCAN_API_KEY` in `.env`

## Testing the Contract

Run the Hardhat tests:
```bash
npm test
```

## Security Considerations

- Only hashes are stored on-chain (privacy-first design)
- No sensitive data or raw logs are ever sent to the blockchain
- Anyone can write to the contract (permissionless)
- Records are immutable once stored
- Gas costs are minimal (~50k gas for storeHash)

## Contract Source Code

The contract source is available at: `contracts/AutoUXRegistry.sol`

Key features:
- Privacy-first: Only SHA-256 hashes stored
- Efficient: Optimized gas usage
- Auditable: Public verification of report integrity
- Event-driven: Easy to query historical anchors
