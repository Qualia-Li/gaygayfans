import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Support x.com and twitter.com URLs
  const tweetMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  if (!tweetMatch) {
    return NextResponse.json({ error: "Not a valid X/Twitter post URL" }, { status: 400 });
  }

  try {
    // Use nitter or vxtwitter to extract image via oembed
    const tweetId = tweetMatch[1];
    const vxUrl = `https://api.vxtwitter.com/Twitter/status/${tweetId}`;
    const res = await fetch(vxUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch tweet");
    }

    const data = await res.json();

    // Extract the first image from media
    const images: string[] = [];
    if (data.media_extended) {
      for (const m of data.media_extended) {
        if (m.type === "image" && m.url) {
          images.push(m.url);
        }
      }
    }
    // Fallback: check mediaURLs
    if (images.length === 0 && data.mediaURLs) {
      images.push(...data.mediaURLs);
    }

    if (images.length === 0) {
      return NextResponse.json({ error: "No images found in this post" }, { status: 404 });
    }

    return NextResponse.json({
      images,
      text: data.text || "",
      author: data.user_name || data.user_screen_name || "",
    });
  } catch (err) {
    console.error("Extract image error:", err);
    return NextResponse.json({ error: "Failed to extract image from post" }, { status: 500 });
  }
}
