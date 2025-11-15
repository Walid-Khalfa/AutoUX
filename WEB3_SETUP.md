# Web3 Setup Guide - AutoUX

This guide walks you through setting up the Web3 on-chain proof feature for AutoUX.

## Overview

The Web3 integration allows users to anchor SHA-256 hashes of their AI-generated reports on the Ethereum blockchain, providing immutable proof of integrity while keeping logs completely private.

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed
- ✅ MetaMask browser extension installed
- ✅ Basic understanding of Ethereum and smart contracts
- ✅ A wallet with Sepolia testnet ETH (free from faucet)

## Step 1: Install MetaMask

1. Visit https://metamask.io/
2. Click "Download" and install the browser extension
3. Create a new wallet or import an existing one
4. **Save your seed phrase securely** (never share it!)

## Step 2: Get Sepolia Testnet ETH

Sepolia is a test network where transactions are free (you just need test ETH for gas).

### Option A: Alchemy Faucet (Recommended)
1. Visit https://www.alchemy.com/faucets/ethereum-sepolia
2. Sign in with your email or GitHub
3. Enter your wallet address
4. Click "Send Me ETH"
5. Wait ~15 seconds for confirmation

### Option B: Sepolia Faucet
1. Visit https://sepoliafaucet.com/
2. Enter your wallet address
3. Complete the CAPTCHA
4. Click "Send Me ETH"

### Verify Balance
1. Open MetaMask
2. Switch network to "Sepolia test network"
3. Check that you have > 0.01 ETH

## Step 3: Get RPC URL (Alchemy or Infura)

You need an RPC URL to interact with the Ethereum network.

### Option A: Alchemy (Recommended)
1. Visit https://www.alchemy.com/
2. Sign up for a free account
3. Create a new app:
   - Name: "AutoUX"
   - Chain: Ethereum
   - Network: Sepolia
4. Copy the HTTPS URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

### Option B: Infura
1. Visit https://infura.io/
2. Sign up for a free account
3. Create a new project
4. Select "Ethereum" → "Sepolia"
5. Copy the HTTPS endpoint

## Step 4: Configure Web3 Environment

### 4.1 Create web3/.env

```bash
cd web3
cp .env.example .env
```

### 4.2 Edit web3/.env

Open `web3/.env` and add your credentials:

```env
# Sepolia RPC URL from Alchemy or Infura
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (export from MetaMask)
# ⚠️ NEVER commit this file or share your private key!
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 4.3 Export Private Key from MetaMask

⚠️ **Security Warning**: Your private key gives full access to your wallet. Only use it on testnets!

1. Open MetaMask
2. Click the three dots (⋮) next to your account
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your MetaMask password
6. Copy the private key (starts with `0x`)
7. Paste it into `web3/.env`

## Step 5: Install Dependencies

```bash
cd web3
npm install
```

This installs Hardhat and all required dependencies.

## Step 6: Compile the Smart Contract

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully (evm target: paris).
```

## Step 7: Deploy to Sepolia

```bash
npm run deploy:sepolia
```

Expected output:
```
🚀 Deploying AutoUXRegistry to Sepolia...
📝 Deploying contract...
✅ AutoUXRegistry deployed to: 0x1234567890abcdef1234567890abcdef12345678

📋 Next steps:
1. Copy the contract address above
2. Update frontend/.env with:
   VITE_REGISTRY_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
3. (Optional) Verify on Etherscan:
   npx hardhat verify --network sepolia 0x1234567890abcdef1234567890abcdef12345678

🔗 View on Etherscan:
   https://sepolia.etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678
```

**Important**: Copy the contract address (the `0x...` string)!

## Step 8: Configure Frontend

### 8.1 Update frontend/.env

Open `frontend/.env` and add:

```env
# Web3 Configuration (Sepolia Testnet)
VITE_REGISTRY_ADDRESS=0xYOUR_CONTRACT_ADDRESS_FROM_STEP_7
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

Replace `0xYOUR_CONTRACT_ADDRESS_FROM_STEP_7` with the actual address from Step 7.

### 8.2 Restart Frontend

If the frontend is running, restart it to load the new environment variables:

```bash
# Stop the frontend (Ctrl+C)
# Then restart:
npm run dev
```

## Step 9: Test the Integration

### 9.1 Upload Logs

1. Open http://localhost:5173
2. Upload a log file or use the demo data
3. Wait for the AI analysis to complete

### 9.2 Connect Wallet

1. Scroll down to the "🔗 On-Chain Proof" section
2. Click "Connect Wallet"
3. MetaMask will pop up - click "Connect"
4. Approve the connection

### 9.3 Anchor Hash

1. Click "📌 Anchor Hash"
2. MetaMask will pop up showing the transaction details
3. Review the gas fee (should be ~$0.10 on testnet)
4. Click "Confirm"
5. Wait for the transaction to be mined (~15 seconds)
6. You should see "✅ Hash stored on-chain successfully!"

### 9.4 Verify Hash

1. Click "🔍 Verify Hash"
2. Wait a moment for the blockchain query
3. You should see "✅ Hash verified on-chain! Report is authentic."

### 9.5 Test Integrity Check

1. Modify the report locally (e.g., change a value in the JSON)
2. Click "🔍 Verify Hash" again
3. You should see "⚠️ Hash not found or mismatch. Report may have been modified."

This proves the integrity check works!

## Step 10: (Optional) Verify Contract on Etherscan

Verifying your contract makes the source code publicly viewable on Etherscan.

### 10.1 Get Etherscan API Key

1. Visit https://etherscan.io/
2. Sign up for a free account
3. Go to "API Keys" in your profile
4. Create a new API key
5. Copy the key

### 10.2 Add to web3/.env

```env
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 10.3 Verify

