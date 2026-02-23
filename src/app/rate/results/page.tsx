"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Heading, Text, Card, Flex, Badge, Grid, Button, Callout } from "@radix-ui/themes";
import type { AggregatedScenarioResult } from "@/types/rate";
import { useAuthStore } from "@/store/authStore";

export default function ResultsPage() {
  const [results, setResults] = useState<AggregatedScenarioResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingsNeeded, setRatingsNeeded] = useState(0);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    fetch("/api/rate/results")
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json();
          if (r.status === 403) {
            setRatingsNeeded(3 - (data.ratingsCount ?? 0));
          }
          throw new Error(data.error);
        }
        return r.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Text color="gray">Loading results...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Container size="3" className="px-4 py-8">
          <Link href="/rate" className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
            &larr; Back to rating
          </Link>
          <Heading size="6" mb="4">Rating Results</Heading>

          <Card className="!bg-zinc-900" size="3">
            <Flex direction="column" align="center" gap="4" py="4">
              <Text size="6">🔒</Text>
              <Heading size="4">{error}</Heading>
              {!isLoggedIn ? (
                <Text size="2" color="gray">Sign in and rate scenarios to unlock results.</Text>
              ) : ratingsNeeded > 0 ? (
                <Text size="2" color="gray">
                  Rate {ratingsNeeded} more scenario{ratingsNeeded !== 1 ? "s" : ""} to unlock!
                </Text>
              ) : null}
              <Link href="/rate">
                <Button className="cursor-pointer">Go Rate Videos</Button>
              </Link>
            </Flex>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Container size="4" className="px-4 py-8">
        <Link href="/rate" className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
          &larr; Back to rating
        </Link>
        <Heading size="6" mb="2">Rating Results</Heading>
        <Text size="2" color="gray" className="mb-6 block">
          Aggregated ratings across all submissions
        </Text>

        <Flex direction="column" gap="6">
          {results.map((scenario) => (
            <Card key={scenario.scenarioId} className="!bg-zinc-900" size="3">
              <Heading size="4" mb="3">{scenario.name}</Heading>
              <Text size="1" color="gray" className="mb-4 block">
                {scenario.totalSubmissions} submission{scenario.totalSubmissions !== 1 ? "s" : ""}
              </Text>

              <Grid columns={{ initial: "1", md: "2" }} gap="4">
                {scenario.variants.map((v) => (
                  <Card key={v.variantId} className="!bg-zinc-800">
                    <Flex direction="column" gap="2">
                      <Flex align="center" justify="between">
                        <Text weight="medium">{v.label}</Text>
                        <Badge color="pink" variant="solid">
                          {v.avgStars.toFixed(1)} ★
                        </Badge>
                      </Flex>
                      <Flex gap="3" wrap="wrap">
                        <Text size="1" color="gray">{v.totalRatings} ratings</Text>
                        <Text size="1" color="gray">{v.bestPicks} best picks</Text>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </Card>
          ))}
        </Flex>
      </Container>
    </div>
  );
}
