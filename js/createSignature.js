const Web3 = require("web3");
require("dotenv").config();

const url =
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_RPC_URL;

//console.log("url:", url);

// This funtion returns a signature for the PRIVATE_KEY in the .env file
// You must pass in an address `to` to be hashed, this address will receive the rewards when `claim` is called
async function main() {
  const web3 = new Web3(url); // Replace with your Ethereum node URL
  const packedEncoding = web3.utils.encodePacked(
    "0xe4a98d2bfd66ce08128fdfffc9070662e489a28e",
  );
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

main();
