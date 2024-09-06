require("@nomicfoundation/hardhat-toolbox");
// infura.ioのAPI Key
const INFURA_API_KEY = vars.get("INFURA_API_KEY");

// MetamaskのSepolia ETHを持っているアカウントの秘密鍵
const ACCOUNT_PRIVATE_KEY = vars.get("ACCOUNT_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};
