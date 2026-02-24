import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { notifyError } from "@/lib/notify";

const REPORT_REASONS = [
  "not_interested",
  "low_quality",
  "rights_violation",
  "child_content",
  "other",
];

export async function POST(req: NextRequest) {
  try {
    const { videoId, reason, detail } = await req.json();

    if (!videoId || !reason || !REPORT_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid report" }, { status: 400 });
    }

    const redis = getRedis();
    const report = {
      videoId,
      reason,
      detail: detail || "",
      timestamp: Date.now(),
      ua: req.headers.get("user-agent")?.slice(0, 200) || "",
    };

    // Store in a sorted set by timestamp for easy retrieval
    await redis.zadd("reports", {
      score: Date.now(),
      member: JSON.stringify(report),
    });

    // Notify on Telegram for serious reports
    if (reason === "child_content" || reason === "rights_violation") {
      const { notifyError: notify } = await import("@/lib/notify");
      const label = reason === "child_content" ? "CHILD CONTENT" : "RIGHTS VIOLATION";
      await notify(
        `REPORT: ${label}`,
        `Video: ${videoId}\nReason: ${reason}\nDetail: ${detail || "none"}`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    await notifyError("report", err);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
