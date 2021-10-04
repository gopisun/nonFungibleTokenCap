// migrating the appropriate contracts
// var SquareVerifier = artifacts.require("./verifier.sol");
const SquareVerifier  = artifacts.require("./verifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async  function(deployer) {
 await deployer.deploy(SquareVerifier);
 await  deployer.deploy(SolnSquareVerifier, SquareVerifier.address, "GopiToken", "GTK");
};
