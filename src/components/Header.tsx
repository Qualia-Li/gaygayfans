"use client";

import Link from "next/link";
import { Flex, Text, Button } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Header() {
  const { email, isLoggedIn, credits } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <div className="pointer-events-none fixed top-0 inset-x-0 z-40 px-4 pt-3 pb-2">
        <Flex align="center" justify="between" className="pointer-events-auto">
          <Flex align="center" gap="2">
            <Text size="4">🏳️‍🌈</Text>
            <Text size="4" weight="bold" className="text-white drop-shadow-lg">
              GayGayFans
            </Text>
          </Flex>

          <Flex align="center" gap="3">
            <Link href="/rate">
              <Button
                variant="solid"
                size="2"
                className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30"
              >
                Rate
              </Button>
            </Link>
            <Link href="/generate">
              <Button variant="soft" size="2" color="pink" className="cursor-pointer">
                Generate
              </Button>
            </Link>
            {isLoggedIn ? (
              <Flex align="center" gap="2">
                <Text size="1" className="text-pink-300">{credits} credits</Text>
                <Text size="1" className="text-zinc-400 max-w-[120px] truncate">{email}</Text>
              </Flex>
            ) : (
              <Button
                variant="outline"
                size="2"
                color="pink"
                className="cursor-pointer"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>
      </div>
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
}
