import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const WAVESPEED_STATUS = "https://api.wavespeed.ai/api/v3/predictions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await params;
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WaveSpeed API not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${WAVESPEED_STATUS}/${id}/result`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to check status" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("WaveSpeed status error:", err);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
