"use client";
import React, { useState } from "react";
//import createLeaves from "../../backend/js/createLeaves";
// Route handler api call, not sure how to use route handlers currently lol
//import { POST } from "../src/app/api/route";
// Used to ensure that the call suceeds past `exceeded rate limit` error
import retry from "async-retry";

export default function CreateLeavesForm() {
  // State to manage input values
  const [formData, setFormData] = useState({
    nftAddress: "",
    blockStart: "",
    blockEnd: "",
    totalSupply: "",
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call createLeaves with the input values
    const { nftAddress, blockStart, blockEnd } = formData;
    try {
      console.log("formData:", formData);
      // Original fetch request without `retries`
      // const leaves = await fetch("/api/createLeavesAPI", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json", // Specify JSON content type
      //   },
      //   body: JSON.stringify(formData)
      // });
      const leaves = await retry(
        async () => {
          // Make the API request
          const response = await fetch("/api/createLeavesAPI", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Specify JSON content type
            },
            body: JSON.stringify(formData),
          });

          // Parse the response JSON
          let json = await response.json();

          // If we receive a 429 error (Too Many Requests), log an error and retry
          if (json.error) {
            console.error("HTTP error 429: Too Many Requests, retrying...");
            throw new Error("HTTP error 429: Too Many Requests, retrying...");
          }

          // Otherwise, return the response JSON
          return json;
        },
        {
          retries: 5, // Number of retries before giving up
          factor: 2, // Exponential factor
          minTimeout: 1000, // Minimum wait time before retrying
          maxTimeout: 60000, // Maximum wait time before retrying
          randomize: true, // Randomize the wait time
        }
      );

      // Return the result
      console.log("leaves:", leaves);
      return leaves;
      //const leaves = POST(formData);
      //console.log("Merkle Tree Leaves:", fetchWithRetries);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-purple-400 font-mono py-3 mb-4 w-1/2 flex-col flex items-center justify-center w-2/3">
      <h3 className="text-xl text-green-300 justify-self-center mb-4">
        Create Leaves
      </h3>
      <form
        className="text-center w-full flex flex-col gap-2 items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          type="string"
          name="nftAddress"
          placeholder="NFT contract address"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0  rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.nftAddress}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="blockStart"
          placeholder="Starting block number"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0 rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.blockStart}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="blockEnd"
          placeholder="Ending block number"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0 rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.blockEnd}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="totalSupply"
          placeholder="Total amount of NFTs"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0 rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.totalSupply}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="bg-purple-700 border-purple-800 border text-green-300 rounded my-2 px-4 py-2 bg-gradient-to-r from-green-400 to-purple-700 hover:to-purple-500 hover:from-green-300 hover:text-purple-600 hover:shadow-lg hover:-translate-y-1   hover:bg-green-300 w-1/2"
        >
          Create
        </button>
      </form>
    </div>
  );
}
