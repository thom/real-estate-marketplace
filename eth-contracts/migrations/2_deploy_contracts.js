// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var NipaHutERC721Token = artifacts.require("./NipaHutERC721Token.sol");

module.exports = async function(deployer) {
  await deployer.deploy(NipaHutERC721Token);
  const nipaHutERC721Token = await NipaHutERC721Token.deployed();

  await deployer.deploy(SquareVerifier);
  const verifierContract = await SquareVerifier.deployed();

  await deployer.deploy(SolnSquareVerifier, verifierContract.address);
  const solnSquareVerifier = await SolnSquareVerifier.deployed();
};