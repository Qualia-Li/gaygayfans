"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAgeGate } from "@/store/ageGate";
import { Card, Button, Text, Flex, Heading, Select, Checkbox } from "@radix-ui/themes";

const bgImages = ["/bg-anime-1.png", "/bg-real-1.png", "/bg-anime-2.png", "/bg-real-2.png"];

export default function AgeGate() {
  const setVerified = useAgeGate((s) => s.setVerified);
  const router = useRouter();
  const [birthYear, setBirthYear] = useState("2000");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const currentYear = new Date().getFullYear();
  const isOldEnough = birthYear !== "" && currentYear - parseInt(birthYear) >= 18;
  const canEnter = isOldEnough && agreedTerms;

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Generate year options from 1930 to (currentYear - 18)
  const years: string[] = [];
  for (let y = currentYear - 18; y >= 1930; y--) {
    years.push(String(y));
  }

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-black">
      {/* Rotating background images */}
      {bgImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === bgIndex ? 0.3 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      <div className="relative flex min-h-dvh flex-col items-center justify-center py-8">
        <Card size="4" className="mx-4 max-w-md w-full !bg-zinc-900">
          <Flex direction="column" align="center" gap="4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gooey.png" alt="GaylyFans" className="h-24 w-auto" />
            <Heading size="5" align="center">Welcome</Heading>
            <Text size="2" color="gray" align="center">
              Before entering, please confirm the following:
            </Text>

            <Flex direction="column" gap="3" className="w-full" role="list">
              <Card className="!bg-zinc-800" role="listitem">
                <Flex gap="3" align="start">
                  <Text size="4" className="mt-0.5" aria-hidden="true">🔞</Text>
                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="p" weight="medium" size="2">I am 18 years or older</Text>
                    <Text as="p" size="1" color="gray">
                      This site contains adult-oriented content intended for mature audiences only.
                    </Text>
                    <Select.Root value={birthYear} onValueChange={setBirthYear}>
                      <Select.Trigger placeholder="Select your birth year" className="cursor-pointer" />
                      <Select.Content>
                        {years.map((y) => (
                          <Select.Item key={y} value={y}>{y}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    {birthYear && !isOldEnough && (
                      <Text size="1" color="red">You must be at least 18 years old.</Text>
                    )}
                  </Flex>
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

            <Flex gap="2" align="start" className="w-full">
              <Checkbox
                checked={agreedTerms}
                onCheckedChange={(v) => setAgreedTerms(v === true)}
                className="mt-0.5 cursor-pointer"
              />
              <Text size="1" color="gray">
                I agree to the{" "}
                <a href="/terms" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline" target="_blank">
                  Privacy Policy
                </a>
              </Text>
            </Flex>

            <Button
              size="3"
              className="w-full cursor-pointer !bg-gradient-to-r !from-orange-500 !via-purple-500 !to-blue-500"
              disabled={!canEnter}
              onClick={() => { if (canEnter) { setVerified(true); router.push("/"); } }}
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
