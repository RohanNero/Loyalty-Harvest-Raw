// "use client";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left green gradient */}
      <div className="w-1/5 bg-gradient-to-l from-green-300 to-purple-300"></div>

      {/* Middle purple area */}
      <div className="w-3/5 bg-green-300">
        <div className="mt-[14vh] items-center justify-self-center flex flex-col w-full">
          <h1 className="font-mono justify-self-center p-10 text-2xl text-purple-500 font-bold ">
            <Link href="/user">User</Link>
          </h1>
          <div className="w-3/4">
            <p className="font-mono px-10 text-purple-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in
              aliquet turpis. Duis vehicula eros eget purus ultricies vulputate.
              Nunc vitae malesuada odio, eleifend facilisis orci. Cras vehicula
              luctus diam, vitae elementum purus laoreet sit amet. Vestibulum ac
              lectus posuere neque tincidunt tincidunt. Curabitur suscipit erat
              est, eu placerat mi blandit ut.
            </p>
          </div>
        </div>
      </div>

      {/* Right green gradient */}
      <div className="w-1/5 bg-gradient-to-l from-purple-300 to-green-300"></div>
    </div>
  );
}
