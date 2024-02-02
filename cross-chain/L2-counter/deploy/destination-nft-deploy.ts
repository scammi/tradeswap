import { utils, Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
const CONFIG = require('../../L1-governance/sepolia.json')
import { ethers } from "ethers";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the destination contract`);

  // Initialize the wallet.
  const wallet = new Wallet(CONFIG.deployerPrivateKey);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("DestinationNFT");

  const destinationContract = await deployer.deploy(artifact, []);

  // Show the contract info.
  const contractAddress = destinationContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
