import { NextResponse } from "next/server";
import feedVideos from "@/data/feed-videos.json";

export async function GET() {
  return NextResponse.json(feedVideos);
}
