function cleanEnv(val: string | undefined): string {
  return (val || "").trim().replace(/^"|"$/g, "").replace(/\\n$/g, "");
}

const TELEGRAM_BOT_TOKEN = cleanEnv(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_CHAT_ID = cleanEnv(process.env.TELEGRAM_CHAT_ID);

export async function notifyError(context: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  const text = `🚨 *GaylyFans Error*\n\n*Context:* ${context}\n*Error:* ${msg}\n*Time:* ${new Date().toISOString()}`;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error(`[notify] Missing Telegram config. ${context}: ${msg}`);
    return;
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch {
    console.error(`[notify] Failed to send Telegram alert: ${context}: ${msg}`);
  }
}
