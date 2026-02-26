import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import feedVideos from "@/data/feed-videos.json";
import classifiedData from "@/x-downloads-data/top_1000_classified.json";

const ADMIN_EMAIL = "liquanlai1995@gmail.com";

interface ClassifiedItem {
  filename: string;
  account: string;
  position: string;
  clip_score: number;
  favorite_count: number;
  bookmark_count: number;
  retweet_count: number;
  view_count: number;
  popularity_score: number;
}

let classifiedMap: Map<string, ClassifiedItem> | null = null;

function getClassifiedMap(): Map<string, ClassifiedItem> {
  if (classifiedMap) return classifiedMap;
  classifiedMap = new Map();
  for (const item of classifiedData as unknown as ClassifiedItem[]) {
    const key = `${item.account}_${item.filename.replace(/\.\w+$/, "")}`;
    classifiedMap.set(key, item);
  }
  return classifiedMap;
}

function extractKeyFromUrl(videoUrl: string): string | null {
  const match = videoUrl.match(/generated\/(.+)\.mp4$/);
  if (match) return match[1];
  return null;
}

function detectModel(videoUrl: string): string {
  if (videoUrl.includes("pub-fd4d644997b0483d8fd457ab9b00a1c1")) return "wan2.2";
  if (videoUrl.includes("pub-be9e0552363545c5a4778d2715805f99")) return "lora-test";
  return "unknown";
}

// Position → LoRA mapping (matches generate_videos.py)
const LORA_CONFIG: Record<string, string> = {
  anal_cowgirl: "Cowgirl HIGH @1.5",
  cowgirl: "Cowgirl HIGH @1.5",
  anal_doggy: "Doggy HIGH @1.5",
  doggy: "Doggy HIGH @1.5",
  oral: "Blowjob HIGH @1.5",
  handjob: "Handjob HIGH @1.2 + Orgasm @0.8",
  facial: "Blowjob HIGH @1.0 + Cumshot LOW @1.2",
  anal_missionary: "Missionary HIGH @1.5",
  missionary: "Missionary HIGH @1.5",
  footjob: "Handjob HIGH @1.2 + Orgasm @0.8",
  general: "General-NSFW HIGH @1.5",
};

// First 21 videos are manually curated lora-test variants with known configs
const RATE_LORA_CONFIG: Record<string, string> = {
  achai_new: "Gay 1.2 + PENIS 1.0 + Cowgirl 0.8",
  lymss_oral: "Gay 1.2 + PENIS 1.0 + Blowjob 0.8",
  military_cowgirl: "Gay 1.2 + PENIS 1.0 + Cowgirl 0.8",
  naruto_bj: "Gay 1.2 + PENIS 1.0 + Blowjob 0.8",
  whitebook_anal: "Gay 1.2 + PENIS 1.0 + Cowgirl 0.8",
  whitebook_anal_missionary: "Gay 1.2 + PENIS 1.0 + Missionary 0.8",
  whitebook_cumshot: "Gay 1.2 + PENIS 1.0 + Cumshot LOW 0.8",
  whitebook_cumspitting: "Gay 1.2 + PENIS 1.0",
  whitebook_facial: "Gay 1.2 + PENIS 1.0 + Blowjob 0.8",
  whitebook_riding: "Gay 1.2 + PENIS 1.0 + Cowgirl 0.8",
  whitebook_solo: "Gay 1.2 + Handjob 1.0",
  yyzxmiao_jerkoff: "Gay 1.2 + Handjob 1.0",
  yyzxmiao_oral: "Gay 1.2 + PENIS 1.0 + Blowjob 0.8",
  yyzxmiao_rear: "Gay 1.2 + PENIS 1.0 + Doggy 0.8",
  zaidiankun_doggy: "Gay 1.2 + PENIS 1.0 + Doggy 0.8",
  zaidiankun_footjob: "Gay 1.2 + Handjob 1.0 + Orgasm 0.8",
};

function getLoraLabel(videoUrl: string, position: string): string {
  // For rate/ URLs, extract scenario name
  const rateMatch = videoUrl.match(/rate\/([^/]+)\//);
  if (rateMatch) return RATE_LORA_CONFIG[rateMatch[1]] ?? "unknown";

  // For generated videos, derive from position
  return LORA_CONFIG[position] ?? "unknown";
}

export async function GET() {
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (session.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Admin access only" }, { status: 403 });
  }

  const classified = getClassifiedMap();

  const enriched = (feedVideos as Array<{ id: string; videoUrl: string; title: string; creator: string; creatorAvatar: string; likes: number; comments: number; shares: number; tags: string[] }>).map((v) => {
    const key = extractKeyFromUrl(v.videoUrl);
    const meta = key ? classified.get(key) : null;
    const position = meta?.position ?? v.tags.find((t) => !["ai", "wan2.1", "wan2.2", "lora", "generated"].includes(t)) ?? "unknown";

    return {
      id: v.id,
      videoUrl: v.videoUrl,
      title: v.title,
      creator: v.creator,
      model: detectModel(v.videoUrl),
      position,
      lora: getLoraLabel(v.videoUrl, position),
      clip_score: meta?.clip_score ?? null,
      popularity_score: meta?.popularity_score ?? null,
    };
  });

  return NextResponse.json(enriched);
}
