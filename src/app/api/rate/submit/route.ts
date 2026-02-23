import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import type { RatingSubmission } from "@/types/rate";

export async function POST(req: NextRequest) {
  const body: RatingSubmission = await req.json();

  if (!body.scenarioId || !body.visitorId || !body.ratings?.length) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Store submission keyed by scenario:visitor for idempotency
  const key = `rating:${body.scenarioId}:${body.visitorId}`;
  await getRedis().set(key, JSON.stringify(body));

  // Also add to a set of all submission keys for this scenario
  await getRedis().sadd(`submissions:${body.scenarioId}`, key);

  // Track all scenario IDs that have submissions
  await getRedis().sadd("rated-scenarios", body.scenarioId);

  return NextResponse.json({ ok: true });
}
