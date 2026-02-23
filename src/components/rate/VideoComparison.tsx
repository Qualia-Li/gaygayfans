"use client";

import { useCallback } from "react";
import type { Scenario } from "@/types/rate";
import { useRatingStore, getVisitorId } from "@/store/ratingStore";
import { Card, Grid, Button, Text, Flex } from "@radix-ui/themes";
import StarRating from "./StarRating";
import BestPicker from "./BestPicker";

interface VideoComparisonProps {
  scenario: Scenario;
}

export default function VideoComparison({ scenario }: VideoComparisonProps) {
  const { ratings, bestVariantId, submitted, setRating, setBest, setSubmitted } =
    useRatingStore();

  const handleSubmit = useCallback(async () => {
    const visitorId = getVisitorId();
    const ratingEntries = Object.entries(ratings).map(([variantId, stars]) => ({
      variantId,
      stars,
    }));

    if (ratingEntries.length === 0) return;

    try {
      const res = await fetch("/api/rate/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          visitorId,
          ratings: ratingEntries,
          bestVariantId,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  }, [ratings, bestVariantId, scenario.id, setSubmitted]);

  const hasRatings = Object.keys(ratings).length > 0;

  return (
    <div>
      {/* Source image */}
      {scenario.sourceImageUrl && (
        <div className="mb-6">
          <Text size="2" color="gray" className="mb-2 block">Source Image</Text>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scenario.sourceImageUrl}
            alt="Source"
            className="rounded-lg max-h-64 object-contain"
          />
        </div>
      )}

      {/* Video variants */}
      <Grid
        columns={{
          initial: "1",
          md: scenario.variants.length === 1 ? "1" : "2",
          lg: scenario.variants.length > 2 ? "3" : scenario.variants.length === 1 ? "1" : "2",
        }}
        gap="4"
        className={scenario.variants.length === 1 ? "max-w-lg" : ""}
      >
        {scenario.variants.map((variant) => (
          <Card key={variant.id} className="!bg-zinc-900 overflow-hidden !p-0">
            <video
              src={variant.videoUrl}
              controls
              loop
              playsInline
              className="w-full aspect-video object-contain bg-black"
            />
            <div className="p-4 space-y-3">
              <Text weight="medium" size="3">{variant.label}</Text>
              <Flex align="center" justify="between">
                <StarRating
                  value={ratings[variant.id] ?? 0}
                  onChange={(stars) => setRating(variant.id, stars)}
                  disabled={submitted}
                />
                <BestPicker
                  selected={bestVariantId === variant.id}
                  onToggle={() =>
                    setBest(bestVariantId === variant.id ? null : variant.id)
                  }
                  disabled={submitted}
                />
              </Flex>
            </div>
          </Card>
        ))}
      </Grid>

      {/* Submit */}
      <Flex justify="center" className="mt-8">
        {submitted ? (
          <Text color="green" weight="medium" size="5">
            Thanks for rating!
          </Text>
        ) : (
          <Button
            size="3"
            onClick={handleSubmit}
            disabled={!hasRatings}
            className={`cursor-pointer ${
              hasRatings
                ? "!bg-gradient-to-r !from-pink-500 !to-purple-600 shadow-lg shadow-pink-500/30"
                : ""
            }`}
          >
            Submit Ratings
          </Button>
        )}
      </Flex>
    </div>
  );
}
