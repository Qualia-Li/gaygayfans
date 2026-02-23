"use client";

import Link from "next/link";
import { Flex, Text, Button, Badge } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function Header() {
  const { email, isLoggedIn, credits, setAuth, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.email) {
          setAuth(data.email, data.credits ?? 0, data.ratingsCount ?? 0);
        }
      })
      .catch(() => {});
  }, [setAuth]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
  };

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
            {isLoggedIn && (
              <Badge size="2" color="pink" variant="solid" highContrast className="px-3 py-1">
                ⚡ {credits} credits
              </Badge>
            )}
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
                <Text size="1" className="text-zinc-400 max-w-[100px] truncate hidden sm:block">{email}</Text>
                <Button variant="ghost" size="1" color="gray" onClick={handleLogout} className="cursor-pointer">
                  Logout
                </Button>
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
