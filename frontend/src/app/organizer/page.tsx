"use client";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col  p-10">
      <h1 className="z-10 max-w-5xl w-full items-center justify-between font-mono lg:flex text-2xl font-bold">
        Organizer
      </h1>
      <div className="max-w-md mx-auto p-4">
        <h3 className="text-xl mb-4">Input Form</h3>
        <form
          className="border rounded bg-gray-300 p-4 text-center"
          onSubmit={(e) => console.log(e)}
        >
          <div className="mb-4">
            <input
              type="string"
              name="nftAddress"
              placeholder="NFT contract address"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              name="blockStart"
              placeholder="Starting block number"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              name="blockEnd"
              placeholder="Ending block number"
              className="border border-gray-300 rounded p-2 w-full"
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
    </main>
  );
}
