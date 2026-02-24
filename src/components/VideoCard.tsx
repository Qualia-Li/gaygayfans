"use client";

import { useState } from "react";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import { Video } from "@/data/videos";

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function VideoCard({ video, lazy = false }: { video: Video; lazy?: boolean }) {
  const { videoRef, containerRef, togglePlay } = useVideoAutoplay();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [paused, setPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleTap = () => {
    togglePlay();
    setPaused((p) => !p);
  };

  return (
    <div
      ref={containerRef}
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
            <svg
              className="h-12 w-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Right side action bar */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
        {/* Creator avatar */}
        <div className="relative mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl ring-2 ring-white">
            {video.creatorAvatar}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            +
          </div>
        </div>

        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center">
          <div
            className={`text-3xl transition-transform ${liked ? "scale-125" : ""}`}
          >
            {liked ? "❤️" : "🤍"}
          </div>
          <span className="mt-1 text-xs font-semibold text-white">
            {formatCount(likeCount)}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center">
          <svg
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="mt-1 text-xs font-semibold text-white">
            {formatCount(video.comments)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center">
          <svg
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 0018 8a3 3 0 10-3-3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 006 9a3 3 0 100 6c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.93 2.93 0 003 2.92 2.93 2.93 0 000-5.84z" />
          </svg>
          <span className="mt-1 text-xs font-semibold text-white">
            {formatCount(video.shares)}
          </span>
        </button>
      </div>

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
