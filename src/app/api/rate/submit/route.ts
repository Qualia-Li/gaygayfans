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
  const session = await getSession();
  // For unauthenticated users, validate visitor ID has v_ prefix to prevent email spoofing
  if (!session?.email && !body.visitorId.startsWith("v_")) {
    return NextResponse.json({ error: "Invalid visitor ID" }, { status: 400 });
  }

  // Use session email as visitor ID when logged in (enables cross-device sync)
  const visitorId = session?.email || body.visitorId;
  const key = `rating:${body.scenarioId}:${visitorId}`;

  // If user just signed in, migrate their anon ratings to their email
  if (session?.email && body.visitorId !== session.email && body.visitorId.startsWith("v_")) {
    const anonKey = `rating:${body.scenarioId}:${body.visitorId}`;
    const anonRating = await redis.get(anonKey);
    if (anonRating && !(await redis.get(key))) {
      await redis.set(key, typeof anonRating === "string" ? anonRating : JSON.stringify(anonRating));
      await redis.sadd(`submissions:${body.scenarioId}`, key);
    }
  }

  // Use SETNX to atomically check if this is a new submission
  const isNew = await redis.setnx(key, JSON.stringify(body));

  if (!isNew) {
    // Update existing rating (not new, just overwrite)
    await redis.set(key, JSON.stringify(body));
  }

  // Also add to a set of all submission keys for this scenario
  await redis.sadd(`submissions:${body.scenarioId}`, key);

  // Track all scenario IDs that have submissions
  await redis.sadd("rated-scenarios", body.scenarioId);

  // Only increment credits for NEW ratings (prevent credit farming)
  let credits: number | undefined;
  let ratingsCount: number | undefined;
  if (session?.email && isNew) {
    const result = await incrementUserRating(session.email);
    credits = result.credits;
    ratingsCount = result.ratingsCount;
  } else if (session?.email) {
    const { getUser } = await import("@/lib/auth");
    const user = await getUser(session.email);
    credits = user?.credits;
    ratingsCount = user?.ratingsCount;
  }

  return NextResponse.json({ ok: true, credits, ratingsCount, isNew: !!isNew });
}