```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

Expected output:
```
Successfully verified contract AutoUXRegistry on Etherscan.
https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS#code
```

## Troubleshooting

### "Insufficient funds for gas"

**Problem**: Your wallet doesn't have enough Sepolia ETH.

**Solution**:
1. Visit a Sepolia faucet (see Step 2)
2. Request more test ETH
3. Wait for confirmation
4. Try again

### "Transaction rejected by user"

**Problem**: You clicked "Reject" in MetaMask.

**Solution**: Click "📌 Anchor Hash" again and click "Confirm" in MetaMask.

### "Wrong network"

**Problem**: MetaMask is not on Sepolia network.

**Solution**:
1. Open MetaMask
2. Click the network dropdown at the top
3. Select "Sepolia test network"
4. If not visible, enable "Show test networks" in Settings

### "MetaMask not found"

**Problem**: MetaMask extension is not installed.

**Solution**:
1. Install MetaMask from https://metamask.io/
2. Refresh the page
3. Try again

### "Contract not configured"

**Problem**: `VITE_REGISTRY_ADDRESS` is not set in `frontend/.env`.

**Solution**:
1. Deploy the contract (Step 7)
2. Copy the contract address
3. Add it to `frontend/.env` (Step 8)
4. Restart the frontend

### "Invalid private key"

**Problem**: The private key in `web3/.env` is incorrect.

**Solution**:
1. Export your private key from MetaMask again (Step 4.3)
2. Make sure it starts with `0x`
3. Update `web3/.env`
4. Try deploying again

### "Network error" or "RPC timeout"

**Problem**: The RPC URL is incorrect or the service is down.

**Solution**:
1. Check your `SEPOLIA_RPC_URL` in `web3/.env`
2. Try a different RPC provider (Alchemy or Infura)
3. Check your internet connection

## Security Best Practices

### ⚠️ Critical Security Rules

1. **Never commit `.env` files**: They contain your private key!
2. **Use testnet only**: Never use your mainnet private key for testing
3. **Separate wallets**: Use a different wallet for development vs. production
4. **Backup seed phrase**: Store it securely offline
5. **Verify transactions**: Always review gas fees and recipient addresses

### What's Safe to Share

✅ Contract address (public on blockchain)
✅ Transaction hashes (public on blockchain)
✅ Wallet address (public identifier)

### What's NEVER Safe to Share

❌ Private key (gives full access to wallet)
❌ Seed phrase (can recover private key)
❌ `.env` file contents

## Cost Estimation

### Testnet (Sepolia)
- **Deployment**: ~1,200,000 gas (~$0 with test ETH)
- **Anchor Hash**: ~50,000 gas (~$0 with test ETH)
- **Verify Hash**: Free (read-only operation)

### Mainnet (Ethereum)
- **Deployment**: ~1,200,000 gas (~$30-100 depending on gas price)
- **Anchor Hash**: ~50,000 gas (~$1-5 depending on gas price)
- **Verify Hash**: Free (read-only operation)

**Recommendation**: Use Polygon or Arbitrum for lower mainnet costs (~$0.01 per transaction).

## Next Steps

### For Development
- ✅ Test the full flow (upload → anchor → verify)
- ✅ Try modifying the report and verifying (should fail)
- ✅ Check the transaction on Etherscan

### For Production
- [ ] Deploy to mainnet or L2 (Polygon, Arbitrum)
- [ ] Use a hardware wallet for deployment
- [ ] Set up monitoring for contract events
- [ ] Implement gas price optimization
- [ ] Add transaction confirmation modals

## Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js v6 Docs**: https://docs.ethers.org/v6/
- **MetaMask Docs**: https://docs.metamask.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Etherscan Sepolia**: https://sepolia.etherscan.io/
- **Web3 README**: [web3/README.md](web3/README.md)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the error message in the browser console
3. Check the transaction on Etherscan
4. Verify your configuration in `.env` files

## Summary

You've successfully set up Web3 on-chain proof for AutoUX! Your reports can now be anchored on the Ethereum blockchain for immutable verification, while keeping your logs completely private.

**Key Benefits**:
- ✅ Immutable proof of report integrity
- ✅ Privacy-preserved (only hashes on-chain)
- ✅ Public verification by anyone
- ✅ Audit trail with timestamps
- ✅ Decentralized (no central authority)

Happy verifying! 🔗✨
