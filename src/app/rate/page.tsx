import Link from "next/link";
import { Container, Heading, Text } from "@radix-ui/themes";
import ScenarioGrid from "@/components/rate/ScenarioGrid";

export const metadata = {
  title: "Rate Videos — GayGayFans",
  description: "Compare and rate AI-generated video variants",
};

export default function RatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Container size="4" className="px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm mb-2 inline-block"
          >
            &larr; Back to feed
          </Link>
          <Heading size="6">Rate Video Variants</Heading>
          <Text size="2" color="gray" className="mt-1 block">
            Click a scenario to compare and rate the generated videos
          </Text>
        </div>
        <ScenarioGrid />
      </Container>
    </div>
  );
}
