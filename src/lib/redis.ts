import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

function cleanEnv(val: string | undefined): string {
  return (val || "").trim().replace(/^"|"$/g, "").replace(/\\n$/g, "");
}

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: cleanEnv(process.env.KV_REST_API_URL),
      token: cleanEnv(process.env.KV_REST_API_TOKEN),
    });
  }
  return _redis;
}
