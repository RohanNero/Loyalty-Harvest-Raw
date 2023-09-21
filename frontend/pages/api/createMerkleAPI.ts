import { NextApiRequest, NextApiResponse } from "next";
import createMerkle from "../../../backend/js/createMerkle";

export default async function createLeavesAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req:", req.body);
  console.log("API parameters:");

  const { leaves, structure } = req.body;
  // Clean up the 'leaves' string by removing extra spaces and line breaks
  const cleanedLeavesString = leaves.replace(/\s+/g, "");
  // Remove the extra square brackets from the 'leaves' string
  const cleanedLeaves = cleanedLeavesString.slice(2, -2); // Remove the first two and last two characters (square brackets)

  // Split the cleaned 'leaves' string into individual leaf strings
  const leavesArray = cleanedLeaves.split("],[").map((leaf) => `[${leaf}]`);
  console.log("leavesArray:", leavesArray);

  // Manually split each leaf string into an array of values
  const parsedLeavesArray = leavesArray.map((leaf) => {
    // Remove extra square brackets within each leaf string
    const cleanedLeaf = leaf.replace(/\[|\]/g, "");
    // Split the cleaned leaf string into individual values
    const values = cleanedLeaf.split(",");

    // Remove extra quotation marks around each value and trim whitespace
    const cleanedValues = values.map((value) =>
      value.replace(/["']/g, "").trim()
    );
    // Filter out empty strings (caused by trailing commas inside the leaves object)
    return cleanedValues.filter(Boolean);
  });

  console.log("parsedLeavesArray:", parsedLeavesArray);

  //   const parsedLeaves = JSON.parse(leaves);
  //   console.log("parsedLeaves:", parsedLeaves);
  //const parsedLeaves = JSON.parse(JSON.parse(leaves)); // Double parse the leaves string
  //console.log("parsedLeaves:", parsedLeaves);

  //   const parsedStructure = JSON.parse(structure);
  //   console.log("parsedStructure:", parsedStructure);
  console.log("structure:", structure);
  const splitStructure = structure.split(",");
  console.log("splitStructure:", splitStructure);
  console.log("leaves:", leaves);
  console.log("first leaf");
  console.log(leavesArray[0]);

  try {
    const { tree, root } = await createMerkle(
      parsedLeavesArray,
      splitStructure
    );
    console.log("merkleData API tree:", tree);
    console.log("merkleData API root:", root);
    res.status(200).json({ success: true, tree, root });
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("Provided address")) {
      console.log("Invalid address provided!");
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
