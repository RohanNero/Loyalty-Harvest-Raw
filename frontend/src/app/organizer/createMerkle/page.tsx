// "use client";
//import createLeaves from "../../../../backend/js/createLeaves";
import CreateMerkleForm from "../../../../components/createMerkleForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen justify-center bg-green-200 text-purple-200 flex">
      <div className="mt-[14vh] items-center justify-self-center flex flex-col w-2/3 bg-purple-400">
        <h1 className="font-mono justify-self-center p-10 text-2xl font-bold ">
          <Link href="/organizer">Organizer</Link>
        </h1>
        <CreateMerkleForm />
        <div>
          <p className="font-mono px-10">Lorem ipsum dolor sit amet</p>
        </div>
      </div>
    </div>
  );
}
