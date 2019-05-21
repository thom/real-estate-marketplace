#!/usr/bin/env node
'use strict';

const Web3 = require('web3');
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

// Read Infura key
const infuraKey = fs.readFileSync(".infura-key").toString().trim();

// Read MetaMask seed phrase (mnemonic)
const mnemonic = fs.readFileSync(".mnemonic").toString().trim();

// Get contract file
const contractFile = require('./build/contracts/SolnSquareVerifier');

// Read configuration (contract addresses)
const config = require('./config.json');

// The script expects the following argument:
// - Token ID
const argv = process.argv.slice(2);
const tokenId = argv[0];

(async() => {
  const provider = await new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`, 0);
  const web3 = await new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const contract = await new web3.eth.Contract(contractFile.abi, config.SolnSquareVerifier, { gasLimit: "4500000" });

  console.log(`Before minting, the contract has ${(await contract.methods.totalSupply().call()).toString()} token`);
  console.log(`Minting new token:\n- Token ID: ${tokenId}\n- Address ${accounts[0]}`);

  try {
    let result = await contract.methods.mint(accounts[0], tokenId).send({ from: accounts[0], gas: 2500000});
    console.log(result)
  } catch(err) {
    throw err
  }
  
  console.log(`After minting, the contract has ${(await contract.methods.totalSupply().call()).toString()} token`);

  process.exit(1);
  process.kill(process.pid);
})();