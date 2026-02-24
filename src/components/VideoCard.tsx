"use client";

import { useState } from "react";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import { useFeedStore } from "@/store/feedStore";
import { Video } from "@/data/videos";

export default function VideoCard({ video, lazy = false }: { video: Video; lazy?: boolean }) {
  const setCurrentVideoId = useFeedStore((s) => s.setCurrentVideoId);
  const { videoRef, containerRef, togglePlay } = useVideoAutoplay(() => setCurrentVideoId(video.id));
  const [paused, setPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const handleTap = () => {
    togglePlay();
    setPaused((p) => !p);
  };

  return (
    <div
      ref={containerRef}
      data-video-id={video.id}
      className="snap-item relative flex items-center justify-center bg-black"
    >
      {/* Loading spinner */}
      {videoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="h-10 w-10 rounded-full border-3 border-white/20 border-t-orange-500 animate-spin" />
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        preload={lazy ? "none" : "metadata"}
        onClick={handleTap}
        onCanPlay={() => setVideoLoading(false)}
      />

      {/* Pause indicator */}
      {paused && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-5">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom overlay info */}
      <div className="absolute bottom-4 left-3 right-20 pb-safe">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-white">@{video.creator}</span>
        </div>
        <p className="text-sm text-white/90 mb-2">{video.title}</p>
        <div className="flex flex-wrap gap-1.5">
          {video.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gradient overlays for readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
