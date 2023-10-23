import {HardhatUserConfig, NetworkUserConfig} from "hardhat/types";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "solidity-coverage";
import "solidity-docgen";
import "hardhat-contract-sizer";

const chainIds = {
  ganache: 1337,
  hardhat: 1337,
  eth: 1,
  eth_ropsten: 3,
  eth_goerli: 5,
  eth_sepolia: 11155111,
  polygon_mumbai: 80001,
  polygon: 137,
  bsc: 56,
  bsc_testnet: 97,
};

function createNetworkConfig(
  network: keyof typeof chainIds
): NetworkUserConfig | any {
  let url: string = "";
  switch (network) {
    case "bsc_testnet":
      url = "https://data-seed-prebsc-1-s1.binance.org:8545";
      break;
    case "eth_sepolia":
      url = "https://rpc2.sepolia.org";
      break;
    default:
      url = "https://rpc.ankr.com/" + network;
  }
  // console.log("### hardhat url:", url);
  return {
    _name: network,
    // accounts: [privateKeyDeploy],
    chainId: chainIds[network],
    url: url,
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig | any = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      _name: "localhost",
      // accounts: {
      //   mnemonic: MNEMONIC,
      // },
      chainId: chainIds.hardhat,
    },
    ethereum: createNetworkConfig("eth"),
    goerli: createNetworkConfig("eth_goerli"),
    sepolia: createNetworkConfig("eth_sepolia"),
    ropsten: createNetworkConfig("eth_ropsten"),
    mumbai: createNetworkConfig("polygon_mumbai"),
    polygon: createNetworkConfig("polygon"),
    binance: createNetworkConfig("bsc"),
    tbinance: createNetworkConfig("bsc_testnet"),
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 100000000,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
    only: [],
  },
  docgen: {
    output: "docs",
    pages: () => "api.md",
  },
};

export default config;
