import { NextApiRequest, NextApiResponse } from "next";
import createLeaves from "../../../backend/js/createLeaves";

export default async function createLeavesAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req:", req.body);
  const { nftAddress, blockStart, blockEnd, totalSupply } = req.body;
  // console.log("API parameters:");
  // console.log(nftAddress, blockStart, blockEnd, totalSupply);

  try {
    const leaves = await createLeaves(
      nftAddress,
      blockStart,
      blockEnd,
      totalSupply
    );
    console.log("leaves:", leaves);
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("Provided address")) {
      console.log("Invalid address provided!");
    }
    // if (
    //   error.message.includes(
    //     "Your app has exceeded its concurrent requests capacity."
    //   )
    // ) {
    //   console.log(
    //     "Alchemy: 'Your app has exceeded its concurrent requests capacity.'"
    //   );
    // }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
