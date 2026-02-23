import { NextRequest, NextResponse } from "next/server";
import scenarios from "@/data/scenarios.json";
import type { Scenario } from "@/types/rate";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scenario = (scenarios as Scenario[]).find((s) => s.id === id);
  if (!scenario) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(scenario);
}
