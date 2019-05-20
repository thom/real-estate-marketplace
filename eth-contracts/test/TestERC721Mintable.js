var NipaHutERC721Token = artifacts.require('NipaHutERC721Token');

contract('TestERC721Mintable', accounts => {
  const account1 = accounts[0];
  const account2 = accounts[1];
  const totalSupplyAccount1 = 5;
  const totalSupplyAccount2 = 10;
  const totalSupply = totalSupplyAccount1 + totalSupplyAccount2;

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

  console.log("TestERC721Mintable:");
  console.log("Account one: accounts[0] ", accounts[0]);
  console.log("Account two: accounts[1] ", accounts[1]);

  describe('match erc721 spec', function () {
    beforeEach(async function () { 
      this.contract = await NipaHutERC721Token.new({from: account1});

      // Mint multiple tokens
      for (var i = 0; i < totalSupplyAccount1; i++) {
          await this.contract.mint(account1, i, {from: account1});
      }

      for (var i = totalSupplyAccount1; i < totalSupply; i++) {
          await this.contract.mint(account2, i, {from: account1});
      }
    });

    it('should return total supply', async function () { 
      let result = await this.contract.totalSupply.call();
      assert.equal(totalSupply, result);
    });

    it('should get token balance', async function () {
      let result = await this.contract.balanceOf(account1);
      assert.equal(totalSupplyAccount1, result);

      result = await this.contract.balanceOf(account2);
      assert.equal(totalSupplyAccount2, result);
    });

    // Token URI should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token URI', async function () { 
      let result = await this.contract.tokenURI(1);
      assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", result);
    });

    it('should transfer token from one owner to another', async function () { 
      await this.contract.transferFrom(account2, account1, (totalSupply-1), {from: account2});
      let result = await this.contract.ownerOf((totalSupply-1));
      assert.equal(account1, result);

      result = await this.contract.balanceOf(account1);
      assert.equal(totalSupplyAccount1 + 1, result, "account 1 gains 1 token");

      result = await this.contract.balanceOf(account2);
      assert.equal(totalSupplyAccount2 - 1, result, "account 2 loses 1 token");

      result = await this.contract.totalSupply.call();
      assert.equal(totalSupply, result, "total supply stays");
    });
  });

  describe('have ownership properties', function () {
    beforeEach(async function () { 
      this.contract = await NipaHutERC721Token.new({from: account1});
    });

    it('should fail when minting when address is not contract owner', async function () { 
      try {
        await this.contract.mint(account2, 1, {from: account2});
      } catch(err) {
        assert.equal(err.reason, "caller must be the contract owner");
      }
    });

    it('should return contract owner', async function () { 
      let result = await this.contract.owner();
      assert.equal(account1, result);
    });
  });
})