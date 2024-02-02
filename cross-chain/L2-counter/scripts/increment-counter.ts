import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Provider, utils } from "zksync-ethers";
const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "0xf92a4370766b8996E4059860523238cB13A24CFA";
const COUNTER_ABI = require("./counter.json");
const COUNTER_ADDRESS = "0x8e59C5F14C2fA6396B649Ca0F57D3B0A6A4F2565";

async function main() {
  // Enter your Ethereum L1 provider RPC URL.
  const l1Provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8ef07dfe7367497f9b7d4a7ad2437ec8");
  const wallet = new ethers.Wallet("2da196251859393fbd131880a2912446feeff732d4b84d797b49a94447b04655", l1Provider);
  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  const l2Provider = new Provider("https://sepolia.era.zksync.dev");
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  const zkSyncContract = new Contract(
    zkSyncAddress,
    utils.ZKSYNC_MAIN_ABI,
    wallet,
  );

  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  const gasPrice = await l1Provider.getGasPrice();

  const gasLimit = await l2Provider.estimateL1ToL2Execute({
    contractAddress: COUNTER_ADDRESS,
    calldata: data,
    caller: utils.applyL1ToL2Alias(GOVERNANCE_ADDRESS),
  });

  const baseCost = await zkSyncContract.l2TransactionBaseCost(
    gasPrice.mul(2),
    gasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
  );

  console.log('>>>>>>')
  const tx = await govcontract.callZkSync(
    zkSyncAddress,
    COUNTER_ADDRESS,
    data,
    gasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
    {
      value: baseCost,
      gasPrice: gasPrice.mul(2),
      nonce: 6
    },
  );

  console.log(tx)
  await tx.wait();

  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
