import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const redis = getRedis();
  const session = await getSession();
  const anonVisitorId = req.nextUrl.searchParams.get("visitorId");

  // Get all rated scenario IDs
  const scenarioIds = await redis.smembers("rated-scenarios");
  if (!scenarioIds.length) {
    return NextResponse.json({ ratings: {} });
  }

  const ratings: Record<string, number> = {};

  // If logged in, fetch ratings by email
  if (session?.email) {
    for (const scenarioId of scenarioIds) {
      const key = `rating:${scenarioId}:${session.email}`;
      const data = await redis.get(key);
      if (data) {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed?.ratings?.[0]?.stars) {
          ratings[parsed.scenarioId] = parsed.ratings[0].stars;
        }
      }
    }

    // Also check anonymous ratings and migrate them
    if (anonVisitorId) {
      for (const scenarioId of scenarioIds) {
        if (ratings[scenarioId]) continue; // already have a rating by email
        const anonKey = `rating:${scenarioId}:${anonVisitorId}`;
        const anonData = await redis.get(anonKey);
        if (anonData) {
          const parsed = typeof anonData === "string" ? JSON.parse(anonData) : anonData;
          if (parsed?.ratings?.[0]?.stars) {
            ratings[parsed.scenarioId] = parsed.ratings[0].stars;
            // Migrate: copy anon rating to user's email key
            const userKey = `rating:${scenarioId}:${session.email}`;
            await redis.set(userKey, typeof anonData === "string" ? anonData : JSON.stringify(anonData));
            await redis.sadd(`submissions:${scenarioId}`, userKey);
          }
        }
      }
    }
  } else if (anonVisitorId) {
    // Not logged in — fetch by anonymous visitor ID
    for (const scenarioId of scenarioIds) {
      const key = `rating:${scenarioId}:${anonVisitorId}`;
      const data = await redis.get(key);
      if (data) {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed?.ratings?.[0]?.stars) {
          ratings[parsed.scenarioId] = parsed.ratings[0].stars;
        }
      }
    }
  }

  return NextResponse.json({ ratings });
}
