import { NextRequest, NextResponse } from "next/server";
import { notifyError } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const { context, message, stack } = await req.json();
    const detail = stack ? `${message}\n\`\`\`\n${stack.slice(0, 500)}\n\`\`\`` : message;
    await notifyError(`FE: ${context || "unknown"}`, detail);
  } catch {
    // silently fail
  }
  return NextResponse.json({ ok: true });
}
