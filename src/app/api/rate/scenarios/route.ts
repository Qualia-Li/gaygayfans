import { NextResponse } from "next/server";
import scenarios from "@/data/scenarios.json";

export async function GET() {
  // Return just id, name, sourceImageUrl, variant count for the gallery grid
  const summary = (scenarios as Array<{ id: string; name: string; sourceImageUrl: string | null; variants: unknown[] }>).map((s) => ({
    id: s.id,
    name: s.name,
    sourceImageUrl: s.sourceImageUrl,
    variantCount: s.variants.length,
  }));
  return NextResponse.json(summary);
}
