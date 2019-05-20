var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var SquareVerifier = artifacts.require('SquareVerifier');
const zokratesProof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", accounts => {
  const account1 = accounts[0];
  const account2 = accounts[1];
  const tokenID = 1;

  ///Available Accounts
  ///==================
  ///(0) 0x6b7a64ed8be6c748fea3deb7f30c3d10e44cdced
  ///(1) 0xdd1e815fa6f1913f0e0adfa831d474c21d0a8d91
  ///(2) 0x2a0668826a7505f72649f14c71d8290e13b802b7
  ///(3) 0xec7d9247f106a24c442b4628fd0515d29e79e131
  ///(4) 0xd06230a32f6cca1d72f086a594af5e7b8d67f016
  ///(5) 0xe55f21bfbc3d3a534b7f95336232b4abf1c4a3e8
  ///(6) 0x03cb6d7f2ba941e78ad151b60fc75216639cc310
  ///(7) 0x28f4ebd33370346e60d73b76d58e112bcbf5c20a
  ///(8) 0xbcdbf6d2022e773e50d04ca1c5b2f313d4c3325a
  ///(9) 0x331037c18c68bdee1f7998d45bb6403bc0deb9cb

  console.log("TestSolnSquareVerifier:");
  console.log("Account one: accounts[0] ", accounts[0]);
  console.log("Account two: accounts[1] ", accounts[1]);

  beforeEach(async() => {
    let squareVerifierContract = await SquareVerifier.new({from: account1});
    this.contract = await SolnSquareVerifier.new(squareVerifierContract.address, {from: account1});
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("should add new solution", async() => {
    let result = false;

    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account2, tokenID, { from: account2 });
      result = true;
    } 
    catch(e) {
      console.log(e);
      result = false;
    }
    assert.equal(result, true);
  });

  it("should not add new solution if the proof was used previously", async() => {
    let result = false;

    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account2, tokenID, { from: account2 });
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account2, tokenID+1, { from: account2 });
      result = true;
    } catch(e) {
      result = false;
    }
    assert.equal(result, false);
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("should be able to mint new token after solution has been submitted", async() => {
    let result = false;
    try {
      await this.contract.submitSolution(...Object.values(zokratesProof.proof), zokratesProof.inputs, account2, tokenID, { from: account2 });
      await this.contract.mint(account2, tokenID, { from: account1 });
      result = true
    } catch(e) {
      console.log(false);
      result = false;
    }
    assert.equal(result, true);
  });
});