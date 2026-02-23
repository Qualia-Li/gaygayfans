"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Scenario } from "@/types/rate";
import { useRatingStore } from "@/store/ratingStore";
import VideoComparison from "@/components/rate/VideoComparison";

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reset = useRatingStore((s) => s.reset);

  useEffect(() => {
    // Reset ratings when navigating to a new scenario
    reset();

    fetch(`/api/rate/scenarios/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setScenario(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, reset]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">Scenario not found</p>
        <Link href="/rate" className="text-pink-400 hover:underline">
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/rate"
          className="text-gray-400 hover:text-white text-sm mb-4 inline-block"
        >
          &larr; Back to gallery
        </Link>
        <h1 className="text-2xl font-bold mb-6">{scenario.name}</h1>
        <VideoComparison scenario={scenario} />
      </div>
    </div>
  );
}
