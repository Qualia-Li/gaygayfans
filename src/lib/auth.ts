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
  // Atomic get-and-delete to prevent token replay attacks
  const redis = getRedis();
  const key = `magic:${token}`;
  const pipeline = redis.pipeline();
  pipeline.get<string>(key);
  pipeline.del(key);
  const [data] = await pipeline.exec<[string | null, number]>();
  if (!data) return null;
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return parsed.email;
}

export async function createSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await getRedis().set(
    `session:${sessionId}`,
    JSON.stringify({ email, createdAt: Date.now() }),
    { ex: SESSION_TTL }
  );

  // Ensure user record exists (SETNX — only set if not exists)
  const userKey = `user:${email}`;
  await getRedis().setnx(
    userKey,
    JSON.stringify({ credits: 0, ratingsCount: 0, createdAt: Date.now() })
  );

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
  // Use Lua script for atomic check-and-update
  const redis = getRedis();
  const userKey = `user:${email}`;
  const script = `
    local data = redis.call('GET', KEYS[1])
    if not data then return -1 end
    local user = cjson.decode(data)
    local newCredits = (user.credits or 0) + tonumber(ARGV[1])
    if newCredits < 0 then return -2 end
    user.credits = newCredits
    redis.call('SET', KEYS[1], cjson.encode(user))
    return newCredits
  `;
  const result = await redis.eval(script, [userKey], [String(delta)]) as number;
  if (result === -1) return 0; // user not found
  if (result === -2) return 0; // insufficient credits
  return result;
}

export async function incrementUserRating(email: string): Promise<{ credits: number; ratingsCount: number }> {
  // Atomic increment via Lua script
  const redis = getRedis();
  const userKey = `user:${email}`;
  const script = `
    local data = redis.call('GET', KEYS[1])
    if not data then return {0, 0} end
    local user = cjson.decode(data)
    user.credits = (user.credits or 0) + 1
    user.ratingsCount = (user.ratingsCount or 0) + 1
    redis.call('SET', KEYS[1], cjson.encode(user))
    return {user.credits, user.ratingsCount}
  `;
  const result = await redis.eval(script, [userKey], []) as [number, number];
  return { credits: result[0], ratingsCount: result[1] };
}
