import { NextRequest, NextResponse } from "next/server";
import { getSession, updateUserCredits } from "@/lib/auth";
import { notifyError } from "@/lib/notify";

const WAVESPEED_API = "https://api.wavespeed.ai/api/v3/wavespeed-ai/wan-2.2/i2v-480p-lora";
const GENERATION_COST = 3;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { image, prompt, loras, duration } = await req.json();

  if (!image || !prompt) {
    return NextResponse.json({ error: "Image and prompt required" }, { status: 400 });
  }

  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    await notifyError("generate/create", "WAVESPEED_API_KEY not configured");
    return NextResponse.json({ error: "WaveSpeed API not configured" }, { status: 500 });
  }

  // Atomically deduct credits BEFORE calling WaveSpeed (prevents double-spend)
  const newCredits = await updateUserCredits(session.email, -GENERATION_COST);
  if (newCredits === 0 && GENERATION_COST > 0) {
    return NextResponse.json(
      { error: `Need ${GENERATION_COST} credits to generate.` },
      { status: 403 }
    );
  }

  try {
    const res = await fetch(WAVESPEED_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        image,
        prompt,
        loras: loras || [],
        duration: duration || 5,
      }),
    });

    if (!res.ok) {
      await updateUserCredits(session.email, GENERATION_COST);
      const err = await res.text();
      await notifyError("generate/create WaveSpeed", err);
      return NextResponse.json({ error: "Generation failed" }, { status: 502 });
    }

    const data = await res.json();

    return NextResponse.json({
      requestId: data.data?.id || data.id,
      credits: newCredits,
    });
  } catch (err) {
    await updateUserCredits(session.email, GENERATION_COST);
    await notifyError("generate/create", err);
    return NextResponse.json({ error: "Failed to start generation" }, { status: 500 });
  }
}
