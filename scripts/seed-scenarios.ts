/**
 * Seed script: Reads test_results directory, uploads media to Cloudflare R2 (media bucket),
 * and generates scenarios.json (client-safe) + lora-metadata.json (server-only).
 *
 * Usage: npx tsx scripts/seed-scenarios.ts
 * Requires: wrangler to be authenticated (npx wrangler login)
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const TEST_RESULTS_DIR = path.join(
  process.env.HOME || "~",
  "proj/gaylora/test_results"
);
const SCENARIOS_OUT = path.join(__dirname, "../src/data/scenarios.json");
const METADATA_OUT = path.join(__dirname, "../src/data/lora-metadata.json");

const R2_BUCKET = "gaygayfans";
const R2_PUBLIC_BASE = "https://pub-be9e0552363545c5a4778d2715805f99.r2.dev";

const VARIANT_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface R2Scenario {
  id: string;
  name: string;
  sourceImageUrl: string | null;
  variants: { id: string; label: string; videoUrl: string }[];
}

interface LoraVariantMeta {
  variantId: string;
  label: string;
  originalFilename: string;
  loraConfig: string;
}

interface LoraMeta {
  scenarioId: string;
  dirName: string;
  variants: LoraVariantMeta[];
}

function uploadToR2(localPath: string, r2Key: string): string {
  const cmd = `npx wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file="${localPath}" --content-type="${
    r2Key.endsWith(".mp4") ? "video/mp4" : "image/jpeg"
  }"`;
  execSync(cmd, { stdio: "pipe" });
  return `${R2_PUBLIC_BASE}/${r2Key}`;
}

function main() {
  const dirs = fs
    .readdirSync(TEST_RESULTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  const scenarios: R2Scenario[] = [];
  const metadata: LoraMeta[] = [];

  for (const dir of dirs) {
    const dirPath = path.join(TEST_RESULTS_DIR, dir.name);
    const files = fs.readdirSync(dirPath);

    const mp4Files = files.filter((f) => f.endsWith(".mp4")).sort();
    const sourceFile = files.find(
      (f) => f === "source.jpg" || f === "source.png"
    );

    // Skip directories with no videos
    if (mp4Files.length === 0) {
      console.log(`Skipping ${dir.name} — no mp4 files`);
      continue;
    }

    const scenarioId = dir.name;
    const prettyName = dir.name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    console.log(`\nProcessing: ${dir.name} (${mp4Files.length} videos)`);

    // Upload source image
    let sourceImageUrl: string | null = null;
    if (sourceFile) {
      const r2Key = `rate/${scenarioId}/source.jpg`;
      const localFile = path.join(dirPath, sourceFile);
      sourceImageUrl = uploadToR2(localFile, r2Key);
      console.log(`  Uploaded source: ${sourceImageUrl}`);
    }

    // Upload videos
    const variants: R2Scenario["variants"] = [];
    const variantMeta: LoraVariantMeta[] = [];

    for (let i = 0; i < mp4Files.length; i++) {
      const mp4 = mp4Files[i];
      const variantId = `${scenarioId}_${VARIANT_LABELS[i]}`;
      const label = `Variant ${VARIANT_LABELS[i]}`;

      const r2Key = `rate/${scenarioId}/${VARIANT_LABELS[i]}.mp4`;
      const localFile = path.join(dirPath, mp4);
      const url = uploadToR2(localFile, r2Key);

      variants.push({ id: variantId, label, videoUrl: url });
      variantMeta.push({
        variantId,
        label,
        originalFilename: mp4,
        loraConfig: mp4.replace(".mp4", ""),
      });

      console.log(`  Uploaded ${label}: ${mp4} → ${url}`);
    }

    scenarios.push({
      id: scenarioId,
      name: prettyName,
      sourceImageUrl,
      variants,
    });

    metadata.push({
      scenarioId,
      dirName: dir.name,
      variants: variantMeta,
    });
  }

  // Write output files
  fs.writeFileSync(SCENARIOS_OUT, JSON.stringify(scenarios, null, 2));
  fs.writeFileSync(METADATA_OUT, JSON.stringify(metadata, null, 2));

  console.log(
    `\n✓ Generated ${SCENARIOS_OUT} (${scenarios.length} scenarios)`
  );
  console.log(`✓ Generated ${METADATA_OUT}`);
}

main();
