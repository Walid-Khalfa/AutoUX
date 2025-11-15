const hre = require('hardhat');

async function main() {
  console.log('🚀 Deploying AutoUXRegistry to Sepolia...');

  // Get the contract factory
  const AutoUXRegistry = await hre.ethers.getContractFactory('AutoUXRegistry');
  
  // Deploy the contract
  console.log('📝 Deploying contract...');
  const contract = await AutoUXRegistry.deploy();
  
  // Wait for deployment
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  
  console.log('✅ AutoUXRegistry deployed to:', address);
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Copy the contract address above');
  console.log('2. Update frontend/.env with:');
  console.log(`   VITE_REGISTRY_ADDRESS=${address}`);
  console.log('3. (Optional) Verify on Etherscan:');
  console.log(`   npx hardhat verify --network sepolia ${address}`);
  console.log('');
  console.log('🔗 View on Etherscan:');
  console.log(`   https://sepolia.etherscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
