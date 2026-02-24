"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Container, Card, Text, Heading, Flex, Button } from "@radix-ui/themes";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const setAuth = useAuthStore((s) => s.setAuth);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing token");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid response from server");
        }
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        return data;
      })
      .then((data) => {
        setAuth(data.email, 0, 0);
        setStatus("success");
        fetch("/api/auth/me")
          .then((r) => r.ok ? r.json() : null)
          .then((user) => {
            if (user?.email) {
              setAuth(user.email, user.credits ?? 0, user.ratingsCount ?? 0);
            }
          })
          .catch(() => {});
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
  }, [token, setAuth]);

  return (
    <Card size="4" className="!bg-zinc-900 text-center">
      <Flex direction="column" align="center" gap="4">
        {status === "loading" && (
          <>
            <Text size="6">⏳</Text>
            <Heading size="4">Verifying...</Heading>
            <Text size="2" color="gray">Please wait while we sign you in.</Text>
          </>
        )}
        {status === "success" && (
          <>
            <Text size="6">✅</Text>
            <Heading size="4">You&apos;re signed in!</Heading>
            <Text size="2" color="gray">Welcome to GaylyFans.</Text>
            <Link href="/">
              <Button className="cursor-pointer">Go to Feed</Button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <Text size="6">❌</Text>
            <Heading size="4">Verification Failed</Heading>
            <Text size="2" color="red">{error}</Text>
            <Link href="/">
              <Button variant="soft" className="cursor-pointer">Go Home</Button>
            </Link>
          </>
        )}
      </Flex>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Container size="1">
        <Suspense
          fallback={
            <Card size="4" className="!bg-zinc-900 text-center">
              <Flex direction="column" align="center" gap="4">
                <Text size="6">⏳</Text>
                <Heading size="4">Loading...</Heading>
              </Flex>
            </Card>
          }
        >
          <VerifyContent />
        </Suspense>
      </Container>
    </div>
  );
}
