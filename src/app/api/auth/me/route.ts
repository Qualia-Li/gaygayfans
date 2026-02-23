import { NextResponse } from "next/server";
import { getSession, getUser } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await getUser(session.email);
  return NextResponse.json({
    email: session.email,
    credits: user?.credits ?? 0,
    ratingsCount: user?.ratingsCount ?? 0,
  });
}
