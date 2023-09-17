"use client";
import React, { useState } from "react";
//import createLeaves from "../../backend/js/createLeaves";
import { POST } from "../src/app/api/route";

// const fetch = require("node-fetch");
// const retry = require("async-retry");

// import fetch from "node-fetch"
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
      // const leaves = await fetch("/api/createLeavesAPI", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json", // Specify JSON content type
      //   },
      //   body: JSON.stringify(formData),
      //   retries: 5, // Number of retries before giving up
      //   factor: 2, // Exponential factor
      //   minTimeout: 1000, // Minimum wait time before retrying
      //   maxTimeout: 60000, // Maximum wait time before retrying
      //   randomize: true, // Randomize the wait time
      // });
      const leaves = await retry(
        async () => {
          // Make the API request
          console.log("reached?");
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
      return result;
      //const leaves = POST(formData);
      //console.log("Merkle Tree Leaves:", fetchWithRetries);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4 md:p-10">
      <h3 className="text-xl mb-4">Create Leaves Input Form</h3>
      <form className="border rounded p-4 text-center " onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="string"
            name="nftAddress"
            placeholder="NFT contract address"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.nftAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="blockStart"
            placeholder="Starting block number"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.blockStart}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="blockEnd"
            placeholder="Ending block number"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.blockEnd}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="totalSupply"
            placeholder="Total amount of NFTs"
            className="border border-gray-300 rounded p-2 w-full"
            value={formData.totalSupply}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
