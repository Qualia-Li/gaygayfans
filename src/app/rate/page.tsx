import Link from "next/link";
import { Container, Heading, Text, Flex, Callout } from "@radix-ui/themes";
import ScenarioGrid from "@/components/rate/ScenarioGrid";
import CreditsDisplay from "@/components/rate/CreditsDisplay";

export const metadata = {
  title: "Rate Videos — GaylyFans",
  description: "Compare and rate AI-generated video variants",
};

export default function RatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Container size="4" className="px-4 py-8">
        <div className="mb-6">
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

        <Flex direction="column" gap="4" className="mb-6">
          <CreditsDisplay />
          <Callout.Root color="pink" variant="soft" size="1">
            <Callout.Text>
              ⚡ Every rating you submit earns you <strong>+1 credit</strong>. Credits let you unlock results and generate new videos!
            </Callout.Text>
          </Callout.Root>
        </Flex>

        <ScenarioGrid />
      </Container>
    </div>
  );
}
