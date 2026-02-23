"use client";

import { useEffect, useState } from "react";
import ScenarioCard from "./ScenarioCard";

interface ScenarioSummary {
  id: string;
  name: string;
  sourceImageUrl: string | null;
  variantCount: number;
}

export default function ScenarioGrid() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rate/scenarios")
      .then((r) => r.json())
      .then((data) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Loading scenarios...
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        No scenarios found. Run the seed script first.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {scenarios.map((s) => (
        <ScenarioCard key={s.id} {...s} />
      ))}
    </div>
  );
}
