import { ethers } from "hardhat";

async function main() {
  const OriginNFT = await ethers.getContractFactory("OriginNFT");

  const contract = await OriginNFT.deploy({
    // nonce: 5,
    // gasPrice: gasPrices,
  });
  console.log(contract);
  await contract.deployed();
  console.log(
    `OriginNFT contract was successfully deployed at ${contract.address}`,
  );

}

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
