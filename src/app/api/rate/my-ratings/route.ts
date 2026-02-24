import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const redis = getRedis();
  const session = await getSession();

  // Get all rated scenario IDs
  const scenarioIds = await redis.smembers("rated-scenarios");
  if (!scenarioIds.length) {
    return NextResponse.json({ ratings: {} });
  }

  // Use session email if logged in, else visitor ID from query param
  const visitorId = session?.email || req.nextUrl.searchParams.get("visitorId");
  if (!visitorId) {
    return NextResponse.json({ ratings: {} });
  }

  // Fetch ratings for this visitor
  const ratings: Record<string, number> = {};

  for (const scenarioId of scenarioIds) {
    const key = `rating:${scenarioId}:${visitorId}`;
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
