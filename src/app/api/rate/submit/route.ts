import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getSession, incrementUserRating } from "@/lib/auth";
import type { RatingSubmission } from "@/types/rate";

export async function POST(req: NextRequest) {
  const body: RatingSubmission = await req.json();

  if (!body.scenarioId || !body.visitorId || !body.ratings?.length) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const redis = getRedis();
  const key = `rating:${body.scenarioId}:${body.visitorId}`;

  // Check if this is a new submission (not a re-submit)
  const existing = await redis.get(key);
  const isNew = !existing;

  // Store submission keyed by scenario:visitor for idempotency
  await redis.set(key, JSON.stringify(body));

  // Also add to a set of all submission keys for this scenario
  await redis.sadd(`submissions:${body.scenarioId}`, key);

  // Track all scenario IDs that have submissions
  await redis.sadd("rated-scenarios", body.scenarioId);

  // Only increment credits for NEW ratings (prevent credit farming)
  let credits: number | undefined;
  let ratingsCount: number | undefined;
  const session = await getSession();
  if (session?.email && isNew) {
    const result = await incrementUserRating(session.email);
    credits = result.credits;
    ratingsCount = result.ratingsCount;
  } else if (session?.email) {
    // Return current values without incrementing
    const { getUser } = await import("@/lib/auth");
    const user = await getUser(session.email);
    credits = user?.credits;
    ratingsCount = user?.ratingsCount;
  }

  return NextResponse.json({ ok: true, credits, ratingsCount, isNew });
}
