import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession } from "@/lib/auth";

function safeParse(data: unknown): unknown {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const redis = getRedis();
  const session = await getSession();
  const anonVisitorId = req.nextUrl.searchParams.get("visitorId");

  // Validate anon visitor ID format (must start with "v_" to prevent email spoofing)
  const validAnonId = anonVisitorId?.startsWith("v_") ? anonVisitorId : null;

  // Get all rated scenario IDs
  const scenarioIds = await redis.smembers("rated-scenarios");
  if (!scenarioIds.length) {
    return NextResponse.json({ ratings: {} });
  }

  const ratings: Record<string, number> = {};

  // If logged in, fetch ratings by email using pipeline
  if (session?.email) {
    const pipeline = redis.pipeline();
    for (const scenarioId of scenarioIds) {
      pipeline.get(`rating:${scenarioId}:${session.email}`);
    }
    const results = await pipeline.exec();

    for (let i = 0; i < scenarioIds.length; i++) {
      const parsed = safeParse(results[i]);
      if (parsed && typeof parsed === "object" && "ratings" in parsed) {
        const r = parsed as { scenarioId: string; ratings: { stars: number }[] };
        if (r.ratings?.[0]?.stars) {
          ratings[r.scenarioId] = r.ratings[0].stars;
        }
      }
    }

    // Also check anonymous ratings and migrate them (only valid anon IDs)
    if (validAnonId) {
      const anonPipeline = redis.pipeline();
      const unmatchedScenarios: string[] = [];
      for (const scenarioId of scenarioIds) {
        if (!ratings[scenarioId]) {
          anonPipeline.get(`rating:${scenarioId}:${validAnonId}`);
          unmatchedScenarios.push(scenarioId);
        }
      }
      if (unmatchedScenarios.length) {
        const anonResults = await anonPipeline.exec();
        for (let i = 0; i < unmatchedScenarios.length; i++) {
          const parsed = safeParse(anonResults[i]);
          if (parsed && typeof parsed === "object" && "ratings" in parsed) {
            const r = parsed as { scenarioId: string; ratings: { stars: number }[] };
            if (r.ratings?.[0]?.stars) {
              ratings[r.scenarioId] = r.ratings[0].stars;
              // Migrate: copy anon rating to user's email key
              const userKey = `rating:${unmatchedScenarios[i]}:${session.email}`;
              await redis.set(userKey, JSON.stringify(parsed));
              await redis.sadd(`submissions:${unmatchedScenarios[i]}`, userKey);
            }
          }
        }
      }
    }
  } else if (validAnonId) {
    // Not logged in — fetch by anonymous visitor ID using pipeline
    const pipeline = redis.pipeline();
    for (const scenarioId of scenarioIds) {
      pipeline.get(`rating:${scenarioId}:${validAnonId}`);
    }
    const results = await pipeline.exec();

    for (let i = 0; i < scenarioIds.length; i++) {
      const parsed = safeParse(results[i]);
      if (parsed && typeof parsed === "object" && "ratings" in parsed) {
        const r = parsed as { scenarioId: string; ratings: { stars: number }[] };
        if (r.ratings?.[0]?.stars) {
          ratings[r.scenarioId] = r.ratings[0].stars;
        }
      }
    }
  }

  return NextResponse.json({ ratings });
}
