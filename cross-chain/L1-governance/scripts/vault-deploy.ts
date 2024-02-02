import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const Vault = await ethers.getContractFactory("Vault");

  const contract = await Vault.deploy({
    // nonce: 5,
    // gasPrice: gasPrices,
  });

  console.log(contract);
  await contract.deployed();

  console.log(
    `Vault contract was successfully deployed at ${contract.address}`,
  );
}

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
