import Link from "next/link";
import ScenarioGrid from "@/components/rate/ScenarioGrid";

export const metadata = {
  title: "Rate Videos — GayGayFans",
  description: "Compare and rate AI-generated video variants",
};

export default function RatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm mb-2 inline-block"
            >
              &larr; Back to feed
            </Link>
            <h1 className="text-2xl font-bold">Rate Video Variants</h1>
            <p className="text-gray-400 mt-1">
              Click a scenario to compare and rate the generated videos
            </p>
          </div>
        </div>
        <ScenarioGrid />
      </div>
    </div>
  );
}
