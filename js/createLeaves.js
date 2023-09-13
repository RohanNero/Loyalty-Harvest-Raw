const Web3 = require("web3");
require("dotenv").config();

const url =
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

//console.log("url:", url);

/** This funtion returns an array of leaves that can be used to create a Merkle tree
 * INPUT:
 * 1. nftAddress is the address of the NFT collection to use
 * 2. blockStart is the starting block number of the reward period
 * 3. blockEnd is the ending block number of the reward period
 * 4. totalSupply is the total amount of NFTs, which will be the total number of leaves
 */
async function createLeaves(nftAddress, blockStart, blockEnd, totalSupply) {
  console.log("nftAddress:", nftAddress);
  console.log("blockStart:", blockStart);
  console.log("blockEnd:", blockEnd);
  const leafStructure = ["address", "address", "uint256", "uint256"];

  /// EXAMPLE VALUES:
  // block start: 4283017
  // block end: 4283027
  // transfered: 4283024
  // `tokenId` 1 should get 50% of the rewards

  /**
   * 1. create initial leaves at `blockStart` for every tokenId, i.e. 100 NFTs = 100 Leaves
   * - These leaves should contain: holderAddress, tokenId, eventId,
   * 2.
   *
   */
}

// in production this line that calls the main function will be removed, only here for testing
// in reality `createSig` will be imported and called directly on the frontend
createLeaves("0xe4a98d2bfd66ce08128fdfffc9070662e489a28e");
