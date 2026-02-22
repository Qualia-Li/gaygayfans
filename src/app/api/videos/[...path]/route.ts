import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE = "/tmp/lora_training";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  // Sanitize: only allow alphanumeric, underscores, hyphens, dots
  for (const seg of segments) {
    if (!/^[\w\-.]+$/.test(seg)) {
      return new NextResponse("Bad request", { status: 400 });
    }
  }

  const filePath = path.join(BASE, ...segments);

  // Prevent path traversal
  if (!filePath.startsWith(BASE)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
