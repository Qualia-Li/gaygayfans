"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Scenario } from "@/types/rate";
import { useRatingStore } from "@/store/ratingStore";
import { Container, Heading, Text } from "@radix-ui/themes";
import VideoComparison from "@/components/rate/VideoComparison";

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reset = useRatingStore((s) => s.reset);

  useEffect(() => {
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
        <Text color="gray">Loading...</Text>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Text color="red">Scenario not found</Text>
        <Link href="/rate" className="text-pink-400 hover:underline">
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Container size="4" className="px-4 py-8">
        <Link
          href="/rate"
          className="text-zinc-400 hover:text-white text-sm mb-4 inline-block"
        >
          &larr; Back to gallery
        </Link>
        <Heading size="6" mb="4">{scenario.name}</Heading>
        <VideoComparison scenario={scenario} />
      </Container>
    </div>
  );
}
