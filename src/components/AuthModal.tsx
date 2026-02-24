"use client";

import { useState } from "react";
import { Dialog, Flex, Text, Button, TextField, Heading } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSend = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to send";
        try { msg = JSON.parse(text).error || msg; } catch { /* non-JSON response */ }
        throw new Error(msg);
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setEmail("");
      setSent(false);
      setError(null);
    }, 200);
  };

  // Check auth on open
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.email) {
          setAuth(data.email, data.credits ?? 0, data.ratingsCount ?? 0);
          handleClose();
        }
      }
    } catch {
      // not logged in
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="400px" className="!bg-zinc-900">
        <Dialog.Title>
          <Heading size="5">Sign In</Heading>
        </Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="4">
          Enter your email to receive a magic link
        </Dialog.Description>

        {sent ? (
          <Flex direction="column" align="center" gap="4" py="4">
            <Text size="6">📧</Text>
            <Heading size="4" align="center">Check your inbox!</Heading>
            <Text size="2" color="gray" align="center">
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </Text>
            <Button variant="soft" color="gray" onClick={checkAuth} className="cursor-pointer">
              I&apos;ve clicked the link
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" gap="3">
            <TextField.Root
              size="3"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            {error && <Text size="1" color="red">{error}</Text>}
            <Flex gap="3" justify="end">
              <Button variant="soft" color="gray" onClick={handleClose} className="cursor-pointer">
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading || !email}
                className="cursor-pointer"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </Flex>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
