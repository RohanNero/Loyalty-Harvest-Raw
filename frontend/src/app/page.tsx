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
          <h1 className="border text-2xl w-3/12 rounded border-green-500 border-2 hover:border-purple-600 bg-gradient-to-r from-purple-400 to-purple-400 text-purple-600 from-30% hover:to-purple-800 hover:from-green-600 hover:text-green-300 hover:shadow-lg hover:-translate-y-1 py-3 px-7 font-mono">
            Loyalty Harvest
          </h1>
        </div>

        <div className="flex justify-evenly font-mono bg-green-300 py-32 w-full h-[69vh]">
          {/* User component */}
          <Link className="w-1/3" href="/user">
            {/* Gold coin 1 container */}
            <div className="relative flex items-center justify-center h-96 w-96 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-300 shadow-lg rounded-full border-8 border-yellow-500 hover:-translate-y-2 hover:shadow-xl hover:from-yellow-200 hover:via-yellow-500 hover:from-15% hover:to-85% hover:to-yellow-200">
              {/* Four Leaf Clover */}
              <div className="h-1/3 w-1/3 relative flex items-center justify-center">
                {/* Main Square */}
                <div className="absolute h-full w-full bg-green-700"></div>
                {/* Leaf 1 left */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -left-[25%] top-0"></div>
                {/* Leaf 1 right */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -left-[.1%] -top-[25%]"></div>
                {/* Leaf 2 left */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -right-[25%] top-0"></div>
                {/* Leaf 2 right */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -right-[.1%] -top-[25%]"></div>
                {/* Leaf 3 left */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -left-[25%] bottom-0"></div>
                {/* Leaf 3 right */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -left-[.1%] -bottom-[25%]"></div>
                {/* Leaf 4 left */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -right-[25%] bottom-0"></div>
                {/* Leaf 4 right */}
                <div className="absolute h-1/2 w-1/2 rounded-full bg-green-700 -right-[.1%] -bottom-[25%]"></div>
                {/* Stem */}
                <div className="absolute h-2/3 w-1/12 rotate-6 bg-green-700 rounded-br-lg -bottom-1/2 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </Link>

          {/* Organizer component */}
          <Link className="w-1/3" href="/organizer">
            {/* The pot */}
            <div className="relative w-96 h-96  bg-gray-800 rounded-full z-10">
              {/* The gold coins */}
              <div className="rounded-full h-8 w-8 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-300 shadow-lg border-4 border-yellow-400 absolute -top-4 left-[75%]"></div>
              <div className="rounded-full h-8 w-8 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-300 shadow-lg border-4 border-yellow-400 absolute -top-4 left-[50%]"></div>
              {/* Gold coin 1 container */}
              <div className="relative">
                {/* Gold Coin */}
                <div className="rounded-full h-12 w-12 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-300 shadow-lg border-4 border-yellow-400 absolute -top-4 left-[25%]"></div>
                {/* Four Leaf Clover */}
                <div className="h-4 w-4 relative flex items-center justify-center">
                  {/* Main Square */}
                  <div className="absolute h-full w-full bg-green-600"></div>
                  {/* Leaf 1 left */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[25%] top-0"></div>
                  {/* Leaf 1 right */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[.1%] -top-[25%]"></div>
                  {/* Leaf 2 left */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[25%] top-0"></div>
                  {/* Leaf 2 right */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[.1%] -top-[25%]"></div>
                  {/* Leaf 3 left */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[25%] bottom-0"></div>
                  {/* Leaf 3 right */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[.1%] -bottom-[25%]"></div>
                  {/* Leaf 4 left */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[25%] bottom-0"></div>
                  {/* Leaf 4 right */}
                  <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[.1%] -bottom-[25%]"></div>
                  {/* Stem */}
                  <div className="absolute h-full w-1/4 rotate-6 bg-green-600 rounded-br-lg -bottom-1/2 left-1/2 transform -translate-x-1/2"></div>
                </div>
              </div>
              {/* The top of the pot */}
              <div className="w-80 h-10 bg-gray-800 rounded-lg absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              {/* Little shiny spot on the pot */}
              <div className="w-5 h-6 bg-gray-100 rounded-full absolute top-28 right-3/4 transform translate-x-2/3"></div>
            </div>
          </Link>

          {/* Four Leaf Clover */}
          <div className="h-32 w-32 relative flex items-center justify-center bg-red-300">
            {/* Main Square */}
            <div className="absolute h-full w-full bg-green-600"></div>
            {/* Leaf 1 left */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[25%] top-0"></div>
            {/* Leaf 1 right */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[.1%] -top-[25%]"></div>
            {/* Leaf 2 left */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[25%] top-0"></div>
            {/* Leaf 2 right */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[.1%] -top-[25%]"></div>
            {/* Leaf 3 left */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[25%] bottom-0"></div>
            {/* Leaf 3 right */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -left-[.1%] -bottom-[25%]"></div>
            {/* Leaf 4 left */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[25%] bottom-0"></div>
            {/* Leaf 4 right */}
            <div className="absolute h-1/2 w-1/2 rounded-full bg-green-600 -right-[.1%] -bottom-[25%]"></div>
            {/* Stem */}
            <div className="absolute h-20 w-2 rotate-6 bg-green-600 rounded-br-lg -bottom-10 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
