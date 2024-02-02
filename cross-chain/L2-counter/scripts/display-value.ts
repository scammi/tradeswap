import { Contract, Provider } from "zksync-ethers";

const COUNTER_ADDRESS = "0x8e59C5F14C2fA6396B649Ca0F57D3B0A6A4F2565";
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initialize the provider
  const l2Provider = new Provider("https://sepolia.era.zksync.dev");

  const counterContract = new Contract(
    COUNTER_ADDRESS,
    COUNTER_ABI,
    l2Provider,
  );

  const value = (await counterContract.value()).toString();

  console.log(`The counter value is ${value}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
