"use client";

import Link from "next/link";
import { Flex, Text, Button, Badge } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";

export default function Header() {
  const { email, isLoggedIn, credits, setAuth, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [starHover, setStarHover] = useState(0);
  const router = useRouter();

  const handleStarClick = useCallback(() => {
    router.push("/rate");
  }, [router]);

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
              GaylyFans
            </Text>
          </Flex>

          <Flex align="center" gap="3">
            {isLoggedIn && (
              <Badge size="2" color="orange" variant="solid" highContrast className="px-3 py-1">
                ⚡ {credits} credits
              </Badge>
            )}
            <div
              className="flex gap-0.5 cursor-pointer drop-shadow-lg"
              onClick={handleStarClick}
              title="Rate Videos"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl transition-all duration-150 ${
                    star <= starHover
                      ? "text-yellow-400 scale-125"
                      : "text-white/40 hover:text-yellow-300"
                  }`}
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <Link href="/generate">
              <Button variant="soft" size="2" color="orange" className="cursor-pointer">
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
                color="orange"
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
