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
  const [leafData, setLeafData] = useState([]);
  const [isLoading, setIsLoaing] = useState(false);

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
      setLeafData([]);

      const leaves = await retry(
        async () => {
          setIsLoaing(true);
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

      setIsLoaing(false);
      setLeafData(leaves);
      // Return the result
      console.log("leaves:", leaves);
      return leaves;

      //const leaves = POST(formData);
      //console.log("Merkle Tree Leaves:", fetchWithRetries);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // State to manage pagination
  const [currentPage, setCurrentPage] = useState(1);
  // default 10 items per table page
  const itemsPerPage = 10;

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter the leaves to display only the items in the current page
  const leavesToDisplay = leafData?.leaves?.slice(startIndex, endIndex) || [];

  // Function to handle copying leaves data to clipboard
  const copyToClipboard = () => {
    const leavesText = JSON.stringify(leafData?.leaves, null, 2); // Convert leaves data to a nicely formatted JSON string
    navigator.clipboard
      .writeText(leavesText)
      .then(() => {
        // alert("Leaves data copied to clipboard!");
        console.log("Leaves data copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy leaves data to clipboard: ", error);
        alert("Failed to copy leaves data to clipboard");
      });
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
      {/* Conditionally render the result in a paginated table */}
      {leafData && leafData.success && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-purple-400 mb-2">
            Leaves:
          </h4>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-green-200 bg-green-200 w-full">
              <thead className="bg-green-300">
                <tr>
                  <th className="border border-green-200 p-2 text-purple-500">
                    Holder
                  </th>
                  <th className="border border-green-200 p-2 text-purple-500">
                    NFT Contract
                  </th>
                  <th className="border border-green-200 p-2 text-purple-500">
                    TokenId
                  </th>
                  <th className="border border-green-200 p-2 text-purple-500 custom-padding">
                    Held Until
                  </th>
                </tr>
              </thead>
              <tbody>
                {leavesToDisplay.map((leaf, index) => (
                  <tr key={index}>
                    <td className="border border-green-200 p-2 text-purple-400">
                      {leaf[0]}
                    </td>
                    <td className="border border-green-200 p-2 text-purple-400">
                      {leaf[1]}
                    </td>
                    <td className="border border-green-200 p-2 text-purple-400">
                      {leaf[2]}
                    </td>
                    <td className="border border-green-200 p-2 text-purple-400 custom-padding">
                      {leaf[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="mt-4">
            {leafData.leaves.length > itemsPerPage && (
              <ul className="flex space-x-2">
                {Array.from({
                  length: Math.ceil(leafData.leaves.length / itemsPerPage),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer ${
                      currentPage === index + 1 ? "font-bold" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-lg text-purple-700 font-semibold">Loading... </div>
      )}
      {/* Button to copy leaves data to clipboard */}
      {leafData && leafData.success && (
        <button
          onClick={copyToClipboard}
          className="bg-purple-700 border-purple-800 border text-green-300 rounded my-2 px-4 py-2 bg-gradient-to-r from-green-400 to-purple-700 hover:to-purple-500 hover:from-green-300 hover:text-purple-600 hover:shadow-lg hover:-translate-y-1 hover:bg-green-300 w-1/2"
        >
          Copy Leaves Data to Clipboard
        </button>
      )}
    </div>
  );
}
