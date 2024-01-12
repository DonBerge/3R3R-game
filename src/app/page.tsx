import type { Metadata } from "next";
import GreatGame from "./great-game";

export const metadata: Metadata = {
  title: "3R3R",
  description: "Un tres en raya de tres en rayas",
};

export default function HomePage() {
  return (
    <>
      <main className="flex h-screen w-screen items-center justify-center bg-violet-700 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <GreatGame />
      </main>
    </>
  );
}
