import "@nomiclabs/hardhat-waffle";

import { HardhatUserConfig } from "hardhat/config";

// import file with Sepolia params
const goerli = require("./sepolia.json");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
  },
  networks: {
    // Sepolia network
    sepolia: {
      url: goerli.nodeUrl,
      accounts: [goerli.deployerPrivateKey],
    },
  },
};

export default config;
