import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Provider, utils } from "zksync-ethers";

const CONFIG = require("../../L1-governance/sepolia.json")
const DESTINATION_NFT_ABI = require("./destinationNFT.json");
const VAULT_ABI = require("./vault.json");

const VAULT_ADDRESS = "0x7096b10e158a28a110ec61a21fd8dc56cc064e80";
const DESTINATION_NFT_ADDRESS = "0xc54c47A3B872621D192430bb81fbB0a2c8dD282B";
const ORIGIN_NFT_ADDRESS = "0xaF8301d33f3341Fc6Ac0e98191015Fa9FF5A4D11";
const DESTINATION_USER_ADDRESS = "0x48F54e595bf039CF30fa5F768c0b57EAC6508a06";
const BRIDGE_TOKEN_ID = 1;

async function main() {
  const l1Provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8ef07dfe7367497f9b7d4a7ad2437ec8");
  const wallet = new ethers.Wallet(CONFIG.deployerPrivateKey, l1Provider);
  const vaultContract = new Contract(VAULT_ADDRESS, VAULT_ABI, wallet);

  const l2Provider = new Provider("https://sepolia.era.zksync.dev");
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  const zkSyncContract = new Contract(
    zkSyncAddress,
    utils.ZKSYNC_MAIN_ABI,
    wallet,
  );

  const destinationNFT = new ethers.utils.Interface(DESTINATION_NFT_ABI);
  const data = destinationNFT.encodeFunctionData("safeMint", [ DESTINATION_USER_ADDRESS, BRIDGE_TOKEN_ID ]);

  const gasPrice = await l1Provider.getGasPrice();
  const gasLimit = await l2Provider.estimateL1ToL2Execute({
    contractAddress: VAULT_ADDRESS,
    calldata: data,
    caller: utils.applyL1ToL2Alias(VAULT_ADDRESS),
  });

  const baseCost = await zkSyncContract.l2TransactionBaseCost(
    gasPrice.mul(2),
    gasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
  );

  const bridgeTx = await vaultContract.wormhole(
    BRIDGE_TOKEN_ID,
    ORIGIN_NFT_ADDRESS,
    zkSyncAddress,
    DESTINATION_NFT_ADDRESS,
    data,
    gasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
    {
      value: baseCost,
      gasPrice: gasPrice.mul(2),
    },
  );

  console.log(bridgeTx)
  await bridgeTx.wait();

  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(bridgeTx);

  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
