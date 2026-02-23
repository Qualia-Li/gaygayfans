"use client";

import { useEffect, useState } from "react";
import { Video } from "@/data/videos";
import VideoCard from "./VideoCard";

export default function Feed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-bounce">🏳️‍🌈</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse [animation-delay:150ms]" />
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black">
        <p className="text-zinc-400">No videos found</p>
      </div>
    );
  }

  return (
    <div className="snap-container no-scrollbar">
      {videos.map((video, i) => (
        <VideoCard key={video.id} video={video} lazy={i > 1} />
      ))}
    </div>
  );
}
