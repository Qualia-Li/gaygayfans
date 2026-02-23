import { cookies } from "next/headers";
import { getRedis } from "./redis";

const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const MAGIC_TTL = 60 * 15; // 15 minutes

export async function createMagicToken(email: string): Promise<string> {
  const token = crypto.randomUUID();
  await getRedis().set(`magic:${token}`, JSON.stringify({ email }), { ex: MAGIC_TTL });
  return token;
}

export async function verifyMagicToken(token: string): Promise<string | null> {
  const data = await getRedis().get<string>(`magic:${token}`);
  if (!data) return null;
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  // Delete token after use (one-time)
  await getRedis().del(`magic:${token}`);
  return parsed.email;
}

export async function createSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await getRedis().set(
    `session:${sessionId}`,
    JSON.stringify({ email, createdAt: Date.now() }),
    { ex: SESSION_TTL }
  );

  // Ensure user record exists
  const userKey = `user:${email}`;
  const existing = await getRedis().get(userKey);
  if (!existing) {
    await getRedis().set(
      userKey,
      JSON.stringify({ credits: 0, ratingsCount: 0, createdAt: Date.now() })
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("ggf-session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });

  return sessionId;
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("ggf-session")?.value;
  if (!sessionId) return null;

  const data = await getRedis().get<string>(`session:${sessionId}`);
  if (!data) return null;
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return { email: parsed.email };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("ggf-session")?.value;
  if (sessionId) {
    await getRedis().del(`session:${sessionId}`);
    cookieStore.delete("ggf-session");
  }
}

export async function getUser(email: string): Promise<{ credits: number; ratingsCount: number } | null> {
  const data = await getRedis().get<string>(`user:${email}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function updateUserCredits(email: string, delta: number): Promise<number> {
  const user = await getUser(email);
  const newCredits = Math.max(0, (user?.credits ?? 0) + delta);
  const userKey = `user:${email}`;
  const existing = await getRedis().get<string>(userKey);
  const parsed = existing ? (typeof existing === "string" ? JSON.parse(existing) : existing) : { createdAt: Date.now() };
  await getRedis().set(userKey, JSON.stringify({ ...parsed, credits: newCredits }));
  return newCredits;
}

export async function incrementUserRating(email: string): Promise<{ credits: number; ratingsCount: number }> {
  const userKey = `user:${email}`;
  const existing = await getRedis().get<string>(userKey);
  const parsed = existing
    ? (typeof existing === "string" ? JSON.parse(existing) : existing)
    : { credits: 0, ratingsCount: 0, createdAt: Date.now() };
  parsed.credits = (parsed.credits ?? 0) + 1;
  parsed.ratingsCount = (parsed.ratingsCount ?? 0) + 1;
  await getRedis().set(userKey, JSON.stringify(parsed));
  return { credits: parsed.credits, ratingsCount: parsed.ratingsCount };
}
