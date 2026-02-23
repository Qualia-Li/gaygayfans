import { NextRequest, NextResponse } from "next/server";
import { getSession, getUser, updateUserCredits } from "@/lib/auth";

const WAVESPEED_API = "https://api.wavespeed.ai/api/v3/wavespeed-ai/wan-2.2/i2v-480p-lora";
const GENERATION_COST = 3;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const user = await getUser(session.email);
  if (!user || user.credits < GENERATION_COST) {
    return NextResponse.json(
      { error: `Need ${GENERATION_COST} credits. You have ${user?.credits ?? 0}.` },
      { status: 403 }
    );
  }

  const { image, prompt, loras, duration } = await req.json();

  if (!image || !prompt) {
    return NextResponse.json({ error: "Image and prompt required" }, { status: 400 });
  }

  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WaveSpeed API not configured" }, { status: 500 });
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
      const err = await res.text();
      console.error("WaveSpeed error:", err);
      return NextResponse.json({ error: "Generation failed" }, { status: 502 });
    }

    const data = await res.json();

    // Deduct credits after successful submission
    const newCredits = await updateUserCredits(session.email, -GENERATION_COST);

    return NextResponse.json({
      requestId: data.data?.id || data.id,
      credits: newCredits,
    });
  } catch (err) {
    console.error("WaveSpeed create error:", err);
    return NextResponse.json({ error: "Failed to start generation" }, { status: 500 });
  }
}
