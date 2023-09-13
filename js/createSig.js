const Web3 = require("web3");
require("dotenv").config();

const url =
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

//console.log("url:", url);

// address is the third argument in terminal
// 1. = node
// 2. = js/createSig.js
// 3. = 0xe4a98d2bfd66ce08128fdfffc9070662e489a28e
//const address = process.argv[2];

// This funtion returns a signature for the PRIVATE_KEY in the .env file
// You must pass in an address `to` to be hashed, this address will receive the rewards when `claim` is called
/** INPUT:
 * 1. address to encode 0xe4a98d2bfd66ce08128fdfffc9070662e489a28e
 * 2. eth_signTypedData_v4 from metamask will be needed to sign using private key
 */
async function createSig(address) {
  console.log("address:", address);
  if (address == undefined) {
    console.log("address is undefined!");
    return;
  }
  const web3 = new Web3(url); // Replace with your Ethereum node URL
  const packedEncoding = web3.utils.encodePacked(address);
  //console.log("packedEncoding:", packedEncoding);

  const messageHash = web3.utils.soliditySha3(packedEncoding);
  //console.log("messageHash:", messageHash);
  //console.log("defaultAccount:", web3.eth.defaultAccount);
  const sig = await web3.eth.accounts.sign(
    messageHash,
    process.env.PRIVATE_KEY,
    console.log,
  );
  console.log("signature:", sig.signature);
}

// in production this line that calls the main function will be removed, only here for testing
// in reality `createSig` will be imported and called directly on the frontend
createSig("0xe4a98d2bfd66ce08128fdfffc9070662e489a28e");
