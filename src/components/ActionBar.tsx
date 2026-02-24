"use client";

import { useState } from "react";
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

export default function ActionBar({ videos }: { videos: Video[] }) {
  const currentVideoId = useFeedStore((s) => s.currentVideoId);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [reportedMap, setReportedMap] = useState<Record<string, boolean>>({});
  const [showReport, setShowReport] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Strip the infinite-scroll suffix (e.g. "video1-8" → "video1") for state tracking
  const originalId = currentVideoId?.replace(/-\d+$/, "") ?? null;
  const video = videos.find((v) => v.id === originalId);
  if (!video || !originalId) return null;

  const liked = likedMap[originalId] ?? false;
  const likeCount = likeCountMap[originalId] ?? video.likes;
  const reported = reportedMap[originalId] ?? false;

  const handleLike = () => {
    setLikedMap((m) => ({ ...m, [originalId]: !liked }));
    setLikeCountMap((m) => ({ ...m, [originalId]: liked ? likeCount - 1 : likeCount + 1 }));
  };

  const handleReport = async (reason: string) => {
    setShowReport(false);
    setReportedMap((m) => ({ ...m, [originalId]: true }));
    setShowConfirmation(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: originalId, reason }),
      });
    } catch {
      // silently fail
    }
    // Scroll to next video after a brief delay
    setTimeout(() => {
      setShowConfirmation(false);
      const current = document.querySelector(`[data-video-id="${currentVideoId}"]`);
      if (current?.nextElementSibling) {
        current.nextElementSibling.scrollIntoView({ behavior: "smooth" });
      }
    }, 1500);
  };

  return (
    <>
      {/* Fixed action bar - right side */}
      <div className="fixed right-3 bottom-32 z-20 flex flex-col items-center gap-5">
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
          <span className="mt-1 text-xs font-semibold text-white drop-shadow">
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
            <svg className="h-7 w-7 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 3v12l5-3 4 3 4-3 5 3V3H3z" />
            </svg>
          )}
          <span className="mt-1 text-xs font-semibold text-white drop-shadow">
            {reported ? "Sent" : "Report"}
          </span>
        </button>
      </div>

      {/* Report menu overlay */}
      {showReport && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={() => setShowReport(false)}>
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

      {/* Report confirmation overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={() => setShowConfirmation(false)}>
          <div className="w-full max-w-sm mb-20 mx-4 rounded-2xl bg-zinc-900 p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="text-4xl block mb-3">✅</span>
            <p className="text-white font-medium mb-2">Thanks for your report</p>
            <p className="text-zinc-400 text-sm mb-4">We will review this internally.</p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
