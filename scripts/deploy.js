const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("nAnimals");
    const token = await Token.deploy("https://nanimals.mypinata.cloud/ipfs/QmV8x3WBkmPdWcFi1mR4fgvaq7WFvB3NGSU5Pv1e167HbT/");
  
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

// Call npx hardhat run scripts/deploy.js --network matic