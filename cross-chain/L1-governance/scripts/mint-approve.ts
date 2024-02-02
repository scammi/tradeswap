import { ethers } from "hardhat";

const VAULT_ADDRESS = "0x7096b10e158a28a110ec61a21fd8dc56cc064e80";
const ORIGIN_NFT_ADDRESS = "0xaF8301d33f3341Fc6Ac0e98191015Fa9FF5A4D11";
const TOKEN_ID = "1";

async function main() {
  // We get the contract to deploy
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();

  const originNFT = await ethers.getContractAt("OriginNFT", ORIGIN_NFT_ADDRESS);

  const mintTx = await originNFT.safeMint(signerAddress);
  await mintTx.wait();

  const approveTx = await originNFT.approve(VAULT_ADDRESS, TOKEN_ID);
  await approveTx.wait();
}

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
