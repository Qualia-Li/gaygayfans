"use client";

import { useAgeGate } from "@/store/ageGate";
import AgeGate from "@/components/AgeGate";
import Feed from "@/components/Feed";
import Header from "@/components/Header";

export default function Home() {
  const verified = useAgeGate((s) => s.verified);

  if (!verified) {
    return <AgeGate />;
  }

  return (
    <main className="relative h-dvh w-full bg-black">
      <Header />
      <Feed />
    </main>
  );
}
