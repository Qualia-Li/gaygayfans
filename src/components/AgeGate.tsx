"use client";

import { useAgeGate } from "@/store/ageGate";
import { Card, Button, Text, Flex, Heading } from "@radix-ui/themes";

export default function AgeGate() {
  const setVerified = useAgeGate((s) => s.setVerified);

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-black">
      <div className="flex min-h-dvh flex-col items-center justify-center py-8">
        <Card size="4" className="mx-4 max-w-md w-full !bg-zinc-900">
          <Flex direction="column" align="center" gap="4">
            <Text size="8" aria-hidden="true">🏳️‍🌈</Text>
            <Heading size="6" align="center">Welcome to GayGayFans</Heading>
            <Text size="2" color="gray" align="center">
              Before entering, please confirm the following:
            </Text>

            <Flex direction="column" gap="3" className="w-full" role="list">
              <Card className="!bg-zinc-800" role="listitem">
                <Flex gap="3" align="start">
                  <Text size="4" className="mt-0.5" aria-hidden="true">🔞</Text>
                  <div>
                    <Text as="p" weight="medium" size="2">I am 18 years or older</Text>
                    <Text as="p" size="1" color="gray">
                      This site contains adult-oriented content intended for mature audiences only.
                    </Text>
                  </div>
                </Flex>
              </Card>

              <Card className="!bg-zinc-800" role="listitem">
                <Flex gap="3" align="start">
                  <Text size="4" className="mt-0.5" aria-hidden="true">🏳️‍🌈</Text>
                  <div>
                    <Text as="p" weight="medium" size="2">I want to view gay content</Text>
                    <Text as="p" size="1" color="gray">
                      This site features adult content created for and by gay men.
                    </Text>
                  </div>
                </Flex>
              </Card>

              <Card className="!bg-zinc-800" role="listitem">
                <Flex gap="3" align="start">
                  <Text size="4" className="mt-0.5" aria-hidden="true">🌍</Text>
                  <div>
                    <Text as="p" weight="medium" size="2">My location allows me to view this content</Text>
                    <Text as="p" size="1" color="gray">
                      You are responsible for ensuring that accessing this content is legal in your jurisdiction.
                    </Text>
                  </div>
                </Flex>
              </Card>
            </Flex>

            <Button
              size="3"
              className="w-full cursor-pointer !bg-gradient-to-r !from-pink-500 !via-purple-500 !to-blue-500"
              onClick={() => setVerified(true)}
            >
              I Confirm All of the Above — Enter
            </Button>

            <a
              href="https://google.com"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              No, take me away
            </a>
          </Flex>
        </Card>

        <Flex wrap="wrap" justify="center" gap="3" className="mt-6 text-xs text-zinc-500">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/content-policy">Content Policy</a>
          <a href="/contact">Contact</a>
        </Flex>
      </div>
    </main>
  );
}
