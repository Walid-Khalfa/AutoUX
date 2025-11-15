const hre = require('hardhat');

async function main() {
  console.log('🚀 Deploying UXBadgeNFT to Sepolia...');

  // Get the contract factory
  const UXBadgeNFT = await hre.ethers.getContractFactory('UXBadgeNFT');
  
  // Deploy the contract
  console.log('📝 Deploying contract...');
  const contract = await UXBadgeNFT.deploy();
  
  // Wait for deployment
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  
  console.log('✅ UXBadgeNFT deployed to:', address);
  console.log('');
  console.log('📋 Contract Details:');
  console.log('   Name: AutoUX Badge');
  console.log('   Symbol: UXBADGE');
  console.log('   Standard: ERC-721');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Copy the contract address above');
  console.log('2. Update frontend/.env with:');
  console.log(`   VITE_NFT_ADDRESS=${address}`);
  console.log('3. (Optional) Verify on Etherscan:');
  console.log(`   npx hardhat verify --network sepolia ${address}`);
  console.log('');
  console.log('🔗 View on Etherscan:');
  console.log(`   https://sepolia.etherscan.io/address/${address}`);
  console.log('');
  console.log('🎨 View on OpenSea (Testnet):');
  console.log(`   https://testnets.opensea.io/assets/sepolia/${address}/1`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
