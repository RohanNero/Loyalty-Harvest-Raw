import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-green-200">
      <div className="pt-4 w-full font-mono text-lg text-center flex justify-between items-center border border-green-500">
        <div className="ml-64 text-green-800">Loyalty Harvest</div>
        <div className="hover:shadow-lg p-1 mr-64">
          <img src="icon.png" alt="Description of the image" />
        </div>
      </div>
      <div className="border rounded w-full text-center pt-20 bg-green-300 ">
        <button className="border rounded border-green-500 border-2  border-purple-600 bg-gradient-to-r from-green-300 to-purple-400 text-purple-600 from-30% hover:to-purple-800 hover:from-green-600 hover:text-green-300 hover:shadow-lg hover:-translate-y-1 py-3 px-7  font-mono">
          Connect
        </button>

        <div className="flex justify-evenly font-mono bg-green-300 py-32 w-full h-[69vh]">
          <div className="border rounded bg-green-200 border-green-500 shadow-lg w-1/3 hover:-translate-y-2">
            Lorum
          </div>
          <div className="border rounded bg-green-200 border-green-500 shadow-lg w-1/3 hover:-translate-y-2">
            Ipsum
          </div>
        </div>
      </div>
    </div>
  );
}
