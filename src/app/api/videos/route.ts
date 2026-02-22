import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CLIPS_DIRS = ["/tmp/lora_training/clips_v3", "/tmp/lora_training/clips"];

interface VideoEntry {
  id: string;
  filename: string;
  videoUrl: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

export async function GET() {
  const videos: VideoEntry[] = [];
  let id = 1;

  for (const dir of CLIPS_DIRS) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4")).sort();

    for (const file of files) {
      const base = file.replace(".mp4", "");
      const txtPath = path.join(dir, base + ".txt");
      let description = base.replace(/_/g, " ");

      if (fs.existsSync(txtPath)) {
        description = fs.readFileSync(txtPath, "utf-8").trim();
      }

      const creator = CREATORS[id % CREATORS.length];
      const tags = description
        .split(",")
        .slice(0, 3)
        .map((t) => t.trim().split(" ")[0].toLowerCase());

      videos.push({
        id: String(id),
        filename: file,
        videoUrl: `/api/videos/${encodeURIComponent(path.basename(dir))}/${encodeURIComponent(file)}`,
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

  return NextResponse.json(videos);
}
