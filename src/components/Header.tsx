"use client";

import Link from "next/link";
import { Flex, Text, Button, Badge } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import { useState, useEffect, useCallback, useRef } from "react";
import AuthModal from "./AuthModal";

function getAnonVisitorId(): string {
  const key = "ggf-visitor-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

export default function Header() {
  const { email, isLoggedIn, credits, ratingsCount, setAuth, incrementCredits, incrementRatingsCount, logout } = useAuthStore();
  const currentVideoId = useFeedStore((s) => s.currentVideoId);
  const [showAuth, setShowAuth] = useState(false);
  const [starHover, setStarHover] = useState(0);
  const [ratedMap, setRatedMap] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const visitorIdRef = useRef<string>("");

  // Reset hover when video changes
  useEffect(() => {
    setStarHover(0);
  }, [currentVideoId]);

  // Initialize visitor ID
  useEffect(() => {
    visitorIdRef.current = getAnonVisitorId();
  }, []);

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

  // Fetch existing ratings from backend (re-fetch when login state changes)
  // Always pass anon visitorId so backend can migrate anon→email ratings on login
  useEffect(() => {
    const vid = visitorIdRef.current;
    const params = vid ? `?visitorId=${encodeURIComponent(vid)}` : "";
    fetch(`/api/rate/my-ratings${params}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.ratings) {
          setRatedMap((prev) => ({ ...data.ratings, ...prev }));
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  // Strip infinite-scroll suffix for API calls
  const originalVideoId = currentVideoId?.replace(/-\d+$/, "") ?? null;

  const rated = originalVideoId ? (ratedMap[originalVideoId] ?? 0) : 0;

  const handleStarClick = useCallback(async (stars: number) => {
    if (!originalVideoId || submitting) return;
    setRatedMap((m) => ({ ...m, [originalVideoId]: stars }));
    setSubmitting(true);

    try {
      const res = await fetch("/api/rate/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: originalVideoId,
          visitorId: email || visitorIdRef.current,
          ratings: [{ variantId: originalVideoId, stars }],
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
  }, [originalVideoId, submitting, rated, incrementCredits, incrementRatingsCount]);

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
            <img src="/logo-gooey.png" alt="GaylyFans" className="h-12 w-auto drop-shadow-lg" />
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
                    star <= (starHover || rated)
                      ? "text-yellow-400 scale-125"
                      : "text-white/40 hover:text-yellow-300"
                  }`}
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(0)}
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
