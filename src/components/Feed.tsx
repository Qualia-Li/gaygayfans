"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Video } from "@/data/videos";
import VideoCard from "./VideoCard";
import ActionBar from "./ActionBar";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BATCH_SIZE = 8;

export default function Feed() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch all videos once
  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data: Video[]) => {
        const shuffled = shuffle(data);
        setAllVideos(data);
        setDisplayVideos(shuffled.slice(0, BATCH_SIZE));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Infinite scroll: when sentinel is visible, append more shuffled videos
  const loadMore = useCallback(() => {
    if (allVideos.length === 0) return;
    setDisplayVideos((prev) => {
      const next = shuffle(allVideos).slice(0, BATCH_SIZE);
      // Give each batch unique keys by appending index
      return [...prev, ...next.map((v, i) => ({ ...v, id: `${v.id}-${prev.length + i}` }))];
    });
  }, [allVideos]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200%" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-bounce">🏳️‍🌈</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse [animation-delay:150ms]" />
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black">
        <p className="text-zinc-400">No videos found</p>
      </div>
    );
  }

  return (
    <>
      <div className="snap-container no-scrollbar">
        {displayVideos.map((video, i) => (
          <VideoCard key={video.id} video={video} lazy={i > 1} />
        ))}
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />
      </div>
      <ActionBar videos={allVideos} />
    </>
  );
}
