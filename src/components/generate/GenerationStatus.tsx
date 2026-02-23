"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Flex, Text, Button, Heading } from "@radix-ui/themes";

interface GenerationStatusProps {
  requestId: string;
  onReset: () => void;
}

export default function GenerationStatus({ requestId, onReset }: GenerationStatusProps) {
  const [status, setStatus] = useState<string>("processing");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/generate/status/${requestId}`);
        const data = await res.json();

        if (data.data?.status) {
          setStatus(data.data.status);
        } else if (data.status) {
          setStatus(data.status);
        }

        // Check for completed
        const output = data.data?.output || data.output;
        if (output) {
          const url = typeof output === "string" ? output : output.video || output.url;
          if (url) {
            setVideoUrl(url);
            setStatus("completed");
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }

        if (data.data?.status === "failed" || data.status === "failed") {
          setError("Generation failed");
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Keep polling on network errors
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [requestId]);

  return (
    <Card className="!bg-zinc-900" size="4">
      <Flex direction="column" align="center" gap="4">
        {status !== "completed" && !error && (
          <>
            <div className="animate-spin text-4xl">⏳</div>
            <Heading size="4">Generating video...</Heading>
            <Text size="2" color="gray">Status: {status}</Text>
            <Text size="1" color="gray">This usually takes 30-60 seconds. Do not close this page.</Text>
          </>
        )}

        {videoUrl && (
          <>
            <Heading size="4" color="green">Video Ready!</Heading>
            <div className="relative w-full max-w-lg">
              <video
                src={videoUrl}
                controls
                loop
                playsInline
                className="w-full rounded-lg aspect-[4/3] object-contain bg-black"
              />
              <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                <span className="text-white/70 text-sm font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  GaylyFans.com
                </span>
              </div>
            </div>
            <Flex gap="3">
              <a href={videoUrl} download target="_blank" rel="noopener noreferrer">
                <Button variant="soft" className="cursor-pointer">Download</Button>
              </a>
              <Button onClick={onReset} className="cursor-pointer">Generate Another</Button>
            </Flex>
          </>
        )}

        {error && (
          <>
            <Text size="6">❌</Text>
            <Heading size="4">Generation Failed</Heading>
            <Text size="2" color="red">{error}</Text>
            <Button onClick={onReset} variant="soft" className="cursor-pointer">Try Again</Button>
          </>
        )}
      </Flex>
    </Card>
  );
}
