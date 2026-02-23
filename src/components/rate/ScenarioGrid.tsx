"use client";

import { useEffect, useState } from "react";
import { Grid, Text } from "@radix-ui/themes";
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
      <div className="flex items-center justify-center py-20">
        <Text color="gray">Loading scenarios...</Text>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Text color="gray">No scenarios found. Run the seed script first.</Text>
      </div>
    );
  }

  return (
    <Grid columns={{ initial: "2", sm: "3", lg: "4" }} gap="4">
      {scenarios.map((s) => (
        <ScenarioCard key={s.id} {...s} />
      ))}
    </Grid>
  );
}
