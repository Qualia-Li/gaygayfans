import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createMagicToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = await createMagicToken(email);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gaygayfans.vercel.app";
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "GayGayFans <noreply@gaygayfans.vercel.app>",
      to: email,
      subject: "Your magic link to GayGayFans",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2>🏳️‍🌈 GayGayFans</h2>
          <p>Click the button below to sign in:</p>
          <a href="${magicLink}" style="display: inline-block; background: linear-gradient(to right, #ec4899, #a855f7); color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
            Sign In
          </a>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">This link expires in 15 minutes.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
