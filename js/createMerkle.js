const Web3 = require("web3");
const ethers = require("ethers");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const env = require("dotenv");
const { claimAbi } = require("../abi/Claim.json");
const { NftAbi } = require("../abi/NFT.json");
const url =
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

const web3 = new Web3(url); // Replace with your Ethereum node URL

// This script is called after the reward period has ended
// 1. it first creates leaves of all the original NFT holders
// 2. then loops through the reward period block frame to view all the `Transfer` events, if one was fired,
// the heldDuration of that leaf is then set to the block that it was transferred at.
// 3. if the duration wasn't set during the loop through the event, it is set to the endBlock.
// 4. now that we have all of the leaves, we can construct the merkle tree and get the root.
// 5. share the root publicly, and the method used to derive the root, this way anyone can prove the root is legit <-- not a true code step
// 6. users create a leaf using their signature, id, and possibily the block they sold at, then a proof using the leaf and the root
// 7. users call claim() function in smart contract with `root`, `proof`, and `leaf` to get their reward.

async function main() {
  //const leaves = ["0-100", "1-75", "2-100", "3-100", "4-50", "5-100", "7-100"];

  class Leaf {
    constructor(ownerAddress = "", nftId = 0, heldUntil = 0) {
      this.ownerAddress = ownerAddress;
      this.nftId = nftId;
      this.heldUntil = heldUntil;
    }

    toString() {
      return `${this.ownerAddress}-${this.nftId}-${this.heldUntil}`;
    }
  }

  // Create instances of the Leaf class and convert them to strings
  const customLeaf0 = new Leaf(
    "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E", // holder address
    0, // tokenId
    0 // heldUntil (block number)
  ).toString();
  const customLeaf1 = new Leaf(
    "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E", // holder address
    1, // tokenId
    0 // heldUntil (block number)
  ).toString();
  const customLeaf2 = new Leaf(
    "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E", // holder address
    2, // tokenId
    0 // heldUntil (block number)
  ).toString();

  const leaves = [customLeaf0, customLeaf1, customLeaf2];

  const merkleTree = new MerkleTree(
    leaves.map((leaf) => keccak256(leaf)),
    keccak256,
    { sortPairs: true }
  );
  console.log("tree:", merkleTree);

  const root = "0x" + merkleTree.getHexRoot();
  console.log("root:", root);

  // Now you can set the Merkle root on your Claim contract
  const sender = "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E"; // The address with admin privileges
  const privateKey = process.env.PRIVATE_KEY; // The private key of the admin
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  );

  console.log(`Merkle root set: ${root}`);
}

main();
