import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createMagicToken } from "@/lib/auth";
import { notifyError } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      await notifyError("send-link", "RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const token = await createMagicToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gaylyfans.com";
    const magicLink = `${baseUrl}/auth/verify?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: "GaylyFans <noreply@gaylyfans.com>",
      to: email,
      subject: "Your magic link to GaylyFans",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f97316;">GaylyFans</h2>
          <p>Click the button below to sign in:</p>
          <a href="${magicLink}" style="display: inline-block; background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
            Sign In
          </a>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">This link expires in 15 minutes.</p>
        </div>
      `,
    });

    if (sendError) {
      await notifyError("send-link", sendError.message);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    await notifyError("send-link", err);
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 });
  }
}
