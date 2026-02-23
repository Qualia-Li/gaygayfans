/**
 * Seed script: Uploads feed clips to Cloudflare R2 (gaygayfans bucket)
 * and generates src/data/feed-videos.json.
 *
 * Usage: npx tsx scripts/seed-feed.ts
 * Requires: wrangler to be authenticated
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const CLIPS_DIRS = ["/tmp/lora_training/clips_v3", "/tmp/lora_training/clips"];
const OUTPUT = path.join(__dirname, "../src/data/feed-videos.json");

const R2_BUCKET = "gaygayfans";
const R2_PUBLIC_BASE = "https://pub-be9e0552363545c5a4778d2715805f99.r2.dev";

const CREATORS = [
  { name: "hotboy69", avatar: "🔥" },
  { name: "muscledaddy", avatar: "💪" },
  { name: "beachbod", avatar: "🏖️" },
  { name: "nightowl", avatar: "🌙" },
  { name: "fitking", avatar: "👑" },
  { name: "latinlover", avatar: "❤️‍🔥" },
  { name: "gymrat", avatar: "🏋️" },
  { name: "prettyboy", avatar: "✨" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uploadToR2(localPath: string, r2Key: string): string {
  const cmd = `npx wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file="${localPath}" --content-type="video/mp4"`;
  execSync(cmd, { stdio: "pipe" });
  return `${R2_PUBLIC_BASE}/${r2Key}`;
}

interface FeedVideo {
  id: string;
  videoUrl: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

function main() {
  const videos: FeedVideo[] = [];
  let id = 1;

  for (const dir of CLIPS_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Skipping ${dir} — does not exist`);
      continue;
    }

    const dirName = path.basename(dir);
    const mp4Files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4")).sort();
    console.log(`\nProcessing ${dirName}: ${mp4Files.length} videos`);

    for (const file of mp4Files) {
      const base = file.replace(".mp4", "");
      const txtPath = path.join(dir, base + ".txt");
      let description = base.replace(/_/g, " ");

      if (fs.existsSync(txtPath)) {
        description = fs.readFileSync(txtPath, "utf-8").trim();
      }

      const r2Key = `feed/${dirName}/${file}`;
      const localPath = path.join(dir, file);

      console.log(`  [${id}] Uploading ${file}...`);
      const videoUrl = uploadToR2(localPath, r2Key);

      const creator = CREATORS[id % CREATORS.length];
      const tags = description
        .split(",")
        .slice(0, 3)
        .map((t) => t.trim().split(" ")[0].toLowerCase());

      videos.push({
        id: String(id),
        videoUrl,
        title: description.length > 60 ? description.slice(0, 60) + "…" : description,
        creator: creator.name,
        creatorAvatar: creator.avatar,
        likes: randomInt(500, 50000),
        comments: randomInt(10, 2000),
        shares: randomInt(5, 500),
        tags,
      });

      id++;
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(videos, null, 2));
  console.log(`\n✓ Generated ${OUTPUT} (${videos.length} videos)`);
}

main();
