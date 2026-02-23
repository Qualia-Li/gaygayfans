"use client";

import Link from "next/link";

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
    <Link
      href={`/rate/${id}`}
      className="group block rounded-xl overflow-hidden bg-gray-900 hover:ring-2 hover:ring-pink-500 transition-all"
    >
      <div className="aspect-video relative bg-gray-800">
        {sourceImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sourceImageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
            🎬
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {variantCount} variant{variantCount !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white text-sm font-medium truncate">{name}</h3>
      </div>
    </Link>
  );
}
