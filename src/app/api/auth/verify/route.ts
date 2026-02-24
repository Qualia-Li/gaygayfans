import { NextRequest, NextResponse } from "next/server";
import { verifyMagicToken, createSession } from "@/lib/auth";
import { notifyError } from "@/lib/notify";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const email = await verifyMagicToken(token);
    if (!email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await createSession(email);
    return NextResponse.json({ ok: true, email });
  } catch (err) {
    await notifyError("auth/verify", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
