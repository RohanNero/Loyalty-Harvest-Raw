import { NextResponse } from "next/server";
import createLeaves from "../../../../backend/js/createLeaves";

export async function POST(request: Request) {
  //   const formData = await request.formData();
  console.log("req:", request);
  const { nftAddress, blockStart, blockEnd, totalSupply } = request;
  console.log("nftAddress:", nftAddress);
  console.log("blockStart:", blockStart);
  console.log("blockEnd:", blockEnd);
  console.log("totalSupply:", totalSupply);
  //const leaves = createLeaves(nftAddress, blockStart, blockEnd, totalSupply);
  //console.log("formData:", formData);
  //const res = createLeaves(formData);
  //const data = await res.json();

  //return NextResponse.json(formData);
}
