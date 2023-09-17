// "use client";
//import createLeaves from "../../../../backend/js/createLeaves";
//import CreateLeavesForm from "../../../../components/CreateLeavesForm";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-10">
      <div className="bg-red-300">
        <h1 className="items-center font-mono text-2xl font-bold ">
          <Link href="/organizer">Organizer</Link>
        </h1>
      </div>
    </main>
  );
}
