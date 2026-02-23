"use client";

import { useCallback } from "react";
import type { Scenario } from "@/types/rate";
import { useRatingStore, getVisitorId } from "@/store/ratingStore";
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
          <h3 className="text-gray-400 text-sm mb-2">Source Image</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scenario.sourceImageUrl}
            alt="Source"
            className="rounded-lg max-h-64 object-contain"
          />
        </div>
      )}

      {/* Video variants */}
      <div
        className={`grid gap-6 ${
          scenario.variants.length === 1
            ? "grid-cols-1 max-w-lg"
            : scenario.variants.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {scenario.variants.map((variant) => (
          <div
            key={variant.id}
            className="bg-gray-900 rounded-xl overflow-hidden"
          >
            <video
              src={variant.videoUrl}
              controls
              loop
              playsInline
              className="w-full aspect-video object-contain bg-black"
            />
            <div className="p-4 space-y-3">
              <h4 className="text-white font-medium">{variant.label}</h4>
              <div className="flex items-center justify-between">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-8 flex justify-center">
        {submitted ? (
          <div className="text-green-400 font-medium text-lg">
            Thanks for rating!
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!hasRatings}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
              hasRatings
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/30 cursor-pointer"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Ratings
          </button>
        )}
      </div>
    </div>
  );
}
