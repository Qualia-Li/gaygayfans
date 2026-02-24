"use client";

import { useState } from "react";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import { useFeedStore } from "@/store/feedStore";
import { Video } from "@/data/videos";

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

const REPORT_REASONS = [
  { id: "not_interested", label: "Not interested", icon: "👎" },
  { id: "low_quality", label: "Low quality", icon: "📉" },
  { id: "rights_violation", label: "Violates my rights / IP", icon: "⚖️" },
  { id: "child_content", label: "Involves a minor", icon: "🚨" },
];

export default function VideoCard({ video, lazy = false }: { video: Video; lazy?: boolean }) {
  const setCurrentVideoId = useFeedStore((s) => s.setCurrentVideoId);
  const { videoRef, containerRef, togglePlay } = useVideoAutoplay(() => setCurrentVideoId(video.id));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [paused, setPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleTap = () => {
    if (showReport) {
      setShowReport(false);
      return;
    }
    togglePlay();
    setPaused((p) => !p);
  };

  const handleReport = async (reason: string) => {
    setShowReport(false);
    setReported(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id, reason }),
      });
    } catch {
      // silently fail
    }
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
      {paused && !showReport && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-5">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Report menu overlay */}
      {showReport && (
        <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/60" onClick={() => setShowReport(false)}>
          <div className="w-full max-w-sm mb-20 mx-4 rounded-2xl bg-zinc-900 p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-white font-medium text-center mb-3">Report this video</p>
            {REPORT_REASONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleReport(r.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-left"
              >
                <span className="text-lg">{r.icon}</span>
                <span className="text-white text-sm">{r.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowReport(false)}
              className="w-full py-2 text-zinc-400 text-sm mt-2"
            >
              Cancel
            </button>
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
          <div className={`text-3xl transition-transform ${liked ? "scale-125" : ""}`}>
            {liked ? "❤️" : "🤍"}
          </div>
          <span className="mt-1 text-xs font-semibold text-white">
            {formatCount(likeCount)}
          </span>
        </button>

        {/* Report */}
        <button
          onClick={() => setShowReport(true)}
          className="flex flex-col items-center"
        >
          {reported ? (
            <span className="text-2xl">✅</span>
          ) : (
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 3v12l5-3 4 3 4-3 5 3V3H3z" />
            </svg>
          )}
          <span className="mt-1 text-xs font-semibold text-white">
            {reported ? "Sent" : "Report"}
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
