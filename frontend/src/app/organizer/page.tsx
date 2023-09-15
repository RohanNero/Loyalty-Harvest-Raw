// "use client";
//import createLeaves from "../../../../backend/js/createLeaves";
import CreateLeavesForm from "../../../components/CreateLeavesForm";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col  p-10">
      <h1 className="z-10 max-w-5xl w-full items-center justify-between font-mono lg:flex text-2xl font-bold">
        Organizer
      </h1>
      <CreateLeavesForm />
    </main>
  );
}
