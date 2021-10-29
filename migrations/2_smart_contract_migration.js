const nAnimals = artifacts.require("nAnimals");

module.exports = function (deployer) {
  deployer.deploy(nAnimals, "https://nanimals.mypinata.cloud/ipfs/QmV8x3WBkmPdWcFi1mR4fgvaq7WFvB3NGSU5Pv1e167HbT/");
};
