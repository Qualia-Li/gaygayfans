import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const from = body.from || "unknown";
    const to = body.to || "unknown";
    const subject = body.subject || "(no subject)";
    const text = (body.text || body.html || "").slice(0, 500);

    const message = [
      `\u2709\uFE0F *New Email to GaylyFans*`,
      ``,
      `*From:* ${escapeMarkdown(from)}`,
      `*To:* ${escapeMarkdown(typeof to === "string" ? to : JSON.stringify(to))}`,
      `*Subject:* ${escapeMarkdown(subject)}`,
      ``,
      escapeMarkdown(text),
    ].join("\n");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        }
      );
    }
  } catch {
    // silently fail - don't break Resend webhook
  }

  return NextResponse.json({ ok: true });
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
