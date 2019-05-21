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

// The script expects the following two arguments:
// - Path to the proof.json
// - Token ID
const argv = process.argv.slice(2);
const proof = require(argv[0]);
const tokenId = argv[1];

(async() => {
  const provider = await new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`, 0);
  const web3 = await new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const contract = await new web3.eth.Contract(contractFile.abi, config.SolnSquareVerifier, { gasLimit: "4500000" });

  console.log(`Submitting solution:\n- Input: ${proof.inputs}\n- Token ID: ${tokenId}\n- Address: ${accounts[0]}`);

  try {
    let result = await contract.methods.submitSolution(...Object.values(proof.proof), proof.inputs, accounts[0], tokenId).send({ from: accounts[0], gas: 2500000});
    console.log(result)
  } catch(err) {
    throw (err);
  }

  process.exit(1);
  process.kill(process.pid);
})();