// "use client";
//import createLeaves from "../../../../backend/js/createLeaves";
import CreateLeavesForm from "../../../components/CreateLeavesForm";
import Link from "next/link";

export default function Page() {
  return (
    // <main className="flex min-h-screen flex-col p-10">
    //   <div className="bg-red-300">
    //     <h1 className="items-center font-mono p-10 text-2xl font-bold ">
    //       <Link href="/organizer">Organizer</Link>
    //     </h1>
    //   </div>

    // </main>
    <div className="min-h-screen justify-center bg-green-200 text-purple-200 flex">
      <div className="mt-[14vh] items-center justify-self-center flex flex-col w-2/3 bg-purple-400">
        <h1 className="font-mono justify-self-center p-10 text-2xl font-bold ">
          <Link href="/organizer">Organizer</Link>
        </h1>
        <div>
          <p className="font-mono px-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in
            aliquet turpis. Duis vehicula eros eget purus ultricies vulputate.
            Nunc vitae malesuada odio, eleifend facilisis orci. Cras vehicula
            luctus diam, vitae elementum purus laoreet sit amet. Vestibulum ac
            lectus posuere neque tincidunt tincidunt. Curabitur suscipit erat
            est, eu placerat mi blandit ut. Vivamus viverra, nunc a molestie
            sollicitudin, sapien quam aliquam orci, at porta purus urna ac
            metus. Nullam bibendum lacus eget faucibus sagittis. Maecenas ut
            feugiat odio. Maecenas mauris purus, consequat sed fermentum quis,
            ultricies in nibh. Suspendisse in nisl in metus ornare elementum in
            vitae ex. Sed vestibulum accumsan mattis. Aliquam id dignissim diam,
            et rhoncus felis. Praesent rutrum sollicitudin arcu, ut porta nunc
            finibus rhoncus. Ut sed nisl lorem. Proin pharetra massa augue, a
            faucibus metus consectetur vitae. Aenean sit amet auctor tortor.
          </p>
        </div>
      </div>
    </div>
  );
}
