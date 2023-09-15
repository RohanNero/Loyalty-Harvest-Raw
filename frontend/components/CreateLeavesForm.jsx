"use client";
import React, { useState } from "react";
import createLeaves from "../../backend/js/createLeaves";

export default function CreateLeavesForm() {
  // State to manage input values
  const [formData, setFormData] = useState({
    nftAddress: "",
    blockStart: "",
    blockEnd: "",
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
      const leaves = await createLeaves(nftAddress, blockStart, blockEnd, 6);
      console.log("Merkle Tree Leaves:", leaves);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl mb-4">Client-Side Input Form</h3>
      <form
        className="border rounded bg-gray-300 p-4 text-center"
        onSubmit={handleSubmit}
      >
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
