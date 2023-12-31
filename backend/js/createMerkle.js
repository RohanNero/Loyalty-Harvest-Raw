const Web3 = require("web3");
const ethers = require("ethers");
const keccak256 = require("keccak256");
require("dotenv").config();
const { claimAbi } = require("../abi/Claim.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");

const url =
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

const web3 = new Web3(url);

// const leaves = [
//   [
//     "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//     "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//     "0",
//     "4283030",
//   ],
//   [
//     "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//     "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//     "1",
//     "4283024",
//   ],
//   [
//     "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//     "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//     "2",
//     "4283030",
//   ],
//   [
//     "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//     "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//     "3",
//     "4283030",
//   ],
//   [
//     "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//     "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//     "4",
//     "4283030",
//   ],
// ];

// This script is called after the reward period has ended
// 1. it first creates leaves of all the original NFT holders
// 2. then loops through the reward period block frame to view all the `Transfer` events, if one was fired,
// the heldDuration of that leaf is then set to the block that it was transferred at.
// 3. if the duration wasn't set during the loop through the event, it is set to the endBlock.
// 4. now that we have all of the leaves, we can construct the merkle tree and get the root.
// 5. share the root publicly, and the method used to derive the root, this way anyone can prove the root is legit <-- not a true code step
// 6. users create a leaf using their signature, id, and possibily the block they sold at, then a proof using the leaf and the root
// 7. users call claim() function in smart contract with `root`, `proof`, and `leaf` to get their reward.

/**
 * This function creates the Merkle Tree by taking in two input parameters
 * leaves - all of the leaves to build the tree with
 * structure - array of strings describing the types inside the leaves
 */
export default async function createMerkle(leaves, structure) {
  // Example leaves for testing, realistically, this script will take in an array as input with the true leaves
  // the leaves will be created in a seperate script `createLeaves`, this script will take input such as blockStart, blockEnd, contractAddress
  // other likely input parameters would be the path to where the tree json file will be written
  // and an array of strings that describe the leaf variable types
  // leaf consists of `holder`, `tokenId`, `eventId`, `heldUntil`

  // console.log("script input:");
  // console.log("leaves:", leaves);
  // console.log("structure:", structure);

  // ensure the `structure` and `leaves` objects are compatible
  // console.log("firstLeaf:", leaves[0]);
  if (leaves[0].length != structure.length) {
    console.log("leaves data and leaf structure doesn't match");
    console.log("leaves data length:", leaves[0].length);
    console.log("leaf structure length:", structure.length);
    return;
  }
  //console.log("create the tree");
  // Create the merkle tree and explicitly state the structure of the leaves
  const tree = StandardMerkleTree.of(leaves, structure);

  //console.log("Tree:", tree);
  console.log("createMerkle script: Merkle Root:", tree.root);
  // write the entire tree to a json file at the specified path
  //fs.writeFileSync("backend/trees/tree_00.json", JSON.stringify(tree.dump()));
  const result = {
    tree,
    root: tree.root,
  };

  return result;
}

// createMerkle(
//   [
//     [
//       "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//       "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//       "0",
//       "4283030",
//     ],
//     [
//       "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//       "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//       "1",
//       "4283024",
//     ],
//     [
//       "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//       "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//       "2",
//       "4283030",
//     ],
//     [
//       "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//       "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//       "3",
//       "4283030",
//     ],
//     [
//       "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E",
//       "0x52469E13ac6DdbFbf803F48E7106f8294E2B888f",
//       "4",
//       "4283030",
//     ],
//   ],
//   ["address", "address", "uint256", "uint256"],
// );
