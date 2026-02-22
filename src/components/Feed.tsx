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
          <div className="mb-4 text-4xl">🏳️‍🌈</div>
          <p className="text-zinc-400">Loading videos...</p>
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
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
