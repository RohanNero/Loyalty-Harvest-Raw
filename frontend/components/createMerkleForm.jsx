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
    leaves: [],
    structure: [],
  });
  const [merkleData, setMerkleData] = useState({
    tree: [],
    root: "",
  });
  const [isLoading, setIsLoaing] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Split the input value into an array
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log("formData:", formData);
      // fetch merkleData using `createMerkleAPI`
      setIsLoaing(true);
      const merkleData = await fetch("/api/createMerkleAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = await merkleData.json();
      console.log("MerkleData:", json);
      setIsLoaing(false);
      setMerkleData(json);
      console.log("useState data:", merkleData);
      // Return the result
      return json;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle copying leaves data to clipboard
  const copyToClipboard = () => {
    const merkleText = JSON.stringify(merkleData.tree, null, 2); // Convert leaves data to a nicely formatted JSON string
    navigator.clipboard
      .writeText(merkleText)
      .then(() => {
        // alert("Merkle data copied to clipboard!");
        console.log("Merkle Tree copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy merkle data to clipboard: ", error);
        alert("Failed to copy merkle data to clipboard");
      });
  };
  // Function to handle copying leaves data to clipboard
  const copyRootToClipboard = () => {
    const merkleText = JSON.stringify(merkleData.root, null, 2); // Convert leaves data to a nicely formatted JSON string
    navigator.clipboard
      .writeText(merkleText)
      .then(() => {
        // alert("Merkle data copied to clipboard!");
        console.log("Merkle Tree copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy merkle data to clipboard: ", error);
        alert("Failed to copy merkle data to clipboard");
      });
  };

  return (
    <div className="bg-purple-400 font-mono py-3 mb-4 w-1/2 flex-col flex items-center justify-center w-2/3">
      <h3 className="text-xl text-green-300 justify-self-center mb-4">
        Create Merkle Tree
      </h3>
      <form
        className="text-center w-full flex flex-col gap-2 items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="leaves"
          placeholder="Leaves (comma-separated)"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0 rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.leaves} // Convert the array back to a comma-separated string for display
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="structure"
          placeholder="Leaf Structure (comma-separated)"
          className="border border-purple-500 p-1.5 text-purple-400 focus:ring-0 rounded w-2/3 bg-green-200 hover:bg-green-300"
          value={formData.structure} // Convert the array back to a comma-separated string for display
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
      {merkleData && merkleData.success && (
        <div className="mt-4 p-3 border border-purple-700 rounded bg-green-200">
          <h4 className="text-lg font-semibold text-purple-700 mb-2">
            Merkle Root:
          </h4>
          <div className="text-lg font-semibold text-purple-400 mb-2">
            {merkleData.root}{" "}
          </div>
        </div>
      )}
      {isLoading && <div className="text-lg font-semibold">Loading... </div>}
      {/* Button to copy leaves data to clipboard */}
      {merkleData && merkleData.success && (
        <div className="flex gap-7">
          <button
            onClick={copyToClipboard}
            className="bg-purple-700 border-purple-800 border text-green-300 rounded my-2 px-4 py-2 bg-gradient-to-r from-green-400 to-purple-700 hover:to-purple-500 hover:from-green-300 hover:text-purple-600 hover:shadow-lg hover:-translate-y-1 hover:bg-green-300 w-1/2"
          >
            Copy Merkle Tree to Clipboard
          </button>
          <button
            onClick={copyRootToClipboard}
            className="bg-purple-700 border-purple-800 border text-green-300 rounded my-2 px-4 py-2 bg-gradient-to-r from-green-400 to-purple-700 hover:to-purple-500 hover:from-green-300 hover:text-purple-600 hover:shadow-lg hover:-translate-y-1 hover:bg-green-300 w-1/2"
          >
            Copy Merkle Root to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
