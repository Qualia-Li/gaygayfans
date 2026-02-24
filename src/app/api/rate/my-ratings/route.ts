import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession } from "@/lib/auth";

export async function GET() {
  const redis = getRedis();
  const session = await getSession();

  // Get all rated scenario IDs
  const scenarioIds = await redis.smembers("rated-scenarios");
  if (!scenarioIds.length) {
    return NextResponse.json({ ratings: {} });
  }

  // Determine visitor ID — use session email if logged in, else "anon"
  const visitorId = session?.email || "anon";

  // Fetch ratings for this visitor
  const ratings: Record<string, number> = {};
  const keys = scenarioIds.map((id) => `rating:${id}:${visitorId}`);

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed?.ratings?.[0]?.stars) {
        ratings[parsed.scenarioId] = parsed.ratings[0].stars;
      }
    }
  }

  return NextResponse.json({ ratings });
}
