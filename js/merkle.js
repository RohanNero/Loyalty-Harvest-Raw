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

// Connect to the NFT contract using its ABI and address
const erc721Contract = new web3.eth.Contract(
  NftAbi,
  "0xf61a4b67d8764a715e15a9392a869235bb81672c"
);

// Connect to the Claim contract using its ABI and address
const claimContract = new web3.eth.Contract(claimAbi, claimContractAddress);

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
  const blockNumber = await web3.eth.getBlockNumber();

  // Replace with the starting and ending block numbers of your reward period
  const startBlock = YOUR_START_BLOCK_NUMBER;
  const endBlock = YOUR_END_BLOCK_NUMBER;

  const events = await erc721Contract.getPastEvents("Transfer", {
    fromBlock: startBlock,
    toBlock: endBlock,
  });

  const leaves = [];

  for (const event of events) {
    const { from, to, tokenId } = event.returnValues;
    const heldUntil = event.blockNumber; // Use block number as a timestamp
    const leafData = `${from}${tokenId}${heldUntil}`;
    const leaf = keccak256(leafData);
    leaves.push(leaf);
  }

  // Construct the Merkle tree
  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });

  const root = "0x" + merkleTree.getHexRoot();

  // Now you can set the Merkle root on your Claim contract
  const sender = "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E"; // The address with admin privileges
  const privateKey = process.env.PRIVATE_KEY; // The private key of the admin
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  );

  const wallet = new ethers.Wallet(privateKey, provider);

  const claimContractWithSigner = claimContract.connect(wallet);

  const tx = await claimContractWithSigner.setRoot(root);

  console.log(`Merkle root set: ${root}`);
}

main();
