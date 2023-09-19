import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-green-200">
      <div className="pt-4 w-full font-mono text-lg text-center flex justify-between items-center border border-green-500">
        <button className="border-2 border-green-500 hover:border-purple-600 bg-gradient-to-r from-green-300 to-purple-400 text-purple-600 from-30% hover:to-purple-800 hover:from-green-600 hover:text-green-300 hover:shadow-lg hover:-translate-y-1 py-3 px-7 font-mono ml-64 rounded">
          Connect Wallet
        </button>
        <div className="pb-2 mr-64">
          <img src="icon.png" alt="Description of the image" />
        </div>
      </div>
      <div className="border rounded w-full text-center pt-20 bg-green-300">
        <div className="flex justify-center">
          {" "}
          {/* Centering the h1 horizontally */}
          <h1 className="border text-2xl w-3/12 rounded border-green-500 border-2 hover:border-purple-600 bg-gradient-to-r from-purple-400 to-purple-400 text-purple-600 from-30% hover:to-purple-800 hover:from-green-600 hover:text-green-300 hover:shadow-lg hover:-translate-y-1 py-3 px-7 font-mono">
            Loyalty Harvest
          </h1>
        </div>

        <div className="flex justify-evenly font-mono bg-green-300 py-32 w-full h-[69vh]">
          <Link className="w-1/3" href="/user">
            <div className="border rounded bg-green-200 border-green-500 w-full h-5/6 hover:shadow-lg hover:-translate-y-2  hover:border-purple-600">
              User
            </div>
          </Link>

          <Link className="w-1/3" href="/organizer">
            <div className="border rounded bg-green-200 border-green-500 w-full h-5/6 hover:shadow-lg hover:-translate-y-2  hover:border-purple-600">
              Organizer
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
