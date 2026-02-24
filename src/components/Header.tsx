"use client";

import Link from "next/link";
import { Flex, Text, Button, Badge } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import { useState, useEffect, useCallback } from "react";
import AuthModal from "./AuthModal";

export default function Header() {
  const { email, isLoggedIn, credits, ratingsCount, setAuth, incrementCredits, incrementRatingsCount, logout } = useAuthStore();
  const currentVideoId = useFeedStore((s) => s.currentVideoId);
  const [showAuth, setShowAuth] = useState(false);
  const [starHover, setStarHover] = useState(0);
  const [rated, setRated] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Reset rating when video changes
  useEffect(() => {
    setRated(0);
    setStarHover(0);
  }, [currentVideoId]);

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

  const handleStarClick = useCallback(async (stars: number) => {
    if (!currentVideoId || submitting || rated > 0) return;
    setRated(stars);
    setSubmitting(true);

    try {
      const res = await fetch("/api/rate/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: currentVideoId,
          visitorId: "anon",
          ratings: [{ variantId: currentVideoId, stars }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.credits !== undefined) {
          incrementCredits();
          incrementRatingsCount();
        }
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }, [currentVideoId, submitting, rated, incrementCredits, incrementRatingsCount]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
  };

  return (
    <>
      <div className="pointer-events-none fixed top-0 inset-x-0 z-40 px-4 pt-3 pb-2">
        <Flex align="center" justify="between" className="pointer-events-auto">
          <Flex align="center" gap="2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gooey.png" alt="GaylyFans" className="h-8 w-auto drop-shadow-lg" />
          </Flex>

          <Flex align="center" gap="3">
            {isLoggedIn && (
              <Flex gap="2" align="center">
                {ratingsCount > 0 && (
                  <Badge size="1" color="yellow" variant="soft">
                    ★ {ratingsCount}
                  </Badge>
                )}
                <Badge size="2" color="orange" variant="solid" highContrast className="px-3 py-1">
                  ⚡ {credits}
                </Badge>
              </Flex>
            )}
            {/* 5-star rating for current video */}
            <div className="flex gap-0.5 drop-shadow-lg" title="Rate this video">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl transition-all duration-150 cursor-pointer select-none ${
                    star <= (rated || starHover)
                      ? "text-yellow-400 scale-125"
                      : "text-white/40 hover:text-yellow-300"
                  } ${rated > 0 ? "pointer-events-none" : ""}`}
                  onMouseEnter={() => !rated && setStarHover(star)}
                  onMouseLeave={() => !rated && setStarHover(0)}
                  onClick={() => handleStarClick(star)}
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
