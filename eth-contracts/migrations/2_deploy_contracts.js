// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./Verifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier).then(() => {
    deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
  });
};
