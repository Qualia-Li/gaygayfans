import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession, getUser } from "@/lib/auth";
import scenarios from "@/data/scenarios.json";
import type { Scenario, RatingSubmission, AggregatedScenarioResult, AggregatedVariantResult } from "@/types/rate";

// Load LoRA metadata (server-only)
let loraMetadata: Array<{
  scenarioId: string;
  dirName: string;
  variants: Array<{
    variantId: string;
    label: string;
    originalFilename: string;
    loraConfig: string;
  }>;
}> = [];

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  loraMetadata = require("@/data/lora-metadata.json");
} catch {
  // metadata not generated yet
}

export async function GET() {
  // Require login and 3+ ratings to view results
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in to view results" }, { status: 401 });
  }

  const user = await getUser(session.email);
  if (!user || (user.ratingsCount ?? 0) < 3) {
    return NextResponse.json(
      { error: "Rate at least 3 scenarios to unlock results", ratingsCount: user?.ratingsCount ?? 0 },
      { status: 403 }
    );
  }

  const results: AggregatedScenarioResult[] = [];

  for (const scenario of scenarios as Scenario[]) {
    const keys = await getRedis().smembers(`submissions:${scenario.id}`);
    const submissions: RatingSubmission[] = [];

    for (const key of keys) {
      const data = await getRedis().get<string>(key);
      if (data) {
        submissions.push(
          typeof data === "string" ? JSON.parse(data) : data
        );
      }
    }

    const scenarioMeta = loraMetadata.find((m) => m.scenarioId === scenario.id);

    const variantResults: AggregatedVariantResult[] = scenario.variants.map((v) => {
      const variantRatings = submissions
        .flatMap((s) => s.ratings)
        .filter((r) => r.variantId === v.id);
      const bestPicks = submissions.filter(
        (s) => s.bestVariantId === v.id
      ).length;
      const meta = scenarioMeta?.variants.find((m) => m.variantId === v.id);

      return {
        variantId: v.id,
        label: v.label,
        videoUrl: v.videoUrl,
        // Keep internal metadata server-side only
        originalFilename: "",
        loraConfig: "",
        avgStars:
          variantRatings.length > 0
            ? variantRatings.reduce((sum, r) => sum + r.stars, 0) /
              variantRatings.length
            : 0,
        totalRatings: variantRatings.length,
        bestPicks,
      };
    });

    results.push({
      scenarioId: scenario.id,
      name: scenario.name,
      sourceImageUrl: scenario.sourceImageUrl,
      variants: variantResults,
      totalSubmissions: submissions.length,
    });
  }

  return NextResponse.json(results);
}
