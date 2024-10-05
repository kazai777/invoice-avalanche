require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [``], // Remplacez par votre clé privée
    },
    mainnet: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts: [``], // Clé privée sur le mainnet Avalanche
    },
  },
};
