const nAnimals = artifacts.require("nAnimals");

module.exports = function (deployer) {
  deployer.deploy(nAnimals, "https://nanimals.mypinata.cloud/ipfs/QmW7w6sgyYNfxLUKSodbAqEmoaD8LYwdRcw8tmPFh69uTF/");
};
