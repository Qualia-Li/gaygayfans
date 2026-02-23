import { NextRequest, NextResponse } from "next/server";
import { verifyMagicToken, createSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
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
}
