// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./Verifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async (deployer) => {
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
};
