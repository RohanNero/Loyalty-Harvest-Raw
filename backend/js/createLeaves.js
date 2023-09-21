const Web3 = require("web3");
require("dotenv").config();
const { nftAbi } = require("../abi/NFT.json");

//const url = "https://eth-sepolia.public.blastapi.io"; //`eth_getLogs` doesn't work
//const url = "https://rpc2.sepolia.org"; // `missing trie node`
//const url = "https://ethereum-sepolia.blockpi.network/v1/rpc/public"; // `missing trie node`
//const url = "https://eth-sepolia-public.unifra.io"; // `missing trie node`
const url = "https://eth-sepolia.g.alchemy.com/v2/demo"; // exceeded concurrent requests capacity <-- ALCHEMY
// const url =
//   "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

const web3 = new Web3(url);

// used to view the NFT holders at `blockStart`
async function getOwnerAtBlock(nftContract, tokenId, blockNumber) {
  const contractCall = nftContract.methods.ownerOf(tokenId);
  const owner = await contractCall.call(undefined, blockNumber);
  return owner;
}

//console.log("url:", url);

/** This funtion returns an array of leaves that can be used to create a Merkle tree
 * INPUT:
 * 1. nftAddress is the address of the NFT collection to use
 * 2. blockStart is the starting block number of the reward period
 * 3. blockEnd is the ending block number of the reward period
 * 4. totalSupply is the total amount of NFTs, which will be the total number of leaves
 */
export default async function createLeaves(
  nftAddress,
  blockStart,
  blockEnd,
  totalSupply,
) {
  //   console.log("nftAddress:", nftAddress);
  //   console.log("blockStart:", blockStart);
  //   console.log("blockEnd:", blockEnd);
  //   console.log("totalSupply:", totalSupply);
  const leafStructure = ["address", "address", "uint256", "uint256"];

  /// EXAMPLE VALUES:
  // block start: 4283020
  // block end: 4283030
  // transfered: 4283024
  // `tokenId` 1 should get 40% of the rewards

  /**
   * 1. create initial leaves at `blockStart` for every tokenId, i.e. 100 NFTs = 100 Leaves
   * - These leaves should contain: holderAddress, tokenId, eventId,
   * 2.
   *
   */
  const leaves = [];

  const nftContract = new web3.eth.Contract(nftAbi, nftAddress); // Replace ABI with your NFT contract's ABI

  //  Loop through NFTs and set initial leaf data
  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const holderAddress = await getOwnerAtBlock(
      nftContract,
      tokenId,
      blockStart,
    );
    const initialLeafData = [
      holderAddress,
      nftAddress,
      tokenId.toString(),
      "0",
    ]; // Default heldUntil as 0
    leaves.push(initialLeafData);
  }

  // Loop through blocks to update heldUntil for transferred NFTs
  for (let blockNumber = blockStart; blockNumber <= blockEnd; blockNumber++) {
    const events = await nftContract.getPastEvents("Transfer", {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    });
    // console.log("--------------------");
    // console.log("blockNumber:", blockNumber);
    // console.log("events:", events);
    for (const event of events) {
      const tokenId = event.returnValues.tokenId;
      const leafIndex = tokenId; // Assuming tokenId corresponds to leaf index
      //console.log("tokenId:", tokenId);
      //console.log(leaves[leafIndex]);
      leaves[leafIndex][3] = blockNumber.toString(); // Update heldUntil
    }
  }

  // Set default/0 value heldUntil to blockEnd for remaining NFTs
  for (let i = 0; i < leaves.length; i++) {
    if (leaves[i][3] === "0") {
      leaves[i][3] = blockEnd.toString();
    }
  }

  // Finally return the leaves
  return leaves;
}

// Call the createLeaves function and log the resulting leaves
// createLeaves("0x52469E13ac6DdbFbf803F48E7106f8294E2B888f", 4283020, 4283030, 7)
//   .then((leaves) => {
//     console.log("Merkle Tree Leaves:");
//     console.log(leaves);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
