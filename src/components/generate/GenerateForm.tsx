"use client";

import { useState } from "react";
import { Card, Flex, Text, TextField, Button, Select, TextArea, Badge, Callout } from "@radix-ui/themes";
import { useAuthStore } from "@/store/authStore";
import presets from "@/data/lora-presets.json";
import GenerationStatus from "./GenerationStatus";

export default function GenerateForm() {
  const { isLoggedIn, credits, setCredits } = useAuthStore();

  const [postUrl, setPostUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [presetId, setPresetId] = useState("gay_general");
  const [duration, setDuration] = useState<5 | 8>(5);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    setError(null);
    setImages([]);
    setSelectedImage(null);
    setExtracting(true);

    try {
      const res = await fetch("/api/generate/extract-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setImages(data.images);
      setSelectedImage(data.images[0]);
      if (data.text) setPrompt(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract");
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    setError(null);
    setGenerating(true);

    const preset = presets.find((p) => p.id === presetId);

    try {
      const res = await fetch("/api/generate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          prompt,
          loras: preset?.loras || [],
          duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRequestId(data.requestId);
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="!bg-zinc-900" size="3">
        <Flex direction="column" align="center" gap="3" py="4">
          <Text size="6">🔒</Text>
          <Text size="4" weight="medium">Sign in to generate videos</Text>
          <Text size="2" color="gray">You need an account and 3 credits per generation.</Text>
        </Flex>
      </Card>
    );
  }

  if (requestId) {
    return <GenerationStatus requestId={requestId} onReset={() => setRequestId(null)} />;
  }

  return (
    <Flex direction="column" gap="4">
      {/* Credits info */}
      <Flex align="center" gap="3">
        <Badge size="2" color="pink" variant="solid" highContrast>⚡ {credits} credits</Badge>
        <Text size="1" color="gray">Each generation costs 3 credits</Text>
      </Flex>

      {/* Step 1: Paste X URL */}
      <Card className="!bg-zinc-900" size="3">
        <Text size="3" weight="medium" mb="3" className="block">1. Paste X/Twitter Post URL</Text>
        <Flex gap="2">
          <TextField.Root
            size="3"
            placeholder="https://x.com/user/status/..."
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            size="3"
            onClick={handleExtract}
            disabled={extracting || !postUrl}
            className="cursor-pointer"
          >
            {extracting ? "Extracting..." : "Extract"}
          </Button>
        </Flex>
      </Card>

      {/* Step 2: Preview image */}
      {images.length > 0 && (
        <Card className="!bg-zinc-900" size="3">
          <Text size="3" weight="medium" mb="3" className="block">2. Select Source Image</Text>
          <Flex gap="3" wrap="wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === img ? "border-pink-500" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Image ${i + 1}`} className="h-32 w-auto object-cover" />
              </button>
            ))}
          </Flex>
        </Card>
      )}

      {/* Step 3: Configure */}
      {selectedImage && (
        <Card className="!bg-zinc-900" size="3">
          <Text size="3" weight="medium" mb="3" className="block">3. Configure Generation</Text>
          <Flex direction="column" gap="3">
            <div>
              <Text size="2" color="gray" mb="1" className="block">Prompt</Text>
              <TextArea
                size="3"
                placeholder="Describe what should happen in the video..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Flex gap="4" wrap="wrap">
              <div>
                <Text size="2" color="gray" mb="1" className="block">LoRA Preset</Text>
                <Select.Root value={presetId} onValueChange={setPresetId}>
                  <Select.Trigger className="cursor-pointer" />
                  <Select.Content>
                    {presets.map((p) => (
                      <Select.Item key={p.id} value={p.id}>{p.name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div>
                <Text size="2" color="gray" mb="1" className="block">Duration</Text>
                <Select.Root value={String(duration)} onValueChange={(v) => setDuration(Number(v) as 5 | 8)}>
                  <Select.Trigger className="cursor-pointer" />
                  <Select.Content>
                    <Select.Item value="5">5 sec ($0.20)</Select.Item>
                    <Select.Item value="8">8 sec ($0.32)</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </Flex>

            <Button
              size="3"
              onClick={handleGenerate}
              disabled={generating || credits < 3 || !prompt}
              className="cursor-pointer !bg-gradient-to-r !from-pink-500 !to-purple-600"
            >
              {generating ? "Starting..." : `Generate Video (3 credits)`}
            </Button>
          </Flex>
        </Card>
      )}

      {error && (
        <Callout.Root color="red" variant="soft">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
}
