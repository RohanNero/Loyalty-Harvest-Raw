const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");

async function main() {
  // grab the merkle tree from the specified path, this could potentially become an input param
  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync("trees/tree_00.json", "utf8")),
  );

  // loop through the tree and find entries that match the target address
  for (const [i, v] of tree.entries()) {
    if (v[0] === "0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E") {
      // obtain the proof at the target entry and log it
      const proof = tree.getProof(i);
      console.log("Value:", v);
      console.log("Proof:", proof);
    }
  }
}

main();
