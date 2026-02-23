"use client";

import Link from "next/link";
import { Card, Badge, Text } from "@radix-ui/themes";

interface ScenarioCardProps {
  id: string;
  name: string;
  sourceImageUrl: string | null;
  variantCount: number;
}

export default function ScenarioCard({
  id,
  name,
  sourceImageUrl,
  variantCount,
}: ScenarioCardProps) {
  return (
    <Link href={`/rate/${id}`}>
      <Card className="group !bg-zinc-900 hover:ring-2 hover:ring-pink-500 transition-all overflow-hidden cursor-pointer">
        <div className="aspect-video relative bg-zinc-800 -m-4 mb-0 rounded-t-lg overflow-hidden">
          {sourceImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sourceImageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-4xl">
              🎬
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="solid" color="gray" highContrast>
              {variantCount} variant{variantCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
        <div className="pt-4">
          <Text size="2" weight="medium" className="truncate block">{name}</Text>
        </div>
      </Card>
    </Link>
  );
}
