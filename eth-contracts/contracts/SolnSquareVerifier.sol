pragma solidity >=0.4.21 <0.6.0;

// Define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";


// Define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is NipaHutERC721Token {
  SquareVerifier squareVerifier;

  constructor(address squareVerifierAddress) public {
    squareVerifier = SquareVerifier(squareVerifierAddress);
  }

  // Define a solutions struct that can hold an index & an address
  struct Solution {
    uint256 tokenID;
    address owner;
    uint256[2] input;
    bool isMinted;
  }

  // Define an array of the above struct
  mapping(bytes32 => Solution) solutions;

  // Define a mapping to store unique solutions submitted
  mapping(uint256 => bytes32) private solutionSubmissions;

  // Create an event to emit when a solution is added
  event SolutionSubmitted(address indexed owner, uint256 indexed tokenID);

  // Create a function to add the solutions to the array and emit the event
  function submitSolution (uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address account, uint256 tokenID) public {
    require(squareVerifier.verifyTx(a, b, c, input), "unable to verify the solution");

    // Hash a, b, c and the input to create a unique key for the solution
    bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));

    require(solutions[solutionKey].tokenID == 0, "solution has already been used previously; create a new one using ZoKrates");

    solutionSubmissions[tokenID] = solutionKey;
    solutions[solutionKey].owner = account;
    solutions[solutionKey].tokenID = tokenID;
    solutions[solutionKey].input = input;

    emit SolutionSubmitted(account, tokenID);
  }

  // Create a function to mint new NFT only after the solution has been verified
  //  - make sure the solution is unique (has not been used before)
  //  - make sure you handle metadata as well as token supply
  function mint(address to, uint256 tokenID) public returns(bool) {
    bytes32 solutionKey = solutionSubmissions[tokenID];
    require(solutionKey != bytes32(0), "no solution submitted for given token ID");
    require(!solutions[solutionKey].isMinted, "the token has already been minted");

    address owner = solutions[solutionSubmissions[tokenID]].owner;
    require(owner == to, "wrong token owner address provided");

    solutions[solutionKey].isMinted = true;
    return super.mint(to, tokenID);
  }
}